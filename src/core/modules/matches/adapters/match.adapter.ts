"use server";

import { revalidateTag } from "next/cache";
import type { Match } from "../interfaces";
import { getMatchesService, uploadMatchService } from "../services";
import { MatchSchema } from "../validators/match.validator";

export const getMatches = async (
	searchParams: URLSearchParams,
): Promise<Match[]> => {
	const query = new URLSearchParams(searchParams);
	const response = await getMatchesService(query.toString());
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

	await uploadMatchService({
		...parsedData.data,
		localTeamId: Number(data.localTeamId.toString()),
		visitorTeamId: Number(data.visitorTeamId.toString()),
		sportId: Number(data.sportId.toString()),
	});

	revalidateTag("matches");
};
