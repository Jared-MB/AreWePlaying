"use client";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation"; // O next/router en versiones anteriores

export default function SearchBar() {
	const router = useRouter();

	const handleSportChange = (value: string) => {
		const selectedSport = value;

		// Actualizamos los searchParams
		const params = new URLSearchParams(window.location.search);
		if (selectedSport) {
			params.set("deporte", selectedSport); // Añadimos o actualizamos el deporte seleccionado
		} else {
			params.delete("deporte"); // Si no hay selección, eliminamos el parámetro 'deporte'
		}
		router.push(`?${params.toString()}`); // Actualizamos la URL sin recargar la página
	};

	return (
		<Select onValueChange={handleSportChange}>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Deporte" />
			</SelectTrigger>

			<SelectContent>
				<SelectItem value="futbol">futbol</SelectItem>
				<SelectItem value="basquetbol">basquetbol</SelectItem>
			</SelectContent>
		</Select>
	);
}

// URL -> `/dashboard?search=my-project`
// `search` -> 'my-project'
