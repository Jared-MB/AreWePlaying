import { expect, test } from "vitest";
import { normalizeSearch } from "@/utils/normalize-search";

test("normalizeSearch ignora acentos, mayúsculas y espacios de sobra", () => {
	expect(normalizeSearch("  ANÁHUAC   Norte ")).toBe("anahuac norte");
	expect(normalizeSearch("Universidad La Salle Nezahualcóyotl")).toBe(
		"universidad la salle nezahualcoyotl",
	);
});
