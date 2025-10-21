import type { Team } from "@/types/team";
import fs from "node:fs/promises";
import { API_URLS } from "../constants/apiUrl";

async function main() {
	const response = await fetch(API_URLS.TEAMS_TABLE);
	const data = await response.json();

	const teamsPositionRaw = JSON.parse(data.data) as {
		Posicion: number;
		EquipoLargo: string;
		Equipo: string;
		Partidos: number;
		PartidosLocal: number;
		PartidosVisita: number;
		Porcentaje: number;
		GanadosPerdidos: number;
		Ganados: number;
		Perdidos: number;
		RegistroLocal: string;
		RegistroVisita: string;
		GanadosLocal: number;
		PerdidosLocal: number;
		GanadosVisita: number;
		PerdidosVisita: number;
		PuntosFavor: number;
		PuntosContra: number;
		DiferenciaPuntos: number;
		EquipoLocalPuntos: number;
		EquipoLocalPuntosContra: number;
		DiferenciaPuntosLocal: number;
		EquipoVisitaPuntos: number;
		EquipoVisitaPuntosContra: number;
		DiferenciaPuntosVisita: number;
		Puntos: number;
		PuntosLocal: number;
		PuntosVisita: number;
	}[];

	const teamsRaw = await fs.readFile("./src/assets/teams.json", "utf8");
	const teams = JSON.parse(teamsRaw) as Team[];

	const teamsPosition = teamsPositionRaw.map((teamPosition) => {
		const team = teams.find((team) => team.name === teamPosition.EquipoLargo);
		if (!team) throw new Error(`Team ${teamPosition.Equipo} not found`);

		return {
			id: team.id,
			position: teamPosition.Posicion,
			name: teamPosition.EquipoLargo,
			shortName: teamPosition.Equipo,
			matches: teamPosition.Partidos,
			localMatches: teamPosition.PartidosLocal,
			awayMatches: teamPosition.PartidosVisita,
			percentage: teamPosition.Porcentaje,
			wr: teamPosition.GanadosPerdidos,
			wins: teamPosition.Ganados,
			losses: teamPosition.Perdidos,
			localWins: teamPosition.GanadosLocal,
			localLosses: teamPosition.PerdidosLocal,
			awayWins: teamPosition.GanadosVisita,
			awayLosses: teamPosition.PerdidosVisita,
			goalsFor: teamPosition.PuntosFavor,
			goalsAgainst: teamPosition.PuntosContra,
			goalDifference: teamPosition.DiferenciaPuntos,
			localGoalsFor: teamPosition.EquipoLocalPuntos,
			localGoalsAgainst: teamPosition.EquipoLocalPuntosContra,
			localGoalDifference: teamPosition.DiferenciaPuntosLocal,
			awayGoalsFor: teamPosition.EquipoVisitaPuntos,
			awayGoalsAgainst: teamPosition.EquipoVisitaPuntosContra,
			awayGoalDifference: teamPosition.DiferenciaPuntosVisita,
			points: teamPosition.Puntos,
			localPoints: teamPosition.PuntosLocal,
			awayPoints: teamPosition.PuntosVisita,
		};
	});

	await fs.writeFile(
		"./src/assets/teams-table.json",
		JSON.stringify(teamsPosition, null, 2),
		"utf8",
	);

	process.exit(0);
}

main();
