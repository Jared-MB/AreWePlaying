import { chromium, type FullConfig } from "@playwright/test";
import { first, matchSlug, teamSlug } from "./data";

/**
 * `astro dev` descubre dependencias al pedir cada página por primera vez: Vite
 * las re-optimiza, invalida los módulos que ya sirvió (504 "Outdated Optimize
 * Dep") y recarga. En CI el servidor siempre arranca en frío, así que antes de
 * los tests se recorre una página de cada tipo hasta que una pasada completa
 * termina sin errores de carga.
 */
export default async function globalSetup(config: FullConfig) {
	const baseURL = config.projects[0].use.baseURL;
	const team = first.table[0];
	const match = first.matches[0];
	const pages = [
		"/",
		`/${first.slug}`,
		`/${first.slug}/teams`,
		team && `/${first.slug}/teams/${teamSlug(team.shortName)}`,
		match && `/${first.slug}/match/${matchSlug(match)}`,
		"/acerca",
	].filter(Boolean) as string[];

	const matchPath = match && `/${first.slug}/match/${matchSlug(match)}`;

	const browser = await chromium.launch();
	const problems: string[] = [];
	try {
		for (let attempt = 1; attempt <= 5; attempt++) {
			const page = await browser.newPage({ baseURL, acceptDownloads: true });
			// La primera pasada compila todo en frío: en CI puede tardar más de 30 s.
			page.setDefaultTimeout(attempt === 1 ? 120_000 : 30_000);
			problems.length = 0;
			page.on("pageerror", (error) => {
				problems.push(`pageerror en ${page.url()}: ${error.message}`);
			});
			page.on("response", (response) => {
				if (response.status() === 504) problems.push(`504 ${response.url()}`);
			});

			for (const path of pages) {
				// Un timeout aquí no es fatal: sólo significa que falta otra pasada.
				// No se usa "networkidle": depende de recursos externos y de CI.
				try {
					await page.goto(path, { waitUntil: "load" });
					await page.waitForFunction(
						() => !document.querySelector("astro-island[ssr]"),
						undefined,
						{ timeout: 15_000 },
					);
					// La story carga html-to-image con un import dinámico al exportar.
					if (path === matchPath) {
						await Promise.all([
							page.waitForEvent("download", { timeout: 15_000 }),
							page
								.getByRole("button", { name: /Descargar 9:16/ })
								.click({ timeout: 5_000 }),
						]);
					}
				} catch (error) {
					problems.push(`${path}: ${(error as Error).message.split("\n")[0]}`);
				}
			}
			await page.close();

			if (problems.length === 0) return;
			console.log(
				`Calentamiento, pasada ${attempt}:\n  ${problems.join("\n  ")}`,
			);
		}
		throw new Error(
			`El servidor de dev no se estabilizó tras 5 pasadas:\n  ${problems.join("\n  ")}`,
		);
	} finally {
		await browser.close();
	}
}
