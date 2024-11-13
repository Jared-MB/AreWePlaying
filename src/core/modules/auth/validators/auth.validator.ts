import { z } from "zod";

export const LoginSchema = z.object({
	password: z
		.string()
		.min(6, "El nombre de usuario debe contener mínimo 6 caracteres"),
	username: z
		.string()
		.min(6, "La contraseña debe contener mínimo 6 caracteres"),
});
