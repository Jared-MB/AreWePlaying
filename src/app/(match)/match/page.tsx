"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { InputContainer } from "@/components/ui/input";
import { Input } from "@/components/ui/input";
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
import { useEffect, useState } from "react";

// Simulated team type
type Team = {
	id: string;
	name: string;
};

export default function MatchCreationPage() {
	const [date, setDate] = useState<Date>();
	const [teams, setTeams] = useState<Team[]>([]);
	const [localTeam, setLocalTeam] = useState<string>("");
	const [visitorTeam, setVisitorTeam] = useState<string>("");

	// Simulated function to fetch teams from the database
	const fetchTeams = async () => {
		// This would be replaced with an actual API call
		const mockTeams: Team[] = [
			{ id: "1", name: "Equipo A" },
			{ id: "2", name: "Equipo B" },
			{ id: "3", name: "Equipo C" },
			{ id: "4", name: "Equipo D" },
		];
		setTeams(mockTeams);
	};

	useEffect(() => {
		fetchTeams();
	}, []);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		console.log("Form submitted:", {
			localTeam,
			visitorTeam,
			date,
			// Add other form fields here
		});
		// Handle form submission
	};

	return (
		<main className="w-screen flex justify-center items-center h-dvh overflow-y-auto">
			<section className="w-full px-20 lg:w-auto lg:mx-auto flex flex-col gap-8">
				<header className="flex flex-col items-center lg:items-start w-full justify-center relative">
					<h2 className="text-4xl text-purple-500 font-medium text-start">
						Registro de Partido Nuevo
					</h2>
				</header>
				<form
					onSubmit={handleSubmit}
					className="grid grid-cols-2 gap-4 sm:grid-cols-none"
				>
					<InputContainer>
						<Label htmlFor="local">Equipo Local</Label>
						<Select value={localTeam} onValueChange={setLocalTeam}>
							<SelectTrigger id="local">
								<SelectValue placeholder="Selecciona el equipo local" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{teams.map((team) => (
										<SelectItem key={team.id} value={team.id}>
											{team.name}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
					</InputContainer>
					<InputContainer>
						<Label htmlFor="visitor">Equipo Visitante</Label>
						<Select value={visitorTeam} onValueChange={setVisitorTeam}>
							<SelectTrigger id="visitor">
								<SelectValue placeholder="Selecciona el equipo visitante" />
							</SelectTrigger>
							<SelectContent>
								<SelectGroup>
									{teams.map((team) => (
										<SelectItem key={team.id} value={team.id}>
											{team.name}
										</SelectItem>
									))}
								</SelectGroup>
							</SelectContent>
						</Select>
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
					<Button type="submit" className="col-span-2">
						Registrar Partido
					</Button>
				</form>
			</section>
		</main>
	);
}
