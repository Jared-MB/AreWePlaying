import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import { getCurrentWeek } from "@/utils/get-current-week";
import { getMatchesWithWeek } from "@/utils/get-match";
import { getNextMatchByTeam, getNextMatches } from "@/utils/get-next-matches";
import { getPastMatches } from "@/utils/get-past-matches";
import { getTodayMatches } from "@/utils/get-today-matches";
import { getTopTeams } from "@/utils/get-top-teams";
import { getTournaments } from "@/utils/get-tournaments";
import { getUpcomingMatches } from "@/utils/get-upcoming-matches";
import { getWeeks } from "@/utils/get-weeks";
import { MATCH, NOW, T1, T2, T2_MATCH, TEAM, WEEK } from "../fixtures";

const ids = (matches: { matchId: string }[]) => matches.map((m) => m.matchId);

beforeEach(() => {
	vi.useFakeTimers({ now: NOW, toFake: ["Date"] });
});

afterEach(() => {
	vi.useRealTimers();
});

test("getTournaments sólo sirve la temporada configurada", () => {
	expect(getTournaments().map((t) => t.id)).toEqual([T1, T2]);
});

test("getMatchesWithWeek aplana los grupos y les pega su semana", async () => {
	const rows = await getMatchesWithWeek(T1);
	expect(
		rows.map(({ match, week }) => [match.matchNumber, week?.week]),
	).toEqual([
		[1, "SEMANA 1"],
		[2, "SEMANA 1"],
		[5, "SEMANA 2"],
		[3, "SEMANA 2"],
		[4, "SEMANA 2"],
		[6, "SEMANA 3"],
		[7, "SEMANA 3"],
		[8, undefined],
	]);
});

describe("pasados vs próximos de un equipo (corte en el instante del salto)", () => {
	test("UP MÉXICO a las 12:00: el partido en vivo que arrancó a las 12:00 ya es pasado", async () => {
		const args = { tournamentId: T1, teamId: TEAM.upMexico };
		expect(ids(await getPastMatches(args))).toEqual([MATCH(1), MATCH(4)]);
		expect(ids(await getUpcomingMatches(args))).toEqual([
			MATCH(6),
			MATCH(7),
			MATCH(8),
		]);
	});

	test("un partido de hoy más tarde es próximo, no pasado", async () => {
		const args = { tournamentId: T1, teamId: TEAM.uv };
		expect(ids(await getPastMatches(args))).toEqual([MATCH(1), MATCH(3)]);
		expect(ids(await getUpcomingMatches(args))).toEqual([MATCH(5), MATCH(6)]);
	});

	test("un minuto antes del salto sigue siendo próximo", async () => {
		vi.setSystemTime(new Date("2026-09-26T11:59:00-06:00"));
		const args = { tournamentId: T1, teamId: TEAM.upMexico };
		expect(ids(await getUpcomingMatches(args))).toContain(MATCH(4));
		expect(ids(await getPastMatches(args))).not.toContain(MATCH(4));
	});

	test("el id del equipo se compara tal cual (sensible a mayúsculas)", async () => {
		expect(
			await getPastMatches({
				tournamentId: T1,
				teamId: TEAM.upMexico.toUpperCase(),
			}),
		).toEqual([]);
	});

	test("torneo inexistente: listas vacías", async () => {
		const args = { tournamentId: "nope", teamId: TEAM.uv };
		expect(await getPastMatches(args)).toEqual([]);
		expect(await getUpcomingMatches(args)).toEqual([]);
	});
});

describe("getTodayMatches", () => {
	test("partidos de hoy por torneo, ordenados por hora; torneos sin partidos hoy no salen", async () => {
		const today = await getTodayMatches();
		expect(
			today.map((r) => ({
				tournament: r.tournament.id,
				week: r.week?.week,
				matches: r.matches.map((m) => m.date),
			})),
		).toEqual([
			{
				tournament: T1,
				week: "SEMANA 2",
				matches: ["26/09/2026 10:00", "26/09/2026 12:00", "26/09/2026 18:00"],
			},
		]);
	});

	test("el día cambia a medianoche de la liga, no de UTC", async () => {
		// 00:30 UTC del 27 = 18:30 del 26 en CDMX.
		vi.setSystemTime(new Date("2026-09-27T00:30:00Z"));
		expect((await getTodayMatches()).map((r) => r.tournament.id)).toEqual([T1]);

		vi.setSystemTime(new Date("2026-09-27T06:30:00Z"));
		expect(await getTodayMatches()).toEqual([]);
	});
});

