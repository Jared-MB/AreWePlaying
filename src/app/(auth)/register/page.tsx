"use client";

import { Button } from "@/components/ui/button";
import { Input, InputContainer } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useFormState } from "react-dom";

import { auth } from "@/core/modules/auth/adapters";
import { useEffect } from "react";
import { toast } from "sonner";

export default function RegisterPage() {
	const [error, dispatch] = useFormState(auth.register, undefined);
	useEffect(() => {
		console.log(error);
		if (error && typeof error === "string") {
			toast.error(error);
		}
	}, [error]);

	return (
		<main className="w-screen flex justify-center items-center lg:basis-1/2 h-dvh overflow-y-auto">
			<section className="w-full px-32 lg:w-auto lg:mx-auto flex gap-8 flex-col">
				<header className="flex flex-col items-center lg:items-start w-full justify-center relative">
					<h2 className="text-4xl text-purple-500 font-medium">Registro</h2>
				</header>
				<form action={dispatch} className="flex flex-col gap-y-4 w-96">
					<InputContainer>
						<Label htmlFor="name">Nombre</Label>
						<Input type="text" id="name" name="name" placeholder="John Doe" />
					</InputContainer>
					<InputContainer>
						<Label htmlFor="username">Usuario</Label>
						<Input
							type="text"
							id="username"
							name="username"
							placeholder="user"
						/>
					</InputContainer>
					<InputContainer>
						<Label htmlFor="email">Correo electrónico</Label>
						<Input
							type="email"
							id="email"
							name="email"
							placeholder="user@example.com"
						/>
					</InputContainer>
					<InputContainer>
						<Label htmlFor="password">Contraseña</Label>
						<Input
							type="password"
							id="password"
							name="password"
							placeholder="* * * * * * * * *"
						/>
					</InputContainer>
					<Button>Registrarse</Button>
					<Link
						href="/login"
						className="text-center text-sm text-purple-500 font-medium hover:underline"
					>
						¿Ya tienes una cuenta?
					</Link>
				</form>
			</section>
		</main>
	);
}
