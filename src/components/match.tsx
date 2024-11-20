"use client";

import {
	FaBasketballBall,
	FaFootballBall,
	FaVolleyballBall,
} from "react-icons/fa";
import { GiSoccerBall } from "react-icons/gi";
import { AvatarEquipo } from "./avatarEquipo";

import type { Match } from "@/core/modules/matches/interfaces";
import Link from "next/link";
import { Badge } from "./ui/badge";

const iconMap = {
	Basketball: FaBasketballBall,
	futbol: GiSoccerBall,
	voleibol: FaVolleyballBall,
	futbol_americano: FaFootballBall,
};

export function Card({
	date,
	gender,
	hour,
	localTeam,
	sport: { name: sportName },
	visitorTeam,
	location,
}: Match) {
	//obtenemos icono
	const Icon = iconMap[sportName];

	return (
		<div className="rounded-xl p-5 dark:bg-zinc-700/10 shadow relative ">
			<Badge
				className="absolute top-4 right-4 inline-flex items-center text-white cursor-pointer"
				value={gender} // Llama a la función pasando el valor de gender
			>
				#{gender.charAt(0).toUpperCase() + gender.slice(1)}
			</Badge>

			{/* Imagenes de los equipos */}
			<div className="flex items-center mb-2 grid-cols-6">
				<AvatarEquipo src={localTeam.logo} /> VS{" "}
				<AvatarEquipo src={visitorTeam.logo} />
			</div>

			<div className="flex items-center mb-2 grid-cols-6">
				{Icon ? <Icon className="h-5 w-5 text-purple-600" /> : null}
				<h1 className="ml-2 text-purple-600 font-semibold">
					{" "}
					<span className="cursor-pointer">{localTeam.name}</span> vs{" "}
					<span className="cursor-pointer">{visitorTeam.name}</span>
				</h1>
			</div>

			<div className="grid grid-cols-2 text-gray-500 ">
				<small>
					{hour} {new Date(date).toDateString()}
				</small>
				<Link
					href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`}
					target="_blank"
					rel="noopener noreferrer"
					className="hover:text-purple-700 flex gap-x-1 justify-end text-sm"
				>
					<span className="truncate max-w-xs">{location}</span>
					{/* -{" "} */}
					{/* <span className="truncate">{sede}</span> */}
				</Link>
			</div>
		</div>
	);
}
