import type { Week } from "@/types/week";
import { readFile } from "node:fs/promises";

export async function getWeeks(tournamentId: string) {
	const rawWeeks = await readFile(
		`./src/assets/${tournamentId.toUpperCase()}/weeks.json`,
		"utf-8",
	);

	return JSON.parse(rawWeeks) as Week[];
}
