import { describe, expect, test } from "vitest";
import {
	ACCENT_PRESETS,
	buildPalette,
	DEFAULT_ACCENT,
	STATUS_BADGE,
} from "@/constants/story";
import {
	ensureContrast,
	parseHex,
	readableTextOn,
	toHex,
	toRgb,
} from "@/utils/color";

describe("parseHex / toRgb / toHex", () => {
	test.each([
		["#FF6E38", [255, 110, 56]],
		["ff6e38", [255, 110, 56]],
		["#abc", [170, 187, 204]],
		["  #000  ", [0, 0, 0]],
		["#12345", null],
		["#GGGGGG", null],
		["", null],
	])("%j → %j", (hex, rgb) => {
		expect(parseHex(hex)).toEqual(rgb);
	});

	test("toRgb cae al respaldo", () => {
		expect(toRgb("nope")).toEqual([0, 0, 0]);
		expect(toRgb("nope", [1, 2, 3])).toEqual([1, 2, 3]);
	});

	test("toHex redondea y va en mayúsculas", () => {
		expect(toHex([255, 110.4, 55.6])).toBe("#FF6E38");
		expect(toHex([0, 0, 0])).toBe("#000000");
	});
});

test.each([
	[[255, 255, 255], "#000000"],
	[[0, 0, 0], "#FFFFFF"],
	[[255, 110, 56], "#000000"],
	[[122, 17, 41], "#FFFFFF"],
	[[200, 149, 27], "#000000"],
	[[29, 78, 216], "#FFFFFF"],
])("readableTextOn(%j) → %s", (bg, fg) => {
	expect(readableTextOn(bg as [number, number, number])).toBe(fg);
});

test("ensureContrast no toca un color que ya contrasta", () => {
	expect(ensureContrast([255, 255, 255], [0, 0, 0], 4.5)).toEqual([
		255, 255, 255,
	]);
});

test("ensureContrast: guinda sobre negro se aclara lo mínimo", () => {
	expect(
		toHex(ensureContrast([122, 17, 41], [9, 9, 11], 4.5)),
	).toMatchInlineSnapshot(`"#A96474"`);
});

/**
 * Golden: la paleta de la tarjeta para cada acento predefinido y tema. Cubre
 * readableTextOn + ensureContrast con colores reales de las universidades.
 */
test("buildPalette para todos los presets (golden)", () => {
	const palettes = Object.fromEntries(
		(["dark", "light"] as const).flatMap((theme) =>
			ACCENT_PRESETS.map((preset) => [
				`${theme} ${preset.name}`,
				buildPalette(theme, preset.value),
			]),
		),
	);
	expect(palettes).toMatchSnapshot();
});

test("buildPalette con un acento inválido usa el naranja por defecto", () => {
	expect(buildPalette("dark", "rojo")).toEqual(
		buildPalette("dark", DEFAULT_ACCENT),
	);
});

test("presets y etiquetas", () => {
	expect(
		ACCENT_PRESETS.map((p) => `${p.name} ${p.value}`),
	).toMatchInlineSnapshot(`
		[
		  "Naranja #FF6E38",
		  "Rojo #C81E28",
		  "Guinda #7A1129",
		  "Oro #C8951B",
		  "Verde #15803D",
		  "Turquesa #0E7490",
		  "Picton Blue #45B1E1",
		  "Azul #1D4ED8",
		  "Azul marino #0F2A5C",
		  "Morado #6D28D9",
		]
	`);
	expect(STATUS_BADGE).toEqual({
		live: "En vivo",
		upcoming: "Próximo partido",
		finished: "Resultado final",
	});
});
