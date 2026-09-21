import tournamentsRaw from "@/assets/tournaments.json" with { type: "json" };
import type { Tournament } from "@/types/tournament";

/**
 * Cada despliegue sirve una sola temporada: la actual en el dominio principal y
 * las pasadas en subdominios (2025-2026.areweplaying.com). Se configura con la
 * variable de entorno SEASON; el valor por defecto es para desarrollo local.
 */
export const CURRENT_SEASON = import.meta.env.SEASON ?? "2026-2027";

/**
 * La temporada vigente, la que sirve el dominio principal. Se deriva de los
 * torneos —ordenan bien como texto: "2025-2026" < "2026-2027"— para no tener
 * que actualizarla a mano cada año.
 */
export const LATEST_SEASON =
	(tournamentsRaw as Tournament[])
		.map((t) => t.season)
		.sort()
		.at(-1) ?? CURRENT_SEASON;
