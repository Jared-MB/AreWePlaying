import { expect, test } from "vitest";
import { getMatchStatus, MATCH_STATUS_LABEL } from "@/utils/get-match-status";

test.each([
	// La API invierte `started`: 1 significa "todavía no arranca".
	[{ live: 0, started: 1 }, "upcoming"],
	[{ live: 0, started: 0 }, "finished"],
	// `live` gana sobre cualquier valor de `started`.
	[{ live: 1, started: 0 }, "live"],
	[{ live: 1, started: 1 }, "live"],
])("%j → %s", (match, status) => {
	expect(getMatchStatus(match)).toBe(status);
});

test("etiquetas", () => {
	expect(MATCH_STATUS_LABEL).toEqual({
		live: "EN CURSO",
		upcoming: "NO INICIADO",
		finished: "COMPLETADO",
	});
});
