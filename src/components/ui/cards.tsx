"use client";

import {
	FaBasketballBall,
	FaFootballBall,
	FaVolleyballBall,
} from "react-icons/fa";
import { GiSoccerBall } from "react-icons/gi";
import { AvatarEquipo } from "../avatarEquipo";
// import { fetchCardData } from "@/app/lib/data";
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
				className="absolute top-4 right-4 inline-flex items-center text-white cursor-pointer" /*onClick={ () => alert("hola")}*/
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

			<div className="flex justify-between text-gray-500">
				<p>
					{hora} {fecha}
				</p>
				<p>
					{ubicacion} {sede}{" "}
				</p>
			</div>
		</div>
	);
}

async function fetchData() {
	// Datos sintéticos
	const data = [
		{
			id: 1,
			equipo1Img:
				"https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/8814.png",
			equipo2Img:
				"https://logowik.com/content/uploads/images/nextjs2106.logowik.com.webp",
			equipo1: "Equipo A",
			equipo2: "Equipo B",
			categoria: "varonil" as const, // Asegúrate de usar el tipo exacto
			deporte: "futbol" as const, // Asegúrate de usar el tipo exacto
			fecha: "Agosto 20, 2024",
			hora: "10:00 AM",
			ubicacion: "Arena BUAP",
			sede: "Local",
		},
		{
			id: 2,
			equipo1Img:
				"https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/8814.png",
			equipo2Img:
				"https://logowik.com/content/uploads/images/nextjs2106.logowik.com.webp",
			equipo1: "Equipo C",
			equipo2: "Equipo D",
			categoria: "femenil" as const, // Asegúrate de usar el tipo exacto
			deporte: "basquetbol" as const, // Asegúrate de usar el tipo exacto
			fecha: "Agosto 20, 2024",
			hora: "10:00 AM",
			ubicacion: "Arena BUAP",
			sede: "Local",
		},
		{
			id: 3,
			equipo1Img:
				"https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/8814.png",
			equipo2Img:
				"https://logowik.com/content/uploads/images/nextjs2106.logowik.com.webp",
			equipo1: "Equipo A",
			equipo2: "Equipo B",
			categoria: "varonil" as const, // Asegúrate de usar el tipo exacto
			deporte: "voleibol" as const, // Asegúrate de usar el tipo exacto
			fecha: "Agosto 20, 2024",
			hora: "10:00 AM",
			ubicacion: "Arena BUAP",
			sede: "Local",
		},
		{
			equipo1Img:
				"https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/8814.png",
			equipo2Img:
				"https://logowik.com/content/uploads/images/nextjs2106.logowik.com.webp",
			equipo1: "Equipo A",
			equipo2: "Equipo B",
			categoria: "varonil" as const, // Asegúrate de usar el tipo exacto
			deporte: "futbol" as const, // Asegúrate de usar el tipo exacto
			fecha: "Agosto 20, 2024",
			hora: "10:00 AM",
			ubicacion: "Arena BUAP",
			sede: "Local",
		},
		{
			equipo1Img:
				"https://a.espncdn.com/combiner/i?img=/i/teamlogos/soccer/500/8814.png",
			equipo2Img:
				"https://logowik.com/content/uploads/images/nextjs2106.logowik.com.webp",
			equipo1: "Equipo A",
			equipo2: "Equipo B",
			categoria: "varonil" as const, // Asegúrate de usar el tipo exacto
			deporte: "futbol_americano" as const, // Asegúrate de usar el tipo exacto
			fecha: "Agosto 20, 2024",
			hora: "10:00 AM",
			ubicacion: "Arena BUAP",
			sede: "Local",
		},
	];

	return data;
}

export default async function CardWrapper() {
	const infoCard = await fetchData();

	return (
		<>
			{infoCard.map((cardData) => (
				<Card key={cardData.id} {...cardData} />
			))}
		</>
	);
}
