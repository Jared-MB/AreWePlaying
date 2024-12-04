"use server";
import { createHeaders } from "../../http";
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

export const verifyTokenService = async () => {
	const response = await fetch(`${process.env.SERVER_API}/verify-token`, {
		method: "GET",
		headers: await createHeaders(),
	});
	return response.json();
};
