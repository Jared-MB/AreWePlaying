import type { Sport } from "../../sport/interfaces";
import type { Team } from "../../team/interfaces";

export interface Notification {
	id: number;
	matchId: number;
	userId: number;
	isActive: boolean;
	match: {
		id: number;
		date: string;
		hour: string;
		location: string;
		gender: string;
		sportId: number;
		localTeamId: number;
		visitorTeamId: number;
		sport: Sport;
		localTeam: Team;
		visitorTeam: Team;
	};
}
