import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
	test: {
		include: ["src/core/**/*.test.ts"],
		globals: true,
		coverage: {
			include: ["src/core/**/*.ts"],
			exclude: [
				"src/core/**/index.ts",
				"src/core/**/*.d.ts",
				"src/core/utils/**/*.ts",
				"src/core/config/**/*.ts",
				"src/core/modules/http/**/*.ts",
				"src/core/**/*.service.ts",
				"src/**/*.test.ts",
			],
		},
	},
	plugins: [tsconfigPaths()],
});
