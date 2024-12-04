"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { setCookie } from "@/core/utils/cookies";
import { loginService, registerService, verifyTokenService } from "../services";
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

	setCookie("session", response.access_token);

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

export const verifyToken = async () => {
	const response = await verifyTokenService();
	if (response.statusCode) {
		return false;
	}
	return response;
};
