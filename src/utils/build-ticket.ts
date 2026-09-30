import type { Match } from "@/types/match";
import type { Week } from "@/types/week";
import { teamInitials } from "./get-match-card";
import { getMatchSlug } from "./match-slug";
import { getTeamLogo } from "./get-team-logo";
import { toISODateTime } from "./league-date";
import { safeHttpUrl } from "./safe-url";
import { getTeamSlug } from "./team-slug";

export type TicketStatus = "EN CURSO" | "NO INICIADO" | "COMPLETADO";

export interface TicketTeam {
	name: string;
	href: string;
	logo: string | null;
	initials: string;
	points: string;
	isWinner: boolean;
}

/** Todo lo que necesita cualquier diseño del boleto de un partido de la lista. */
export interface Ticket {
	href: string;
	matchup: string;
	/** "#0042" */
	number: string;
	/** "14:00" */
	time: string;
	/** "25/09/2026" */
	day: string;
	datetime?: string;
	weekLabel?: string;
	venueUrl: string | null;
	venueName: string;
	status: TicketStatus;
	hasScore: boolean;
	local: TicketTeam;
	visiting: TicketTeam;
}

const getStatus = (game: Match): TicketStatus => {
	if (game.live === 1) return "EN CURSO";
	if (game.started === 1) return "NO INICIADO";
	return "COMPLETADO";
};

export function buildTicket({
	game,
	week,
	tournamentId,
	tournamentSlug,
}: {
	game: Match;
	week?: Week;
	tournamentId: string;
	tournamentSlug: string;
}): Ticket {
	const [day, time] = game.date.split(" ");
	const status = getStatus(game);
	// La API manda "-" como puntos en los partidos por jugarse: en el boleto es
	// ruido, así que sólo hay marcador cuando ya empezó.
	const hasScore = status !== "NO INICIADO";
	const localPoints = Number(game.localTeamPoints || 0);
	const visitingPoints = Number(game.visitingTeamPoints || 0);

	const side = (
		name: string,
		teamId: string,
		points: string,
		isWinner: boolean,
	): TicketTeam => ({
		name,
		href: `/${tournamentSlug}/teams/${getTeamSlug({ shortName: name })}`,
		logo: getTeamLogo({ tournamentId, teamId }),
		initials: teamInitials(name),
		points,
		isWinner,
	});

	return {
		href: `/${tournamentSlug}/match/${getMatchSlug(game)}`,
		matchup: `${game.localTeam} vs ${game.visitingTeam}`,
		number: `#${String(game.matchNumber).padStart(4, "0")}`,
		time,
		day,
		datetime: toISODateTime(game.date),
		weekLabel: week?.week,
		venueUrl: safeHttpUrl(game.locationUrl),
		venueName: game.location,
		status,
		hasScore,
		local: side(
			game.localTeam,
			game.localTeamId,
			game.localTeamPoints,
			localPoints > visitingPoints,
		),
		visiting: side(
			game.visitingTeam,
			game.visitingTeamId,
			game.visitingTeamPoints,
			visitingPoints > localPoints,
		),
	};
}
