import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { vi } from "vitest";

/**
 * Los datos reales (`src/assets`) se regeneran cada noche, así que los tests
 * leen de `tests/fixtures`: un par de torneos armados a mano donde cada partido
 * cubre un caso concreto. El lector imita al real: id en mayúsculas y lista
 * vacía cuando el torneo no tiene ese archivo.
 */
export const FIXTURES_DIR = path.resolve(import.meta.dirname, "fixtures");

vi.mock("@/utils/asset-files", () => ({
	assetFiles:
		<T>(name: string) =>
		async (tournamentId: string): Promise<T[]> => {
			const file = path.join(
				FIXTURES_DIR,
				tournamentId.toUpperCase(),
				`${name}.json`,
			);
			return existsSync(file) ? JSON.parse(readFileSync(file, "utf-8")) : [];
		},
}));

vi.mock("@/assets/tournaments.json", () => ({
	default: JSON.parse(
		readFileSync(path.join(FIXTURES_DIR, "tournaments.json"), "utf-8"),
	),
}));
