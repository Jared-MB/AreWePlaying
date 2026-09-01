import argparse
import asyncio
import base64
import binascii
import json
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
args = parser.parse_args()

API = "https://scoretdi2025-eta.vercel.app/api/"

LOGOS_FOLDER = Path("./public/logos")
LOGO_MAX_SIZE = 512
LOGO_QUALITY = 60

# Margen tras la última jornada antes de dar el torneo por terminado. El API
# suele agregar las jornadas de playoffs cuando la temporada regular ya acabó.
FINISHED_GRACE = timedelta(days=14)


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


def save_json_as_file(path: str, data):
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


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
    ensure_folder("./src/assets/" + tournament_id)

    weeks_path = "./src/assets/" + tournament_id + "/weeks.json"
    teams_path = "./src/assets/" + tournament_id + "/teams.json"

    def get_match_days():
        response = requests.get(API + "jornadas?torneoID=" + tournament_id)

        if response.status_code != 200:
            print("Error getting match days")
            sys.exit(1)

        data = response.json()["data"]

        data_json = json.loads(data)

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
        response = requests.get(API + "partidos?jornadaID=" + match_day["id"])

        if response.status_code != 200:
            print("Error getting match day: ", match_day["id"])

        data = response.json()["data"]

        data_json = json.loads(data)

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

        async with session.get(API + "equipos?torneoID=" + tournament_id) as response:
            teams_response = await response.json()
            teams_data: list[ApiTeam] = json.loads(teams_response["data"])

        mapped_data = await asyncio.gather(*(process_team(team) for team in teams_data))
        mapped_data = list(mapped_data)

        save_json_as_file(teams_path, mapped_data)

        return mapped_data

    async def fetch_teams_table(
        session: aiohttp.ClientSession, teams: list[Team]
    ) -> list[TeamTableEntry]:
        async with session.get(
            API + "tablaResumen?torneoID=" + tournament_id
        ) as response:
            data = await response.json()
            teams_position_raw: list[TeamPositionRaw] = json.loads(data["data"])

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

        save_json_as_file(
            "./src/assets/" + tournament_id + "/teams-table.json", teams_position
        )

        return teams_position

    async def get_teams_data(cached_teams: list[Team] | None) -> None:
        async with aiohttp.ClientSession() as session:
            teams = cached_teams if cached_teams else await fetch_teams(session)
            await fetch_teams_table(session, teams)

    # Las jornadas solo cambian cuando el calendario se agota (playoffs), así
    # que reutilizamos el archivo mientras queden jornadas por jugar.
    match_days = None if args.refresh_static else load_json_file(weeks_path)

    if match_days and not is_calendar_complete(match_days):
        match_days = None

    if match_days is None:
        match_days = get_match_days()
        save_json_as_file(weeks_path, match_days)
    else:
        print("Reusing cached match days for " + tournament_id)

    matches = asyncio.run(get_matches(match_days))
    save_json_as_file("./src/assets/" + tournament_id + "/matches.json", matches)

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

        updated_at = datetime.fromisoformat(tournament.get("updated_at"))
        now = datetime.now(UTC)
        difference = now - updated_at

        if difference > timedelta(hours=24):
            get_tournament_data(tournament_id)
        else:
            print("Haven't pass 24 hours, skipping " + tournament_id)

    print("JSON's populated correctly")


if __name__ == "__main__":
    main()
