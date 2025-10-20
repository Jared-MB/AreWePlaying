import fs from "node:fs/promises";

/**
 * Please don't sue me 🙏
 */
const API_URL =
	"https://scoretdi2025-eta.vercel.app/api/jornadas?torneoID=066CC7C9-E88C-4595-8CF5-D5AAADF0AA33";

async function fetchMatchDays() {
	const response = await fetch(API_URL);
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
}

fetchMatchDays();
