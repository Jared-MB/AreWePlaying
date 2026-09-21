import { ensureContrast, readableTextOn, toHex, toRgb } from "@/utils/color";
import type { MatchStatus } from "@/utils/get-match-status";

/**
 * Tokens de la tarjeta compartible. Viven aquí, y no en el componente, porque
 * también los usa la imagen social del partido (`src/og/`), que se renderiza en
 * el servidor y no puede importar nada que arrastre `preact/hooks`.
 */

export type StoryTheme = "dark" | "light";

export const THEMES = {
	dark: {
		bg: "#09090B",
		surface: "#18181B",
		line: "#52525C",
		mutedFg: "#9F9FA9",
		fg: "#FAFAFA",
	},
	light: {
		bg: "#FFFFFF",
		surface: "#F4F4F5",
		line: "#9F9FA9",
		mutedFg: "#6B7280",
		fg: "#000000",
	},
} as const satisfies Record<StoryTheme, Record<string, string>>;

export const DEFAULT_ACCENT = "#FF6E38";

/** Colores institucionales frecuentes; el selector libre cubre el resto. */
export const ACCENT_PRESETS = [
	{ value: DEFAULT_ACCENT, name: "Naranja" },
	{ value: "#C81E28", name: "Rojo" },
	{ value: "#7A1129", name: "Guinda" },
	{ value: "#C8951B", name: "Oro" },
	{ value: "#15803D", name: "Verde" },
	{ value: "#0E7490", name: "Turquesa" },
	{ value: "#1D4ED8", name: "Azul" },
	{ value: "#0F2A5C", name: "Azul marino" },
	{ value: "#6D28D9", name: "Morado" },
] as const;

/** Etiqueta del partido en la tarjeta; más coloquial que MATCH_STATUS_LABEL. */
export const STATUS_BADGE: Record<MatchStatus, string> = {
	live: "En vivo",
	upcoming: "Próximo partido",
	finished: "Resultado final",
};

/**
 * El acento es una marca ajena, así que no se puede asumir que contraste: sobre
 * un relleno se elige blanco/negro, y como texto se aclara u oscurece lo justo.
 * `large` es para el marcador y `small` para el pie.
 */
export function buildPalette(theme: StoryTheme, accent: string) {
	const base = THEMES[theme];
	const accentRgb = toRgb(accent, toRgb(DEFAULT_ACCENT));
	const bgRgb = toRgb(base.bg);

	return {
		...base,
		primary: toHex(accentRgb),
		primaryFg: readableTextOn(accentRgb),
		accentTextLarge: toHex(ensureContrast(accentRgb, bgRgb, 3)),
		accentTextSmall: toHex(ensureContrast(accentRgb, bgRgb, 4.5)),
	};
}

export type Palette = ReturnType<typeof buildPalette>;

export interface StoryTeam {
	name: string;
	logo: string | null;
	initials: string;
	record: string;
	position: string;
	points: string;
	isWinner: boolean;
}
