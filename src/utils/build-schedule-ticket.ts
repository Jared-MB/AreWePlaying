import type { Match } from "@/types/match";
import { teamInitials } from "./get-match-card";
import { getTeamLogo } from "./get-team-logo";
import {
	formatLeagueSchedule,
	leagueDateToEpoch,
	toISODateTime,
} from "./league-date";
import { getMatchSlug } from "./match-slug";
import { safeHttpUrl } from "./safe-url";
import { getTeamSlug } from "./team-slug";

export interface ScheduleTeam {
	name: string;
	href: string;
	logo: string | null;
	initials: string;
}

export interface ScheduleResult {
	ownPoints: number;
	rivalPoints: number;
	isWin: boolean;
}

/** Todo lo que necesita cualquier diseño del boleto del calendario de un equipo. */
export interface ScheduleTicket {
	href: string;
	matchup: string;
	/** "#0042" */
	number: string;
	isHome: boolean;
	/** "LOCAL" / "VISITA" */
	locationLabel: string;
	datetime?: string;
	/** "jue 1 oct" */
	day: string;
	/** "13:00" */
	time: string;
	venueName: string | null;
	venueUrl: string | null;
	opponent: ScheduleTeam;
	/** "vs · #4 · 3-1": quién es el rival y cómo llega. */
	opponentMeta: string;
	/** Ya se jugó: el boleto se muestra rasgado. */
	isPast: boolean;
	/** Sólo hay marcador en partidos pasados que sí se capturaron. */
	result: ScheduleResult | null;
	/** Pasado, pero sin marcador capturado. */
	missingResult: boolean;
}

export function buildScheduleTicket({
	match,
	teamId,
	tournamentId,
	tournamentSlug,
	showResult = false,
}: {
	match: Match;
	/** El equipo dueño del calendario: el rival es el otro. */
	teamId: string;
	tournamentId: string;
	tournamentSlug: string;
	showResult?: boolean;
}): ScheduleTicket {
	const isHome = match.localTeamId === teamId;

	const side = (name: string, id: string): ScheduleTeam => ({
		name,
		href: `/${tournamentSlug}/teams/${getTeamSlug({ shortName: name })}`,
		logo: getTeamLogo({ tournamentId, teamId: id }),
		initials: teamInitials(name),
	});

	const local = side(match.localTeam, match.localTeamId);
	const visiting = side(match.visitingTeam, match.visitingTeamId);
	const rival = isHome
		? {
				position: match.visitingTeamPosition,
				record: match.visitingTeamWR,
			}
		: { position: match.localTeamPosition, record: match.localTeamWR };

	// La posición viene como "(5)"; sin número no se pinta.
	const position = rival.position.replace(/\D/g, "");
	const opponentMeta = [
		isHome ? "vs" : "en",
		position ? `#${position}` : null,
		rival.record && rival.record !== "-" ? rival.record : null,
	]
		.filter(Boolean)
		.join(" · ");

	// Un partido ya pasado puede seguir sin marcador ("-") si no se capturó.
	const ownPoints = Number.parseInt(
		isHome ? match.localTeamPoints : match.visitingTeamPoints,
		10,
	);
	const rivalPoints = Number.parseInt(
		isHome ? match.visitingTeamPoints : match.localTeamPoints,
		10,
	);
	const hasScore =
		showResult && Number.isFinite(ownPoints) && Number.isFinite(rivalPoints);

	const { day, time } = formatLeagueSchedule(leagueDateToEpoch(match.date));

	return {
		href: `/${tournamentSlug}/match/${getMatchSlug(match)}`,
		matchup: `${match.localTeam} vs ${match.visitingTeam}`,
		number: `#${String(match.matchNumber).padStart(4, "0")}`,
		isHome,
		locationLabel: isHome ? "Local" : "Visita",
		datetime: toISODateTime(match.date),
		day,
		time,
		venueName: match.location && match.location !== "-" ? match.location : null,
		venueUrl: safeHttpUrl(match.locationUrl),
		opponent: isHome ? visiting : local,
		opponentMeta,
		isPast: showResult,
		result: hasScore
			? { ownPoints, rivalPoints, isWin: ownPoints > rivalPoints }
			: null,
		missingResult: showResult && !hasScore,
	};
}
