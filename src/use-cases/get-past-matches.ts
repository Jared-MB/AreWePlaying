import type { Match } from "@/types/match";
import { isBefore, parse } from "date-fns";
import matchesData from "@/assets/matches.json";

const matches = matchesData as { data: Match[]; id: string }[];

export function getPastMatches(teamId: string): Match[] {
	const today = new Date();

	const pastMatches = matches.flatMap((matchObj) =>
		matchObj.data.filter(
			(match) =>
				(match.localTeamId === teamId || match.visitingTeamId === teamId) &&
				isBefore(
					parse(match.date.split(" ")[0], "dd/MM/yyyy", new Date()),
					today,
				),
		),
	);

	return pastMatches;
}
