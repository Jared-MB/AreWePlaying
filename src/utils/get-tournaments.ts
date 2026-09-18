import tournamentsRaw from "@/assets/tournaments.json" with { type: "json" };
import { CURRENT_SEASON } from "@/constants/season";

export const getTournaments = () =>
	tournamentsRaw.filter((t) => t.season === CURRENT_SEASON);
