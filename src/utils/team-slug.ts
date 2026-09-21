import type { TeamPosition } from "@/types/team";
import { buildSlugMap } from "./slug-map";
import { getTeamsTable } from "./get-teams-table";
import { slugify } from "./slugify";

/** "uagro" — el nombre corto es el que se ve en toda la interfaz. */
export const getTeamSlug = (team: { shortName: string }) =>
	slugify(team.shortName);

async function teamsBySlug(tournamentId: string) {
	return buildSlugMap(
		await getTeamsTable(tournamentId),
		getTeamSlug,
		(t) => t.shortName,
		`los equipos del torneo ${tournamentId}`,
	);
}

export async function getTeamBySlug({
	tournamentId,
	slug,
}: {
	tournamentId: string;
	slug?: string;
}): Promise<TeamPosition | undefined> {
	if (!slug) return undefined;

	return (await teamsBySlug(tournamentId)).get(slug);
}

/** Slug → id, para las rutas que siguen trabajando con el UUID interno. */
export async function getTeamIdBySlug({
	tournamentId,
	slug,
}: {
	tournamentId: string;
	slug?: string;
}) {
	return (await getTeamBySlug({ tournamentId, slug }))?.id;
}
