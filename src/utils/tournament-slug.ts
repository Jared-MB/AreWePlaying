import type { Tournament } from "@/types/tournament";
import { buildSlugMap } from "./slug-map";
import { getTournaments } from "./get-tournaments";
import { slugify } from "./slugify";

/** "division-ii-femenil-centro" */
export const getTournamentSlug = (tournament: Tournament) =>
	slugify(
		[
			"Division",
			tournament.division,
			tournament.category,
			tournament.conference,
		]
			.filter(Boolean)
			.join(" "),
	);

/**
 * La temporada no entra en el slug: cada despliegue sirve una sola (ver
 * CURRENT_SEASON), así que dentro de un build no hay dos torneos iguales.
 */
const tournamentsBySlug = () =>
	buildSlugMap(
		getTournaments(),
		getTournamentSlug,
		(t) => t.id,
		`la temporada ${getTournaments()[0]?.season ?? ""}`,
	);

export const getTournamentBySlug = (slug?: string) =>
	slug ? tournamentsBySlug().get(slug) : undefined;

/** Igual que el anterior, pero para rutas donde un slug inválido es un bug. */
export function requireTournamentBySlug(slug?: string): Tournament {
	const tournament = getTournamentBySlug(slug);

	if (!tournament) {
		throw new Error(`No existe un torneo con el slug "${slug}".`);
	}

	return tournament;
}
