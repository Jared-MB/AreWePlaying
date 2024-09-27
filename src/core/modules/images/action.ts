"use server";

import { randomUUID } from "node:crypto";
import { uploadImageService } from "./services/image.services";

export const uploadImage = async (_prevState: unknown, data: FormData) => {
	const image = data.get("image") as File;

	try {
		await uploadImageService({
			image,
			imageId: randomUUID(),
			teamName: "Equipo A",
			universityId: randomUUID(),
		});
	} catch (error) {
		console.log(error);
		if (error instanceof Error) {
			return error.message;
		}
		return "Error al subir la imagen";
	}

	return true;
};
