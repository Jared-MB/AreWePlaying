"use server";

import type { Team } from "@/types/team";

import { cacheTag, cacheLife } from "next/cache";
import fs from "node:fs/promises";

export async function getTeamById(teamId?: string) {
	"use cache";
	cacheTag(`team-by-id-${teamId}`);
	cacheLife("days");
	const teamsFile = await fs.readFile("./src/assets/teams.json", "utf-8");
	const teams = JSON.parse(teamsFile) as Team[];
	return teams.find((team) => team.id === teamId) || null;
}
