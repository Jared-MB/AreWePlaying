import { createRequire } from "node:module";
import path from "node:path";

import { defineConfig, passthroughImageService } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import preact from "@astrojs/preact";

import vercel from "@astrojs/vercel";

import { SITE_URL } from "./src/constants/site";

/**
 * satori (la imagen social de cada partido) carga sus dos .wasm en runtime con
 * `readFileSync`, así que el trazado de dependencias de Vercel no los ve y la
 * función se despliega sin ellos. Se resuelven aquí y se copian a mano.
 *
 * Las rutas se resuelven en vez de escribirse porque pnpm las cuelga de un
 * directorio con la versión en el nombre.
 */
const require = createRequire(import.meta.url);
const satoriPackage = require.resolve("satori/package.json");

const wasmFiles = [
	path.join(path.dirname(satoriPackage), "yoga.wasm"),
	createRequire(satoriPackage).resolve("harfbuzzjs/hb.wasm"),
].map((file) => path.relative(process.cwd(), file));

export default defineConfig({
	// Las páginas siguen prerenderizándose; ya no queda ningún server island. El
	// adaptador sólo hace falta para las dos rutas on-demand: la imagen social de
	// cada partido y el redirect de las URLs viejas.
	adapter: vercel({ includeFiles: wasmFiles }),
	// Base absoluta para las URLs canónicas y de las tarjetas sociales (og/twitter).
	site: SITE_URL,
	// El sitio no usa <Image>, pero con el adaptador `/_image` queda expuesto como
	// función: sin optimizador no procesa (ni decodifica) imágenes de nadie.
	image: { service: passthroughImageService() },
	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [preact({ compat: true })],
});
