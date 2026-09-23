import argparse
import asyncio
import base64
import binascii
import json
import re
import sys
from datetime import UTC, datetime, timedelta
from io import BytesIO
from pathlib import Path
from typing import TypedDict

import aiohttp
import requests
from PIL import Image, ImageOps

parser = argparse.ArgumentParser()
parser.add_argument(
    "-f", "--force", action="store_true", help="Fuerza la ejecución sin confirmación"
)
parser.add_argument(
    "-s",
    "--refresh-static",
    action="store_true",
    help="Vuelve a descargar los datos estáticos (jornadas y equipos)",
)
parser.add_argument(
    "--allow-shrink",
    action="store_true",
    help="Guarda los datos aunque el API regrese menos partidos o equipos que antes",
)
args = parser.parse_args()

API = "https://scoretdi2025-eta.vercel.app/api/"

# El API es el servidor de alguien más, así que nos identificamos en cada
# petición: si su dueño ve este tráfico y quiere que paremos, tiene a quién
# escribirle en lugar de bloquear a ciegas un cliente anónimo.
HEADERS = {
    "User-Agent": (
        "AreWePlaying/1.0 (+https://areweplaying.com; "
        "https://github.com/Jared-MB/AreWePlaying; amunozbaez669@gmail.com)"
    )
}

# Sin timeout, un API colgado deja el workflow corriendo hasta que GitHub lo mata.
REQUEST_TIMEOUT = 30
AIOHTTP_TIMEOUT = aiohttp.ClientTimeout(total=60)

# Los IDs del API terminan en rutas de archivo: sólo se aceptan UUIDs para que
# uno como "../../algo" no escriba fuera de la carpeta.
UUID_RE = re.compile(
    r"^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$", re.IGNORECASE
)

LOGOS_FOLDER = Path("./public/logos")
LOGO_MAX_SIZE = 512
LOGO_QUALITY = 60

# Margen tras la última jornada antes de dar el torneo por terminado. El API
# suele agregar las jornadas de playoffs cuando la temporada regular ya acabó.
FINISHED_GRACE = timedelta(days=14)


def is_uuid(value) -> bool:
    return isinstance(value, str) and UUID_RE.match(value) is not None


def fetch_api_data(endpoint: str, params: dict[str, str]):
    """GET al API y decodifica su `data`, que viene como JSON dentro de un string.

    Cualquier error (red, status, JSON) revienta el script a propósito: es mejor
    que el workflow falle y no haga commit a que publique datos a medias.
    """

    response = requests.get(
        API + endpoint, params=params, headers=HEADERS, timeout=REQUEST_TIMEOUT
    )
    response.raise_for_status()

    return json.loads(response.json()["data"])


async def fetch_api_data_async(
    session: aiohttp.ClientSession, endpoint: str, params: dict[str, str]
):
    async with session.get(API + endpoint, params=params) as response:
        response.raise_for_status()
        body = await response.json()

    return json.loads(body["data"])


def guard_shrink(path: str, label: str, new_count: int, count_cached) -> None:
    """Aborta si el API regresa menos elementos de los que ya había guardados.

    Los partidos y la tabla sólo crecen durante un torneo; si de pronto bajan, lo
    más probable es una respuesta rota del API, y el workflow la publicaría.
    """

    if args.allow_shrink:
        return

    cached = load_json_file(path)
    if not cached:
        return

    old_count = count_cached(cached)
    if new_count < old_count:
        print(
            f"El API regresó {new_count} {label} y había {old_count} guardados en "
            f"{path}. No se sobrescribe; usa --allow-shrink si es intencional."
        )
        sys.exit(1)


def get_tournaments():
    with open("./src/assets/tournaments.json", encoding="utf-8") as f:
        data = json.load(f)

    return data


def load_json_file(path: str):
    """Return the cached JSON at path, or None when it's missing or unusable."""

    file = Path(path)

    if not file.exists():
        return None

    try:
        data = json.loads(file.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError):
        return None

    return data or None


def parse_api_date(value: str | None) -> datetime | None:
    """Parse the DD/MM/YYYY[ HH:MM] dates the API returns."""

    if not value:
        return None

    for fmt in ("%d/%m/%Y %H:%M", "%d/%m/%Y"):
        try:
            return datetime.strptime(value, fmt).replace(tzinfo=UTC)
        except ValueError:
            continue

    return None


