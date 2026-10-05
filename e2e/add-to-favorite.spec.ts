import { expect, test } from "@playwright/test";
import { first, teamSlug } from "./data";
import { hydrated } from "./hydration";

// A diferencia de la cuenta regresiva, el enlace sirve aunque no haya partidos
// por jugarse: basta con cualquier equipo del torneo.
const [team, otherTeam] = first?.table ?? [];

test.skip(!team || !otherTeam, "El torneo no tiene al menos dos equipos");

const teamUrl = (shortName: string) =>
	`/${first.slug}/teams/${teamSlug(shortName)}`;

test("?action=addToFavorite agrega el equipo y limpia la URL", async ({
	page,
}) => {
	const url = teamUrl(team.shortName);
	await page.addInitScript((id) => {
		// Sólo en la primera carga: la recarga debe ver lo que guardó la página.
		if (sessionStorage.getItem("seeded")) return;
		sessionStorage.setItem("seeded", "1");
		localStorage.setItem("favorites", JSON.stringify([id]));
	}, otherTeam.id);

	await page.goto(`${url}?action=addToFavorite`);
	await hydrated(page);

	const button = page.getByRole("button", { name: /favoritos/ });
	await expect(button).toHaveAttribute("data-active", "true");
	await expect(page.getByText("Se agregó a favoritos")).toBeVisible();
	expect(await page.evaluate(() => localStorage.getItem("favorites"))).toBe(
		JSON.stringify([otherTeam.id, team.id]),
	);
	// Recargar o compartir la URL no debe repetir la acción.
	expect(new URL(page.url()).search).toBe("");

	await page.reload();
	await hydrated(page);
	await expect(button).toHaveAttribute("data-active", "true");
	await expect(page.getByText("Se agregó a favoritos")).toHaveCount(0);
});

test("?action=addToFavorite no duplica ni quita un favorito existente", async ({
	page,
}) => {
	await page.addInitScript((id) => {
		localStorage.setItem("favorites", JSON.stringify([id]));
	}, team.id);

	await page.goto(`${teamUrl(team.shortName)}?action=addToFavorite`);
	await hydrated(page);

	await expect(page.getByRole("button", { name: /favoritos/ })).toHaveAttribute(
		"data-active",
		"true",
	);
	expect(await page.evaluate(() => localStorage.getItem("favorites"))).toBe(
		JSON.stringify([team.id]),
	);
	expect(new URL(page.url()).search).toBe("");
	// Ya era favorito: no hubo cambio que anunciar.
	await expect(page.getByText("Se agregó a favoritos")).toHaveCount(0);
});
