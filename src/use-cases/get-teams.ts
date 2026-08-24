import type { Team } from "@/types/team";
import teams from "@/assets/teams.json";

export function getTeams() {
	return teams as Team[];
}
