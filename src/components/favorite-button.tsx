import { readFavorites, writeFavorites } from "@/utils/favorites";
import { Star, StarOff } from "lucide-preact";
import { useEffect, useState } from "preact/hooks";
import { toast } from "sonner";

export default function FavoriteButton({ id }: { id: string }) {
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
			class="group cursor-pointer inline-block bg-surface hover:bg-surface-hover rounded-md p-2 duration-180 text-sm font-bold uppercase tracking-wider shadow-xs transition-transform focus:scale-95"
		>
			<Star class="size-5 transition-colors duration-75 fill-background group-data-[active=true]:fill-favorite" />
		</button>
	);
}
