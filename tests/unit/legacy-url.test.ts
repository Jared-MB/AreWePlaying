import { expect, test } from "vitest";
import { resolveLegacyPath } from "@/utils/legacy-url";
import { MATCH, T1, T2, T3_OTHER_SEASON, TEAM, WEEK } from "../fixtures";

const UNKNOWN = "deadbeef-0000-4000-8000-000000000000";

test.each([
	// Torneo, en cualquier capitalización y con o sin slash final.
	[`/${T1}`, "/division-i-varonil"],
	[`/${T1.toLowerCase()}/`, "/division-i-varonil"],
	[`/${T2}`, "/division-ii-femenil-centro"],
	// Equipos.
	[`/${T1}/teams`, "/division-i-varonil/teams"],
	[`/${T1}/teams/${TEAM.tec}`, "/division-i-varonil/teams/tec-de-mty-cem"],
	[
		`/${T1}/teams/${TEAM.tec.toUpperCase()}`,
		"/division-i-varonil/teams/tec-de-mty-cem",
	],
	[`/${T1}/teams/${UNKNOWN}`, null],
	[`/${T1}/teams/uv`, null],
	// Partidos.
	[`/${T1}/match/${MATCH(6)}`, "/division-i-varonil/match/uv-vs-up-mexico-6"],
	[`/${T1}/match`, null],
	[`/${T1}/match/${UNKNOWN}`, null],
	[`/${T1}/match/uv-vs-up-mexico-6`, null],
	// Jornadas.
	[`/${T1}/${WEEK.s2}`, "/division-i-varonil/semana-2"],
	[`/${T1}/${UNKNOWN}`, null],
	[`/${T1}/semana-2`, null],
	[`/${T1}/${WEEK.s2}/extra`, null],
	// Rutas que no son URLs viejas.
	["/", null],
	["/division-i-varonil", null],
	[`/${T3_OTHER_SEASON}`, null],
	[`/${UNKNOWN}`, null],
	[`/${T1}/teams/${TEAM.tec}/extra`, null],
	// Un torneo de T1 no resuelve equipos de T2.
	[`/${T1}/teams/${TEAM.uagro}`, null],
])("%s → %s", async (pathname, expected) => {
	expect(await resolveLegacyPath(pathname)).toBe(expected);
});
