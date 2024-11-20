"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImagePlus, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useRef, useState } from "react";

interface ImageSelectorProps {
	selectedImage: File | null;
	setSelectedImage: (file: File | null) => void;
	fallbackText?: string;
}

export default function ImageSelector({
	selectedImage,
	setSelectedImage,
	fallbackText = "Click to select an image",
}: ImageSelectorProps) {
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleImageChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) {
				if (file.type.startsWith("image/")) {
					setSelectedImage(file);
					const reader = new FileReader();
					reader.onloadend = () => {
						setPreviewUrl(reader.result as string);
					};
					reader.readAsDataURL(file);
				} else {
					alert("Please select an image file");
					setSelectedImage(null);
					setPreviewUrl(null);
				}
			}
		},
		[setSelectedImage],
	);

	const handleRemoveImage = useCallback(
		(e: React.MouseEvent) => {
			e.stopPropagation();
			setSelectedImage(null);
			setPreviewUrl(null);
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		},
		[setSelectedImage],
	);

	const handleCardClick = () => {
		fileInputRef.current?.click();
	};

	return (
		<Card
			className="bg-transparent border-2 border-dashed border-gray-300 hover:border-gray-400 transition-colors cursor-pointer"
			onClick={handleCardClick}
		>
			<CardContent className="p-0">
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					onChange={handleImageChange}
					className="hidden"
					aria-label="Select team image"
				/>
				<div className="relative w-full h-48">
					{previewUrl ? (
						<>
							<Image
								src={previewUrl}
								alt="Selected team image"
								layout="fill"
								objectFit="cover"
								className="rounded-md"
							/>
							<Button
								variant="secondary"
								size="icon"
								className="absolute top-2 right-2 rounded-full"
								onClick={handleRemoveImage}
							>
								<X className="h-4 w-4" />
								<span className="sr-only">Remove image</span>
							</Button>
						</>
					) : (
						<div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
							<ImagePlus className="h-12 w-12 mb-2" />
							<p>{fallbackText}</p>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
