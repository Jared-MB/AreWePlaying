"use client";

import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { DatePickerWithRange } from "./ui/date-range-picker";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";
import { useEffect, useState } from "react";
import { InputContainer, InputLabel } from "./ui/input-label";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import useSearchParams, { type KeySearchParams } from "@/hooks/useSearchParams";

interface MatchFiltersState {
	sport: string;
	category: string;
	dateRange: DateRange | undefined;
}

export default function MatchFilters({
	isDesktop = false,
}: { isDesktop?: boolean }) {
	const [values, setValues] = useState<MatchFiltersState>({
		sport: "",
		category: "",
		dateRange: undefined,
	});

	const { searchParams, setSearchParams, clearSearchParams } =
		useSearchParams();

	const onChange = (
		value: React.Key | DateRange | undefined,
		key: KeySearchParams,
	) => {
		setValues((prev) => ({ ...prev, [key]: value }));
		let formattedValue = value;
		if (typeof value === "object") {
			formattedValue = JSON.stringify(value);
		}
		setSearchParams(formattedValue, key);
	};

	const clearFilters = () => {
		setValues({
			sport: "",
			category: "",
			dateRange: undefined,
		});
		clearSearchParams();
	};

	useEffect(() => {
		const sport = searchParams.get("sport");
		const category = searchParams.get("category");
		const dateRange = searchParams.get("dateRange");

		setValues((prev) => ({
			...prev,
			sport: sport ?? "",
			category: category ?? "",
			dateRange: dateRange ? JSON.parse(dateRange) : undefined,
		}));
	}, [searchParams]);

	return (
		<div className="flex flex-col md:flex-row items-end justify-between md:justify-start gap-x-8 gap-y-5 md:gap-y-0 py-6 w-full ">
			<h4
				className={cn(
					"w-full text-start text-2xl font-medium text-primary",
					isDesktop && "hidden",
				)}
			>
				Filtrar
			</h4>
			<Separator className={cn(isDesktop && "hidden")} />
			<InputContainer>
				<InputLabel className={cn(isDesktop && "hidden md:inline-block")}>
					Deporte
				</InputLabel>
				<Select
					value={values.sport}
					onValueChange={(value) => onChange(value, "sport")}
				>
					<SelectTrigger
						aria-label="Click para desplegar las opciones y seleccionar un deporte"
						className={cn(
							"w-full md:w-[220px]",
							isDesktop && "hidden md:flex ",
						)}
					>
						<SelectValue placeholder="Selecciona un deporte" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Sports</SelectLabel>
							<SelectItem value="all">Todos</SelectItem>
							<SelectItem value="basketball">Basketball</SelectItem>
							<SelectItem value="football">Football</SelectItem>
							<SelectItem value="soccer">Soccer</SelectItem>
							<SelectItem value="volleyball">Volleyball</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</InputContainer>
			<InputContainer>
				<InputLabel className={cn(isDesktop && "hidden md:inline-block")}>
					Categoría
				</InputLabel>
				<Select
					value={values.category}
					onValueChange={(value) => onChange(value, "category")}
				>
					<SelectTrigger
						aria-label="Click para desplegar las opciones y seleccionar una categoría"
						className={cn(
							"w-full md:w-[220px]",
							isDesktop && "hidden md:flex ",
						)}
					>
						<SelectValue placeholder="Selecciona una categoría" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Categoría</SelectLabel>
							<SelectItem value="all">Todos</SelectItem>
							<SelectItem value="femenil">Femenil</SelectItem>
							<SelectItem value="varonil">Varonil</SelectItem>
						</SelectGroup>
					</SelectContent>
				</Select>
			</InputContainer>
			<InputContainer>
				<InputLabel className={cn(isDesktop && "hidden md:inline-block")}>
					Fecha
				</InputLabel>
				<DatePickerWithRange
					onValueChange={(value) => onChange(value, "dateRange")}
					date={values.dateRange}
					className={cn(isDesktop && "hidden md:flex ")}
				/>
			</InputContainer>
			<Button
				onClick={clearFilters}
				className={cn("mt-2", isDesktop && "hidden md:inline-block")}
			>
				Limpiar filtros
			</Button>
		</div>
	);
}
