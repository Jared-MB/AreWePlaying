import type { Match } from "@/types/match";
import { isAfter, parse } from "date-fns";
import matchesData from "@/assets/matches.json";

const matches = matchesData as { data: Match[]; id: string }[];

export function getUpcomingMatches(teamId: string): Match[] {
	const today = new Date();

	const upcomingMatches = matches.flatMap((matchObj) =>
		matchObj.data.filter(
			(match) =>
				(match.localTeamId === teamId || match.visitingTeamId === teamId) &&
				isAfter(
					parse(match.date.split(" ")[0], "dd/MM/yyyy", new Date()),
					today,
				),
		),
	);

	return upcomingMatches;
}