def parse_updated_at(value: str | None) -> datetime | None:
    """Parse the ISO `updated_at`, tolerating torneos nuevos sin fecha."""

    if not value:
        return None

    try:
        parsed = datetime.fromisoformat(value)
    except (TypeError, ValueError):
        return None

    # Las fechas viejas (o escritas a mano) pueden venir sin zona horaria.
    return parsed if parsed.tzinfo else parsed.replace(tzinfo=UTC)


def save_json_as_file(path: str, data):
    # Tabs y salto de línea final para que salga igual que lo formatea Biome: así
    # el diff sólo muestra los datos que de verdad cambiaron.
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent="\t")
        f.write("\n")


def ensure_folder(path: str):
    folder = Path(path)
    folder.mkdir(parents=True, exist_ok=True)


def decode_base64_image(raw: str) -> bytes:
    """Decode the base64 image the API returns, with or without data URI prefix."""

    data = raw.strip()

    if data.startswith("data:"):
        _, _, data = data.partition(",")

    # El API a veces manda el base64 sin el padding final.
    return base64.b64decode(data + "=" * (-len(data) % 4))


def encode_logo_as_avif(raw: str) -> bytes:
    """Convert a base64 logo into a resized AVIF image."""

    with Image.open(BytesIO(decode_base64_image(raw))) as image:
        image = ImageOps.exif_transpose(image)

        has_alpha = image.mode in ("RGBA", "LA", "PA") or "transparency" in image.info
        image = image.convert("RGBA" if has_alpha else "RGB")
        image.thumbnail((LOGO_MAX_SIZE, LOGO_MAX_SIZE), Image.LANCZOS)

        buffer = BytesIO()
        image.save(buffer, format="AVIF", quality=LOGO_QUALITY)

    return buffer.getvalue()


def save_team_logo(tournament_id: str, team_id: str, raw: str | None) -> str | None:
    """Store the team logo as AVIF and return its public URL."""

    if not raw:
        return None

    if not is_uuid(tournament_id) or not is_uuid(team_id):
        print(f"Skipping logo with unexpected id: {tournament_id!r}/{team_id!r}")
        return None

    try:
        avif = encode_logo_as_avif(raw)
    except (OSError, ValueError, binascii.Error) as error:
        print(f"Error processing logo for team {team_id}: {error}")
        return None

    folder = LOGOS_FOLDER / tournament_id
    folder.mkdir(parents=True, exist_ok=True)

    logo_path = folder / (team_id + ".avif")

    # Evita reescribir el archivo (y ensuciar el diff) si no cambió.
    if not logo_path.exists() or logo_path.read_bytes() != avif:
        logo_path.write_bytes(avif)

    return "/logos/" + tournament_id + "/" + team_id + ".avif"


def last_match_day_date(match_days) -> datetime | None:
    dates = [parse_api_date(match_day.get("date")) for match_day in match_days]
    dates = [date for date in dates if date is not None]

    return max(dates) if dates else None


def is_calendar_complete(match_days) -> bool:
    """Whether the cached calendar can still grow (playoffs, jornadas extra)."""

    last_date = last_match_day_date(match_days)

    # Mientras queden jornadas por jugar el calendario ya está completo; solo
    # cuando se agota vale la pena volver a preguntar por jornadas nuevas.
    return last_date is not None and last_date > datetime.now(UTC)


def is_tournament_finished(match_days, matches) -> bool:
    """A tournament is done once every match ended and the grace period passed."""

    played = [match for match_day in matches for match in match_day["data"]]

    if not played:
        return False

    if any(not match.get("endTime") for match in played):
        return False

    last_date = last_match_day_date(match_days)

    if last_date is None:
        return False

    return datetime.now(UTC) - last_date > FINISHED_GRACE


