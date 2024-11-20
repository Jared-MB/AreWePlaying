"use client";
import { Button } from "@/components/ui/button";
import { Input, InputContainer } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { login } from "@/core/modules/auth/adapters/auth.adapter";
import Link from "next/link";
import { useEffect } from "react";
import { useFormState } from "react-dom";
import { toast } from "sonner";

export default function LoginPage() {
	const [error, dispatch] = useFormState(login, undefined);
	useEffect(() => {
		if (error && typeof error === "string") {
			toast.error(error);
		}
	}, [error]);

	return (
		<main className="w-screen flex justify-center items-center lg:basis-1/2 h-dvh overflow-y-auto">
			<section className="w-full px-32 lg:w-auto lg:mx-auto flex gap-8 flex-col">
				<header className="flex flex-col items-center lg:items-start w-full justify-center relative">
					<h2 className="text-4xl text-purple-500 font-medium">
						Inicio de sesión
					</h2>
				</header>
				<form action={dispatch} className="flex flex-col gap-y-4 w-96">
					<InputContainer>
						<Label htmlFor="username">Usuario</Label>
						<Input
							name="username"
							type="text"
							id="username"
							placeholder="Ejemplo User"
						/>
						{error && typeof error === "object" && error.username && (
							<small className="text-rose-500">{error.username}</small>
						)}
					</InputContainer>
					<InputContainer>
						<Label htmlFor="password">Contraseña</Label>
						<Input
							name="password"
							type="password"
							id="password"
							placeholder="* * * * * * * * *"
						/>
						{error && typeof error === "object" && error.password && (
							<small className="text-rose-500">{error.password}</small>
						)}
					</InputContainer>
					<Button type="submit">Iniciar sesión</Button>
					<Link
						href="/register"
						className="text-center text-sm text-purple-500 font-medium hover:underline"
					>
						¿Aún no tienes una cuenta?
					</Link>
				</form>
			</section>
		</main>
	);
}
