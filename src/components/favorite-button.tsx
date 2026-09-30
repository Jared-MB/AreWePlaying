import { readFavorites, writeFavorites } from "@/utils/favorites";
import { Star, StarOff } from "lucide-preact";
import { useEffect, useState } from "preact/hooks";
import { toast } from "sonner";

// "banner" es el botón de contorno sobre el encabezado de color del equipo.
const VARIANTS = {
	surface:
		"bg-surface hover:bg-surface-hover rounded-md p-2 shadow-xs text-sm tracking-wider",
	banner:
		"items-center rounded-full border-2 border-current px-4 py-2 font-mono text-sm font-bold uppercase tracking-wider hover:bg-primary-foreground hover:text-banner",
};

export default function FavoriteButton({
	id,
	variant = "surface",
}: {
	id: string;
	variant?: keyof typeof VARIANTS;
}) {
	const [isFavorite, setIsFavorite] = useState(false);

	const toggleFavorite = () => {
		// Se relee el almacenamiento en vez de confiar en el estado: otra pestaña
		// pudo haber cambiado la lista.
		const favorites = readFavorites();
		const next = !favorites.includes(id);

		const saved = writeFavorites(
			next ? [...favorites, id] : favorites.filter((f) => f !== id),
		);

		if (!saved) {
			toast.error("No se pudo guardar el favorito en este navegador");
			return;
		}

		setIsFavorite(next);
		toast(
			next ? (
				<span>Se agregó a favoritos</span>
			) : (
				<span>Se quitó de favoritos</span>
			),
			{
				icon: next ? (
					<Star className="fill-favorite-strong size-4" />
				) : (
					<StarOff className="fill-favorite-strong size-4" />
				),
			},
		);
	};

	useEffect(() => {
		setIsFavorite(readFavorites().includes(id));
	}, []);

	return (
		<button
			onClick={toggleFavorite}
			type="button"
			data-active={isFavorite}
			title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
			className={`touch-hitbox group cursor-pointer flex justify-center gap-2 duration-180 transition-[transform,background-color,color] focus:scale-95 ${VARIANTS[variant]}`}
		>
			<Star
				aria-hidden="true"
				className={`size-5 transition-colors duration-75 group-data-[active=true]:fill-favorite ${variant === "banner" ? "fill-transparent group-data-[active=true]:text-favorite" : "fill-background text-favorite"}`}
			/>
			<span className="sr-only lg:not-sr-only">
				{isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
			</span>
		</button>
	);
}
