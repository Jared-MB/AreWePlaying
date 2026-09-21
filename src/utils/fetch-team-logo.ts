import sharp from "sharp";

/**
 * Escudo del equipo como data URI PNG, listo para incrustarlo en el SVG de la
 * imagen social.
 *
 * Dos razones para no usar `getTeamLogo`: los escudos son AVIF y satori no sabe
 * decodificarlo, y la ruta corre en una función de Vercel que no tiene acceso a
 * `public/`. Se piden por HTTP al propio deployment, que sí los sirve.
 */

/** Los escudos no cambian dentro de un deployment y la instancia se reutiliza. */
const cache = new Map<string, string | null>();

const LOGO_SIZE = 128;

export async function fetchTeamLogo({
	tournamentId,
	teamId,
	origin,
}: {
	tournamentId: string;
	teamId: string;
	/** URL de la petición en curso: sirve en dev y en los previews, no sólo en producción. */
	origin: string | URL;
}): Promise<string | null> {
	const path = `/logos/${tournamentId.toUpperCase()}/${teamId}.avif`;

	const cached = cache.get(path);
	if (cached !== undefined) return cached;

	const logo = await render(new URL(path, origin));
	cache.set(path, logo);

	return logo;
}

async function render(url: URL): Promise<string | null> {
	try {
		const response = await fetch(url);
		// No todos los equipos tienen escudo: la tarjeta cae al chip de iniciales.
		if (!response.ok) return null;

		const png = await sharp(await response.arrayBuffer())
			.resize(LOGO_SIZE, LOGO_SIZE, {
				fit: "contain",
				background: { r: 255, g: 255, b: 255, alpha: 0 },
			})
			.png()
			.toBuffer();

		return `data:image/png;base64,${png.toString("base64")}`;
	} catch {
		// Un escudo ilegible no puede tumbar la imagen social entera.
		return null;
	}
}
