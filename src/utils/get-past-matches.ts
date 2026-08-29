import { isBefore, parse } from "date-fns";
import { getMatches } from "./get-matches";
import type { Match } from "@/types/match";

export async function getPastMatches({
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
				isBefore(
					parse(match.date.split(" ")[0], "dd/MM/yyyy", new Date()),
					today,
				),
		),
	);

	return pastMatches;
}
