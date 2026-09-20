import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import preact from "@astrojs/preact";

import vercel from "@astrojs/vercel";

import { SITE_URL } from "./src/constants/site";

export default defineConfig({
	// Las páginas siguen prerenderizándose; el adaptador sólo hace falta para
	// servir on-demand los server islands (p. ej. los partidos de hoy en el index).
	adapter: vercel(),
	// Base absoluta para las URLs canónicas y de las tarjetas sociales (og/twitter).
	site: SITE_URL,
	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [preact({ compat: true })],
});
