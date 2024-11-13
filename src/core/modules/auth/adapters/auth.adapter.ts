"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { loginService } from "../services/auth.service";
import { LoginSchema } from "../validators/auth.validator";

export const login = async (_prevState: unknown, payload: FormData) => {
	const { username, password } = Object.fromEntries(payload.entries());
	const safeParse = LoginSchema.safeParse({ username, password });
	console.log(safeParse);
	if (!safeParse.success) {
		console.log(safeParse.error.flatten().fieldErrors);
		return safeParse.error.flatten().fieldErrors;
	}
	const response = await loginService(safeParse.data);
	if (!response.access_token) {
		return "El nombre de usuario o la contraseña son incorrectas.";
	}
	cookies().set("session", response.access_token, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 60 * 24,
		path: "/",
	});

	redirect("/");
	console.log(response);
};
