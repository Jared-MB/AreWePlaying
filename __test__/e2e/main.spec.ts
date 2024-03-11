import { test, expect } from "@playwright/test";

test.describe("Main", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("http://localhost:3000/");
		await page.getByRole("button", { name: "Limpiar filtros" }).click();
	});

	test("Main filters", async ({ page }) => {
		await page
			.getByLabel("Click para desplegar las opciones y seleccionar un deporte")
			.click();
		await page.getByLabel("Basketball").click();

		const matches = page.locator("section");
		expect(await matches.evaluate((node) => node.children.length)).toBe(8);

		await page
			.getByLabel(
				"Click para desplegar las opciones y seleccionar una categoría",
			)
			.click();
		await page.getByLabel("Femenil").click();

		expect(await matches.evaluate((node) => node.children.length)).toBe(4);

		await page.getByRole("button", { name: "Selecciona una fecha" }).click();
		await page.getByLabel("March").getByText("19").click();
		await page.getByLabel("March").getByText("22").click();
		await page.getByRole("button", { name: "Mar 19, 2024 - Mar 22," }).click();

		expect(await matches.evaluate((node) => node.children.length)).toBe(1);

		await page.getByRole("button", { name: "Limpiar filtros" }).click();
		expect(await matches.evaluate((node) => node.children.length)).toBe(9);

		await expect(
			page.getByLabel(
				"Click para desplegar las opciones y seleccionar un deporte",
			),
		).toContainText("Selecciona un deporte");
		await expect(
			page.getByLabel(
				"Click para desplegar las opciones y seleccionar una categoría",
			),
		).toContainText("Selecciona una categoría");
		await expect(page.locator("#date")).toContainText("Selecciona una fecha");
	});

	test("Tags must set the filters", async ({ page }) => {
		await page.getByRole("button", { name: "#Football" }).click();
		await expect(
			page.getByLabel(
				"Click para desplegar las opciones y seleccionar un deporte",
			),
		).toContainText("Football");
		await page.getByRole("button", { name: "#femenil" }).click();
		await expect(
			page.getByLabel(
				"Click para desplegar las opciones y seleccionar una categoría",
			),
		).toContainText("Femenil");

		const matches = page.locator("section");
		expect(await matches.evaluate((node) => node.children.length)).toBe(1);
	});

	test("Clicking the Github icon must redirect to the repository", async ({
		page,
	}) => {
		const page1Promise = page.waitForEvent("popup");
		await page
			.getByLabel("Ir al repositorio de AreWePlaying? en GitHub.")
			.click();
		const page1 = await page1Promise;
		await expect(page1.locator("#repository-container-header")).toContainText(
			"AreWePlaying",
		);
	});
});
