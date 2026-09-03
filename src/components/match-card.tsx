import confetti from "canvas-confetti";
import type { ComponentChildren } from "preact";
import { useEffect, useState } from "preact/hooks";

export default function MatchCard({
	localTeamId,
	visitingTeamId,
	children,
}: {
	localTeamId?: string;
	visitingTeamId?: string;
	children: ComponentChildren;
}) {
	const [isFavorite, setIsFavorite] = useState(false);

	useEffect(() => {
		const favoritesTeams = JSON.parse(
			window.localStorage.getItem("favorites") || "[]",
		);

		const isFavorite =
			favoritesTeams.includes(localTeamId) ||
			favoritesTeams.includes(visitingTeamId);

		setIsFavorite(isFavorite);

		isFavorite &&
			confetti({
				particleCount: 60,
				spread: 100,
				startVelocity: 45,
				origin: { y: 0.6 },
				gravity: 0.5,
				disableForReducedMotion: true,
			});
	}, []);

	return (
		<div
			data-active={isFavorite}
			className="mb-6 text-card-foreground flex flex-col gap-6 p-0 shadow-[2px_2px_0px_0px_rgba(107,33,168,0.3)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none rounded-none! border-2 border-foreground group data-[active=true]:bg-primary/80 data-[active=true]:text-primary-foreground!"
		>
			{children}
		</div>
	);
}
