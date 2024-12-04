"use client";

import {
	FaBasketballBall,
	FaFootballBall,
	FaVolleyballBall,
} from "react-icons/fa";
import { GiSoccerBall } from "react-icons/gi";
import { AvatarEquipo } from "./avatarEquipo";

import type { Match } from "@/core/modules/matches/interfaces";
import { notification } from "@/core/modules/notification";
import { Bell, BellOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "./ui/badge";

const iconMap = {
	Basketball: FaBasketballBall,
	futbol: GiSoccerBall,
	voleibol: FaVolleyballBall,
	futbol_americano: FaFootballBall,
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
} as any;

export function Card({
	date,
	gender,
	hour,
	localTeam,
	sport: { name: sportName },
	visitorTeam,
	location,
	id,
	notificationActive,
}: Match & {
	// biome-ignore lint/suspicious/noExplicitAny: <explanation>
	notificationActive: any;
}) {
	const Icon = iconMap[sportName];

	const [disabled, setDisabled] = useState(false);

	return (
		<div className="rounded-xl p-5 dark:bg-zinc-700/10 shadow relative ">
			<div className="absolute top-4 right-4 flex flex-col md:flex-row items-end md:items-center gap-2">
				<Badge
					className="inline-flex items-center text-white cursor-pointer capitalize"
					value={gender}
				>
					#{gender}
				</Badge>
				<button
					type="button"
					disabled={disabled}
					onClick={async () => {
						setDisabled(true);
						if (notificationActive) {
							await notification.deleteNotification(id, notificationActive.id);
						} else {
							await notification.createNotification(id);
						}
						setDisabled(false);
					}}
					className="hover:bg-zinc-800 active:bg-zinc-800/50 p-2 rounded-md duration-300 disabled:opacity-50"
				>
					{notificationActive ? (
						<BellOff className="w-5 h-5 text-purple-500" />
					) : (
						<Bell className="w-5 h-5" />
					)}
				</button>
			</div>
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
