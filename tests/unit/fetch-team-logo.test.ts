import sharp from "sharp";
import { beforeEach, expect, test, vi } from "vitest";

const png = await sharp({
	create: { width: 300, height: 150, channels: 4, background: "#FF0000" },
})
	.png()
	.toBuffer();

beforeEach(() => {
	vi.resetModules();
});

const load = async () =>
	(await import("@/utils/fetch-team-logo")).fetchTeamLogo;

test("pide el AVIF al propio deployment y lo devuelve como PNG 128×128", async () => {
	const fetch = vi.fn().mockResolvedValue(new Response(png));
	vi.stubGlobal("fetch", fetch);
	const fetchTeamLogo = await load();

	const logo = await fetchTeamLogo({
		tournamentId: "abc-def",
		teamId: "t-1",
		origin: "https://preview.example.com/x/y?z=1",
	});

	expect((fetch.mock.calls[0][0] as URL).href).toBe(
		"https://preview.example.com/logos/ABC-DEF/t-1.avif",
	);
	expect(logo?.startsWith("data:image/png;base64,")).toBe(true);
	const meta = await sharp(
		Buffer.from(logo?.split(",")[1] ?? "", "base64"),
	).metadata();
	expect([meta.width, meta.height, meta.hasAlpha]).toEqual([128, 128, true]);
});

test("cachea por ruta, incluso los que no existen", async () => {
	const fetch = vi.fn().mockResolvedValue(new Response(null, { status: 404 }));
	vi.stubGlobal("fetch", fetch);
	const fetchTeamLogo = await load();
	const args = { tournamentId: "abc", teamId: "t-1", origin: "https://a.com" };

	expect(await fetchTeamLogo(args)).toBeNull();
	expect(await fetchTeamLogo({ ...args, origin: "https://b.com" })).toBeNull();
	expect(fetch).toHaveBeenCalledTimes(1);
});

test.each([
	["error de red", () => Promise.reject(new Error("net"))],
	["imagen ilegible", () => Promise.resolve(new Response("no es imagen"))],
])("%s → null", async (_, impl) => {
	vi.stubGlobal("fetch", vi.fn(impl));
	const fetchTeamLogo = await load();
	expect(
		await fetchTeamLogo({
			tournamentId: "a",
			teamId: "b",
			origin: "https://a.com",
		}),
	).toBeNull();
});
