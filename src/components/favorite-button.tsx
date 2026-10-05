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

const ACTION_PARAM = "action";
const ADD_TO_FAVORITE_ACTION = "addToFavorite";

/**
 * Los equipos ponen `?action=addToFavorite` en el enlace de su perfil. Sólo
 * agrega (nunca quita) para que abrir el enlace dos veces no deshaga nada, y
 * limpia el parámetro para que recargar o compartir la URL no lo repita.
 * Devuelve true si el equipo quedó agregado por esta acción.
 */
function consumeAddToFavoriteAction(id: string): boolean {
	const url = new URL(window.location.href);
	if (url.searchParams.get(ACTION_PARAM) !== ADD_TO_FAVORITE_ACTION) {
		return false;
	}

	url.searchParams.delete(ACTION_PARAM);
	window.history.replaceState(window.history.state, "", url);

	const favorites = readFavorites();
	if (favorites.includes(id)) return false;

	return writeFavorites([...favorites, id]);
}

export default function FavoriteButton({
	id,
	variant = "surface",
}: {
	id: string;
	variant?: keyof typeof VARIANTS;
}) {
	const [isFavorite, setIsFavorite] = useState(false);

	const notifyAdded = () =>
		toast(<span>Se agregó a favoritos</span>, {
			icon: <Star className="fill-favorite-strong size-4" />,
		});

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
		if (next) {
			notifyAdded();
			return;
		}

		toast(<span>Se quitó de favoritos</span>, {
			icon: <StarOff className="fill-favorite-strong size-4" />,
		});
	};

	useEffect(() => {
		if (consumeAddToFavoriteAction(id)) notifyAdded();
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
