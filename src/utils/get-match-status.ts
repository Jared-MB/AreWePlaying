import type { Match } from "@/types/match";

export type MatchStatus = "live" | "upcoming" | "finished";

/**
 * La API invierte el sentido de `started`: 1 significa "todavía no arranca".
 * Se centraliza aquí para no repetir la condición en cada vista.
 */
export function getMatchStatus(
	match: Pick<Match, "live" | "started">,
): MatchStatus {
	if (match.live === 1) return "live";
	if (match.started === 1) return "upcoming";
	return "finished";
}

export const MATCH_STATUS_LABEL: Record<MatchStatus, string> = {
	live: "EN CURSO",
	upcoming: "NO INICIADO",
	finished: "COMPLETADO",
};
