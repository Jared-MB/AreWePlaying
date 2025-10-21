"use client";

import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { useQuery } from "@tanstack/react-query";
import { getTeams } from "@/use-cases/get-teams";
import { useUniversity } from "@/hooks/use-university";

export function SelectUniversity() {
	const { data: universities, isLoading } = useQuery({
		queryKey: ["universities"],
		queryFn: getTeams,
	});

	const selectedUniversity = useUniversity((state) => state.university);
	const setSelectedUniversity = useUniversity((state) => state.setUniversity);

	if (isLoading) {
		return <SelectUniversitySkeleton />;
	}

	return (
		<Select value={selectedUniversity} onValueChange={setSelectedUniversity}>
			<SelectTrigger
				className="w-[164px] md:w-[240px]"
				name="SelectUniversity"
				aria-label="Selecciona tu universidad"
			>
				<SelectValue placeholder="Selecciona tu equipo" />
			</SelectTrigger>
			<SelectContent>
				{universities?.map((university) => (
					<SelectItem key={university.id} value={university.id}>
						{university.shortName}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);
}

export function SelectUniversitySkeleton() {
	return (
		<Select disabled>
			<SelectTrigger className="w-[164px] md:w-[240px]">
				<SelectValue placeholder="Selecciona tu equipo" />
			</SelectTrigger>
		</Select>
	);
}
