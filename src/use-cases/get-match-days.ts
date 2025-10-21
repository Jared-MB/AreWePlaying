"use server";

import type { MatchDay } from "@/types/match-day";
import { cacheLife, cacheTag } from "next/cache";
import fs from "node:fs/promises";

export async function getMatchDays(): Promise<MatchDay[]> {
	"use cache";
	cacheTag("match-days");
	cacheLife("max");
	const matchDays = await fs.readFile("./src/assets/match-days.json", "utf-8");
	return JSON.parse(matchDays);
}
