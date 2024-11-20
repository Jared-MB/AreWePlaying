"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";

export const useWelcome = () => {
	const searchParams = useSearchParams();
	const router = useRouter();

	useEffect(() => {
		const params = new URLSearchParams(searchParams);
		if (params.get("login") === "true" && params.get("from") === "register") {
			toast.success("Bienvenido!");
			router.replace("/");
		}
	}, []);
};

export const Welcome = () => {
	useWelcome();
	return null;
};
