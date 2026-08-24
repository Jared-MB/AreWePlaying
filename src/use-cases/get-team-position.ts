import type { TeamPosition } from "@/types/team";
import positions from "@/assets/teams-table.json";

export function getTeamPosition(teamId: string): TeamPosition | undefined {
	const position = (positions as TeamPosition[]).find(
		(position) => position.id === teamId,
	);

	return position;
}
