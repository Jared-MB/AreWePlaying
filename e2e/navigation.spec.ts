import { expect, test } from "@playwright/test";
import { all, first, matchSlug, teamSlug } from "./data";

const escapeRegExp = (value: string) =>
	value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

test.beforeEach(({ page }) => {
	// Una excepción sin atrapar en cualquier página es un fallo.
	page.on("pageerror", (error) => {
		throw error;
	});
});

test("home: título, una entrada por torneo y secciones principales", async ({
	page,
}) => {
	await page.goto("/");
	await expect(page).toHaveTitle(/^Are We Playing\? \| .*liga ABE/);

	const divisions = page
		.getByRole("navigation", { name: "Divisiones" })
		.getByRole("link");
	await expect(divisions).toHaveCount(all.length);
	for (const { slug } of all) {
		await expect(
			page
				.getByRole("navigation", { name: "Divisiones" })
				.locator(`a[href="/${slug}"]`),
		).toHaveCount(1);
	}

	await expect(
		page.getByRole("heading", { name: "Mejores equipos" }),
	).toBeVisible();
	// El server island termina de cargar (hoy o próxima jornada).
	await expect(page.locator('[aria-busy="true"]')).toHaveCount(0, {
		timeout: 15_000,
	});
	await expect(
		page
			.getByRole("heading", { name: /Partidos de hoy|Próximos partidos/ })
			.first(),
	).toBeVisible();
});

test("home → torneo → tabla → equipo → partido", async ({ page }) => {
	await page.goto("/");
	await page
		.getByRole("navigation", { name: "Divisiones" })
		.locator(`a[href="/${first.slug}"]`)
		.click();
	await expect(page).toHaveURL(`/${first.slug}`);

	await page.goto(`/${first.slug}/teams`);
	const team = first.table.toSorted((a, b) => a.position - b.position)[0];
	// El menú de equipos del encabezado también enlaza al equipo, pero oculto.
	await page
		.getByRole("main")
		.locator(`a[href="/${first.slug}/teams/${teamSlug(team.shortName)}"]`)
		.first()
		.click();
	await expect(page).toHaveURL(
		`/${first.slug}/teams/${teamSlug(team.shortName)}`,
	);
	await expect(page).toHaveTitle(
		new RegExp(
			`^${escapeRegExp(team.shortName)} · Calendario y resultados · .+ \\| Are We Playing\\?$`,
		),
	);
	// La posición en la tabla va bajo el nombre, junto al récord.
	await expect(page.getByRole("heading", { level: 1 })).toHaveText(
		team.shortName,
	);
	await expect(page.getByText(`#${team.position} en la tabla`)).toBeVisible();
	await expect(page.getByText(`${team.wins}W - ${team.losses}L`)).toBeVisible();

	const detail = page
		.getByRole("link", { name: /^Ver detalle del partido/ })
		.first();
	const href = await detail.getAttribute("href");
	expect(href).toMatch(new RegExp(`^/${first.slug}/match/[a-z0-9-]+-\\d+$`));
	await detail.click();
	await expect(page).toHaveURL(href ?? "");
	await expect(page).toHaveTitle(/ vs .* \| Are We Playing\?$/);
});

test("cada jornada tiene su página con sus partidos", async ({ page }) => {
	const group = first.groups.find((g) => g.data.length > 0);
	test.skip(!group, "El torneo aún no tiene partidos");
	const week = first.weeks.find((w) => w.id === group?.id);
	test.skip(!week, "Jornada sin datos");
	if (!group || !week) return;

	await page.goto(
		`/${first.slug}/${week.week.toLowerCase().replace(/\s+/g, "-")}`,
	);
	await expect(page.getByRole("article")).toHaveCount(group.data.length);
	for (const match of group.data) {
		await expect(
			page.locator(`a[href="/${first.slug}/match/${matchSlug(match)}"]`),
		).toHaveCount(1);
	}
});

test("página de partido: marcador en el título si ya se jugó", async ({
	page,
}) => {
	const match = first.matches.find((m) => m.started === 0 && m.live === 0);
	test.skip(!match, "No hay partidos terminados todavía");
	if (!match) return;

	await page.goto(`/${first.slug}/match/${matchSlug(match)}`);
	await expect(page).toHaveTitle(
		new RegExp(
			`^${escapeRegExp(`${match.localTeam} vs ${match.visitingTeam} ${match.localTeamPoints}-${match.visitingTeamPoints} · `)}.+ \\| Are We Playing\\?$`,
		),
	);
	await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
		"content",
		new RegExp(`/${first.slug}/match/${matchSlug(match)}/og\\.png$`),
	);
});

test("acerca", async ({ page }) => {
	await page.goto("/acerca");
	await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test('SEO: canónica sin "/" final, tarjeta social PNG y datos estructurados', async ({
	page,
}) => {
	const team = first.table[0];
	await page.goto(`/${first.slug}/teams/${teamSlug(team.shortName)}`);

	await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
		"href",
		new RegExp(`/${first.slug}/teams/${teamSlug(team.shortName)}$`),
	);
	// El escudo es el favicon, pero la tarjeta social sigue siendo la PNG.
	await expect(page.locator('meta[property="og:image"]')).toHaveAttribute(
		"content",
		/\/og\.png$/,
	);
	await expect(page).toHaveTitle(
		new RegExp(`^${escapeRegExp(team.shortName)} · `),
	);

	const match = first.matches[0];
	await page.goto(`/${first.slug}/match/${matchSlug(match)}`);
	const jsonLd = JSON.parse(
		(await page.locator('script[type="application/ld+json"]').textContent()) ??
			"{}",
	);
	expect(jsonLd).toMatchObject({
		"@type": "SportsEvent",
		name: `${match.localTeam} vs ${match.visitingTeam}`,
	});
});

test("SEO: el 404 no se indexa", async ({ page }) => {
	await page.goto("/esto-no-existe");
	await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
		"content",
		"noindex",
	);
	await expect(page.locator('link[rel="canonical"]')).toHaveCount(0);
});
