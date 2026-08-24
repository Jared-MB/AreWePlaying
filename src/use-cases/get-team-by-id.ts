import type { Team } from "@/types/team";
import teams from "@/assets/teams.json";

export function getTeamById(teamId?: string) {
	return (teams as Team[]).find((team) => team.id === teamId) || null;
}
