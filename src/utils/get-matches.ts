import type { Match } from "@/types/match";
import { assetFiles } from "./asset-files";

const loadMatches = assetFiles<{ data: Match[]; id: string }>("matches");

/** Los partidos del torneo, agrupados por la jornada a la que pertenecen. */
export async function getMatches(tournamentId: string) {
	return loadMatches(tournamentId);
}
