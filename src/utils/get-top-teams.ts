import type { Team } from "@/types/team";
import { assetFiles } from "./asset-files";
import { getTeamsTable } from "./get-teams-table";
import { getTournaments } from "./get-tournaments";

const loadTeams = assetFiles<Team>("teams");

export async function getTopTeams(limit = 3) {
	return Promise.all(
		getTournaments().map(async (tournament) => {
			const id = tournament.id.toUpperCase();

			const [table, teams] = await Promise.all([
				getTeamsTable(id),
				loadTeams(id),
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
