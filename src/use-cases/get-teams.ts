"use server";

import type { Team } from "@/types/team";
import { cacheTag, cacheLife } from "next/cache";
import fs from "node:fs/promises";

export async function getTeams() {
	"use cache";
	cacheTag(`teams`);
	cacheLife("days");
	const teamsFile = await fs.readFile("./src/assets/teams.json", "utf-8");
	const teams = JSON.parse(teamsFile) as Team[];
	return teams;
}
