import type { Week } from "@/types/week";
import { z } from "zod";
import fs from "node:fs/promises";

export async function getWeek({
	tournamentId,
	weekId,
}: {
	weekId: string;
	tournamentId: string;
}): Promise<Week | undefined> {
	"use cache";

	const parsedTournamentId = z.uuid().safeParse(tournamentId);
	const parsedWeekId = z.uuid().safeParse(weekId);

	if (!parsedTournamentId.success || !parsedWeekId.success) return undefined;

	const rawData = await fs.readFile(
		`./src/assets/${parsedTournamentId.data.toUpperCase()}/weeks.json`,
		"utf-8",
	);

	const data = JSON.parse(rawData) as Week[];
	return data.find((m) => m.id === weekId) ?? undefined;
}
