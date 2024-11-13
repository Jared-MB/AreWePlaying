"use server";

import type { Login } from "../interfaces/auth.interface";

export async function loginService(payload: Login) {
	const response = await fetch(`${process.env.SERVER_API}/auth/login`, {
		method: "POST",
		body: JSON.stringify(payload),
		headers: {
			"Content-Type": "application/json",
		},
	});
	return response.json();
}
