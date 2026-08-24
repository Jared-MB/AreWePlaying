import matchDaysData from "@/assets/match-days.json";
import { isAfter, parse } from "date-fns";

export function getCurrentWeek() {
	const date = new Date();

	const matchDay = matchDaysData.findLast((day) => {
		const dayDate = parse(day.date, "dd/MM/yyyy", new Date());
		return !isAfter(dayDate, date);
	});

	return matchDay;
}
