import type { TeamPosition } from "@/types/team";

export interface TeamStats {
	/** Puntos anotados por partido; `null` si aún no juega. */
	pointsForPerGame: number | null;
	/** Puntos recibidos por partido; `null` si aún no juega. */
	pointsAgainstPerGame: number | null;
	/** Diferencia de puntos por partido; `null` si aún no juega. */
	differentialPerGame: number | null;
}

const perGame = (total: number, matches: number) =>
	matches > 0 ? total / matches : null;

/**
 * En la tabla de la liga los puntos del marcador vienen como "goals" (el
 * formato es el mismo para todos los deportes); aquí se pasan a promedios.
 */
export function getTeamStats(team: TeamPosition): TeamStats {
	return {
		pointsForPerGame: perGame(team.goalsFor, team.matches),
		pointsAgainstPerGame: perGame(team.goalsAgainst, team.matches),
		differentialPerGame: perGame(team.goalDifference, team.matches),
	};
}
