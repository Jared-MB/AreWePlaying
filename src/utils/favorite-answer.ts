import { getLeagueToday, toSortableDay } from "./league-date";

export interface UpcomingMatch {
	/** Instante absoluto del salto inicial, en ms. */
	startsAt: number;
	opponent: string;
	href: string;
}

export interface MatchResult {
	matchId: string;
	playedAt: number;
	opponent: string;
	points: number;
	opponentPoints: number;
	href: string;
}

/** Lo que la portada necesita de un equipo para contestar "¿jugamos?". */
export interface TeamAnswer {
	team: string;
	upcoming: UpcomingMatch[];
	last?: MatchResult;
}

export type Answer =
	| { kind: "live" | "today" | "tomorrow"; team: string; match: UpcomingMatch }
	| { kind: "later"; team: string; match: UpcomingMatch; days: number }
	| { kind: "idle" };

export interface NewResult extends MatchResult {
	team: string;
	/** Primera vez que esta persona lo ve: se estampa con animación. */
	isFresh: boolean;
}

/** Un partido de basquetbol dura unas dos horas; después ya no está "en juego". */
const LIVE_WINDOW = 150 * 60 * 1000;
/** Resultados más viejos que esto ya no son noticia. */
const RESULT_MAX_AGE = 10 * 24 * 60 * 60 * 1000;
/** Tras verlo por primera vez, el sello se queda un rato (por si recargas). */
const RESULT_LINGER = 6 * 60 * 60 * 1000;
const MAX_RESULTS = 3;

const DAY = 24 * 60 * 60 * 1000;

/** Días de calendario (en hora de la liga) entre dos instantes. */
function leagueDayDiff(from: number, to: number) {
	const toUtc = (instant: number) => {
		const day = toSortableDay(getLeagueToday(new Date(instant)));
		return Date.UTC(
			Number(day.slice(0, 4)),
			Number(day.slice(4, 6)) - 1,
			Number(day.slice(6, 8)),
		);
	};

	return Math.round((toUtc(to) - toUtc(from)) / DAY);
}

/**
 * Contesta la pregunta del sitio para esta persona: el partido más próximo de
 * cualquiera de sus favoritos. null sin favoritos (no hay a quién contestarle).
 */
export function resolveAnswer(
	answers: Record<string, TeamAnswer>,
	favorites: string[],
	now: number,
): Answer | null {
	if (favorites.length === 0) return null;

	let next: { team: string; match: UpcomingMatch } | undefined;

	for (const id of favorites) {
		const answer = answers[id];
		const match = answer?.upcoming.find((m) => m.startsAt + LIVE_WINDOW > now);
		if (!match || (next && next.match.startsAt <= match.startsAt)) continue;

		next = { team: answer.team, match };
	}

	if (!next) return { kind: "idle" };
	if (next.match.startsAt <= now) return { kind: "live", ...next };

	const days = leagueDayDiff(now, next.match.startsAt);
	if (days <= 0) return { kind: "today", ...next };
	if (days === 1) return { kind: "tomorrow", ...next };

	return { kind: "later", ...next, days };
}

/**
 * Resultados recientes de los favoritos que esta persona todavía no había
 * visto (o vio hace muy poco), del más nuevo al más viejo.
 */
export function getNewResults(
	answers: Record<string, TeamAnswer>,
	favorites: string[],
	seen: Record<string, number>,
	now: number,
): NewResult[] {
	const results = new Map<string, NewResult>();

	for (const id of favorites) {
		const answer = answers[id];
		const last = answer?.last;
		if (!last || results.has(last.matchId)) continue;
		if (now - last.playedAt > RESULT_MAX_AGE) continue;

		const seenAt = seen[last.matchId];
		if (seenAt !== undefined && now - seenAt > RESULT_LINGER) continue;

		results.set(last.matchId, {
			...last,
			team: answer.team,
			isFresh: seenAt === undefined,
		});
	}

	return [...results.values()]
		.toSorted((a, b) => b.playedAt - a.playedAt)
		.slice(0, MAX_RESULTS);
}

/**
 * Marca los resultados como vistos y olvida los que ya no se mostrarían, para
 * que la lista en localStorage no crezca toda la temporada.
 */
export function markResultsSeen(
	seen: Record<string, number>,
	results: NewResult[],
	now: number,
) {
	const next: Record<string, number> = {};

	for (const [matchId, seenAt] of Object.entries(seen)) {
		if (now - seenAt < RESULT_MAX_AGE) next[matchId] = seenAt;
	}
	for (const result of results) {
		next[result.matchId] ??= now;
	}

	return next;
}
