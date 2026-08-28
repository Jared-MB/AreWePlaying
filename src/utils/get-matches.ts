import { readFile } from "node:fs/promises";
import { assetsDir } from "./assets-dir";
import type { Match } from "@/types/match";
import path from "node:path";

export async function getMatches(tournamentId: string) {
	const rawMatches = await readFile(
		path.join(assetsDir, tournamentId.toUpperCase(), "matches.json"),
		"utf-8",
	);

	return JSON.parse(rawMatches) as { data: Match[]; id: string }[];
}
