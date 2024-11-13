"use server";

import { cookies } from "next/headers";

export async function getUsernameService() {
	const token = cookies().get("session");
	if (!token) {
		return;
	}
	const { value } = token;
	const response = await fetch(`${process.env.SERVER_API}/profile`, {
		method: "GET",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${value}`,
		},
	});
	return response.json();
}
