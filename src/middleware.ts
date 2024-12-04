import {
	type MiddlewareConfig,
	type NextRequest,
	NextResponse,
} from "next/server";

export async function middleware(request: NextRequest) {
	const cookie = request.cookies.get("session") ?? {
		value: "",
	};

	const response = await fetch(`${process.env.SERVER_API}/verify-token`, {
		method: "GET",
		headers: {
			Authorization: `Bearer ${cookie.value}`,
			Cookie: `session=${cookie.value}`,
		},
	});

	const data = await response.json();
	const from = new URL(request.url).pathname;

	if (from.startsWith("/admin")) {
		if (data.statusCode || data.role !== "ADMIN") {
			return NextResponse.redirect(
				new URL("/", request.nextUrl).toString(),
				302,
			);
		}
		return NextResponse.next();
	}
}

export const config: MiddlewareConfig = {
	matcher:
		"/((?!_next/static|_next/image|favicon.ico|login|register|health-check).*)",
};
