import { readTeamsTable } from "./assets";

export async function getTeamsTable(tournamentId: string) {
	return readTeamsTable(tournamentId);
}
