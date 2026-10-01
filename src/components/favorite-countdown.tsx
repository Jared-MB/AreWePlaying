import { readFavorites } from "@/utils/favorites";
import type { NextTeamMatch } from "@/utils/get-next-matches";
import { ChevronLeft, ChevronRight, MapPin, Star } from "lucide-preact";
import { useEffect, useRef, useState } from "preact/hooks";

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** Cuánto más chico es cada boleto respecto al que tiene delante. */
const STACK_SHRINK = 0.04;

/** Cuánto hay que arrastrar el boleto del frente para mandarlo al fondo. */
const SWIPE_DISTANCE = 96;
/** Movimiento mínimo para considerar que es un arrastre y no un clic. */
const DRAG_SLOP = 6;
/** Un gesto rápido (px por ms) cuenta como "mandar al fondo" aunque sea corto. */
const FLICK_SPEED = 0.5;
const FLICK_MIN_DISTANCE = 40;

const NAV_BUTTON =
	"touch-hitbox grid size-10 cursor-pointer place-items-center rounded-md border-2 border-line bg-surface text-foreground transition-[background-color] hover:bg-surface-hover focus-visible:outline-2 focus-visible:outline-offset-2 md:size-8";

const TICKET_LABEL =
	"text-xs font-bold uppercase tracking-wider text-muted-foreground";

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
	const [frontId, setFrontId] = useState<string>();
	const [dragX, setDragX] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const drag = useRef<{
		id: number;
		startX: number;
		startY: number;
		startTime: number;
		dx: number;
		active: boolean;
	} | null>(null);

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

	// Se guarda el partido del frente (no un índice): `pending` se encoge solo
	// cuando un partido empieza.
	const total = pending.length;
	const frontIndex = Math.max(
		pending.findIndex((match) => match.matchId === frontId),
		0,
	);
	const goTo = (offset: number) => {
		setFrontId(pending[(frontIndex + offset + total) % total].matchId);
		setDragX(0);
	};

	const startDrag = (event: PointerEvent) => {
		if (event.pointerType === "mouse" && event.button !== 0) return;
		drag.current = {
			id: event.pointerId,
			startX: event.clientX,
			startY: event.clientY,
			startTime: event.timeStamp,
			dx: 0,
			active: false,
		};
	};

	const moveDrag = (event: PointerEvent) => {
		const current = drag.current;
		if (!current || current.id !== event.pointerId) return;

		const dx = event.clientX - current.startX;
		if (!current.active) {
			// Con el dedo el primer movimiento casi nunca es recto: se espera a que
			// lo horizontal gane en vez de descartar el gesto. Si es un scroll, el
			// navegador lo cancela solo (`touch-pan-y`).
			const dy = event.clientY - current.startY;
			if (Math.abs(dx) < DRAG_SLOP || Math.abs(dy) > Math.abs(dx)) return;
			// Se captura hasta aquí y no en pointerdown: así un clic normal sigue
			// llegando a los enlaces del boleto.
			current.active = true;
			try {
				(event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);
			} catch {
				// El puntero ya no está activo: los eventos siguen llegando por burbujeo.
			}
			setIsDragging(true);
		}
		current.dx = dx;
		setDragX(dx);
	};

	const endDrag = (event: PointerEvent) => {
		const current = drag.current;
		if (!current || current.id !== event.pointerId) return;

		drag.current = null;
		setIsDragging(false);
		if (!current.active) return;
		const distance = Math.abs(current.dx);
		const speed = distance / Math.max(event.timeStamp - current.startTime, 1);
		const isFlick = distance >= FLICK_MIN_DISTANCE && speed >= FLICK_SPEED;
		if (event.type === "pointerup" && (distance >= SWIPE_DISTANCE || isFlick)) {
			goTo(1);
			return;
		}
		setDragX(0);
	};

	return (
		<section
			aria-labelledby="favorite-countdown"
			className="mb-12 motion-safe:animate-in motion-safe:fade-in motion-safe:slide-in-from-bottom-2 motion-safe:duration-300"
		>
			<div className="mb-6 flex items-center justify-between gap-4">
				<h2
					id="favorite-countdown"
					className="flex items-center gap-2 font-mono text-sm font-bold uppercase tracking-wider text-muted-foreground"
				>
					<Star
						className="size-4 shrink-0 fill-favorite-strong text-favorite-strong"
						aria-hidden="true"
					/>
					Tus tickets
				</h2>

				{total > 1 ? (
					<div className="flex items-center gap-2">
						<span
							className="mr-1 font-mono text-xs font-bold tabular-nums text-muted-foreground"
							aria-hidden="true"
						>
							{frontIndex + 1} / {total}
						</span>
						<button
							type="button"
							className={NAV_BUTTON}
							aria-label="Partido anterior"
							onClick={() => goTo(-1)}
						>
							<ChevronLeft className="size-4" aria-hidden="true" />
						</button>
						<button
							type="button"
							className={NAV_BUTTON}
							aria-label="Partido siguiente"
							onClick={() => goTo(1)}
						>
							<ChevronRight className="size-4" aria-hidden="true" />
						</button>
					</div>
				) : null}
			</div>

			{/* Los boletos se apilan en una sola celda: el del frente va completo y los demás asoman por arriba (`--peek`), cada vez más chicos. Sólo el del frente responde; se cambia con los botones o arrastrándolo a un lado, y entonces se va al fondo. Los de atrás son `inert` para que no entren en el orden de tabulación. */}
			<div
				className="-mx-3 grid overflow-x-clip px-3 pt-(--stack-top) [--peek:4.5rem] md:[--peek:5rem]"
				style={`--stack-top: calc(${total - 1} * var(--peek))`}
			>
				{pending.map((match, index) => {
					const remaining = match.startsAt - now;

					const position = (index - frontIndex + total) % total;
					const isFront = position === 0;
					const isSwipeable = isFront && total > 1;

					return (
						<div
							key={match.matchId}
							inert={!isFront}
							onPointerDown={isSwipeable ? startDrag : undefined}
							onPointerMove={isSwipeable ? moveDrag : undefined}
							onPointerUp={isSwipeable ? endDrag : undefined}
							onPointerCancel={isSwipeable ? endDrag : undefined}
							className={`ticket-edge @container col-start-1 row-start-1 min-w-0 origin-top z-(--z) translate-x-(--x) translate-y-(--y) scale-(--s) ${
								isFront && isDragging
									? "[&_*]:cursor-grabbing"
									: "motion-safe:transition-[translate,scale] motion-safe:duration-300 motion-safe:ease-out"
							} ${isSwipeable ? "touch-pan-y" : ""}`}
							style={`--z: ${total - position}; --x: ${isFront ? dragX : 0}px; --y: calc(${position} * var(--peek) * -1); --s: ${1 - position * STACK_SHRINK}`}
						>
							<article className="relative grid h-full min-w-0 grid-rows-[3rem_1fr] overflow-hidden rounded-lg bg-surface text-card-foreground transition-[background-color] [--notch-x:calc(4.5rem_+_1px)] [--notch-y:calc(3rem_+_1px)] hover:bg-surface-hover max-md:ticket-notch-x md:ticket-notch-y md:grid-cols-[4.5rem_1fr] md:grid-rows-1">
								<a
									draggable={false}
									className="absolute inset-0 cursor-pointer rounded-lg focus-visible:outline-2 focus-visible:outline-offset-[-6px]"
									href={`/${match.tournamentSlug}/match/${match.matchSlug}`}
									aria-label={`Ver detalle del partido entre ${match.team} contra ${match.opponent}`}
								/>

								<div className="flex min-w-0 flex-col gap-5 p-5 md:p-6">
									<header className="min-w-0 flex flex-col gap-1">
										<h3 className="wrap-break-word font-bold uppercase tracking-wide text-xl [&>a]:hover:underline [&>a]:z-10 [&>a]:relative [&>a]:touch-hitbox">
											<a
												draggable={false}
												href={`/${match.tournamentSlug}/teams/${match.teamSlug}`}
											>
												{match.team}
											</a>{" "}
											<span className="text-muted-foreground text-base">
												vs
											</span>{" "}
											<a
												draggable={false}
												href={`/${match.tournamentSlug}/teams/${match.opponentSlug}`}
											>
												{match.opponent}
											</a>
										</h3>
										<p className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
											{match.tournament}
											{match.week ? ` · ${match.week}` : null}
											{` · ${match.isLocal ? "Local" : "Visita"}`}
										</p>
									</header>

									<p className="sr-only">
										{describe(remaining)} para el partido de {match.team}:{" "}
										{match.label}.
									</p>

									<div className="flex gap-2 @xl:gap-3" aria-hidden="true">
										{getParts(remaining).map((part) => (
											<div
												key={part.label}
												className="min-w-0 flex-1 @xl:min-w-14 @xl:flex-none"
											>
												<div className="font-pixel text-2xl font-bold tabular-nums @md:text-3xl @xl:text-5xl">
													{String(part.value).padStart(2, "0")}
												</div>
												<div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
													{part.label}
												</div>
											</div>
										))}
									</div>

									<dl className="grid gap-x-6 gap-y-3 border-t-2 border-dashed border-line pt-4 @xl:grid-cols-[auto_minmax(0,1fr)]">
										<div>
											<dt className={TICKET_LABEL}>Fecha</dt>
											<dd>
												<time
													dateTime={new Date(match.startsAt).toISOString()}
													className="min-w-0 text-sm font-bold uppercase tracking-wide"
												>
													{match.label}
												</time>
											</dd>
										</div>
										{match.location &&
										match.location !== "-" &&
										match.locationUrl ? (
											<div className="min-w-0">
												<dt className={TICKET_LABEL}>Cancha</dt>
												<dd>
													<a
														draggable={false}
														href={match.locationUrl}
														target="_blank"
														rel="noopener noreferrer"
														className="flex min-w-0 w-fit items-center gap-2 text-sm font-bold uppercase tracking-wide hover:underline z-10 touch-hitbox"
													>
														<MapPin
															className="size-3.5 shrink-0"
															aria-hidden="true"
														/>
														<span className="min-w-0 wrap-break-word">
															{match.location}
														</span>
														<span className="sr-only">
															{" "}
															(abre en una pestaña nueva)
														</span>
													</a>
												</dd>
											</div>
										) : null}
									</dl>
								</div>

								{/* Talón de color: arriba como banda en móvil, a la izquierda en escritorio. */}
								<div
									aria-hidden="true"
									className="order-first flex items-center justify-center gap-2 border-dashed border-background bg-primary px-4 text-xs font-bold uppercase tracking-wider text-highlight-foreground max-md:border-b-2 md:flex-col md:border-r-2"
								>
									<Star className="size-4 shrink-0 fill-current" />
									<span className="md:rotate-180 md:[writing-mode:vertical-rl]">
										Favorito
									</span>
								</div>
							</article>
						</div>
					);
				})}
			</div>

			{total > 1 ? (
				<p className="sr-only" role="status">
					Partido {frontIndex + 1} de {total}
				</p>
			) : null}
		</section>
	);
}
