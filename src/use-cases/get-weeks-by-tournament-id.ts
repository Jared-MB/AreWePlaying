import fs from "node:fs/promises";
import { z } from "zod";
import type { Week } from "@/types/week";

export async function getWeeksByTournamentId(
	tournamentId: string,
): Promise<Week[]> {
	"use cache";

	const parsedData = z.uuid().safeParse(tournamentId);

	if (!parsedData.success) return [];

	const weeks = await fs.readFile(
		`./src/assets/${parsedData.data.toUpperCase()}/weeks.json`,
		"utf-8",
	);

	return JSON.parse(weeks);
}
