import type { Team, TeamPosition } from "@/types/team";
import { getTournaments } from "./get-tournaments";

// Igual que en get-today-matches: glob para que los JSON queden empaquetados
// en la función on-demand del server island.
const teamsTableFiles = import.meta.glob<TeamPosition[]>(
	"/src/assets/*/teams-table.json",
	{ import: "default" },
);
const teamsFiles = import.meta.glob<Team[]>("/src/assets/*/teams.json", {
	import: "default",
});

export async function getTopTeams(limit = 3) {
	return Promise.all(
		getTournaments().map(async (tournament) => {
			const id = tournament.id.toUpperCase();

			const [table, teams] = await Promise.all([
				teamsTableFiles[`/src/assets/${id}/teams-table.json`]?.() ?? [],
				teamsFiles[`/src/assets/${id}/teams.json`]?.() ?? [],
			]);

			const topTeams = table
				.toSorted((a, b) => a.position - b.position)
				.slice(0, limit)
				.map((team) => ({
					...team,
					logo: teams.find((t) => t.id === team.id)?.logo ?? null,
				}));

			return { tournament, teams: topTeams };
		}),
	);
}
