import { LOCAL_STORAGE_FAVORITES_KEY } from "@/constants/local-storage";
import { Star, StarOff } from "lucide-preact";
import { useEffect, useState } from "preact/hooks";
import { toast } from "sonner";

export default function FavoriteButton({ id }: { id: string }) {
	const [isFavorite, setIsFavorite] = useState(false);

	const setFavorites = (favorites: string[]) => {
		localStorage.setItem(
			LOCAL_STORAGE_FAVORITES_KEY,
			JSON.stringify(favorites),
		);
	};

	const toggleFavorite = () => {
		setIsFavorite((prev) => {
			toast(
				!prev ? (
					<span>Se agregó a favoritos</span>
				) : (
					<span>Se quitó de favoritos</span>
				),
				{
					icon: !prev ? (
						<Star className="fill-yellow-500 size-4" />
					) : (
						<StarOff className="fill-yellow-500 size-4" />
					),
				},
			);
			return !prev;
		});

		const favorites = window.localStorage.getItem(LOCAL_STORAGE_FAVORITES_KEY);

		if (!favorites) {
			setFavorites([id]);
			return;
		}

		const parsedFavorites = JSON.parse(favorites);

		if (!parsedFavorites.includes(id)) {
			parsedFavorites.push(id);
			setFavorites(parsedFavorites);
			return;
		}

		parsedFavorites.splice(parsedFavorites.indexOf(id), 1);
		setFavorites(parsedFavorites);
	};

	useEffect(() => {
		const favorites = window.localStorage.getItem(LOCAL_STORAGE_FAVORITES_KEY);
		if (favorites) {
			setIsFavorite(JSON.parse(favorites).includes(id));
		}
	}, []);

	return (
		<button
			onClick={toggleFavorite}
			type="button"
			data-active={isFavorite}
			title={isFavorite ? "Quitar de favoritos" : "Agregar a favoritos"}
			class="group cursor-pointer inline-block border-2 border-foreground bg-muted p-2 font-mono text-sm font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(107,33,168,0.3)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none"
		>
			<Star class="size-5 transition-colors duration-75 fill-background group-data-[active=true]:fill-amber-400" />
		</button>
	);
}
