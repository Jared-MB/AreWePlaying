import { isAfter, parse } from "date-fns";
import { getMatches } from "./get-matches";
import type { Match } from "@/types/match";

export async function getUpcomingMatches({
	teamId,
	tournamentId,
}: {
	tournamentId: string;
	teamId: string;
}): Promise<Match[]> {
	const today = new Date();

	const matches = await getMatches(tournamentId);

	const pastMatches = matches.flatMap((matchObj) =>
		matchObj.data.filter(
			(match) =>
				(match.localTeamId === teamId || match.visitingTeamId === teamId) &&
				isAfter(
					parse(match.date.split(" ")[0], "dd/MM/yyyy", new Date()),
					today,
				),
		),
	);

	return pastMatches;
}
