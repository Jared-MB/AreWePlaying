import fs from "node:fs/promises";

/**
 * Please don't sue me 🙏
 */
const createApiUrl = (id: string): string =>
	`https://scoretdi2025-eta.vercel.app/api/partidos?jornadaID=${id}`;

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
		const response = await fetch(createApiUrl(id));
		const matchDay = (await response.json()) as {
			mensaje: "Tabla";
			data: string;
		};
		return {
			...matchDay,
			data: JSON.parse(matchDay.data),
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
