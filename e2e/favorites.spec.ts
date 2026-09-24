import { expect, test } from "@playwright/test";
import { matchSlug, teamSlug, teamWithFutureMatch } from "./data";
import { hydrated } from "./hydration";

const target = teamWithFutureMatch();

test.skip(
	!target,
	"Ningún equipo tiene partidos por jugarse (fuera de temporada)",
);

test("marcar favorito persiste y arma la cuenta regresiva en la home", async ({
	page,
}) => {
	if (!target) return;
	const { data, team, match } = target;
	const teamUrl = `/${data.slug}/teams/${teamSlug(team.shortName)}`;

	await page.goto(teamUrl);
	await hydrated(page);
	const button = page.getByRole("button", { name: /favoritos/ });
	await expect(button).toHaveAttribute("data-active", "false");
	await button.click();
	await expect(button).toHaveAttribute("data-active", "true");
	await expect(page.getByText("Se agregó a favoritos")).toBeVisible();
	expect(await page.evaluate(() => localStorage.getItem("favorites"))).toBe(
		JSON.stringify([team.id]),
	);

	await page.reload();
	await hydrated(page);
	await expect(page.getByRole("button", { name: /favoritos/ })).toHaveAttribute(
		"data-active",
		"true",
	);

	await page.goto("/");
	const countdown = page.getByRole("region", { name: "Tu próximo partido" });
	await expect(countdown).toBeVisible({ timeout: 15_000 });
	await expect(
		countdown.locator(`a[href="/${data.slug}/match/${matchSlug(match)}"]`),
	).toHaveCount(1);
	await expect(
		countdown.getByText(
			/^Faltan \d+ (día|días|hora|horas|minuto|minutos) para el partido de/,
		),
	).toHaveCount(1);

	// Quitarlo borra la cuenta regresiva.
	await page.goto(teamUrl);
	await hydrated(page);
	await page.getByRole("button", { name: /favoritos/ }).click();
	await expect(page.getByText("Se quitó de favoritos")).toBeVisible();
	await page.goto("/");
	await expect(page.locator('[aria-busy="true"]')).toHaveCount(0, {
		timeout: 15_000,
	});
	await expect(
		page.getByRole("region", { name: "Tu próximo partido" }),
	).toHaveCount(0);
});

test("en la jornada, el partido del favorito se resalta y se anuncia", async ({
	page,
}) => {
	if (!target) return;
	const { data, team, match } = target;
	const week = data.weeks.find(
		(w) => w.id === data.groups.find((g) => g.data.includes(match))?.id,
	);
	test.skip(!week, "El partido no tiene jornada");
	if (!week) return;

	await page.addInitScript((id) => {
		localStorage.setItem("favorites", JSON.stringify([id]));
	}, team.id);
	await page.goto(
		`/${data.slug}/${week.week.toLowerCase().replace(/\s+/g, "-")}`,
	);
	await hydrated(page);

	const card = page.locator('[data-active="true"]').filter({
		has: page.locator(`a[href="/${data.slug}/match/${matchSlug(match)}"]`),
	});
	await expect(card).toHaveCount(1);
	await expect(
		card.getByText("Juega uno de tus equipos favoritos"),
	).toBeAttached();
	await expect(page.locator("#are-we-playing")).toHaveAttribute(
		"data-active",
		"true",
	);
});
