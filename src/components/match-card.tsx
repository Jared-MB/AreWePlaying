import confetti from "canvas-confetti";
import type { ComponentChildren } from "preact";
import { useEffect, useRef, useState } from "preact/hooks";
import { readFavorites } from "@/utils/favorites";

export default function MatchCard({
	localTeamId,
	visitingTeamId,
	celebrate = true,
	children,
}: {
	localTeamId?: string;
	visitingTeamId?: string;
	/**
	 * Confeti, "Yes!!" y auto-scroll al partido del favorito. Se apaga en las
	 * listas de partidos futuros: resaltarlos sí, celebrarlos todavía no.
	 */
	celebrate?: boolean;
	children: ComponentChildren;
}) {
	const [isFavorite, setIsFavorite] = useState(false);
	const $card = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!localTeamId || !visitingTeamId) {
			return;
		}

		const favoritesTeams = readFavorites();

		if (favoritesTeams.length === 0) {
			return;
		}

		const isFavorite =
			favoritesTeams.includes(localTeamId) ||
			favoritesTeams.includes(visitingTeamId);

		setIsFavorite(isFavorite);

		if (isFavorite && celebrate) {
			confetti({
				particleCount: 60,
				spread: 100,
				startVelocity: 45,
				origin: { y: 0.6 },
				gravity: 0.5,
				disableForReducedMotion: true,
			});
			const $areWePlaying = document.getElementById("are-we-playing");
			$areWePlaying?.setAttribute("data-active", "true");

			// Avisa a la página para que decida si hace scroll hasta el partido.
			window.dispatchEvent(
				new CustomEvent("favorite-match", { detail: $card.current }),
			);
		}
	}, []);

	return (
		<div
			ref={$card}
			data-active={isFavorite}
			className="bg-surface group relative shadow-xs mb-6 text-card-foreground flex flex-col gap-6 p-0 transition-all duration-180 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none has-[a]:active:scale-99 has-[a]:active:shadow-none rounded-md data-[active=true]:bg-primary/90 data-[active=true]:text-primary-foreground!"
		>
			{/* El resaltado del favorito es sólo color: esto lo vuelve audible. */}
			{isFavorite ? (
				<p className="sr-only">Juega uno de tus equipos favoritos</p>
			) : null}
			{children}
		</div>
	);
}
