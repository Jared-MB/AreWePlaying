import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import preact from "@astrojs/preact";

export default defineConfig({
	// Base absoluta para las URLs canónicas y de las tarjetas sociales (og/twitter).
	// TODO: reemplazar por el dominio real de producción.
	site: "https://are-we-playing.vercel.app",
	vite: {
		plugins: [tailwindcss()],
	},
	integrations: [preact({ compat: true })],
});
