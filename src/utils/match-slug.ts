import type { Match } from "@/types/match";
import { buildSlugMap } from "./slug-map";
import { getMatchesWithWeek, type MatchWithWeek } from "./get-match";
import { getTeamSlug } from "./team-slug";
import { slugify } from "./slugify";

/**
 * "uagro-vs-buap-12". Lleva el número de partido porque dos equipos pueden
 * enfrentarse más de una vez (vuelta o liguilla) y el slug tiene que seguir
 * siendo único.
 */
export const getMatchSlug = (
	match: Pick<Match, "localTeam" | "visitingTeam" | "matchNumber">,
) =>
	slugify(
		`${getTeamSlug({ shortName: match.localTeam })} vs ${getTeamSlug({
			shortName: match.visitingTeam,
		})} ${match.matchNumber}`,
	);

async function matchesBySlug(tournamentId: string) {
	return buildSlugMap(
		await getMatchesWithWeek(tournamentId),
		({ match }) => getMatchSlug(match),
		({ match }) => match.name,
		`los partidos del torneo ${tournamentId}`,
	);
}

export async function getMatchBySlug({
	tournamentId,
	slug,
}: {
	tournamentId: string;
	slug?: string;
}): Promise<MatchWithWeek | undefined> {
	if (!slug) return undefined;

	return (await matchesBySlug(tournamentId)).get(slug);
}
