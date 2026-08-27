import { z } from "zod";
import fs from "node:fs/promises";
import type { Match } from "@/types/match";

export async function getMatches({
	tournamentId,
	weekId,
}: {
	tournamentId: string;
	weekId: string;
}): Promise<Match[]> {
	"use cache";

	const parsedTournamentId = z.uuid().safeParse(tournamentId);
	const parsedWeekId = z.uuid().safeParse(weekId);

	if (!parsedTournamentId.success || !parsedWeekId.success) return [];

	const rawData = await fs.readFile(
		`./src/assets/${parsedTournamentId.data.toUpperCase()}/matches.json`,
		"utf-8",
	);

	const data = JSON.parse(rawData) as { data: Match[]; id: string }[];
	const matches = data.find((d) => d.id === parsedWeekId.data);

	return matches?.data ?? [];
}
