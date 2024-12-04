"use server";

import { cookies } from "next/headers";

export const getCookie = async (key: string) => {
	const cookie = cookies().get(key);
	return cookie?.value;
};

export const setCookie = async (key: string, value: string) => {
	cookies().set(key, value, {
		httpOnly: true,
		secure: process.env.NODE_ENV === "production",
		maxAge: 60 * 60 * 24,
		path: "/",
	});
};
