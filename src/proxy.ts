import { NextRequest, NextResponse } from "next/server";
import { getCurrentWeek } from "./lib/get-current-week";

export function proxy(request: NextRequest) {
	return NextResponse.next();

	/* 	const matchDay = getCurrentWeek();
	const matchDayId = matchDay?.id;

	return NextResponse.redirect(new URL(`/weeks/${matchDayId}`, request.url));
 */
}

export const config = {
	matcher: "/",
};
