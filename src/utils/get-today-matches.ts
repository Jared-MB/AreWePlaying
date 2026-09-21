import { getLeagueToday } from "./league-date";
import { getMatches } from "./get-matches";
import { getTournaments } from "./get-tournaments";
import { getWeeks } from "./get-weeks";

export async function getTodayMatches() {
	const today = getLeagueToday();

	const results = await Promise.all(
		getTournaments().map(async (tournament) => {
			const id = tournament.id.toUpperCase();

			const [matches, weeks] = await Promise.all([
				getMatches(id),
				getWeeks(id),
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
