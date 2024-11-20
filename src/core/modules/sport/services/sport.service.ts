"use server";

import { createHeaders } from "../../http";

export const getSportsService = async () => {
	const response = await fetch(`${process.env.SERVER_API}/sport`, {
		method: "GET",
		headers: await createHeaders(),
		next: {
			tags: ["sports"],
		},
	});
	return response.json();
};
