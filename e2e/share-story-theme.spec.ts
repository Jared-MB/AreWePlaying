import { expect, test } from "@playwright/test";
import { finishedMatch, first, matchSlug, teamSlug } from "./data";
import { hydrated } from "./hydration";

test("compartir sin Web Share copia la URL del equipo", async ({
	page,
	context,
	browserName,
}) => {
	test.skip(
		browserName !== "chromium",
		"Permisos de portapapeles sólo en Chromium",
	);
	await context.grantPermissions(["clipboard-read", "clipboard-write"]);
	await page.addInitScript(() => {
		// Fuerza el camino del portapapeles también en el perfil móvil.
		Object.defineProperty(navigator, "share", { value: undefined });
	});

	const team = first.table[0];
	const url = `/${first.slug}/teams/${teamSlug(team.shortName)}`;
	await page.goto(url);
	await hydrated(page);
	await page.getByRole("button", { name: "Compartir" }).click();
	await expect(page.getByText("Enlace copiado al portapapeles")).toBeVisible();
	expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
		new URL(url, page.url()).href,
	);
});

test("la story se descarga como PNG con el nombre del partido", async ({
	page,
}) => {
	const found = finishedMatch();
	test.skip(!found, "No hay partidos terminados");
	if (!found) return;
	const { data, match } = found;

	await page.goto(`/${data.slug}/match/${matchSlug(match)}`);
	await hydrated(page);
	await expect(
		page.getByRole("heading", { name: "Para compartir" }),
	).toBeVisible();

	const [download] = await Promise.all([
		page.waitForEvent("download", { timeout: 30_000 }),
		page.getByRole("button", { name: /Descargar 9:16/ }).click(),
	]);
	const slug = (s: string) =>
		s
			.normalize("NFD")
			.replace(/[̀-ͯ]/g, "")
			.replace(/[^a-zA-Z0-9]+/g, "-")
			.replace(/^-|-$/g, "")
			.toLowerCase();
	expect(download.suggestedFilename()).toBe(
		`are-we-playing-${slug(match.localTeam)}-vs-${slug(match.visitingTeam)}.png`,
	);
});

test("el color de la story se recuerda entre partidos", async ({ page }) => {
	const match = first.matches[0];
	test.skip(!match, "Sin partidos");
	await page.goto(`/${first.slug}/match/${matchSlug(match)}`);
	await hydrated(page);
	await page.getByRole("button", { name: "Guinda" }).click();
	await page.getByRole("button", { name: "Claro" }).click();
	await page.reload();
	await hydrated(page);
	await expect(page.getByRole("button", { name: "Guinda" })).toHaveAttribute(
		"aria-pressed",
		"true",
	);
	await expect(page.getByRole("button", { name: "Claro" })).toHaveAttribute(
		"aria-pressed",
		"true",
	);
});

test("el tema elegido persiste al recargar", async ({ page }) => {
	await page.emulateMedia({ colorScheme: "light" });
	await page.goto("/acerca");
	const html = page.locator("html");
	await expect(html).not.toHaveClass(/dark/);

	await page.getByRole("button", { name: "Activar tema oscuro" }).click();
	await expect(html).toHaveClass(/dark/);
	await page.reload();
	await expect(html).toHaveClass(/dark/);
	expect(await page.evaluate(() => localStorage.getItem("theme"))).toBe("dark");
});
