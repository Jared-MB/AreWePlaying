import type { Tournament } from "@/types/tournament";
import { teamInitials } from "./get-match-card";
import { getTeamLogo } from "./get-team-logo";
import { getTeamsTable } from "./get-teams-table";
import { getTeamSlug } from "./team-slug";
import { getTournamentSlug } from "./tournament-slug";

export interface StandingTeam {
	id: string;
	name: string;
	href: string;
	logo: string | null;
	initials: string;
	/** `null` mientras el torneo no empieza: la API manda 0 para todos. */
	position: number | null;
	matches: number;
	wins: number;
	losses: number;
	percentage: number;
	pointsFor: number;
	pointsAgainst: number;
	difference: number;
}

/**
 * La tabla de un torneo lista para pintar. Antes del primer partido no hay
 * orden real: los equipos van en orden alfabético y `hasStarted` lo avisa para
 * que la página lo diga en vez de inventar posiciones.
 */
export async function getStandings(tournament: Tournament) {
	const tournamentId = tournament.id.toLowerCase();
	const tournamentSlug = getTournamentSlug(tournament);
	const table = await getTeamsTable(tournamentId);
	const hasStarted = table.some((team) => team.position > 0);

	const sorted = hasStarted
		? table.toSorted((a, b) => a.position - b.position)
		: table.toSorted((a, b) => a.shortName.localeCompare(b.shortName, "es"));

	const teams: StandingTeam[] = sorted.map((team) => ({
		id: team.id,
		name: team.shortName,
		href: `/${tournamentSlug}/teams/${getTeamSlug(team)}`,
		logo: getTeamLogo({ tournamentId, teamId: team.id }),
		initials: teamInitials(team.shortName),
		position: hasStarted ? team.position : null,
		matches: team.matches,
		wins: team.wins,
		losses: team.losses,
		percentage: team.percentage,
		pointsFor: team.goalsFor,
		pointsAgainst: team.goalsAgainst,
		difference: team.goalDifference,
	}));

	return { teams, hasStarted };
}
