import tournamentsRaw from "@/assets/tournaments.json" with { type: "json" };
import type { Tournament } from "@/types/tournament";
import { CURRENT_SEASON } from "@/constants/season";

export const getTournaments = (): Tournament[] =>
	(tournamentsRaw as Tournament[]).filter((t) => t.season === CURRENT_SEASON);
