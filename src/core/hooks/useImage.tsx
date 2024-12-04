import { type UUID, randomUUID } from "crypto";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { uploadImageService } from "@/core/modules/images/services/image.service";
import Link from "next/link";
import { toast } from "sonner";

export type UseImageOptions =
	| { submitOnChange?: false; uploadFunction?: never }
	| {
			submitOnChange: true;
			uploadFunction: (url: string, prevState?: string) => Promise<void>;
	  };

export const useImage = (url?: string, options?: UseImageOptions) => {
	const [file, setFile] = useState<File | null>(null);
	const [previewImage, setPreviewImage] = useState<string | null>(url || null);
	const [hasChanged, setHasChanged] = useState("off");

	const submitImage = async (image: File) => {
		let id: undefined | UUID = undefined;
		if (url) {
			id = url.split("/").pop() as UUID;
		}

		const formData = new FormData();
		formData.append("image", image);
		formData.append("imageId", id as string);

		try {
			const image = formData.get("image") as File;
			const uploadedImage = await uploadImageService({
				image,
				imageId: randomUUID(),
				teamName: "Equipo A",
				universityId: randomUUID(),
			});
			if (uploadedImage) {
				setPreviewImage(uploadedImage.url);
				setHasChanged("off");
				setFile(null);
				await options?.uploadFunction?.(uploadedImage.url, url);
			}
		} catch (error) {
			setPreviewImage(null);
			setFile(null);
			if (error instanceof Error) {
				toast.error(error.message, {
					action: (
						<Button asChild size="sm" variant="outline">
							<Link href="/docs/faq#image-size-limit">Ver más</Link>
						</Button>
					),
				});
				return;
			}
			toast.error("Error al subir la imagen");
		}
	};

	const handleImageUpload = async (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		setFile(event.target.files?.[0] || null);
		const file = event.target.files?.[0];
		setHasChanged("on");

		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setPreviewImage(reader.result as string);
			};
			reader.readAsDataURL(file);
			if (options?.submitOnChange) {
				return await submitImage(file);
			}
		} else {
			setPreviewImage(null);
			setFile(null);
		}
	};

	return {
		file,
		previewImage,
		handleImageUpload,
		hasChanged,
		// uploadImageOnDB
	};
};
