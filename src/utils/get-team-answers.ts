import type { Match } from "@/types/match";
import { getMatchStatus } from "./get-match-status";
import { getMatches } from "./get-matches";
import { leagueDateToEpoch } from "./league-date";
import { getMatchSlug } from "./match-slug";
import { getTournaments } from "./get-tournaments";
import { getTournamentSlug } from "./tournament-slug";
import type { TeamAnswer } from "./favorite-answer";

/**
 * Partidos pendientes que se mandan por equipo. La portada se prerenderiza y
 * se reconstruye cada noche: con dos, si el próximo ya pasó antes del siguiente
 * build, la respuesta salta al que sigue en vez de quedarse sin nada.
 */
const UPCOMING_PER_TEAM = 2;

/** Un partido "por jugar" que empezó hace más que esto ya no cuenta. */
const STALE_AFTER = 3 * 60 * 60 * 1000;

function toPoints(value: string) {
	const points = Number.parseInt(value, 10);
	return Number.isFinite(points) ? points : null;
}

function getSides(match: Match) {
	const local = toPoints(match.localTeamPoints);
	const visiting = toPoints(match.visitingTeamPoints);

	return [
		{
			id: match.localTeamId,
			team: match.localTeam,
			opponent: match.visitingTeam,
			points: local,
			opponentPoints: visiting,
		},
		{
			id: match.visitingTeamId,
			team: match.visitingTeam,
			opponent: match.localTeam,
			points: visiting,
			opponentPoints: local,
		},
	];
}

function addMatch(
	answers: Record<string, TeamAnswer>,
	match: Match,
	href: string,
	now: number,
) {
	const startsAt = leagueDateToEpoch(match.date);
	if (!Number.isFinite(startsAt)) return;

	const status = getMatchStatus(match);

	for (const side of getSides(match)) {
		answers[side.id] ??= { team: side.team, upcoming: [] };
		const answer = answers[side.id];

		if (status === "upcoming" && startsAt > now - STALE_AFTER) {
			answer.upcoming.push({ startsAt, opponent: side.opponent, href });
			continue;
		}

		if (status !== "finished") continue;
		if (side.points === null || side.opponentPoints === null) continue;
		if (answer.last && answer.last.playedAt >= startsAt) continue;

		answer.last = {
			matchId: match.matchId,
			playedAt: startsAt,
			opponent: side.opponent,
			points: side.points,
			opponentPoints: side.opponentPoints,
			href,
		};
	}
}

/**
 * Lo mínimo para que la portada conteste "¿jugamos?" por cada equipo: sus
 * próximos partidos y su último resultado. Los favoritos sólo viven en el
 * navegador, así que se manda todo indexado por id y la isla elige.
 */
export async function getTeamAnswers() {
	const now = Date.now();
	const answers: Record<string, TeamAnswer> = {};

	await Promise.all(
		getTournaments().map(async (tournament) => {
			const tournamentSlug = getTournamentSlug(tournament);
			const matches = await getMatches(tournament.id.toUpperCase());

			for (const match of matches.flatMap((matchObj) => matchObj.data)) {
				addMatch(
					answers,
					match,
					`/${tournamentSlug}/match/${getMatchSlug(match)}`,
					now,
				);
			}
		}),
	);

	for (const answer of Object.values(answers)) {
		answer.upcoming = answer.upcoming
			.toSorted((a, b) => a.startsAt - b.startsAt)
			.slice(0, UPCOMING_PER_TEAM);
	}

	return answers;
}
