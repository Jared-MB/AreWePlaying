import { Button } from "@/components/ui/button";
import { Input, InputContainer } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function RegisterPage() {
	return (
		<main className="w-screen flex justify-center items-center lg:basis-1/2 h-dvh overflow-y-auto">
			<section className="w-full px-32 lg:w-auto lg:mx-auto flex gap-8 flex-col">
				<header className="flex flex-col items-center lg:items-start w-full justify-center relative">
					<h2 className="text-4xl text-purple-500 font-medium">Registro</h2>
				</header>
				<form className="flex flex-col gap-y-4 w-96">
					<InputContainer>
						<Label htmlFor="username">Usuario</Label>
						<Input type="text" id="username" placeholder="user" />
					</InputContainer>
					<InputContainer>
						<Label htmlFor="email">Correo electrónico</Label>
						<Input type="email" id="email" placeholder="user@example.com" />
					</InputContainer>
					<InputContainer>
						<Label htmlFor="password">Contraseña</Label>
						<Input
							type="password"
							id="password"
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