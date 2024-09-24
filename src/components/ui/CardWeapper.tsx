// import { fetchCardData } from "@/app/lib/data";
import { Card } from "./card";

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
			ubicacion: "Tecnologico de monterrey campus puebla",
			sede: "Externo",
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
