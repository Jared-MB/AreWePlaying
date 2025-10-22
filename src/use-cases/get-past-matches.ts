"use server";

import type { Match } from "@/types/match";
import { isBefore, parse } from "date-fns";
import { cacheLife, cacheTag } from "next/cache";
import fs from "node:fs/promises";

export async function getPastMatches(teamId: string): Promise<Match[]> {
	"use cache";
	cacheLife("hours");
	cacheTag(`past-matches-${teamId}`);

	const matchesFile = await fs.readFile("./src/assets/matches.json", "utf8");

	const matches = JSON.parse(matchesFile) as { data: Match[]; id: string }[];

	const today = new Date();

	const pastMatches = matches.flatMap((matchObj) =>
		matchObj.data.filter(
			(match) =>
				(match.localTeamId === teamId || match.visitingTeamId === teamId) &&
				isBefore(
					parse(match.date.split(" ")[0], "dd/MM/yyyy", new Date()),
					today,
				),
		),
	);

	return pastMatches;
}
