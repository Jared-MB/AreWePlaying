/// <reference types="vitest/config" />
import { getViteConfig } from "astro/config";

// Los tests fijan la temporada a la de los fixtures: así `getTournaments()` no
// depende del valor por defecto de CURRENT_SEASON ni de los datos de cada noche.
process.env.SEASON = "test-season";

export default getViteConfig({
	test: {
		include: ["tests/**/*.test.{ts,tsx}"],
		setupFiles: ["./tests/setup.ts"],
		environment: "node",
		env: { SEASON: "test-season" },
		restoreMocks: true,
		unstubGlobals: true,
	},
});
