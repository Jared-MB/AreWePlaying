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
	// Las páginas siguen prerenderizándose; el adaptador sólo hace falta para
	// servir on-demand los server islands (p. ej. los partidos de hoy en el index)
	// y la imagen social de cada partido.
	adapter: vercel({ includeFiles: wasmFiles }),
	// Base absoluta para las URLs canónicas y de las tarjetas sociales (og/twitter).
	site: SITE_URL,
	// El sitio no usa <Image>, pero con el adaptador `/_image` queda expuesto como
	// función: sin optimizador no procesa (ni decodifica) imágenes de nadie.
	image: { service: passthroughImageService() },
	// Los e2e no usan la barra de dev, y tras la re-optimización en frío de Vite
	// su entrypoint se queda respondiendo 504. Sólo se apaga para Playwright.
	devToolbar: { enabled: !process.env.E2E },
	vite: {
		plugins: [tailwindcss()],
		// Sólo afecta a `astro dev`. Estas dependencias se descubren tarde (import
		// dinámico de la story, islas que sólo montan algunas páginas): Vite las
		// re-optimiza a media sesión y responde 504 "Outdated Optimize Dep", así
		// que la primera descarga de la story fallaba en dev y en los e2e.
		optimizeDeps: {
			include: ["html-to-image", "canvas-confetti"],
		},
	},
	integrations: [preact({ compat: true })],
});
