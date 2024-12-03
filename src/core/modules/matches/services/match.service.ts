"use server";

import { createHeaders } from "../../http";

export const getMatchesService = async (query: string) => {
	const response = await fetch(`${process.env.SERVER_API}/matches?${query}`, {
		method: "GET",
		headers: await createHeaders(),
		next: {
			tags: ["matches"],
		},
	});
	return response.json();
};

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export const uploadMatchService = async (payload: any) => {
	const response = await fetch(`${process.env.SERVER_API}/matches`, {
		method: "POST",
		body: JSON.stringify(payload),
		headers: await createHeaders(),
	});
	return response.json();
};
