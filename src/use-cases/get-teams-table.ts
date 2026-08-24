import type { TeamPosition } from "@/types/team";
import teamsTable from "@/assets/teams-table.json";

export function getTeamsTable() {
	return teamsTable as TeamPosition[];
}
