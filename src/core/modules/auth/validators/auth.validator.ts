import { z } from "zod";

export const LoginSchema = z.object({
	password: z
		.string()
		.min(6, "El nombre de usuario debe contener mínimo 6 caracteres"),
	username: z
		.string()
		.min(6, "La contraseña debe contener mínimo 6 caracteres"),
});

export const RegisterSchema = z.object({
	name: z
		.string()
		.min(6, "El nombre de usuario debe contener mínimo 6 caracteres"),
	email: z
		.string()
		.email("El email no es válido")
		.min(6, "El email debe contener mínimo 6 caracteres"),
	password: z
		.string()
		.min(6, "La contraseña debe contener mínimo 6 caracteres"),
	username: z
		.string()
		.min(6, "El nombre de usuario debe contener mínimo 6 caracteres"),
});
