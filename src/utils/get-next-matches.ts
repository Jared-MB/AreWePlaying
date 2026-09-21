import type { Match } from "@/types/match";
import type { Week } from "@/types/week";
import {
	formatLeagueDateTime,
	getLeagueToday,
	leagueDateToEpoch,
	toSortableDay,
} from "./league-date";
import { getTournaments } from "./get-tournaments";
import { getTournamentSlug } from "./tournament-slug";
import { getMatchSlug } from "./match-slug";
import { getTeamSlug } from "./team-slug";

// Mismo patrón que get-today-matches: glob para que los JSON queden empaquetados
// en la función on-demand del server island.
const matchesFiles = import.meta.glob<{ data: Match[]; id: string }[]>(
	"/src/assets/*/matches.json",
	{ import: "default" },
);
const weeksFiles = import.meta.glob<Week[]>("/src/assets/*/weeks.json", {
	import: "default",
});

/** Partido de un favorito, con lo mínimo para pintar su tarjeta en el cliente. */
export interface NextTeamMatch {
	matchId: string;
	/** Slugs precalculados: la isla corre en el navegador y no puede resolverlos. */
	matchSlug: string;
	tournamentSlug: string;
	teamSlug: string;
	opponentSlug: string;
	/** Instante absoluto del salto inicial, en ms. */
	startsAt: number;
	/** Día y hora ya formateados en español, para que la isla no cargue Intl. */
	label: string;
	tournament: string;
	team: string;
	/** UUID: es la llave con la que se guardan los favoritos en localStorage. */
	teamId: string;
	opponent: string;
	isLocal: boolean;
	location: string;
	locationUrl: string;
	week?: string;
}

function isFutureDay(day: string, today: string) {
	return toSortableDay(day) > toSortableDay(today);
}

async function loadTournament(id: string) {
	const loadMatches = matchesFiles[`/src/assets/${id}/matches.json`];
	const loadWeeks = weeksFiles[`/src/assets/${id}/weeks.json`];
	if (!loadMatches) return null;

	const [matches, weeks] = await Promise.all([
		loadMatches(),
		loadWeeks?.() ?? [],
	]);

	return { matches, weeks };
}

/**
 * Próxima jornada de cada torneo: el día futuro más cercano con partidos.
 * Devuelve la misma forma que getTodayMatches para reutilizar la vista.
 */
export async function getNextMatches() {
	const today = getLeagueToday();

	const results = await Promise.all(
		getTournaments().map(async (tournament) => {
			const loaded = await loadTournament(tournament.id.toUpperCase());
			if (!loaded) return null;

			const { matches, weeks } = loaded;

			let nextDay: string | undefined;
			let weekId: string | undefined;

			for (const matchObj of matches) {
				for (const match of matchObj.data) {
					const day = match.date.split(" ")[0];
					if (!isFutureDay(day, today)) continue;
					if (nextDay && toSortableDay(day) >= toSortableDay(nextDay)) continue;

					nextDay = day;
					weekId = matchObj.id;
				}
			}

			if (!nextDay) return null;

			const dayMatches = matches
				.flatMap((matchObj) => matchObj.data)
				.filter((match) => match.date.split(" ")[0] === nextDay)
				.toSorted((a, b) => a.date.localeCompare(b.date));

			return {
				tournament,
				week: weeks.find((w) => w.id === weekId),
				day: nextDay,
				matches: dayMatches,
			};
		}),
	);

	return results
		.filter((r) => r !== null)
		.toSorted((a, b) =>
			toSortableDay(a.day).localeCompare(toSortableDay(b.day)),
		);
}

/**
 * Próximo partido de cada equipo, indexado por id. Se serializa en la página
 * para que la isla de favoritos (que sólo el navegador conoce) arme la cuenta
 * regresiva sin pedir nada al servidor.
 */
export async function getNextMatchByTeam() {
	const today = getLeagueToday();
	const now = Date.now();
	const byTeam: Record<string, NextTeamMatch> = {};

	await Promise.all(
		getTournaments().map(async (tournament) => {
			const tournamentSlug = getTournamentSlug(tournament);
			const tournamentLabel = [
				`División ${tournament.division}`,
				tournament.category,
				tournament.conference,
			]
				.filter(Boolean)
				.join(" · ");
			const loaded = await loadTournament(tournament.id.toUpperCase());
			if (!loaded) return;

			const { matches, weeks } = loaded;

			for (const matchObj of matches) {
				const week = weeks.find((w) => w.id === matchObj.id)?.week;

				for (const match of matchObj.data) {
					// Cuentan también los de hoy que aún no empiezan: si tu equipo
					// juega en unas horas, la cuenta regresiva va a ese partido.
					if (toSortableDay(match.date.split(" ")[0]) < toSortableDay(today))
						continue;

					const startsAt = leagueDateToEpoch(match.date);
					if (startsAt <= now) continue;

					const sides = [
						{
							id: match.localTeamId,
							team: match.localTeam,
							opponent: match.visitingTeam,
							isLocal: true,
						},
						{
							id: match.visitingTeamId,
							team: match.visitingTeam,
							opponent: match.localTeam,
							isLocal: false,
						},
					];

					for (const { id, team, opponent, isLocal } of sides) {
						const current = byTeam[id];
						if (current && current.startsAt <= startsAt) continue;

						byTeam[id] = {
							matchId: match.matchId,
							matchSlug: getMatchSlug(match),
							tournamentSlug,
							teamSlug: getTeamSlug({ shortName: team }),
							opponentSlug: getTeamSlug({ shortName: opponent }),
							startsAt,
							label: formatLeagueDateTime(startsAt),
							tournament: tournamentLabel,
							team,
							teamId: id,
							opponent,
							isLocal,
							location: match.location,
							locationUrl: match.locationUrl,
							week,
						};
					}
				}
			}
		}),
	);

	return byTeam;
}
