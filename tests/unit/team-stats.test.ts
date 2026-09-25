import { expect, test } from "vitest";
import type { TeamPosition } from "@/types/team";
import { getTeamStats } from "@/utils/team-stats";

const team = (overrides: Partial<TeamPosition>) =>
	({
		matches: 0,
		goalsFor: 0,
		goalsAgainst: 0,
		goalDifference: 0,
		...overrides,
	}) as TeamPosition;

test("getTeamStats: promedia los puntos por partido", () => {
	expect(
		getTeamStats(
			team({ matches: 2, goalsFor: 144, goalsAgainst: 75, goalDifference: 69 }),
		),
	).toEqual({
		pointsForPerGame: 72,
		pointsAgainstPerGame: 37.5,
		differentialPerGame: 34.5,
	});
});

test("getTeamStats: sin partidos jugados no divide entre cero", () => {
	expect(getTeamStats(team({}))).toEqual({
		pointsForPerGame: null,
		pointsAgainstPerGame: null,
		differentialPerGame: null,
	});
});
