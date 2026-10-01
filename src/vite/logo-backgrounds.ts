import { readdir } from "node:fs/promises";
import path from "node:path";
import type { defineConfig } from "astro/config";
import sharp from "sharp";
import { type Rgb, toHex } from "../utils/color";

// `vite` no es dependencia directa (pnpm no lo expone): el tipo sale del config.
type VitePluginOption = NonNullable<
	NonNullable<Parameters<typeof defineConfig>[0]["vite"]>["plugins"]
>[number];
type VitePlugin = Extract<Awaited<VitePluginOption>, { name: string }>;

const MODULE_ID = "virtual:logo-backgrounds";
const RESOLVED_ID = `\0${MODULE_ID}`;

/** Diferencia máxima por canal entre esquinas para considerarlas un mismo fondo. */
const MAX_CORNER_SPREAD = 24;
/** Por encima de esto en los tres canales el fondo ya es blanco, como el círculo. */
const NEAR_WHITE = 235;

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

/** { "/logos/<torneo>/<equipo>.avif": "#hex" }, sólo para los escudos con fondo. */
async function buildBackgrounds(publicDir: string) {
	const logosDir = path.join(publicDir, "logos");
	const files = (await readdir(logosDir, { recursive: true })).filter((file) =>
		file.endsWith(".avif"),
	);

	const entries = await Promise.all(
		files.map(async (file) => {
			const url = `/logos/${file.split(path.sep).join("/")}`;
			const background = await cornerColor(path.join(logosDir, file)).catch(
				() => null,
			);

			return [url, background] as const;
		}),
	);

	return Object.fromEntries(entries.filter(([, background]) => background));
}

/**
 * Calcula en build el color de fondo de cada escudo y lo expone como
 * `virtual:logo-backgrounds`. Antes se hacía con sharp en cada render: en la
 * isla de partidos de hoy eso cargaba libvips y decodificaba los AVIF en cada
 * arranque en frío de la función, para un dato que sólo cambia al desplegar.
 */
export function logoBackgrounds(): VitePlugin {
	let publicDir = "";

	return {
		name: "logo-backgrounds",
		configResolved(config) {
			publicDir = config.publicDir;
		},
		resolveId(id) {
			return id === MODULE_ID ? RESOLVED_ID : undefined;
		},
		async load(id) {
			if (id !== RESOLVED_ID) return undefined;

			const backgrounds = await buildBackgrounds(publicDir);
			return `export const LOGO_BACKGROUNDS = ${JSON.stringify(backgrounds)};`;
		},
		// En dev, un escudo nuevo o reemplazado recalcula el mapa.
		configureServer(server) {
			const logosDir = path.join(publicDir, "logos");
			const refresh = (file: string) => {
				if (!file.startsWith(logosDir)) return;

				const module = server.moduleGraph.getModuleById(RESOLVED_ID);
				if (module) server.moduleGraph.invalidateModule(module);
			};

			server.watcher.on("add", refresh);
			server.watcher.on("change", refresh);
			server.watcher.on("unlink", refresh);
		},
	};
}
