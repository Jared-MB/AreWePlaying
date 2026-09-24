import { beforeEach, expect, test, vi } from "vitest";

// Este archivo prueba los lectores reales, no el mock de tests/setup.ts.
vi.unmock("@/utils/asset-files");
vi.mock("node:fs", async (importOriginal) => {
	const fs = await importOriginal<typeof import("node:fs")>();
	return { ...fs, existsSync: vi.fn(fs.existsSync) };
});

const { existsSync } = await import("node:fs");
const { assetFiles } = await import("@/utils/asset-files");
const { getTeamLogo } = await import("@/utils/get-team-logo");

beforeEach(() => {
	vi.mocked(existsSync).mockReset();
});

test("assetFiles: torneo desconocido da lista vacía", async () => {
	expect(await assetFiles("matches")("no-existe")).toEqual([]);
});

test("assetFiles: el id se busca en mayúsculas", async () => {
	const [first] = (await import("@/assets/tournaments.json")).default as {
		id: string;
	}[];
	// El mock de tournaments.json apunta a los fixtures; se toma un id real.
	const realId = "63D81BD1-9F3F-499A-8F85-BA7B5545A41B";
	const upper = await assetFiles("weeks")(realId);
	const lower = await assetFiles("weeks")(realId.toLowerCase());
	expect(first).toBeDefined();
	expect(upper.length).toBeGreaterThan(0);
	expect(lower).toEqual(upper);
});

test("getTeamLogo: ruta pública en mayúsculas si el archivo existe, null si no", () => {
	vi.mocked(existsSync).mockReturnValue(true);
	expect(getTeamLogo({ tournamentId: "abc-def", teamId: "t-1" })).toBe(
		"/logos/ABC-DEF/t-1.avif",
	);
	expect(vi.mocked(existsSync).mock.calls[0][0]).toMatch(
		/public\/logos\/ABC-DEF\/t-1\.avif$/,
	);

	vi.mocked(existsSync).mockReturnValue(false);
	expect(getTeamLogo({ tournamentId: "abc-def", teamId: "t-1" })).toBeNull();
});