def get_tournament_data(tournament_id: str):
    if not is_uuid(tournament_id):
        print(f"ID de torneo inválido en tournaments.json: {tournament_id!r}")
        sys.exit(1)

    ensure_folder("./src/assets/" + tournament_id)

    weeks_path = "./src/assets/" + tournament_id + "/weeks.json"
    teams_path = "./src/assets/" + tournament_id + "/teams.json"

    def get_match_days():
        data_json = fetch_api_data("jornadas", {"torneoID": tournament_id})

        match_days = [
            {
                "date": match_day["Fecha"],
                "week": match_day["Nombre"],
                "type": match_day["tipojornadanombre"],
                "id": match_day["JornadaID"],
                "tournamentId": match_day["TorneoID"],
            }
            for match_day in data_json
        ]

        return match_days

    async def get_matches(match_days):
        tasks = [asyncio.to_thread(get_match_day, md) for md in match_days]
        results = await asyncio.gather(*tasks)
        return [
            {"data": data, "id": md["id"]}
            for data, md in zip(results, match_days, strict=False)
        ]

    def get_match_day(match_day):
        data_json = fetch_api_data("partidos", {"jornadaID": match_day["id"]})

        week_matches = [
            {
                "matchId": match["PartidoID"],
                "matchNumber": match["Numero"],
                "localTeam": match["EquipoLocal"],
                "localTeamId": match["EquipoLocalID"],
                "visitingTeam": match["EquipoVisita"],
                "visitingTeamId": match["EquipoVisitaID"],
                "date": match["Fecha"],
                "startTime": match["Iniciado"],
                "endTime": match["Terminado"],
                "localTeamPoints": match["EquipoCasaPuntos"],
                "visitingTeamPoints": match["EquipoVisitaPuntos"],
                "period": match["PeriodoFinal"],
                "name": match["Nombre"],
                "started": match["PartidoIniciado"],
                "location": match["SedeNombre"],
                "locationUrl": match["Ubicacion"],
                "live": match["EnVivo"],
                "url": match["URL"],
                "localTeamPosition": match["PosLocal"],
                "localTeamWR": match["GPLocal"],
                "visitingTeamPosition": match["PosVisita"],
                "visitingTeamWR": match["GPVisita"],
            }
            for match in data_json
        ]

        return week_matches

    class ApiTeam(TypedDict):
        EquipoID: str
        Nombre: str
        NombreCorte: str
        Logo: str | None

    class Team(TypedDict):
        id: str
        name: str
        shortName: str
        logo: str | None

    class TeamPositionRaw(TypedDict):
        Posicion: int
        EquipoLargo: str
        Equipo: str
        Partidos: int
        PartidosLocal: int
        PartidosVisita: int
        Porcentaje: float
        GanadosPerdidos: int
        Ganados: int
        Perdidos: int
        RegistroLocal: str
        RegistroVisita: str
        GanadosLocal: int
        PerdidosLocal: int
        GanadosVisita: int
        PerdidosVisita: int
        PuntosFavor: int
        PuntosContra: int
        DiferenciaPuntos: int
        EquipoLocalPuntos: int
        EquipoLocalPuntosContra: int
        DiferenciaPuntosLocal: int
        EquipoVisitaPuntos: int
        EquipoVisitaPuntosContra: int
        DiferenciaPuntosVisita: int
        Puntos: int
        PuntosLocal: int
        PuntosVisita: int

    class TeamTableEntry(TypedDict):
        id: str
        position: int
        name: str
        shortName: str
        matches: int
        localMatches: int
        awayMatches: int
        percentage: float
        wr: int
        wins: int
        losses: int
        localWins: int
        localLosses: int
        awayWins: int
        awayLosses: int
        goalsFor: int
        goalsAgainst: int
        goalDifference: int
        localGoalsFor: int
        localGoalsAgainst: int
        localGoalDifference: int
        awayGoalsFor: int
        awayGoalsAgainst: int
        awayGoalDifference: int
        points: int
        localPoints: int
        awayPoints: int

    async def process_team(team: ApiTeam) -> Team:
        logo = await asyncio.to_thread(
            save_team_logo, tournament_id, team["EquipoID"], team["Logo"]
        )

        return {
            "id": team["EquipoID"],
            "name": team["Nombre"],
            "shortName": team["NombreCorte"],
            "logo": logo,
        }

    async def fetch_teams(session: aiohttp.ClientSession) -> list[Team]:
        """Fetch teams, persist to disk, and return the data."""

        teams_data: list[ApiTeam] = await fetch_api_data_async(
            session, "equipos", {"torneoID": tournament_id}
        )

        mapped_data = await asyncio.gather(*(process_team(team) for team in teams_data))
        mapped_data = list(mapped_data)

        guard_shrink(teams_path, "equipos", len(mapped_data), len)
        save_json_as_file(teams_path, mapped_data)

        return mapped_data

    async def fetch_teams_table(
        session: aiohttp.ClientSession, teams: list[Team]
    ) -> list[TeamTableEntry]:
        teams_position_raw: list[TeamPositionRaw] = await fetch_api_data_async(
            session, "tablaResumen", {"torneoID": tournament_id}
        )

        teams_position: list[TeamTableEntry] = []
        for team_position in teams_position_raw:
            team = next(
                (t for t in teams if t["name"] == team_position["EquipoLargo"]),
                None,
            )
            if team is None:
                raise ValueError(f"Team {team_position['Equipo']} not found")

            teams_position.append(
                {
                    "id": team["id"],
                    "position": team_position["Posicion"],
                    "name": team_position["EquipoLargo"],
                    "shortName": team_position["Equipo"],
                    "matches": team_position["Partidos"],
                    "localMatches": team_position["PartidosLocal"],
                    "awayMatches": team_position["PartidosVisita"],
                    "percentage": team_position["Porcentaje"],
                    "wr": team_position["GanadosPerdidos"],
                    "wins": team_position["Ganados"],
                    "losses": team_position["Perdidos"],
                    "localWins": team_position["GanadosLocal"],
                    "localLosses": team_position["PerdidosLocal"],
                    "awayWins": team_position["GanadosVisita"],
                    "awayLosses": team_position["PerdidosVisita"],
                    "goalsFor": team_position["PuntosFavor"],
                    "goalsAgainst": team_position["PuntosContra"],
                    "goalDifference": team_position["DiferenciaPuntos"],
                    "localGoalsFor": team_position["EquipoLocalPuntos"],
                    "localGoalsAgainst": team_position["EquipoLocalPuntosContra"],
                    "localGoalDifference": team_position["DiferenciaPuntosLocal"],
                    "awayGoalsFor": team_position["EquipoVisitaPuntos"],
                    "awayGoalsAgainst": team_position["EquipoVisitaPuntosContra"],
                    "awayGoalDifference": team_position["DiferenciaPuntosVisita"],
                    "points": team_position["Puntos"],
                    "localPoints": team_position["PuntosLocal"],
                    "awayPoints": team_position["PuntosVisita"],
                }
            )

        table_path = "./src/assets/" + tournament_id + "/teams-table.json"
        guard_shrink(table_path, "equipos en la tabla", len(teams_position), len)
        save_json_as_file(table_path, teams_position)

        return teams_position

    async def get_teams_data(cached_teams: list[Team] | None) -> None:
        async with aiohttp.ClientSession(
            headers=HEADERS, timeout=AIOHTTP_TIMEOUT
        ) as session:
            teams = cached_teams if cached_teams else await fetch_teams(session)
            await fetch_teams_table(session, teams)

    # Las jornadas solo cambian cuando el calendario se agota (playoffs), así
    # que reutilizamos el archivo mientras queden jornadas por jugar.
    match_days = None if args.refresh_static else load_json_file(weeks_path)

    if match_days and not is_calendar_complete(match_days):
        match_days = None

    if match_days is None:
        match_days = get_match_days()
        guard_shrink(weeks_path, "jornadas", len(match_days), len)
        save_json_as_file(weeks_path, match_days)
    else:
        print("Reusing cached match days for " + tournament_id)

    matches = asyncio.run(get_matches(match_days))

    def count_matches(days) -> int:
        return sum(len(day["data"]) for day in days)

    matches_path = "./src/assets/" + tournament_id + "/matches.json"
    guard_shrink(matches_path, "partidos", count_matches(matches), count_matches)
    save_json_as_file(matches_path, matches)

    # Los equipos (y sus logos) no cambian durante el torneo.
    cached_teams = None if args.refresh_static else load_json_file(teams_path)

    if cached_teams:
        print("Reusing cached teams for " + tournament_id)

    asyncio.run(get_teams_data(cached_teams))

    finished = is_tournament_finished(match_days, matches)

    def update_tournament(tournament):
        if tournament.get("id") == tournament_id:
            return {
                **tournament,
                "finished": finished,
                "updated_at": datetime.now(UTC).isoformat(),
            }
        return tournament

    updated_tournaments = list(map(update_tournament, get_tournaments()))
    save_json_as_file("./src/assets/tournaments.json", updated_tournaments)
    print("Fetched " + tournament_id + (" (finished)" if finished else ""))


def main():
    for tournament in get_tournaments():
        tournament_id = tournament.get("id")

        if args.force:
            get_tournament_data(tournament_id)
            continue

        if tournament.get("finished"):
            print("Tournament already finished, skipping " + tournament_id)
            continue

        updated_at = parse_updated_at(tournament.get("updated_at"))

        if updated_at is None:
            # Torneo nuevo (o sin fecha válida): toca bajarlo por primera vez.
            get_tournament_data(tournament_id)
            continue

        now = datetime.now(UTC)
        difference = now - updated_at

        if difference > timedelta(hours=24):
            get_tournament_data(tournament_id)
        else:
            print("Haven't pass 24 hours, skipping " + tournament_id)

    print("JSON's populated correctly")


if __name__ == "__main__":
    main()
