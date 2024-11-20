import type { Sport } from "../../sport/interfaces";
import type { Team } from "../../team/interfaces";

export interface Match {
	id: number;
	date: Date;
	hour: string;
	location: string;
	gender: string;
	sportId: number;
	localTeamId: number;
	visitorTeamId: number;
	localTeam: Team;
	visitorTeam: Team;
	sport: Sport;
}
