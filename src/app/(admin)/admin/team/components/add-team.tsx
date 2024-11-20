"use client";

import ImagePreview from "@/components/image-preview";
import { Button } from "@/components/ui/button";
import {} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
} from "@/components/ui/dialog";
import { Input, InputContainer } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { team } from "@/core/modules/team";
import type { University } from "@/core/modules/university/interfaces";
import { DialogTitle, DialogTrigger } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

export default function AddTeam({
	universities,
}: { universities: University[] }) {
	const [open, setOpen] = useState(false);

	const [error, dispatch] = useFormState(team.uploadTeam, undefined);

	useEffect(() => {
		console.log(error);
	}, [error]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>Agregar Equipo</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-purple-500">
						Registro de Equipo Nuevo
					</DialogTitle>
				</DialogHeader>
				<Separator />
				<form action={dispatch}>
					<div className="grid grid-cols-[1fr_auto_auto] p-0 gap-x-4">
						<div className="flex flex-col gap-y-4">
							<InputContainer>
								<Label htmlFor="teamName">Nombre del Equipo</Label>
								<Input
									type="text"
									id="teamName"
									placeholder="Nombre del equipo"
									required
									name="name"
								/>
							</InputContainer>
							<InputContainer className="row-start-2 row-end-3">
								<Label htmlFor="schoolName">Universidad</Label>
								<Select name="universityId">
									<SelectTrigger>
										<SelectValue placeholder="Selecciona una universidad" />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											{universities.map((university) => (
												<SelectItem
													key={university.id}
													value={`${university.id}`}
												>
													{university.name}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</InputContainer>
						</div>
						<Separator orientation="vertical" />
						<div className="grid place-content-center p-4">
							<ImagePreview fallback={"K"} />
						</div>
					</div>
					<Separator />
					<DialogFooter className="mt-6">
						<Button
							type="submit"
							className="ml-auto"
							onClick={() => setOpen(false)}
						>
							Registrar Equipo
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
