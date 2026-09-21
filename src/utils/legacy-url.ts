import type { Match } from "@/types/match";
import type { TeamPosition } from "@/types/team";
import type { Week } from "@/types/week";
import { getMatchSlug } from "./match-slug";
import { getTeamSlug } from "./team-slug";
import { getTournamentSlug } from "./tournament-slug";
import { getTournaments } from "./get-tournaments";
import { getWeekSlug } from "./week-slug";

// Igual que en get-today-matches: glob en vez de readFile para que los JSON
// queden empaquetados en la función on-demand. En Vercel la función no tiene
// acceso a src/assets, así que leer del disco aquí fallaría en producción.
const teamsTableFiles = import.meta.glob<TeamPosition[]>(
	"/src/assets/*/teams-table.json",
	{ import: "default" },
);
const weeksFiles = import.meta.glob<Week[]>("/src/assets/*/weeks.json", {
	import: "default",
});
const matchesFiles = import.meta.glob<{ data: Match[]; id: string }[]>(
	"/src/assets/*/matches.json",
	{ import: "default" },
);

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const sameId = (a: string, b: string) => a.toLowerCase() === b.toLowerCase();

/**
 * Traduce una URL vieja basada en UUIDs a su equivalente legible.
 *
 * Las URLs del sitio fueron UUIDs durante un tiempo y siguen circulando en
 * chats y marcadores, así que se redirigen en vez de dejarlas morir en un 404.
 * Devuelve null cuando la ruta no es una URL vieja reconocible.
 */
export async function resolveLegacyPath(
	pathname: string,
): Promise<string | null> {
	const [tournamentId, second, third, ...rest] = pathname
		.split("/")
		.filter(Boolean);

	if (!tournamentId || !UUID.test(tournamentId) || rest.length > 0) return null;

	const tournament = getTournaments().find((t) => sameId(t.id, tournamentId));
	if (!tournament) return null;

	const base = `/${getTournamentSlug(tournament)}`;
	const dir = tournament.id.toUpperCase();

	if (!second) return base;

	if (second === "teams") {
		if (!third) return `${base}/teams`;
		if (!UUID.test(third)) return null;

		const teams =
			(await teamsTableFiles[`/src/assets/${dir}/teams-table.json`]?.()) ?? [];
		const team = teams.find((t) => sameId(t.id, third));

		return team ? `${base}/teams/${getTeamSlug(team)}` : null;
	}

	if (second === "match") {
		if (!third || !UUID.test(third)) return null;

		const groups =
			(await matchesFiles[`/src/assets/${dir}/matches.json`]?.()) ?? [];
		const match = groups
			.flatMap((group) => group.data)
			.find((m) => sameId(m.matchId, third));

		return match ? `${base}/match/${getMatchSlug(match)}` : null;
	}

	// Lo que queda con esta forma es una jornada: /<torneo>/<semana>.
	if (third || !UUID.test(second)) return null;

	const weeks = (await weeksFiles[`/src/assets/${dir}/weeks.json`]?.()) ?? [];
	const week = weeks.find((w) => sameId(w.id, second));

	return week ? `${base}/${getWeekSlug(week)}` : null;
}
