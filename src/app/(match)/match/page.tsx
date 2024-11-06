"use client";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input, InputContainer } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/core/utils";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useState } from "react";

export default function MatchCreationPage() {
	const [date, setDate] = useState<Date>();

	return (
		<main className="w-screen flex justify-center items-center h-dvh overflow-y-auto">
			<section className="w-full px-20 lg:w-auto lg:mx-auto flex flex-col gap-8">
				<header className="flex flex-col items-center lg:items-start w-full justify-center relative">
					<h2 className="text-4xl text-purple-500 font-medium text-start">
						Registro de Partido Nuevo
					</h2>
				</header>
				<form className="grid grid-cols-2 gap-4 sm:grid-cols-none">
					<InputContainer>
						<Label htmlFor="local">Equipo Local</Label>
						<Input type="text" id="local" placeholder="Nombre del local" />
					</InputContainer>
					<InputContainer>
						<Label htmlFor="visitor">Equipo Visitante</Label>
						<Input
							type="text"
							id="visitor"
							placeholder="Nombre del visitante"
						/>
					</InputContainer>
					<InputContainer>
						<Label htmlFor="date">Fecha</Label>
						<Popover>
							<PopoverTrigger asChild>
								<Button
									variant={"outline"}
									className={cn(
										"justify-start text-left font-normal",
										!date && "text-muted-foreground",
									)}
								>
									<CalendarIcon className="mr-2" />
									{date ? (
										format(date, "PPP")
									) : (
										<span>Seleccione una fecha</span>
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-auto p-0">
								<Calendar
									mode="single"
									selected={date}
									onSelect={setDate}
									initialFocus
								/>
							</PopoverContent>
						</Popover>
					</InputContainer>
					<InputContainer>
						<Label htmlFor="hour">Hora</Label>
						<Input type="time" id="hour" />
					</InputContainer>
					<InputContainer>
						<Label htmlFor="location">Ubicación</Label>
						<Input
							type="text"
							id="location"
							placeholder="Ubicación del partido"
						/>
					</InputContainer>
					<InputContainer>
						<Label htmlFor="gender">Género</Label>
						<Select>
							<SelectTrigger>
								<SelectValue placeholder="Selecciona un género" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="varonil">Varonil</SelectItem>
									<SelectItem value="femenil">Femenil</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</InputContainer>
					<InputContainer>
						<Label htmlFor="sport">Deporte</Label>
						<Select>
							<SelectTrigger>
								<SelectValue placeholder="Selecciona un deporte" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									<SelectItem value="futbol">Fútbol</SelectItem>
									<SelectItem value="basquetbol">Básquetbol</SelectItem>
									<SelectItem value="voleybol">Voleybol</SelectItem>
									<SelectItem value="futbol-americano">
										Fútbol Americano
									</SelectItem>
								</SelectGroup>
							</SelectContent>
						</Select>
					</InputContainer>
					<Button className="col-span-2">Registrar Partido</Button>
				</form>
			</section>
		</main>
	);
}
