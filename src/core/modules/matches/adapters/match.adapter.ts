"use server";

import { revalidateTag } from "next/cache";
import type { Match } from "../interfaces";
import {
	getMatchesService,
	uploadMatchService,
} from "../services/match.service";
import { MatchSchema } from "../validators/match.validator";

export const getMatches = async (): Promise<Match[]> => {
	const response = await getMatchesService();
	return response;
};

export const uploadMatch = async (
	date: Date | undefined,
	_prevState: unknown,
	payload: FormData,
) => {
	const data = Object.fromEntries(payload.entries());

	const parsedData = MatchSchema.safeParse({ ...data, date });
	if (!parsedData.success) {
		return parsedData.error.flatten().fieldErrors;
	}

	const response = await uploadMatchService({
		...parsedData.data,
		localTeamId: Number(data.localTeamId.toString()),
		visitorTeamId: Number(data.visitorTeamId.toString()),
		sportId: Number(data.sportId.toString()),
	});

	revalidateTag("matches");
};
