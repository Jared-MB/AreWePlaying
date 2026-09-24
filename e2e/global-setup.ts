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

	const browser = await chromium.launch();
	try {
		for (let attempt = 1; attempt <= 5; attempt++) {
			const page = await browser.newPage({ baseURL, acceptDownloads: true });
			let broken = false;
			page.on("pageerror", () => {
				broken = true;
			});
			page.on("response", (response) => {
				if (response.status() === 504) broken = true;
			});

			for (const path of pages) {
				await page.goto(path, { waitUntil: "networkidle" });
				await page
					.waitForFunction(() => !document.querySelector("astro-island[ssr]"), {
						timeout: 15_000,
					})
					.catch(() => {
						broken = true;
					});
			}
			// La story carga html-to-image con un import dinámico al exportar.
			await page
				.getByRole("button", { name: /Descargar 9:16/ })
				.click({ timeout: 5_000 })
				.catch(() => undefined);
			await page.waitForLoadState("networkidle");
			await page.close();

			if (!broken) return;
		}
		throw new Error("El servidor de dev no se estabilizó tras 5 pasadas");
	} finally {
		await browser.close();
	}
}
