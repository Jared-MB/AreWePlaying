import asyncio
import json
import sys
from pathlib import Path
from typing import TypedDict

import aiohttp
import requests

TOURNAMENT_ID = "066CC7C9-E88C-4595-8CF5-D5AAADF0AA33"
API = "https://scoretdi2025-eta.vercel.app/api/"


def get_match_days():
    response = requests.get(API + "jornadas?torneoID=" + TOURNAMENT_ID)

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
    return {
        "id": team["EquipoID"],
        "name": team["Nombre"],
        "shortName": team["NombreCorte"],
        "logo": None,
    }


async def fetch_teams(session: aiohttp.ClientSession) -> list[Team]:
    """Fetch teams, persist to disk, and return the data."""

    async with session.get(API + "equipos?torneoID=" + TOURNAMENT_ID) as response:
        teams_response = await response.json()
        teams_data: list[ApiTeam] = json.loads(teams_response["data"])

    mapped_data = await asyncio.gather(*(process_team(team) for team in teams_data))
    mapped_data = list(mapped_data)

    Path("./src/assets/teams.json").write_text(
        json.dumps(mapped_data, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    return mapped_data


async def fetch_teams_table(
    session: aiohttp.ClientSession, teams: list[Team]
) -> list[TeamTableEntry]:
    async with session.get(API + "tablaResumen?torneoID=" + TOURNAMENT_ID) as response:
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

    Path("./src/assets/teams-table.json").write_text(
        json.dumps(teams_position, indent=2, ensure_ascii=False), encoding="utf-8"
    )

    return teams_position


async def get_teams_data() -> None:
    async with aiohttp.ClientSession() as session:
        teams = await fetch_teams(session)
        await fetch_teams_table(session, teams)


match_days = get_match_days()
matches = asyncio.run(get_matches(match_days))

with open("./src/assets/match-days.json", "w", encoding="utf-8") as f:
    json.dump(match_days, f, ensure_ascii=False, indent=2)

with open("./src/assets/matches.json", "w", encoding="utf-8") as f:
    json.dump(matches, f, ensure_ascii=False, indent=2)

asyncio.run(get_teams_data())

print("JSON's populated correctly")
