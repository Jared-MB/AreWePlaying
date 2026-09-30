import { teamInitials } from "./get-match-card";
import { getTeamLogo } from "./get-team-logo";
import { getTeamsTable } from "./get-teams-table";
import { getTeamSlug } from "./team-slug";
import { getTournaments } from "./get-tournaments";
import { getTournamentSlug } from "./tournament-slug";

/**
 * Todos los equipos de la temporada agrupados por torneo y en orden alfabético,
 * como las conferencias en el directorio de equipos de la NBA.
 */
export async function getTeamsByTournament() {
	return Promise.all(
		getTournaments().map(async (tournament) => {
			const slug = getTournamentSlug(tournament);
			const teams = await getTeamsTable(tournament.id.toLowerCase());

			return {
				slug,
				label: [
					`División ${tournament.division}`,
					tournament.category,
					tournament.conference,
				]
					.filter(Boolean)
					.join(" · "),
				teams: teams
					.toSorted((a, b) => a.shortName.localeCompare(b.shortName, "es"))
					.map((team) => ({
						id: team.id,
						name: team.shortName,
						href: `/${slug}/teams/${getTeamSlug(team)}`,
						logo: getTeamLogo({ tournamentId: tournament.id, teamId: team.id }),
						initials: teamInitials(team.shortName),
					})),
			};
		}),
	);
}
