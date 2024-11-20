"use client";
import { Button } from "@/components/ui/button";
import {} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input, InputContainer } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { university } from "@/core/modules/university";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

export default function AddUniversity() {
	const [open, setOpen] = useState(false);

	const [error, dispatch] = useFormState(
		university.uploadUniversity,
		undefined,
	);

	useEffect(() => {
		console.log(error);
	}, [error]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>Agregar Universidad</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader>
					<DialogTitle className="text-purple-500">
						Registrar universidad
					</DialogTitle>
				</DialogHeader>
				<Separator />
				<form action={dispatch}>
					<InputContainer>
						<Label htmlFor="university">Nombre de la Universidad</Label>
						<Input
							type="text"
							id="university"
							name="name"
							placeholder="ej. BUAP"
						/>
					</InputContainer>
					<DialogFooter className="mt-6">
						<Button
							type="submit"
							className="ml-auto"
							onClick={() => setOpen(false)}
						>
							Registrar Universidad
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
