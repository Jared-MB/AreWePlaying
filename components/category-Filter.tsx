"use client";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";

export default function CategoryFilter() {
	const router = useRouter();

	const handleCategoryChange = (value: string) => {
		const params = new URLSearchParams(window.location.search);
		if (value) {
			params.set("categoria", value); // Actualiza el filtro de categorías
		} else {
			params.delete("categoria");
		}
		router.push(`?${params.toString()}`); // Actualiza la URL
	};

	return (
		<Select onValueChange={handleCategoryChange}>
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
