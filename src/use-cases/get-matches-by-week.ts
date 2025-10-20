"use server";

import type { Match } from "@/types/match";
import { cacheLife, cacheTag } from "next/cache";
import fs from "node:fs/promises";

export async function getMatchesByWeek(weekId?: string) {
	"use cache";
	cacheTag(`matches-by-week-${weekId}`);
	cacheLife("days");

	if (!weekId) {
		return [];
	}

	const matches = await fs.readFile("./src/assets/matches.json", "utf-8");
	const matchesByWeek = JSON.parse(matches) as { data: Match[]; id: string }[];
	return matchesByWeek.find((match) => match.id === weekId)?.data || [];
}
