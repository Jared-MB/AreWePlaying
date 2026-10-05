import { describe, expect, test } from "vitest";
import {
	getNewResults,
	markResultsSeen,
	resolveAnswer,
	type TeamAnswer,
} from "@/utils/favorite-answer";
import { leagueDateToEpoch } from "@/utils/league-date";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

// Jueves 15 de octubre de 2026, 10:00 en hora de la liga.
const NOW = leagueDateToEpoch("15/10/2026 10:00");

function team(
	name: string,
	upcoming: string[],
	last?: { at: string; points: number; opponentPoints: number },
): TeamAnswer {
	return {
		team: name,
		upcoming: upcoming.map((date) => ({
			startsAt: leagueDateToEpoch(date),
			opponent: "RIVAL",
			href: `/x/match/${name}`,
		})),
		last: last && {
			matchId: `${name}-last`,
			playedAt: leagueDateToEpoch(last.at),
			opponent: "RIVAL",
			points: last.points,
			opponentPoints: last.opponentPoints,
			href: `/x/match/${name}-last`,
		},
	};
}

describe("resolveAnswer", () => {
	test("sin favoritos no contesta", () => {
		expect(resolveAnswer({}, [], NOW)).toBeNull();
	});

	test.each([
		["15/10/2026 16:00", "today"],
		["15/10/2026 09:00", "live"],
		["16/10/2026 01:00", "tomorrow"],
		["20/10/2026 13:00", "later"],
	])("partido el %s → %s", (date, kind) => {
		const answers = { a: team("UANL", [date]) };
		expect(resolveAnswer(answers, ["a"], NOW)?.kind).toBe(kind);
	});

	test("cuenta los días de calendario, no bloques de 24 h", () => {
		const answers = { a: team("UANL", ["17/10/2026 08:00"]) };
		expect(resolveAnswer(answers, ["a"], NOW)).toMatchObject({
			kind: "later",
			days: 2,
		});
	});

	test("un partido que ya terminó salta al siguiente", () => {
		const answers = {
			a: team("UANL", ["15/10/2026 06:00", "22/10/2026 13:00"]),
		};
		expect(resolveAnswer(answers, ["a"], NOW)).toMatchObject({
			kind: "later",
			days: 7,
		});
	});

	test("elige el partido más próximo entre todos los favoritos", () => {
		const answers = {
			a: team("UANL", ["20/10/2026 13:00"]),
			b: team("UDEM", ["16/10/2026 13:00"]),
		};
		expect(resolveAnswer(answers, ["a", "b"], NOW)).toMatchObject({
			kind: "tomorrow",
			team: "UDEM",
		});
	});

	test("favoritos sin partidos pendientes (o ids viejos) → idle", () => {
		const answers = { a: team("UANL", []) };
		expect(resolveAnswer(answers, ["a", "borrado"], NOW)).toEqual({
			kind: "idle",
		});
	});
});

describe("getNewResults", () => {
	const answers = {
		a: team("UANL", [], {
			at: "14/10/2026 13:00",
			points: 70,
			opponentPoints: 60,
		}),
		b: team("UDEM", [], {
			at: "12/10/2026 13:00",
			points: 50,
			opponentPoints: 61,
		}),
		c: team("TEC", [], {
			at: "01/09/2026 13:00",
			points: 80,
			opponentPoints: 79,
		}),
	};

	test("muestra los recientes no vistos, del más nuevo al más viejo", () => {
		const results = getNewResults(answers, ["b", "a", "c"], {}, NOW);
		expect(results.map((r) => [r.team, r.isFresh])).toEqual([
			["UANL", true],
			["UDEM", true],
		]);
	});

	test("recién visto se queda pero sin animar; visto hace mucho desaparece", () => {
		const seen = { "UANL-last": NOW - HOUR, "UDEM-last": NOW - DAY };
		const results = getNewResults(answers, ["a", "b"], seen, NOW);
		expect(results.map((r) => [r.team, r.isFresh])).toEqual([["UANL", false]]);
	});

	test("markResultsSeen conserva la primera vista y poda lo viejo", () => {
		const results = getNewResults(answers, ["a"], {}, NOW);
		const seen = markResultsSeen(
			{ "UANL-last": NOW - HOUR, viejo: NOW - 30 * DAY },
			results,
			NOW,
		);
		expect(seen).toEqual({ "UANL-last": NOW - HOUR });
	});
});
