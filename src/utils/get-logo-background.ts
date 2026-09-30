import path from "node:path";
import sharp from "sharp";
import { type Rgb, toHex } from "./color";

/** Diferencia máxima por canal entre esquinas para considerarlas un mismo fondo. */
const MAX_CORNER_SPREAD = 24;
/** Por encima de esto en los tres canales el fondo ya es blanco, como el círculo. */
const NEAR_WHITE = 235;

/** Se consulta en cada página que muestra al equipo; el escudo no cambia en el build. */
const cache = new Map<string, Promise<string | null>>();

async function cornerColor(file: string): Promise<string | null> {
	const { data, info } = await sharp(file)
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });

	const pixel = (x: number, y: number) => {
		const i = (y * info.width + x) * info.channels;
		return [...data.subarray(i, i + 4)];
	};
	// Un píxel hacia adentro: el borde exacto suele traer antialiasing.
	const [right, bottom] = [info.width - 2, info.height - 2];
	const corners = [
		pixel(1, 1),
		pixel(right, 1),
		pixel(1, bottom),
		pixel(right, bottom),
	];

	if (corners.some(([, , , alpha]) => alpha < 200)) return null;

	const channels = [0, 1, 2].map((c) => corners.map((corner) => corner[c]));
	const uniform = channels.every(
		(values) => Math.max(...values) - Math.min(...values) <= MAX_CORNER_SPREAD,
	);
	if (!uniform) return null;

	const average = channels.map(
		(values) => values.reduce((sum, v) => sum + v, 0) / values.length,
	) as Rgb;

	return average.every((v) => v >= NEAR_WHITE) ? null : toHex(average);
}

/**
 * El color de fondo de un escudo cuadrado (esquinas opacas y del mismo color),
 * para pintar el círculo con él y fundir las esquinas hacia ese color en vez de
 * hacia blanco. Escudos transparentes o con fondo blanco devuelven null.
 */
export function getLogoBackground(logo: string | null): Promise<string | null> {
	if (!logo) return Promise.resolve(null);

	let background = cache.get(logo);
	if (!background) {
		background = cornerColor(path.join(process.cwd(), "public", logo)).catch(
			() => null,
		);
		cache.set(logo, background);
	}

	return background;
}
