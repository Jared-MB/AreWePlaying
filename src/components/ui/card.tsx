"use client";

import {
	FaBasketballBall,
	FaFootballBall,
	FaVolleyballBall,
} from "react-icons/fa";
import { GiSoccerBall } from "react-icons/gi";
import { AvatarEquipo } from "../avatarEquipo";

import { Badge } from "./badge";

const iconMap = {
	basquetbol: FaBasketballBall,
	futbol: GiSoccerBall,
	voleibol: FaVolleyballBall,
	futbol_americano: FaFootballBall,
};

export function Card({
	equipo1Img,
	equipo2Img,
	equipo1,
	equipo2,
	categoria,
	deporte,
	fecha,
	hora,
	ubicacion,
	sede,
}: {
	equipo1Img: string;
	equipo2Img: string;
	equipo1: string;
	equipo2: string;
	categoria: "varonil" | "femenil"; // Asegúrate de que estos valores sean exactos
	deporte: "futbol" | "basquetbol" | "voleibol" | "futbol_americano";
	fecha: string;
	hora: string;
	ubicacion: string;
	sede: string;
}) {
	//obtenemos icono
	const Icon = iconMap[deporte];

	return (
		<div className="rounded-xl bg-gray-50 p-4 shadow-sm relative ">
			<Badge
				className="absolute top-4 right-4 inline-flex items-center text-white cursor-pointer"
				value={categoria} // Llama a la función pasando el valor de categoria
			>
				#{categoria.charAt(0).toUpperCase() + categoria.slice(1)}
			</Badge>

			{/* Imagenes de los equipos */}
			<div className="flex items-center mb-2 grid-cols-6">
				<AvatarEquipo src={equipo1Img} /> VS <AvatarEquipo src={equipo2Img} />
			</div>

			<div className="flex items-center mb-2 grid-cols-6">
				{Icon ? <Icon className="h-5 w-5 text-purple-600" /> : null}
				<h1 className="ml-2 text-purple-600 font-semibold">
					{" "}
					<span className="cursor-pointer">{equipo1}</span> vs{" "}
					<span className="cursor-pointer">{equipo2}</span>
				</h1>
			</div>

			<div className="flex flex-col sm:flex-row justify-between text-gray-500 ">
				<div className="flex-grow ">
					<p>
						{hora} {fecha}
					</p>
				</div>
				<div className="flex flex-col max-w-[150px]">
					<a
						href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ubicacion)}`}
						target="_blank"
						rel="noopener noreferrer"
						className="no-underline hover:text-purple-600"
					>
						{ubicacion} - {sede}
					</a>
				</div>
			</div>
		</div>
	);
}
