import type { TeamPosition } from "@/types/team";
import { assetFiles } from "./asset-files";

const loadTeamsTable = assetFiles<TeamPosition>("teams-table");

export async function getTeamsTable(tournamentId: string) {
	return loadTeamsTable(tournamentId);
}
