import type { Match } from "@/types/match";
import type { Week } from "@/types/week";
import { getTournaments } from "./get-tournaments";

// Los JSON se importan vía glob (y no con readFile) para que queden empaquetados
// en la función on-demand que renderiza el server island.
const matchesFiles = import.meta.glob<{ data: Match[]; id: string }[]>(
	"/src/assets/*/matches.json",
	{ import: "default" },
);
const weeksFiles = import.meta.glob<Week[]>("/src/assets/*/weeks.json", {
	import: "default",
});

// Las fechas de los partidos están en hora local de la liga.
const LEAGUE_TIME_ZONE = "America/Mexico_City";

/** Fecha de hoy en la zona horaria de la liga, con el formato dd/MM/yyyy de los partidos. */
export function getLeagueToday(now = new Date()) {
	return new Intl.DateTimeFormat("es-MX", {
		timeZone: LEAGUE_TIME_ZONE,
		day: "2-digit",
		month: "2-digit",
		year: "numeric",
	}).format(now);
}

export async function getTodayMatches() {
	const today = getLeagueToday();

	const results = await Promise.all(
		getTournaments().map(async (tournament) => {
			const id = tournament.id.toUpperCase();
			const loadMatches = matchesFiles[`/src/assets/${id}/matches.json`];
			const loadWeeks = weeksFiles[`/src/assets/${id}/weeks.json`];
			if (!loadMatches) return null;

			const [matches, weeks] = await Promise.all([
				loadMatches(),
				loadWeeks?.() ?? [],
			]);

			for (const matchObj of matches) {
				const todayMatches = matchObj.data.filter(
					(match) => match.date.split(" ")[0] === today,
				);

				if (todayMatches.length > 0) {
					return {
						tournament,
						week: weeks.find((w) => w.id === matchObj.id),
						matches: todayMatches.toSorted((a, b) =>
							a.date.localeCompare(b.date),
						),
					};
				}
			}

			return null;
		}),
	);

	return results.filter((r) => r !== null);
}
