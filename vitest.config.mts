/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

// El banner muestra la temporada del despliegue: se fija para que el test no
// dependa del .env de cada máquina.
process.env.SEASON = "2025-2026";

export default getViteConfig({
	test: {
		include: ["tests/**/*.test.{ts,tsx}"],
		environment: "node",
		env: { SEASON: "2025-2026" },
	},
});
