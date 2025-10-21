export interface Team {
	id: string;
	name: string;
	logo?: string;
	shortName: string;
}

export interface TeamPosition {
	id: string;
	position: number;
	name: string;
	shortName: string;
	matches: number;
	localMatches: number;
	awayMatches: number;
	percentage: number;
	wr: number;
	wins: number;
	losses: number;
	localWins: number;
	localLosses: number;
	awayWins: number;
	awayLosses: number;
	goalsFor: number;
	goalsAgainst: number;
	goalDifference: number;
	localGoalsFor: number;
	localGoalsAgainst: number;
	localGoalDifference: number;
	awayGoalsFor: number;
	awayGoalsAgainst: number;
	awayGoalDifference: number;
	points: number;
	localPoints: number;
	awayPoints: number;
}
