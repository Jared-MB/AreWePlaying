import { readFileSync } from "node:fs";
import path from "node:path";
import type { Match } from "../src/types/match";
import type { TeamPosition } from "../src/types/team";
import type { Tournament } from "../src/types/tournament";
import type { Week } from "../src/types/week";
import { slugify } from "../src/utils/slugify";

/**
 * Los e2e corren contra los datos reales, que cambian cada noche. En vez de
 * fijar equipos o partidos, se eligen aquí los que sirven para cada prueba.
 * Los slugs se arman igual que en src/utils/*-slug.ts (cubiertos por los tests
 * unitarios); aquí sólo se usan para saber a qué URL navegar.
 */
// Playwright corre desde la raíz del repo (y el paquete no es ESM).
const ASSETS = path.resolve(process.cwd(), "src/assets");
const read = <T>(...parts: string[]): T =>
	JSON.parse(readFileSync(path.join(ASSETS, ...parts), "utf-8"));

const SEASON = process.env.SEASON ?? "2026-2027";

export const tournaments = read<Tournament[]>("tournaments.json").filter(
	(t) => t.season === SEASON,
);

export const tournamentSlug = (t: Tournament) =>
	slugify(
		["Division", t.division, t.category, t.conference]
			.filter(Boolean)
			.join(" "),
	);

export const teamSlug = (shortName: string) => slugify(shortName);

export const matchSlug = (
	m: Pick<Match, "localTeam" | "visitingTeam" | "matchNumber">,
) =>
	slugify(
		`${teamSlug(m.localTeam)} vs ${teamSlug(m.visitingTeam)} ${m.matchNumber}`,
	);

/** México no tiene horario de verano desde 2022: la liga siempre es UTC-6. */
export function leagueEpoch(date: string) {
	const [day, time = "00:00"] = date.split(" ");
	const [dd, mm, yyyy] = day.split("/").map(Number);
	const [hh, min] = time.split(":").map(Number);
	return Date.UTC(yyyy, mm - 1, dd, hh + 6, min);
}

export function load(t: Tournament) {
	const id = t.id.toUpperCase();
	const groups = read<{ id: string; data: Match[] }[]>(id, "matches.json");
	return {
		tournament: t,
		slug: tournamentSlug(t),
		weeks: read<Week[]>(id, "weeks.json"),
		table: read<TeamPosition[]>(id, "teams-table.json"),
		groups,
		matches: groups.flatMap((g) => g.data),
	};
}

export const all = tournaments.map(load);
export const first = all[0];

/** Un equipo con partido por jugarse (para la cuenta regresiva). */
export function teamWithFutureMatch() {
	const now = Date.now() + 10 * 60_000;
	for (const data of all) {
		const match = data.matches
			.filter((m) => leagueEpoch(m.date) > now)
			.toSorted((a, b) => leagueEpoch(a.date) - leagueEpoch(b.date))[0];
		if (!match) continue;
		const team = data.table.find((t) => t.id === match.localTeamId);
		if (team) return { data, team, match };
	}
	return undefined;
}

/** Un partido terminado, para la story con marcador. */
export function finishedMatch() {
	for (const data of all) {
		const match = data.matches.find((m) => m.started === 0 && m.live === 0);
		if (match) return { data, match };
	}
	return undefined;
}
