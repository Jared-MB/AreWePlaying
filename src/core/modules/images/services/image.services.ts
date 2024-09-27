import r2 from "@/core/utils/r2";
import { PutObjectCommand } from "@aws-sdk/client-s3";

interface UploadImageServiceParams {
	image: File;
	imageId: string;
	teamName: string;
	universityId: string;
	safe?: boolean;
}

const getKey = ({
	imageId,
	teamName,
	universityId,
}: {
	imageId: string;
	teamName: string;
	universityId: string;
}): string => {
	const sanitizedTeamName = teamName.replace(/\s+/g, "-").toLowerCase();
	return `${sanitizedTeamName}/${universityId}/${imageId}-${Date.now()}`;
};

export const uploadImageService = async ({
	image,
	imageId,
	teamName,
	universityId,
	safe = false,
}: UploadImageServiceParams): Promise<{ url: string; id: string } | null> => {
	if (!image || image.size === 0) return null;
	if (image.size > 500000) {
		if (safe) return null;
		throw new Error("La imagen no puede pesar más de 500KB");
	}

	const imageKey = getKey({
		imageId,
		teamName,
		universityId,
	});

	const buffer = await image.arrayBuffer();

	const command = new PutObjectCommand({
		Bucket: process.env.R2_BUCKET_NAME,
		Key: imageKey,
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		Body: buffer as any,
		ContentType: image.type,
		CacheControl: "max-age=259200",
	});

	await r2.send(command);

	const url = `https://are-we-playing.kristall.app/${imageKey}`;
	return { url, id: imageId };
};
