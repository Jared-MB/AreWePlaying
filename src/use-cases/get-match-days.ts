import type { MatchDay } from "@/types/match-day";
import matchDays from "@/assets/match-days.json";

export function getMatchDays(): MatchDay[] {
	return matchDays as MatchDay[];
}
