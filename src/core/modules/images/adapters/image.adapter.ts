"use server";

import { randomUUID } from "crypto";
import { uploadImageService } from "../services/image.service";

export const uploadImage = async (data: FormData) => {
	const image = data.get("image") as File;
	const universityId = data.get("universityId") as string;
	const teamName = data.get("name") as string;

	try {
		const response = await uploadImageService({
			image,
			imageId: randomUUID(),
			teamName,
			universityId,
		});
		return response;
	} catch (error) {
		console.log(error);
		if (error instanceof Error) {
			return error.message;
		}
		return "Error al subir la imagen";
	}
};
