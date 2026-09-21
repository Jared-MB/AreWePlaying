import type { Week } from "@/types/week";
import { assetFiles } from "./asset-files";

const loadWeeks = assetFiles<Week>("weeks");

export async function getWeeks(tournamentId: string) {
	return loadWeeks(tournamentId);
}
