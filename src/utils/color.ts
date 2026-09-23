export type Rgb = [number, number, number];

/** Acepta "#abc" y "#aabbcc"; devuelve null si no es un hex válido. */
export function parseHex(hex: string): Rgb | null {
	const value = hex.trim().replace(/^#/, "");

	const full =
		value.length === 3
			? value
					.split("")
					.map((c) => c + c)
					.join("")
			: value;

	if (!/^[0-9a-f]{6}$/i.test(full)) return null;

	return [
		Number.parseInt(full.slice(0, 2), 16),
		Number.parseInt(full.slice(2, 4), 16),
		Number.parseInt(full.slice(4, 6), 16),
	];
}

/** Igual que `parseHex` pero siempre devuelve un color, para usos en render. */
export function toRgb(hex: string, fallback: Rgb = [0, 0, 0]): Rgb {
	return parseHex(hex) ?? fallback;
}

export function toHex([r, g, b]: Rgb): string {
	return `#${[r, g, b]
		.map((c) => Math.round(c).toString(16).padStart(2, "0"))
		.join("")}`.toUpperCase();
}

/** Luminancia relativa de WCAG 2.1. */
function luminance([r, g, b]: Rgb): number {
	const [rl, gl, bl] = [r, g, b].map((channel) => {
		const c = channel / 255;
		return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
	});

	return 0.2126 * rl + 0.7152 * gl + 0.0722 * bl;
}

function contrastRatio(a: Rgb, b: Rgb): number {
	const [light, dark] = [luminance(a), luminance(b)].sort((x, y) => y - x);

	return (light + 0.05) / (dark + 0.05);
}

/** Blanco o negro, el que se lea mejor encima de `background`. */
export function readableTextOn(background: Rgb): string {
	const white: Rgb = [255, 255, 255];
	const black: Rgb = [0, 0, 0];

	return contrastRatio(background, white) >= contrastRatio(background, black)
		? "#FFFFFF"
		: "#000000";
}

function mix(a: Rgb, b: Rgb, amount: number): Rgb {
	return [
		a[0] + (b[0] - a[0]) * amount,
		a[1] + (b[1] - a[1]) * amount,
		a[2] + (b[2] - a[2]) * amount,
	];
}

/**
 * Aclara u oscurece `color` lo mínimo necesario para que se lea sobre `background`.
 * Un guinda institucional sobre fondo negro, o un amarillo sobre blanco, quedarían
 * invisibles si se usaran tal cual como texto.
 */
export function ensureContrast(
	color: Rgb,
	background: Rgb,
	target: number,
): Rgb {
	if (contrastRatio(color, background) >= target) return color;

	// Se empuja hacia el extremo contrario al fondo para conservar el tono.
	const goal: Rgb = luminance(background) > 0.18 ? [0, 0, 0] : [255, 255, 255];

	for (let step = 1; step <= 20; step++) {
		const candidate = mix(color, goal, step / 20);
		if (contrastRatio(candidate, background) >= target) return candidate;
	}

	return goal;
}
