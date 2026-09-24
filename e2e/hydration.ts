import type { Page } from "@playwright/test";

/** En dev las islas se hidratan después del load: un clic antes se pierde. */
export const hydrated = (page: Page) =>
	page.waitForFunction(() => !document.querySelector("astro-island[ssr]"));
