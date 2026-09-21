import type { StoryTeam } from "@/constants/story";
import type { Match } from "@/types/match";
import type { TeamPosition } from "@/types/team";
import type { Tournament } from "@/types/tournament";
import type { Week } from "@/types/week";
import { type MatchStatus, getMatchStatus } from "./get-match-status";
import { getTeamLogo } from "./get-team-logo";
import { format, isValid, parse } from "date-fns";
import { es } from "date-fns/locale";

export interface MatchCard {
	status: MatchStatus;
	local: StoryTeam;
	visiting: StoryTeam;
	/** "25 sep 2026" */
	dateLabel: string;
	/** "14:00", o "—" cuando la API no manda hora. */
	timeLabel: string;
	venue: string;
	weekLabel: string;
	tournamentLabel: string;
}

/** Las tres primeras letras de la primera palabra: "UP MÉXICO" → "UP". */
export const teamInitials = (name: string) =>
	name.split(" ")[0].substring(0, 3);

export const getTournamentLabel = (tournament: Tournament) =>
	`División ${tournament.division} · ${tournament.category}${
		tournament.conference ? ` · ${tournament.conference}` : ""
	}`;

// En los partidos por jugarse la API manda posición y récord vacíos: se cae a la
// tabla general para no dejar separadores sueltos ("LOCAL · · ").
// Un torneo que aún no arranca trae posición 0 y récord 0-0: eso es "sin dato".
const positionOf = (raw: string, stats?: TeamPosition) =>
	raw?.trim() || (stats && stats.position > 0 ? `(${stats.position})` : "");

const recordOf = (raw: string, stats?: TeamPosition) =>
	raw?.trim() || (stats && stats.matches > 0 ? stats.wr : "");

/**
 * Todo lo que necesitan las dos tarjetas del partido: la story 9:16 que se
 * descarga desde la página y la imagen social 1200×630 que sirve `og.png.ts`.
 * Vive en un solo lugar para que no se desincronicen.
 */
export function buildMatchCard({
	tournament,
	match,
	week,
	localStats,
	visitingStats,
}: {
	tournament: Tournament;
	match: Match;
	week?: Week;
	localStats?: TeamPosition;
	visitingStats?: TeamPosition;
}): MatchCard {
	const tournamentId = tournament.id.toLowerCase();
	const status = getMatchStatus(match);
	const hasScore = status !== "upcoming";

	const localPoints = Number(match.localTeamPoints);
	const visitingPoints = Number(match.visitingTeamPoints);

	const [rawDate, rawTime = ""] = match.date.split(" ");
	const parsedDate = parse(rawDate, "dd/MM/yyyy", new Date());

	const side = (
		which: "local" | "visiting",
		stats: TeamPosition | undefined,
		won: boolean,
	): StoryTeam => {
		const name = which === "local" ? match.localTeam : match.visitingTeam;
		const teamId = which === "local" ? match.localTeamId : match.visitingTeamId;

		return {
			name,
			logo: getTeamLogo({ tournamentId, teamId }),
			initials: teamInitials(name),
			position: positionOf(
				which === "local"
					? match.localTeamPosition
					: match.visitingTeamPosition,
				stats,
			),
			record: recordOf(
				which === "local" ? match.localTeamWR : match.visitingTeamWR,
				stats,
			),
			points:
				which === "local" ? match.localTeamPoints : match.visitingTeamPoints,
			isWinner: won,
		};
	};

	const tournamentLabel = getTournamentLabel(tournament);

	return {
		status,
		local: side("local", localStats, hasScore && localPoints > visitingPoints),
		visiting: side(
			"visiting",
			visitingStats,
			hasScore && visitingPoints > localPoints,
		),
		dateLabel: isValid(parsedDate)
			? format(parsedDate, "d MMM yyyy", { locale: es })
			: rawDate,
		timeLabel: rawTime || "—",
		venue:
			match.location && match.location !== "-" ? match.location : "Por definir",
		weekLabel: week?.week ?? tournamentLabel,
		tournamentLabel,
	};
}
