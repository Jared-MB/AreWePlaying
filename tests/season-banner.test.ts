import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { expect, test } from "vitest";
import SeasonBanner from "@/components/SeasonBanner.astro";
import { CURRENT_SEASON, LATEST_SEASON } from "@/constants/season";
import { CURRENT_SEASON_URL } from "@/constants/site";

async function render() {
	const container = await AstroContainer.create();
	return container.renderToString(SeasonBanner);
}

test("el banner enlaza a la temporada actual", async () => {
	const html = await render();

	expect(html).toContain(`href="${CURRENT_SEASON_URL}"`);
	expect(html).toContain(`temporada ${CURRENT_SEASON}`);
	expect(html).toContain(`Ir a la temporada ${LATEST_SEASON}`);
});

test("el botón de cerrar existe y no va dentro del enlace", async () => {
	const html = await render();
	const link = html.match(/<a[\s\S]*?<\/a>/)?.[0] ?? "";

	expect(html).toContain('aria-label="Cerrar aviso"');
	expect(html).toContain("data-season-banner-dismiss");
	expect(link).not.toContain("data-season-banner-dismiss");
});
