"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function BtnCleanFilters() {
	const router = useRouter();

	const handleCleanFilters = () => {
		const params = new URLSearchParams(window.location.search);
		params.delete("categoria");
		params.delete("fecha");
		params.delete("deporte");
		router.push(`?${params.toString()}`);
	};
	return (
		<Button onClick={handleCleanFilters} className="text-white">
			Limpiar
		</Button>
	);
}
