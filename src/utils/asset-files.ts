/**
 * Los JSON de `src/assets` se cargan con `import.meta.glob` y no con `readFile`
 * porque las rutas on-demand (el redirect de URLs viejas, los partidos de hoy,
 * la imagen social de cada partido) corren en una función de Vercel que no
 * tiene acceso al directorio: leer del disco ahí falla en producción.
 *
 * El glob es perezoso, así que cada torneo se carga sólo cuando se pide.
 */
const FILES = {
	matches: import.meta.glob("/src/assets/*/matches.json", {
		import: "default",
	}),
	weeks: import.meta.glob("/src/assets/*/weeks.json", { import: "default" }),
	"teams-table": import.meta.glob("/src/assets/*/teams-table.json", {
		import: "default",
	}),
	teams: import.meta.glob("/src/assets/*/teams.json", { import: "default" }),
} as const;

type AssetName = keyof typeof FILES;

/**
 * Devuelve el lector de uno de los JSON por torneo. Un torneo sin ese archivo
 * (o fuera de la temporada actual) da una lista vacía en vez de reventar: quien
 * lo pide ya sabe responder 404.
 */
export function assetFiles<T>(name: AssetName) {
	const files = FILES[name] as Record<string, () => Promise<T[]>>;

	return async (tournamentId: string): Promise<T[]> =>
		(await files[
			`/src/assets/${tournamentId.toUpperCase()}/${name}.json`
		]?.()) ?? [];
}
