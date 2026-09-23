import { readFavorites } from "@/utils/favorites";
import type { NextTeamMatch } from "@/utils/get-next-matches";
import { MapPin, Star } from "lucide-preact";
import { useEffect, useState } from "preact/hooks";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function getParts(remaining: number) {
	const left = Math.max(remaining, 0);

	return [
		{ value: Math.floor(left / DAY), label: "Días" },
		{ value: Math.floor((left % DAY) / HOUR), label: "Hrs" },
		{ value: Math.floor((left % HOUR) / MINUTE), label: "Min" },
		{ value: Math.floor((left % MINUTE) / SECOND), label: "Seg" },
	];
}

function describe(remaining: number) {
	const [days, hours, minutes] = getParts(remaining).map((p) => p.value);

	if (days > 0) return `Faltan ${days} ${days === 1 ? "día" : "días"}`;
	if (hours > 0) return `Faltan ${hours} ${hours === 1 ? "hora" : "horas"}`;
	return `Faltan ${minutes} ${minutes === 1 ? "minuto" : "minutos"}`;
}

/**
 * Cuenta regresiva al próximo partido de los equipos favoritos. Los favoritos
 * sólo existen en localStorage, así que el servidor manda el próximo partido de
 * cada equipo y aquí se filtra el que le toca a esta persona.
 */
export default function FavoriteCountdown({
	matchesByTeam,
}: {
	matchesByTeam: Record<string, NextTeamMatch>;
}) {
	const [matches, setMatches] = useState<NextTeamMatch[]>([]);
	const [now, setNow] = useState(() => Date.now());

	useEffect(() => {
		// La lista de partidos se monta debajo y hace scroll hasta el favorito:
		// avisa cuando esta tarjeta ya ocupó (o no) su lugar, para que no mida
		// antes de tiempo.
		let hasSettled = false;
		const settle = () => {
			if (hasSettled) return;
			hasSettled = true;
			window.dispatchEvent(new CustomEvent("favorite-countdown-settled"));
		};

		const favorites = readFavorites();

		const seen = new Set<string>();
		const next = favorites
			.map((teamId) => matchesByTeam[teamId])
			.filter((match) => {
				// Si dos favoritos juegan entre sí, es el mismo partido.
				if (!match || seen.has(match.matchId)) return false;
				seen.add(match.matchId);
				return true;
			})
			.toSorted((a, b) => a.startsAt - b.startsAt);

		setMatches(next);
		// El siguiente frame ya tiene la tarjeta pintada y el alto definitivo;
		// en una pestaña en segundo plano rAF no corre, de ahí el respaldo.
		requestAnimationFrame(settle);
		const fallback = window.setTimeout(settle, 100);

		return () => window.clearTimeout(fallback);
	}, [matchesByTeam]);

	useEffect(() => {
		if (matches.length === 0) return;

		const id = window.setInterval(() => setNow(Date.now()), SECOND);
		return () => window.clearInterval(id);
	}, [matches.length]);

	const pending = matches.filter((match) => match.startsAt > now);
	if (pending.length === 0) return null;

	return (
		<section
			aria-labelledby="favorite-countdown"
			class="mb-12 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300"
		>
			<h2
				id="favorite-countdown"
				class="mb-6 flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-wider text-muted-foreground"
			>
				<Star
					class="size-4 shrink-0 fill-favorite-strong text-favorite-strong"
					aria-hidden="true"
				/>
				{pending.length === 1 ? "Tu próximo partido" : "Tus próximos partidos"}
			</h2>

			<div class={`grid gap-6 ${pending.length > 1 ? "sm:grid-cols-2" : ""}`}>
				{pending.map((match) => {
					const remaining = match.startsAt - now;

					return (
						<article
							key={match.matchId}
							class="flex min-w-0 flex-col gap-4 rounded-md bg-surface p-6 shadow-xs transition-all duration-180 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none has-[a]:active:scale-99 has-[a]:active:shadow-none relative"
						>
							<a
								className="cursor-pointer focus-visible:outline-2 outline-offset-4 absolute inset-0"
								href={`/${match.tournamentSlug}/match/${match.matchSlug}`}
								aria-label={`Ver detalle del partido entre ${match.team} contra ${match.opponent}`}
							/>
							<header class="min-w-0 flex flex-col gap-1">
								<h3 class="wrap-break-word font-bold uppercase tracking-wide text-xl [&>a]:hover:underline [&>a]:z-10 [&>a]:relative [&>a]:touch-hitbox">
									<a href={`/${match.tournamentSlug}/teams/${match.teamSlug}`}>
										{match.team}
									</a>{" "}
									<span class="text-muted-foreground text-base">vs</span>{" "}
									<a
										href={`/${match.tournamentSlug}/teams/${match.opponentSlug}`}
									>
										{match.opponent}
									</a>
								</h3>
								<p class="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
									{match.tournament}
									{match.week ? ` · ${match.week}` : null}
									{` · ${match.isLocal ? "Local" : "Visita"}`}
								</p>
							</header>

							<p class="sr-only">
								{describe(remaining)} para el partido de {match.team}:{" "}
								{match.label}.
							</p>

							<div class="flex flex-wrap gap-3" aria-hidden="true">
								{getParts(remaining).map((part) => (
									<div key={part.label} class="min-w-14">
										<div class="font-mono text-3xl font-bold tabular-nums md:text-4xl">
											{String(part.value).padStart(2, "0")}
										</div>
										<div class="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
											{part.label}
										</div>
									</div>
								))}
							</div>

							<div class="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-sm">
								<time
									dateTime={new Date(match.startsAt).toISOString()}
									class="min-w-0 font-bold uppercase tracking-wide"
								>
									{match.label}
								</time>
							</div>

							{match.location && match.location !== "-" && match.locationUrl ? (
								<a
									href={match.locationUrl}
									target="_blank"
									rel="noopener noreferrer"
									class="flex min-w-0 w-fit items-center gap-2 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:underline z-10 touch-hitbox"
								>
									<MapPin class="size-3.5 shrink-0" aria-hidden="true" />
									<span class="sr-only">Lugar: </span>
									<span class="min-w-0 wrap-break-word">{match.location}</span>
								</a>
							) : null}
						</article>
					);
				})}
			</div>
		</section>
	);
}
