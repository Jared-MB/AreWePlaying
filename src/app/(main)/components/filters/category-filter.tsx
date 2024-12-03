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
	const selectCategory = searchParams.get("categoria") || "";

	const handleCategoryChange = (value: string) => {
		const params = new URLSearchParams(window.location.search);
		if (value) {
			params.set("categoria", value);
		} else {
			params.delete("categoria");
		}
		router.replace(`?${params.toString()}`);
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
