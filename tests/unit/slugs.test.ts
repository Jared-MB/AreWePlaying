import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, test } from "vitest";
import type { Tournament } from "@/types/tournament";
import { getMatchBySlug, getMatchSlug } from "@/utils/match-slug";
import { buildSlugMap } from "@/utils/slug-map";
import { slugify } from "@/utils/slugify";
import { getTeamBySlug, getTeamSlug } from "@/utils/team-slug";
import {
	getTournamentBySlug,
	getTournamentSlug,
	requireTournamentBySlug,
} from "@/utils/tournament-slug";
import { getWeekBySlug, getWeekSlug } from "@/utils/week-slug";
import { MATCH, T1, T2, TEAM, WEEK } from "../fixtures";

describe("slugify", () => {
	test.each([
		["UP MÉXICO", "up-mexico"],
		["TEC. DE MTY (CEM)", "tec-de-mty-cem"],
		["LOBOS UAdeC", "lobos-uadec"],
		["  Ñandú   Güero ", "nandu-guero"],
		["¡¿Qué?!", "que"],
		["--a--b--", "a-b"],
		["SEMANA 10", "semana-10"],
		["Élite_2026/27", "elite-2026-27"],
		["", ""],
	])("%j → %j", (input, expected) => {
		expect(slugify(input)).toBe(expected);
	});
});

describe("slugs de cada entidad", () => {
	test("torneo: incluye la conferencia sólo cuando existe", () => {
		const base = { id: "x", season: "s", finished: false, updated_at: "" };
		expect(
			getTournamentSlug({ ...base, division: "I", category: "Varonil" }),
		).toBe("division-i-varonil");
		expect(
			getTournamentSlug({
				...base,
				division: "II",
				category: "Femenil",
				conference: "Centro",
			}),
		).toBe("division-ii-femenil-centro");
	});

	test("equipo usa el nombre corto", () => {
		expect(getTeamSlug({ shortName: "TEC. DE MTY (CEM)" })).toBe(
			"tec-de-mty-cem",
		);
	});

	test("semana", () => {
		expect(getWeekSlug({ week: "SEMANA 3" })).toBe("semana-3");
	});

	test("partido lleva el número para distinguir la revancha", () => {
		expect(
			getMatchSlug({
				localTeam: "UP MÉXICO",
				visitingTeam: "UV",
				matchNumber: 1,
			}),
		).toBe("up-mexico-vs-uv-1");
		expect(
			getMatchSlug({
				localTeam: "UV",
				visitingTeam: "UP MÉXICO",
				matchNumber: 6,
			}),
		).toBe("uv-vs-up-mexico-6");
	});
});

describe("búsqueda por slug", () => {
	test("torneos de la temporada actual", () => {
		expect(getTournamentBySlug("division-i-varonil")?.id).toBe(T1);
		expect(getTournamentBySlug("division-ii-femenil-centro")?.id).toBe(T2);
		// El de otra temporada no se sirve en este despliegue.
		expect(getTournamentBySlug("division-i-femenil")).toBeUndefined();
		expect(getTournamentBySlug(undefined)).toBeUndefined();
	});

	test("requireTournamentBySlug revienta con un mensaje claro", () => {
		expect(() => requireTournamentBySlug("nope")).toThrowError(
			'No existe un torneo con el slug "nope".',
		);
		expect(requireTournamentBySlug("division-i-varonil").id).toBe(T1);
	});

	test("equipo, semana y partido", async () => {
		const tournamentId = T1.toLowerCase();

		expect(
			(await getTeamBySlug({ tournamentId, slug: "tec-de-mty-cem" }))?.id,
		).toBe(TEAM.tec);
		expect(await getTeamBySlug({ tournamentId, slug: "nope" })).toBeUndefined();
		expect(await getTeamBySlug({ tournamentId })).toBeUndefined();

		expect((await getWeekBySlug({ tournamentId, slug: "semana-2" }))?.id).toBe(
			WEEK.s2,
		);
		expect(await getWeekBySlug({ tournamentId })).toBeUndefined();

		const found = await getMatchBySlug({
			tournamentId,
			slug: "uv-vs-up-mexico-6",
		});
		expect(found?.match.matchId).toBe(MATCH(6));
		expect(found?.week?.id).toBe(WEEK.s3);

		// Partido cuyo grupo no tiene jornada: se encuentra, pero sin semana.
		const orphan = await getMatchBySlug({
			tournamentId,
			slug: "up-mexico-vs-tec-de-mty-cem-8",
		});
		expect(orphan?.match.matchId).toBe(MATCH(8));
		expect(orphan?.week).toBeUndefined();

		expect(await getMatchBySlug({ tournamentId })).toBeUndefined();
	});
});

describe("buildSlugMap", () => {
	test("un slug repetido rompe el build con ambos nombres", () => {
		expect(() =>
			buildSlugMap(
				[{ n: "UV" }, { n: "UV." }],
				(x) => slugify(x.n),
				(x) => x.n,
				"los equipos del torneo X",
			),
		).toThrowError(
			'Slug duplicado "uv" en los equipos del torneo X: "UV" y "UV."',
		);
	});

	test("el mensaje completo", () => {
		expect(() =>
			buildSlugMap(
				["a", "a"],
				(x) => x,
				(x) => x.toUpperCase(),
				"ctx",
			),
		).toThrowError(
			'Slug duplicado "a" en ctx: "A" y "A". Las URLs deben ser únicas.',
		);
	});
});

/**
 * Golden file: todos los slugs que generan los nombres reales de la liga (copia
 * congelada en tests/fixtures/real-snapshot.json). Son las URLs que ya circulan
 * en chats y marcadores: si este snapshot cambia, se rompen enlaces compartidos.
 */
test("slugs de los datos reales (golden)", async () => {
	const snapshot: {
		tournament: Tournament;
		teams: string[];
		weeks: string[];
		matches: { localTeam: string; visitingTeam: string; matchNumber: number }[];
	}[] = JSON.parse(
		readFileSync(
			path.resolve(import.meta.dirname, "../fixtures/real-snapshot.json"),
			"utf-8",
		),
	);

	const lines = snapshot.flatMap(({ tournament, teams, weeks, matches }) => {
		const base = getTournamentSlug(tournament);
		return [
			`# ${base}`,
			...teams.map(
				(t) => `${t} → /${base}/teams/${getTeamSlug({ shortName: t })}`,
			),
			...weeks.map((w) => `${w} → /${base}/${getWeekSlug({ week: w })}`),
			...matches.map((m) => `/${base}/match/${getMatchSlug(m)}`),
		];
	});

	await expect(`${lines.join("\n")}\n`).toMatchFileSnapshot(
		"./__snapshots__/real-slugs.txt",
	);
});
