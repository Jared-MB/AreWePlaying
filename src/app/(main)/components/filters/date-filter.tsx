"use client";
import { format, parse } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/core/utils";
import { useRouter, useSearchParams } from "next/navigation";

export function DateFilter() {
	const router = useRouter();
	const searchParams = useSearchParams();

	// Obtener la fecha de los parámetros de búsqueda
	const fecha = searchParams.get("fecha");
	const initialDate = fecha
		? parse(fecha, "dd-MM-yyyy", new Date())
		: undefined; // Parsea la fecha en el formato correcto

	const handleDateChange = (selectedDate: Date | undefined) => {
		const params = new URLSearchParams(window.location.search);
		if (selectedDate) {
			params.set("fecha", format(selectedDate, "dd-MM-yyyy")); // Formato de fecha
		} else {
			params.delete("fecha");
		}
		router.push(`?${params.toString()}`); // Actualiza la URL sin recargar la página
	};

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant={"outline"}
					className={cn(
						"w-[280px] justify-start text-left font-normal",
						!initialDate && "text-muted-foreground",
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{initialDate ? (
						format(initialDate, "PPP")
					) : (
						<span>Selecciona una fecha</span>
					)}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0">
				<Calendar
					mode="single"
					selected={initialDate}
					onSelect={(newDate) => {
						handleDateChange(newDate);
					}}
					initialFocus
				/>
			</PopoverContent>
		</Popover>
	);
}
