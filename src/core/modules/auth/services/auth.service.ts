"use server";

import type { Login } from "../interfaces";

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

export async function registerService(payload: Login) {
	const response = await fetch(`${process.env.SERVER_API}/users`, {
		method: "POST",
		body: JSON.stringify(payload),
		headers: {
			"Content-Type": "application/json",
		},
	});
	return response.json();
}
