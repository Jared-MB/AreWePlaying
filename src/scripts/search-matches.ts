import fs from "node:fs/promises";
import { API_URLS } from "../constants/apiUrl";

async function fetchMatchDays() {
	const matchDaysFile = await fs.readFile(
		"./src/assets/match-days.json",
		"utf-8",
	);
	const matchDaysData = JSON.parse(matchDaysFile) as {
		date: string;
		week: string;
		type: string;
		id: string;
		tournamentId: string;
	}[];

	const matchDaysPromise = matchDaysData.map(async ({ id }) => {
		const response = await fetch(API_URLS.MATCHES(id));
		const matchDay = (await response.json()) as {
			mensaje: "Tabla";
			data: string;
		};

		const parsedData = JSON.parse(matchDay.data) as {
			PartidoID: string;
			Numero: number;
			EquipoLocal: string;
			EquipoLocalID: string;
			EquipoVisita: string;
			EquipoVisitaID: string;
			Fecha: string;
			Iniciado: string;
			Terminado: string;
			EquipoCasaPuntos: string;
			EquipoVisitaPuntos: string;
			PeriodoFinal: string;
			Nombre: string;
			PartidoIniciado: number;
			SedeNombre: string;
			Ubicacion: string;
			EnVivo: number;
			URL: string;
			PosLocal: string;
			GPLocal: string;
			PosVisita: string;
			GPVisita: string;
		}[];

		return {
			data: parsedData.map((match) => ({
				matchId: match.PartidoID,
				matchNumber: match.Numero,
				localTeam: match.EquipoLocal,
				localTeamId: match.EquipoLocalID,
				visitingTeam: match.EquipoVisita,
				visitingTeamId: match.EquipoVisitaID,
				date: match.Fecha,
				startTime: match.Iniciado,
				endTime: match.Terminado,
				localTeamPoints: match.EquipoCasaPuntos,
				visitingTeamPoints: match.EquipoVisitaPuntos,
				period: match.PeriodoFinal,
				name: match.Nombre,
				started: match.PartidoIniciado,
				location: match.SedeNombre,
				locationUrl: match.Ubicacion,
				live: match.EnVivo,
				url: match.URL,
				localTeamPosition: match.PosLocal,
				localTeamWR: match.GPLocal,
				visitingTeamPosition: match.PosVisita,
				visitingTeamWR: match.GPVisita,
			})),
			id,
		};
	});

	const matchDays = await Promise.all(matchDaysPromise);

	await fs.writeFile(
		"./src/assets/matches.json",
		JSON.stringify(matchDays, null, 2),
	);

	process.exit(0);
}

fetchMatchDays();
