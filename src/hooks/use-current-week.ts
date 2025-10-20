"use client";

import type { MatchDay } from "@/types/match-day";

import { isAfter, parse } from "date-fns";
import { useMemo } from "react";

export function useCurrentWeek(weeks: MatchDay[]) {
	const currentWeek = useMemo(() => {
		const currentDate = new Date();

		for (const matchDay of weeks) {
			if (
				isAfter(parse(matchDay.date, "dd/MM/yyyy", new Date()), currentDate)
			) {
				const index = weeks.indexOf(matchDay);
				return { currentWeek: weeks[index - 1], today: currentDate };
			}
		}

		return {
			currentWeek: undefined,
			today: currentDate,
		};
	}, [weeks]);

	return currentWeek;
}
