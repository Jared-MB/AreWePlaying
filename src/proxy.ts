import { type NextRequest, NextResponse } from "next/server";
import matchDaysData from "@/assets/match-days.json";
import { isAfter, parse } from "date-fns";
import { match } from "path-to-regexp";

const weekFn = match("/week/:id");

export async function proxy(request: NextRequest) {
	const pathname = request.nextUrl.pathname;
	const result = weekFn(pathname);

	if (result) {
		return NextResponse.next();
	}

	const date = new Date();

	const matchDay = matchDaysData.findLast((day) => {
		const dayDate = parse(day.date, "dd/MM/yyyy", new Date());
		return !isAfter(dayDate, date);
	});

	const matchDayId = matchDay?.id;

	if (request.nextUrl.pathname === "/week") {
		return NextResponse.redirect(new URL(`/week/${matchDayId}`, request.url));
	}

	return NextResponse.rewrite(new URL(`/week/${matchDayId}`, request.url));
}

export const config = {
	matcher: ["/", "/week"],
};
