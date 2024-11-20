"use client";

import ImagePreview from "@/components/image-preview";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input, InputContainer } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useState } from "react";

export default function TeamCreationPage() {
	const [teamName, setTeamName] = useState("");
	const [schoolName, setSchoolName] = useState("");
	const [selectedImage, setSelectedImage] = useState<File | null>(null);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Form submitted:", { teamName, schoolName, selectedImage });
		// Reset form after submission
		setTeamName("");
		setSchoolName("");
		setSelectedImage(null);
	};

	return (
		<main className="w-screen flex justify-center items-center h-dvh overflow-y-auto">
			<Card className="max-w-md w-full">
				<CardHeader>
					<CardTitle className="text-purple-500">
						Registro de Equipo Nuevo
					</CardTitle>
				</CardHeader>
				<Separator />
				<form onSubmit={handleSubmit}>
					<CardContent className="grid grid-cols-[1fr_auto_auto] p-0">
						<div className="p-6 flex flex-col gap-y-4">
							<InputContainer>
								<Label htmlFor="teamName">Nombre del Equipo</Label>
								<Input
									type="text"
									id="teamName"
									placeholder="Nombre del equipo"
									value={teamName}
									onChange={(e) => setTeamName(e.target.value)}
									required
								/>
							</InputContainer>
							<InputContainer className="row-start-2 row-end-3">
								<Label htmlFor="schoolName">Nombre de la Escuela</Label>
								<Input
									type="text"
									id="schoolName"
									placeholder="Nombre de la escuela"
									value={schoolName}
									onChange={(e) => setSchoolName(e.target.value)}
									required
								/>
							</InputContainer>
						</div>
						<Separator orientation="vertical" />
						<div className="grid place-content-center p-4">
							<ImagePreview fallback={teamName.at(0) ?? "K"} />
						</div>
					</CardContent>
					<Separator />
					<CardFooter className="mt-6">
						<Button type="submit" className="ml-auto">
							Registrar Equipo
						</Button>
					</CardFooter>
				</form>
			</Card>
		</main>
	);
}
