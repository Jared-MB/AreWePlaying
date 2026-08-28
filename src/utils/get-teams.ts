import { readFile } from "node:fs/promises";
import { assetsDir } from "./assets-dir";
import path from "node:path";
import type { TeamPosition } from "@/types/team";

export async function getTeams(tournamentId: string) {
	const rawTeams = await readFile(
		path.join(assetsDir, tournamentId.toUpperCase(), "teams-table.json"),
		"utf-8",
	);

	return JSON.parse(rawTeams) as TeamPosition[];
}
