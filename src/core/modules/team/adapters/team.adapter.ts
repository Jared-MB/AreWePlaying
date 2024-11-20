"use server";

import { revalidateTag } from "next/cache";
import type { Team } from "../interfaces";
import { getTeamsService, uploadTeamService } from "../services/team.service";

export const getTeams = async (): Promise<Team[]> => {
	const response = await getTeamsService();
	return response;
};

export const uploadTeam = async (_prevState: unknown, payload: FormData) => {
	const { name, universityId } = Object.fromEntries(payload.entries());

	// const imageResponse = await imageService.uploadImage(payload);
	// if (!imageResponse || typeof imageResponse === "string") {
	// 	return;
	// }
	await uploadTeamService({
		name: name.toString(),
		universityId: Number(universityId.toString()),
		logo: "",
	});

	revalidateTag("teams");
};
