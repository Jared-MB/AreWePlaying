import { expect, test } from "@playwright/test";

test("has title", async ({ page }) => {
	await page.goto("http://localhost:3000/");
	await expect(page.getByRole("link", { name: "AreWePlaying?" })).toBeVisible();
	await expect(
		page.locator("button").filter({ hasText: "Categoría" }),
	).toBeVisible();
	await page.getByText("#Varonil").first().click();
	await expect(
		page.locator("button").filter({ hasText: "Varonil" }),
	).toBeVisible();
	await page.getByRole("button", { name: "Limpiar" }).click();
	await expect(
		page.locator("button").filter({ hasText: "Categoría" }),
	).toBeVisible();
	await page.getByRole("button", { name: "CN" }).click();
	await expect(page.getByLabel("CN")).toBeVisible();
});