describe("getNextMatches", () => {
	test("el día futuro más cercano de cada torneo, torneos ordenados por ese día", async () => {
		const next = await getNextMatches();
		expect(
			next.map((r) => ({
				tournament: r.tournament.id,
				day: r.day,
				week: r.week?.week,
				matches: r.matches.map((m) => m.matchId),
			})),
		).toEqual([
			{
				tournament: T2,
				day: "29/09/2026",
				week: "SEMANA 1",
				// Ordenados por hora: el de 17:00 antes que el de 19:30.
				matches: [T2_MATCH(2), T2_MATCH(1)],
			},
			{
				tournament: T1,
				day: "03/10/2026",
				week: "SEMANA 3",
				matches: [MATCH(6)],
			},
		]);
	});

	test("hoy no cuenta como próximo día aunque queden partidos", async () => {
		const next = await getNextMatches();
		expect(next.flatMap((r) => r.matches).map((m) => m.matchId)).not.toContain(
			MATCH(5),
		);
	});

	test("sin días futuros el torneo desaparece", async () => {
		vi.setSystemTime(new Date("2026-12-01T12:00:00-06:00"));
		expect(await getNextMatches()).toEqual([]);
	});
});

describe("getNextMatchByTeam", () => {
	test("próximo partido de cada equipo (golden)", async () => {
		expect(await getNextMatchByTeam()).toMatchSnapshot();
	});

	test("cuenta el de hoy que no ha empezado y descarta el que ya arrancó", async () => {
		const byTeam = await getNextMatchByTeam();
		expect(byTeam[TEAM.buap].matchId).toBe(MATCH(5));
		expect(byTeam[TEAM.uv].matchId).toBe(MATCH(5));
		expect(byTeam[TEAM.upMexico].matchId).toBe(MATCH(6));
		expect(byTeam[TEAM.tec].matchId).toBe(MATCH(7));
	});

	test("link de sede javascript: se descarta", async () => {
		const byTeam = await getNextMatchByTeam();
		expect(byTeam[TEAM.buap].location).toBe("GIMNASIO");
		expect(byTeam[TEAM.buap].locationUrl).toBeNull();
		expect(byTeam[TEAM.upMexico].locationUrl).toBe(
			"http://maps.google.com/maps?daddr=19.36,-99.16",
		);
	});

	test("lados local/visita y rival", async () => {
		const byTeam = await getNextMatchByTeam();
		expect(byTeam[TEAM.buap]).toMatchObject({
			isLocal: true,
			team: "BUAP",
			opponent: "UV",
			teamSlug: "buap",
			opponentSlug: "uv",
		});
		expect(byTeam[TEAM.uv]).toMatchObject({ isLocal: false, opponent: "BUAP" });
	});
});

test("getCurrentWeek: la última jornada que ya empezó", async () => {
	const weeks = await getWeeks(T1);
	expect(getCurrentWeek(weeks)?.id).toBe(WEEK.s2);

	vi.setSystemTime(new Date("2026-09-28T12:00:00-06:00"));
	expect(getCurrentWeek(weeks)?.id).toBe(WEEK.s3);

	vi.setSystemTime(new Date("2026-09-01T12:00:00-06:00"));
	expect(getCurrentWeek(weeks)).toBeUndefined();
});

test("getTopTeams: ordenados por posición, con límite y escudo de teams.json", async () => {
	const top = await getTopTeams(2);
	expect(
		top.map((r) => ({
			tournament: r.tournament.id,
			teams: r.teams.map((t) => [t.position, t.shortName, t.logo]),
		})),
	).toEqual([
		{
			tournament: T1,
			teams: [
				[1, "UV", `/logos/${T1}/${TEAM.uv}.avif`],
				[2, "UP MÉXICO", `/logos/${T1}/${TEAM.upMexico}.avif`],
			],
		},
		{
			tournament: T2,
			teams: [
				[0, "UAGRO", `/logos/${T2}/${TEAM.uagro}.avif`],
				[0, "LOBOS UAdeC", null],
			],
		},
	]);

	expect((await getTopTeams())[0].teams.map((t) => t.shortName)).toEqual([
		"UV",
		"UP MÉXICO",
		"TEC. DE MTY (CEM)",
	]);
});
