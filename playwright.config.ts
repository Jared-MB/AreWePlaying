import { defineConfig, devices } from "@playwright/test";

// Puerto propio: nunca se reutiliza el `astro dev` de quien desarrolla, que
// puede tener otra configuración o datos a medio editar.
const PORT = 4399;

export default defineConfig({
	testDir: "./e2e",
	globalSetup: "./e2e/global-setup.ts",
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 1 : 0,
	reporter: process.env.CI ? [["github"], ["html", { open: "never" }]] : "list",
	use: {
		baseURL: `http://localhost:${PORT}`,
		locale: "es-MX",
		timezoneId: "America/Mexico_City",
		trace: "retain-on-failure",
	},
	projects: [
		{ name: "desktop", use: { ...devices["Desktop Chrome"] } },
		{ name: "mobile", use: { ...devices["Pixel 7"] } },
	],
	// El adaptador de Vercel no soporta `astro preview`: se prueba contra dev.
	// `--ignore-lock` porque Astro sólo permite un `astro dev` por proyecto.
	webServer: {
		command: `pnpm exec astro dev --port ${PORT} --ignore-lock`,
		url: `http://localhost:${PORT}`,
		reuseExistingServer: false,
		timeout: 120_000,
		// Astro manda `astro dev` a segundo plano si detecta un agente de IA (y
		// entonces rechaza --ignore-lock); con esta variable definida no lo hace.
		env: { ASTRO_DEV_BACKGROUND: "0" },
	},
});
