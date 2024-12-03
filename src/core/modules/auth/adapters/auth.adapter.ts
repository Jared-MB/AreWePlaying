"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { loginService, registerService } from "../services";
import { LoginSchema, RegisterSchema } from "../validators";

export const login = async (
	_prevState: unknown,
	payload: FormData,
	{ redirectQuery }: { redirectQuery: URLSearchParams } = {
		redirectQuery: new URLSearchParams(),
	},
) => {
	const { username, password } = Object.fromEntries(payload.entries());
	const safeParse = LoginSchema.safeParse({ username, password });
	if (!safeParse.success) {
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

	redirect(`/?${redirectQuery.toString()}`);
};

export const logout = async () => {
	"use server";
	cookies().delete("session");
};

export const register = async (_prevState: unknown, payload: FormData) => {
	const { username, password, email, name } = Object.fromEntries(
		payload.entries(),
	);
	const safeParse = RegisterSchema.safeParse({
		username,
		password,
		email,
		name,
	});
	if (!safeParse.success) {
		return safeParse.error.flatten().fieldErrors;
	}

	const response = await registerService(safeParse.data);
	if (response?.id) {
		const query = new URLSearchParams();
		query.set("login", "true");
		query.set("from", "register");
		return await login(undefined, payload, {
			redirectQuery: query,
		});
	}
};
