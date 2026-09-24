import { describe, expect, test } from "vitest";
import {
	formatLeagueDateTime,
	formatLeagueDay,
	getLeagueToday,
	leagueDateToEpoch,
	toISODateTime,
	toSortableDay,
} from "@/utils/league-date";

describe("leagueDateToEpoch (hora de Ciudad de México → instante absoluto)", () => {
	test.each([
		["26/09/2026 12:00", "2026-09-26T18:00:00.000Z"],
		["26/09/2026 18:00", "2026-09-27T00:00:00.000Z"],
		// Sin hora: medianoche de la liga.
		["04/10/2026", "2026-10-04T06:00:00.000Z"],
		// México quitó el horario de verano en 2022: abril sigue en UTC-6.
		["05/04/2026 03:00", "2026-04-05T09:00:00.000Z"],
		["01/07/2026 20:30", "2026-07-02T02:30:00.000Z"],
		// Antes de 2022 sí había horario de verano (UTC-5 en julio).
		["01/07/2021 20:30", "2021-07-02T01:30:00.000Z"],
		["31/12/2026 23:59", "2027-01-01T05:59:00.000Z"],
	])("%s → %s", (value, iso) => {
		expect(new Date(leagueDateToEpoch(value)).toISOString()).toBe(iso);
	});

	// OJO: el comentario de `toISODateTime` promete `undefined` para una fecha
	// ilegible, pero hoy `Intl` revienta antes con RangeError. Se fija el
	// comportamiento actual; si se corrige, este test debe cambiar a propósito.
	test("una fecha ilegible lanza RangeError (no devuelve undefined)", () => {
		expect(() => leagueDateToEpoch("por definir")).toThrow(RangeError);
		expect(() => toISODateTime("por definir")).toThrow(RangeError);
		expect(toISODateTime("26/09/2026 12:00")).toBe("2026-09-26T18:00:00.000Z");
	});
});

describe("getLeagueToday usa el día de la liga, no el del servidor", () => {
	test.each([
		["2026-09-27T05:59:00Z", "26/09/2026"],
		["2026-09-27T06:00:00Z", "27/09/2026"],
		["2026-01-01T03:00:00Z", "31/12/2025"],
	])("%s → %s", (instant, day) => {
		expect(getLeagueToday(new Date(instant))).toBe(day);
	});
});

describe("formatos en español", () => {
	test("formatLeagueDateTime", () => {
		expect(formatLeagueDateTime(leagueDateToEpoch("26/09/2026 18:00"))).toBe(
			"sábado 26 de septiembre · 18:00 hrs",
		);
		expect(formatLeagueDateTime(leagueDateToEpoch("04/10/2026 09:05"))).toBe(
			"domingo 4 de octubre · 09:05 hrs",
		);
		expect(formatLeagueDateTime(leagueDateToEpoch("01/01/2027 00:00"))).toBe(
			"viernes 1 de enero · 00:00 hrs",
		);
	});

	test("formatLeagueDay", () => {
		expect(formatLeagueDay("26/09/2026")).toBe("sábado 26 de septiembre");
		expect(formatLeagueDay("01/11/2026")).toBe("domingo 1 de noviembre");
	});
});

test("toSortableDay ordena dd/MM/yyyy cronológicamente", () => {
	expect(toSortableDay("26/09/2026")).toBe("20260926");
	const days = ["01/10/2026", "30/09/2026", "15/01/2027", "31/12/2025"];
	expect(
		days.toSorted((a, b) => toSortableDay(a).localeCompare(toSortableDay(b))),
	).toEqual(["31/12/2025", "30/09/2026", "01/10/2026", "15/01/2027"]);
});
