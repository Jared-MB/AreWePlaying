import type { Week } from "@/types/week";
import { buildSlugMap } from "./slug-map";
import { getWeeks } from "./get-weeks";
import { slugify } from "./slugify";

/** "semana-1" */
export const getWeekSlug = (week: Pick<Week, "week">) => slugify(week.week);

async function weeksBySlug(tournamentId: string) {
	return buildSlugMap(
		await getWeeks(tournamentId),
		getWeekSlug,
		(w) => w.week,
		`las jornadas del torneo ${tournamentId}`,
	);
}

export async function getWeekBySlug({
	tournamentId,
	slug,
}: {
	tournamentId: string;
	slug?: string;
}): Promise<Week | undefined> {
	if (!slug) return undefined;

	return (await weeksBySlug(tournamentId)).get(slug);
}
