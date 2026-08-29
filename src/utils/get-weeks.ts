import { readWeeks } from "./assets";

export async function getWeeks(tournamentId: string) {
	return readWeeks(tournamentId);
}
