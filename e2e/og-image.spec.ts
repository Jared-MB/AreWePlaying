import { expect, test } from "@playwright/test";
import sharp from "sharp";
import { first, matchSlug } from "./data";

test.describe("imagen social del partido", () => {
	const match = first.matches[0];
	const path = `/${first.slug}/match/${match ? matchSlug(match) : "x"}/og.png`;

	test.skip(!match, "Sin partidos");

	test("PNG 1200×630 cacheable", async ({ request }) => {
		const response = await request.get(path);
		expect(response.status()).toBe(200);
		expect(response.headers()["content-type"]).toBe("image/png");
		expect(response.headers()["cache-control"]).toBe(
			"public, max-age=0, s-maxage=31536000, immutable",
		);
		const meta = await sharp(await response.body()).metadata();
		expect([meta.width, meta.height]).toEqual([1200, 630]);
	});

	test("con query redirige a la URL limpia", async ({ request }) => {
		const response = await request.get(`${path}?v=1`, { maxRedirects: 0 });
		expect(response.status()).toBe(301);
		expect(response.headers().location).toBe(path);
	});

	test("partido inexistente es 404", async ({ request }) => {
		const response = await request.get(
			`/${first.slug}/match/nope-vs-nope-0/og.png`,
		);
		expect(response.status()).toBe(404);
		expect(await response.text()).toBe("Partido no encontrado");
	});
});
