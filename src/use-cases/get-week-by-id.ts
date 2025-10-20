"use server";

import type { MatchDay } from "@/types/match-day";
import { cacheLife, cacheTag } from "next/cache";
import fs from "node:fs/promises";

export async function getWeekById(id?: string) {
	"use cache";
	cacheLife("days");
	cacheTag(`week-${id}`);

	if (!id) {
		return undefined;
	}

	const weekFile = await fs.readFile("./src/assets/match-days.json", "utf-8");
	const weeks = JSON.parse(weekFile) as MatchDay[];

	const week = weeks.find((week) => week.id === id);

	return week;
}
