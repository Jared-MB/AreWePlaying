import sharp from "sharp";
import { beforeAll, expect, test, vi } from "vitest";

vi.mock("@/utils/fetch-team-logo", () => ({
	fetchTeamLogo: vi.fn().mockResolvedValue(null),
}));

let GET: typeof import("@/pages/[tournament]/match/[match]/og.png")["GET"];

beforeAll(async () => {
	({ GET } = await import("@/pages/[tournament]/match/[match]/og.png"));
});

// La ruta sólo lee `params` y `request` del contexto de Astro.
const call = (path: string, params: Record<string, string>) =>
	GET({
		params,
		request: new Request(`https://areweplaying.com${path}`),
	} as unknown as Parameters<typeof GET>[0]);

const OK_PARAMS = {
	tournament: "division-i-varonil",
	match: "up-mexico-vs-uv-1",
};
const OK_PATH = "/division-i-varonil/match/up-mexico-vs-uv-1/og.png";

test("PNG 1200×630 cacheable en el CDN", async () => {
	const response = await call(OK_PATH, OK_PARAMS);
	expect(response.status).toBe(200);
	expect(response.headers.get("Content-Type")).toBe("image/png");
	expect(response.headers.get("Cache-Control")).toBe(
		"public, max-age=0, s-maxage=31536000, immutable",
	);
	const meta = await sharp(
		Buffer.from(await response.arrayBuffer()),
	).metadata();
	expect([meta.format, meta.width, meta.height]).toEqual(["png", 1200, 630]);
}, 30_000);

test("con query string redirige 301 a la URL limpia", async () => {
	const response = await call(`${OK_PATH}?v=2`, OK_PARAMS);
	expect(response.status).toBe(301);
	expect(response.headers.get("Location")).toBe(OK_PATH);
	expect(response.headers.get("Cache-Control")).toBe(
		"public, max-age=0, s-maxage=31536000, immutable",
	);
});

test("404 con texto para torneo o partido inexistente", async () => {
	const noTournament = await call("/x/match/y/og.png", {
		tournament: "x",
		match: "y",
	});
	expect([noTournament.status, await noTournament.text()]).toEqual([
		404,
		"Torneo no encontrado",
	]);

	const noMatch = await call("/division-i-varonil/match/y/og.png", {
		tournament: "division-i-varonil",
		match: "y",
	});
	expect([noMatch.status, await noMatch.text()]).toEqual([
		404,
		"Partido no encontrado",
	]);
});
