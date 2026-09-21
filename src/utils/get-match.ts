import type { Match } from "@/types/match";
import type { Week } from "@/types/week";
import { getMatches } from "./get-matches";
import { getWeeks } from "./get-weeks";

export interface MatchWithWeek {
	match: Match;
	week?: Week;
}

/** Todos los partidos del torneo, cada uno con la semana a la que pertenece. */
export async function getMatchesWithWeek(
	tournamentId: string,
): Promise<MatchWithWeek[]> {
	const [weeksMatches, weeks] = await Promise.all([
		getMatches(tournamentId),
		getWeeks(tournamentId),
	]);

	return weeksMatches.flatMap((group) => {
		const week = weeks.find((w) => w.id === group.id);

		return group.data.map((match) => ({ match, week }));
	});
}
