import { readMatches } from "./assets";

export async function getMatches(tournamentId: string) {
	return readMatches(tournamentId);
}
