import type { Week } from "@/types/week";
import { isAfter, parse } from "date-fns";

export function getCurrentWeek(weeks: Week[]) {
	const date = new Date();

	const matchDay = weeks.findLast((day) => {
		const dayDate = parse(day.date, "dd/MM/yyyy", new Date());
		return !isAfter(dayDate, date);
	});

	return matchDay;
}
