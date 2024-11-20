"use server";

import { createHeaders } from "../../http";

export const getTeamsService = async () => {
	const response = await fetch(`${process.env.SERVER_API}/teams`, {
		method: "GET",
		headers: await createHeaders(),
		next: {
			tags: ["teams"],
		},
	});
	return response.json();
};

export const uploadTeamService = async ({
	name,
	universityId,
	logo,
}: { name: string; universityId: number; logo: string }) => {
	const response = await fetch(`${process.env.SERVER_API}/teams`, {
		method: "POST",
		body: JSON.stringify({ name, universityId, logo }),
		headers: await createHeaders(),
	});
	return response.json();
};
