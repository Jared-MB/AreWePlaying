"use server";

import { revalidateTag } from "next/cache";
import type { University } from "../interfaces";
import { getUniversitiesService, uploadUniversityService } from "../services";

export const getUniversities = async (): Promise<University[]> => {
	const response = await getUniversitiesService();
	return response;
};

export const uploadUniversity = async (
	_prevState: unknown,
	payload: FormData,
) => {
	const { name } = Object.fromEntries(payload.entries());
	const response = await uploadUniversityService(name.toString());
	revalidateTag("universities");
	return response;
};
