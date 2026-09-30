import path from "node:path";
import sharp from "sharp";
import { contrastRatio, ensureContrast, type Rgb, toHex } from "./color";
import { getTeamLogo } from "./get-team-logo";

const SAMPLE_SIZE = 48;
/**
 * Para contar como color (y no blanco, gris o negro) un píxel necesita algo de
 * croma absoluto y saturación relativa: así entra el azul marino de un escudo,
 * oscuro pero intenso, y quedan fuera los grises de las sombras.
 */
const MIN_CHROMA = 30;
const MIN_SATURATION = 0.35;
/** Bits por canal al agrupar: 4 → 4096 cubetas, suficiente para un escudo. */
const BUCKET_SHIFT = 4;
const WHITE: Rgb = [255, 255, 255];
/**
 * Peso de los colores claros (amarillo, dorado) frente a los que ya aguantan
 * texto blanco: oscurecidos quedan color lodo, así que un azul menos abundante
 * del mismo escudo gana si aparece al menos un tercio de las veces.
 */
const LIGHT_COLOR_WEIGHT = 0.35;

/** Cada cubeta acumula la suma de sus píxeles para devolver el promedio real. */
type Bucket = { count: number; sum: Rgb };

function isChromatic(r: number, g: number, b: number) {
	const max = Math.max(r, g, b);
	const chroma = max - Math.min(r, g, b);

	return chroma >= MIN_CHROMA && chroma / max >= MIN_SATURATION;
}

function addPixel(buckets: Map<number, Bucket>, [r, g, b]: Rgb) {
	const key =
		((r >> BUCKET_SHIFT) << 8) |
		((g >> BUCKET_SHIFT) << 4) |
		(b >> BUCKET_SHIFT);
	const bucket = buckets.get(key) ?? { count: 0, sum: [0, 0, 0] };

	bucket.count++;
	bucket.sum = [bucket.sum[0] + r, bucket.sum[1] + g, bucket.sum[2] + b];
	buckets.set(key, bucket);
}

async function dominantColor(file: string): Promise<Rgb | null> {
	const { data, info } = await sharp(file)
		.resize(SAMPLE_SIZE, SAMPLE_SIZE, { fit: "inside" })
		.ensureAlpha()
		.raw()
		.toBuffer({ resolveWithObject: true });

	const buckets = new Map<number, Bucket>();

	for (let i = 0; i < data.length; i += info.channels) {
		const [r, g, b, alpha] = data.subarray(i, i + 4);
		if (alpha >= 128 && isChromatic(r, g, b)) addPixel(buckets, [r, g, b]);
	}

	const top = [...buckets.values()]
		.map(({ count, sum }) => {
			const color = sum.map((channel) => channel / count) as Rgb;
			const weight = contrastRatio(color, WHITE) >= 3 ? 1 : LIGHT_COLOR_WEIGHT;
			return { color, score: count * weight };
		})
		.sort((a, b) => b.score - a.score)[0];
	if (!top) return null;

	return top.color;
}

/**
 * El color principal del escudo, oscurecido lo necesario para que el texto
 * blanco del encabezado se lea encima. Los escudos sin color (blanco y negro,
 * grises) o los equipos sin escudo devuelven null: se queda el color de la marca.
 */
export async function getLogoColor({
	tournamentId,
	teamId,
}: {
	tournamentId: string;
	teamId: string;
}): Promise<string | null> {
	const logo = getTeamLogo({ tournamentId, teamId });
	if (!logo) return null;

	try {
		const color = await dominantColor(path.join(process.cwd(), "public", logo));
		return color ? toHex(ensureContrast(color, WHITE, 4.5)) : null;
	} catch {
		// Un escudo corrupto no debe tumbar el build: se usa el color de la marca.
		return null;
	}
}
