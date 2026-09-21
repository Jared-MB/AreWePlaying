import { getMatchSlug } from "./match-slug";
import { getMatches } from "./get-matches";
import { getTeamSlug } from "./team-slug";
import { getTeamsTable } from "./get-teams-table";
import { getTournaments } from "./get-tournaments";
import { getTournamentSlug } from "./tournament-slug";
import { getWeeks } from "./get-weeks";
import { getWeekSlug } from "./week-slug";

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

		const teams = await getTeamsTable(dir);
		const team = teams.find((t) => sameId(t.id, third));

		return team ? `${base}/teams/${getTeamSlug(team)}` : null;
	}

	if (second === "match") {
		if (!third || !UUID.test(third)) return null;

		const match = (await getMatches(dir))
			.flatMap((group) => group.data)
			.find((m) => sameId(m.matchId, third));

		return match ? `${base}/match/${getMatchSlug(match)}` : null;
	}

	// Lo que queda con esta forma es una jornada: /<torneo>/<semana>.
	if (third || !UUID.test(second)) return null;

	const weeks = await getWeeks(dir);
	const week = weeks.find((w) => sameId(w.id, second));

	return week ? `${base}/${getWeekSlug(week)}` : null;
}
