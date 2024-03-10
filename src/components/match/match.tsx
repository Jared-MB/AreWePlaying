import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { format } from "@formkit/tempo";

import type { Match as MatchType } from "@/types";
import { FORMAT_DATE, LOCALE } from "@/constants/date";

import { MapPin } from "lucide-react";

import Link from "next/link";
import Tag from "./tag";
import { Suspense } from "react";

interface MatchProps {
	away: {
		name: string;
		logo: string;
	};
	local: boolean;
	sport: string;
	date: MatchType["date"];
	location: MatchType["location"];
	gender: MatchType["gender"];
}

export default function Match({
	away,
	local,
	sport,
	date,
	location,
	gender,
}: MatchProps) {
	return (
		<Card className="h-fit">
			<CardHeader className="flex flex-col gap-y-6 md:gap-y-0 md:flex-row justify-between items-center md:items-start">
				<div className="flex flex-row items-center gap-x-4">
					<Avatar className="w-16 h-16">
						<AvatarImage
							alt="Logo de los Lobos BUAP"
							src="/img/lobos-buap.webp"
							className="object-contain"
						/>
						<AvatarFallback>BUAP</AvatarFallback>
					</Avatar>
					vs.
					<Avatar className="border  w-16 h-16">
						<AvatarImage
							alt={`Logo de la universidad ${away.name}`}
							src={away.logo}
							className="object-contain"
						/>
						<AvatarFallback>{away.name}</AvatarFallback>
					</Avatar>
				</div>
				<Suspense>
					<div className="flex items-center gap-x-2">
						<Tag
							value={sport.toLowerCase()}
							query="sport"
							title="Filtrar por deporte"
						>
							{sport}
						</Tag>
						<Tag
							value={gender.toLowerCase()}
							query="category"
							title="Filtrar por genero"
						>
							{gender}
						</Tag>
					</div>
				</Suspense>
			</CardHeader>
			{/* <Separator /> */}
			<CardContent className="flex flex-col items-center md:items-start gap-y-2 text-sm text-muted-foreground">
				<div className="text-primary text-xl font-semibold flex gap-x-2 items-center justify-center w-fit">
					<span>BUAP</span>
					<span>vs.</span>
					<span className="w-fit text-wrap">{away.name}</span>
				</div>
				<div className="flex md:items-end md:justify-between w-full flex-col md:flex-row">
					<div className="flex flex-col gap-y-0.5 grow items-center md:items-start">
						<span>
							{location.name} - {local ? "Local" : "Visitante"}
						</span>
						{/* <span>1:00 PM - Marzo 18, 2024</span> */}
						<span className="capitalize">
							{format(date, FORMAT_DATE, LOCALE)}
						</span>
					</div>
					<Link
						href={location.url}
						target="_blank"
						className="relative -bottom-2 flex justify-center gap-x-1 text-muted-foreground my-2"
					>
						<MapPin size={20} strokeWidth={1} />
						<span>Ver mapa</span>
					</Link>
				</div>
			</CardContent>
		</Card>
	);
}
