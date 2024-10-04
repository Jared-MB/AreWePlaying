"use client";

import ImagePreview from "@/components/image-preview";
import SubmitButton from "@/components/submit-button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { InputContainer } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Toaster } from "@/components/ui/sonner";
import { uploadImage } from "@/core/modules/images/action";
import { useEffect, useRef } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

export default function ImagePage() {
	const [error, dispatch] = useFormState(uploadImage, undefined);

	const ref = useRef<HTMLFormElement>(null);

	useEffect(() => {
		if (error && typeof error === "boolean") {
			toast.success("Imagen subida correctamente");
			ref.current?.reset();
		} else if (error && typeof error === "string") {
			toast.error(error);
		}
	}, [error]);

	return (
		<main className="flex items-center justify-center h-[calc(100dvh-8rem)]">
			<Card>
				<CardHeader>
					<CardTitle>DEMO</CardTitle>
					<CardDescription>Subida de imágenes</CardDescription>
				</CardHeader>
				<Separator />
				<form className="pt-6" ref={ref} action={dispatch}>
					<CardContent>
						<InputContainer>
							<Label>Imagen</Label>
							<ImagePreview fallback="Imagen" />
						</InputContainer>
					</CardContent>
					<CardFooter className="justify-end">
						<SubmitButton />
					</CardFooter>
				</form>
			</Card>
			<Toaster />
		</main>
	);
}
