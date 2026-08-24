import type { MatchDay } from "@/types/match-day";
import weeks from "@/assets/match-days.json";

export function getWeekById(id?: string) {
	if (!id) {
		return undefined;
	}

	const week = (weeks as MatchDay[]).find((week) => week.id === id);

	return week;
}
