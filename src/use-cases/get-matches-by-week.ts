import type { Match } from "@/types/match";
import matchesByWeek from "@/assets/matches.json";

export function getMatchesByWeek(weekId?: string) {
	if (!weekId) {
		return [];
	}
	return (
		(matchesByWeek as { data: Match[]; id: string }[]).find(
			(match) => match.id === weekId,
		)?.data || []
	);
}
