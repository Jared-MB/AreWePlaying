"use client";

import { useParams } from "next/navigation";
import { PrefetchLink } from "./prefetch-link";
import type { Route } from "next";

export function GoToMain() {
	const params = useParams();

	return (
		<PrefetchLink
			href={
				params.week ? (`/week/${params.week}` as Route) : ("/week" as Route)
			}
			aria-label="Ver horarios"
		>
			Horarios
		</PrefetchLink>
	);
}
