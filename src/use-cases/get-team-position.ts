"use server";

import type { TeamPosition } from "@/types/team";
import { cacheLife, cacheTag } from "next/cache";
import fs from "node:fs/promises";

export async function getTeamPosition(
	teamId: string,
): Promise<TeamPosition | undefined> {
	"use cache";
	cacheLife("days");
	cacheTag(`team-position-${teamId}`);

	const positionsFile = await fs.readFile(
		"./src/assets/teams-table.json",
		"utf8",
	);

	const positions = JSON.parse(positionsFile);

	const position = positions.find(
		(position: TeamPosition) => position.id === teamId,
	);

	return position;
}
