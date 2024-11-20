"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
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
import { Separator } from "@/components/ui/separator";
import { match } from "@/core/modules/matches";
import type { Sport } from "@/core/modules/sport/interfaces";
import type { Team } from "@/core/modules/team/interfaces";
import { cn } from "@/core/utils";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useFormState } from "react-dom";

export default function AddMatch({
	teams,
	sports,
}: {
	teams: Team[];
	sports: Sport[];
}) {
	const [date, setDate] = useState<Date | undefined>(new Date());
	const [open, setOpen] = useState(false);

	const uploadMatch = match.uploadMatch.bind(null, date);

	const [error, dispatch] = useFormState(uploadMatch, undefined);

	useEffect(() => {
		console.log(error);
	}, [error]);

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button>Agregar Partido</Button>
			</DialogTrigger>
			<DialogContent>
				<DialogHeader className="flex flex-col items-center lg:items-start w-full justify-center relative">
					<DialogTitle className="text-purple-500">
						Registro de Partido Nuevo
					</DialogTitle>
				</DialogHeader>
				<Separator />
				<form action={dispatch}>
					<div className="mb-4 grid grid-cols-2 gap-4">
						<InputContainer>
							<Label htmlFor="local">Equipo Local</Label>
							<Select name="localTeamId">
								<SelectTrigger id="local">
									<SelectValue placeholder="Selecciona el equipo local" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{teams.map((team) => (
											<SelectItem key={team.id} value={`${team.id}`}>
												{team.name}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</InputContainer>
						<InputContainer>
							<Label htmlFor="visitor">Equipo Visitante</Label>
							<Select name="visitorTeamId">
								<SelectTrigger id="visitor">
									<SelectValue placeholder="Selecciona el equipo visitante" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{teams.map((team) => (
											<SelectItem key={team.id} value={`${team.id}`}>
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
							<Input type="time" id="hour" name="hour" />
						</InputContainer>
						<InputContainer className="col-span-2">
							<Label htmlFor="location">Ubicación</Label>
							<Input
								type="text"
								id="location"
								placeholder="Ubicación del partido"
								name="location"
							/>
						</InputContainer>
						<InputContainer>
							<Label htmlFor="gender">Género</Label>
							<Select name="gender">
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
							<Select name="sportId">
								<SelectTrigger>
									<SelectValue placeholder="Selecciona un deporte" />
								</SelectTrigger>
								<SelectContent>
									<SelectGroup>
										{sports.map((sport) => (
											<SelectItem key={sport.id} value={`${sport.id}`}>
												{sport.name}
											</SelectItem>
										))}
									</SelectGroup>
								</SelectContent>
							</Select>
						</InputContainer>
					</div>
					<Separator />
					<DialogFooter className="mt-4">
						<Button type="submit" onClick={() => setOpen(false)}>
							Registrar Partido
						</Button>
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}
