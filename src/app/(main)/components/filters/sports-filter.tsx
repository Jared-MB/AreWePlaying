"use client";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { Sport } from "@/core/modules/sport/interfaces";
import { useRouter, useSearchParams } from "next/navigation";

export default function SportFilter({ sports }: { sports: Sport[] }) {
	const router = useRouter();
	const searchParams = useSearchParams();
	const selectedSport = searchParams.get("deporte") || "";

	const handleSportChange = (value: string) => {
		const selectedSport = value;

		const params = new URLSearchParams(window.location.search);
		if (selectedSport && selectedSport !== "all") {
			params.set("deporte", selectedSport);
		} else {
			params.delete("deporte");
		}
		router.replace(`?${params.toString()}`);
	};

	return (
		<Select defaultValue={selectedSport} onValueChange={handleSportChange}>
			<SelectTrigger className="w-[180px]">
				<SelectValue placeholder="Deporte" />
			</SelectTrigger>
			<SelectContent>
				<SelectItem value="all">Todos</SelectItem>
				{sports.map((sport) => (
					<SelectItem key={sport.id} value={String(sport.id)}>
						{sport.name}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}
