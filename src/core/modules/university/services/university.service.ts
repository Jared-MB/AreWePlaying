"use server";

import { createHeaders } from "../../http";

export const getUniversitiesService = async () => {
	const response = await fetch(`${process.env.SERVER_API}/universities`, {
		method: "GET",
		headers: await createHeaders(),
		next: {
			tags: ["universities"],
		},
	});
	return response.json();
};

export const uploadUniversityService = async (name: string) => {
	const response = await fetch(`${process.env.SERVER_API}/universities`, {
		method: "POST",
		body: JSON.stringify({ name }),
		headers: await createHeaders(),
	});
	return response.json();
};
