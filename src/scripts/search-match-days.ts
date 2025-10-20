import fs from "node:fs/promises";
import { API_URLS } from "../constants/apiUrl";

async function fetchMatchDays() {
	const response = await fetch(API_URLS.MATCH_DAYS);
	const matchDays = (await response.json()) as {
		mensaje: "Tabla";
		data: string;
	};

	const matchDaysData = JSON.parse(matchDays.data) as {
		JornadaID: string;
		Nombre: string;
		Fecha: string;
		tipojornadanombre: string;
		TorneoID: string;
	}[];

	const parsedMatchDays = matchDaysData.map((matchDay) => ({
		date: matchDay.Fecha,
		week: matchDay.Nombre,
		type: matchDay.tipojornadanombre,
		id: matchDay.JornadaID,
		tournamentId: matchDay.TorneoID,
	}));

	await fs.writeFile(
		"./src/assets/match-days.json",
		JSON.stringify(parsedMatchDays, null, 2),
	);

	process.exit(0);
}

fetchMatchDays();
