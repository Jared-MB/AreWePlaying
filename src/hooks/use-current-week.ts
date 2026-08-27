"use client";

import type { Week } from "@/types/week";
import { isAfter, parse } from "date-fns";
import { useMemo } from "react";

export function useCurrentWeek(weeks: Week[]) {
	const currentWeek = useMemo(() => {
		const currentDate = new Date();

		const matchDay = weeks.findLast((day) => {
			const dayDate = parse(day.date, "dd/MM/yyyy", new Date());
			return !isAfter(dayDate, currentDate);
		});

		return {
			currentWeek: matchDay,
			today: currentDate,
		};
	}, [weeks]);

	return currentWeek;
}
