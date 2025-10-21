import { type NextRequest, NextResponse } from "next/server";
import matchDaysData from "@/assets/match-days.json";
import { isAfter, parse } from "date-fns";

export async function middleware(request: NextRequest) {
	const searchParams = request.nextUrl.searchParams;
	const week = searchParams.get("week");

	if (week) {
		return NextResponse.next();
	}

	const date = new Date();

	const matchDay = matchDaysData.findLast((day) => {
		const dayDate = parse(day.date, "dd/MM/yyyy", new Date());
		return !isAfter(dayDate, date);
	});

	const matchDayId = matchDay?.id;

	return NextResponse.redirect(new URL(`?week=${matchDayId}`, request.url));
}

export const config = {
	matcher: "/",
};
