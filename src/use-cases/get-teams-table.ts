"use server";

import type { TeamPosition } from "@/types/team";
import { cacheLife, cacheTag } from "next/cache";
import fs from "node:fs/promises";

export async function getTeamsTable() {
	"use cache";
	cacheTag("teams-table");
	cacheLife("days");

	const teamsTableRaw = await fs.readFile(
		"./src/assets/teams-table.json",
		"utf8",
	);
	const teamsTable = JSON.parse(teamsTableRaw) as TeamPosition[];
	return teamsTable;
}
