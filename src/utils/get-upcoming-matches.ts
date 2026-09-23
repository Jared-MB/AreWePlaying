import { getMatches } from "./get-matches";
import { leagueDateToEpoch } from "./league-date";
import type { Match } from "@/types/match";

export async function getUpcomingMatches({
	teamId,
	tournamentId,
}: {
	tournamentId: string;
	teamId: string;
}): Promise<Match[]> {
	// Se compara el instante del salto inicial (en hora de la liga) contra el
	// del build: con la fecha a medianoche en la zona del servidor, un partido
	// de hoy caía en "pasados" antes de jugarse.
	const now = Date.now();

	const matches = await getMatches(tournamentId);

	return matches.flatMap((matchObj) =>
		matchObj.data.filter(
			(match) =>
				(match.localTeamId === teamId || match.visitingTeamId === teamId) &&
				leagueDateToEpoch(match.date) > now,
		),
	);
}
