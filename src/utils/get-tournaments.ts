import { readTournamentIds } from "./assets";

export async function getTournaments() {
	return readTournamentIds().map((id) => id.toLowerCase());
}
