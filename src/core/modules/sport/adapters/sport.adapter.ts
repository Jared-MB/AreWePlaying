"use server";
import type { Sport } from "../interfaces";
import { getSportsService } from "../services/sport.service";

export const getSports = async (): Promise<Sport[]> => {
	const response = await getSportsService();
	return response;
};
