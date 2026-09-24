import { expect, test } from "vitest";
import { safeHttpUrl } from "@/utils/safe-url";

test.each([
	["https://maps.google.com/?q=1", "https://maps.google.com/?q=1"],
	[
		"http://maps.google.com/maps?daddr=19.36,-99.16",
		"http://maps.google.com/maps?daddr=19.36,-99.16",
	],
	// Se normaliza con URL: espacios fuera, slash final y host en minúsculas.
	["  https://EXAMPLE.com  ", "https://example.com/"],
	["javascript:alert(1)", null],
	["JAVASCRIPT:alert(1)", null],
	["data:text/html,<script>", null],
	["ftp://example.com", null],
	["-", null],
	["maps.google.com", null],
	["", null],
	[null, null],
	[undefined, null],
])("%j → %j", (input, expected) => {
	expect(safeHttpUrl(input)).toBe(expected);
});
