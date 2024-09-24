"use client";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useRouter, useSearchParams } from "next/navigation";

export default function CategoryFilter() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const selectCategory = searchParams.get("categoria") || ""; // Obtiene el valor del parámetro "categoria" de la URL o un string vacío

	const handleCategoryChange = (value: string) => {
		const params = new URLSearchParams(window.location.search);
		if (value) {
			params.set("categoria", value); // Agrega el parámetro a la URL pero no actualiza la página
		} else {
			params.delete("categoria");
		}
		router.push(`?${params.toString()}`); // Actualiza la página con el nuevo parámetro
	};

	return (
		<Select value={selectCategory} onValueChange={handleCategoryChange}>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Categoría" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="varonil">Varonil</SelectItem>
				<SelectItem value="femenil">Femenil</SelectItem>
			</SelectContent>
		</Select>
	);
}
