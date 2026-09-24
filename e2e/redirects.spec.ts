import { expect, test } from "@playwright/test";
import { first, matchSlug, teamSlug } from "./data";

const redirect = async (
	request: import("@playwright/test").APIRequestContext,
	path: string,
) => {
	const response = await request.get(path, { maxRedirects: 0 });
	return { status: response.status(), location: response.headers().location };
};

test.describe("URLs viejas con UUID", () => {
	const id = first.tournament.id;
	const team = first.table[0];
	const week = first.weeks[0];
	const match = first.matches[0];

	test("torneo (mayúsculas y minúsculas)", async ({ request }) => {
		expect(await redirect(request, `/${id}`)).toEqual({
			status: 301,
			location: `/${first.slug}`,
		});
		expect(await redirect(request, `/${id.toLowerCase()}`)).toEqual({
			status: 301,
			location: `/${first.slug}`,
		});
	});

	test("tabla y equipo", async ({ request }) => {
		expect(await redirect(request, `/${id}/teams`)).toEqual({
			status: 301,
			location: `/${first.slug}/teams`,
		});
		expect(await redirect(request, `/${id}/teams/${team.id}`)).toEqual({
			status: 301,
			location: `/${first.slug}/teams/${teamSlug(team.shortName)}`,
		});
	});

	test("jornada", async ({ request }) => {
		test.skip(!week, "Sin jornadas");
		expect(await redirect(request, `/${id}/${week.id}`)).toEqual({
			status: 301,
			location: `/${first.slug}/${week.week.toLowerCase().replace(/\s+/g, "-")}`,
		});
	});

	test("partido", async ({ request }) => {
		test.skip(!match, "Sin partidos");
		expect(await redirect(request, `/${id}/match/${match.matchId}`)).toEqual({
			status: 301,
			location: `/${first.slug}/match/${matchSlug(match)}`,
		});
	});
});

test("una ruta desconocida responde 404 con la página de no encontrado", async ({
	page,
}) => {
	const response = await page.goto("/esto-no-existe");
	expect(response?.status()).toBe(404);
	await expect(page).toHaveTitle("Página no encontrada | Are We Playing?");
});

test("un UUID que no es de ningún torneo también es 404", async ({
	request,
}) => {
	const response = await request.get("/deadbeef-0000-4000-8000-000000000000", {
		maxRedirects: 0,
	});
	expect(response.status()).toBe(404);
});
