import {
	LOCAL_STORAGE_STORY_ACCENT_KEY,
	LOCAL_STORAGE_STORY_THEME_KEY,
} from "@/constants/local-storage";
import {
	ACCENT_PRESETS,
	DEFAULT_ACCENT,
	type Palette,
	STATUS_BADGE,
	type StoryTeam,
	type StoryTheme,
	buildPalette,
} from "@/constants/story";
import { Check, Download, Link2, Loader2, Share2, X } from "lucide-preact";
import {
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "preact/hooks";
import { toast } from "sonner";
import { parseHex, readableTextOn, toHex, toRgb } from "@/utils/color";
import type { MatchStatus } from "@/utils/get-match-status";

/** Lienzo 9:16 de Instagram. Se dibuja a tamaño real y se escala sólo para la vista previa. */
const STORY_WIDTH = 1080;
const STORY_HEIGHT = 1920;

interface Props {
	status: MatchStatus;
	local: StoryTeam;
	visiting: StoryTeam;
	/** "UANL vs UPAEP": título al compartir el enlace. */
	shareTitle: string;
	dateLabel: string;
	timeLabel: string;
	venue: string;
	weekLabel: string;
	tournamentLabel: string;
	siteLabel: string;
	fileName: string;
}

/** Los nombres largos ("Universidad La Salle Nezahualcóyotl") tienen que caber en su columna. */
function nameSize(name: string) {
	if (name.length > 24) return 34;
	if (name.length > 14) return 42;
	return 52;
}

/** El escudo gigante y apagado del fondo, como en el encabezado del partido. */
function Watermark({
	team,
	theme,
	class: className,
}: {
	team: StoryTeam;
	theme: StoryTheme;
	class: string;
}) {
	if (!team.logo) return null;

	return (
		<img
			src={team.logo}
			alt=""
			class={`absolute size-[760px] object-contain ${className}`}
			style={{
				opacity: theme === "dark" ? 0.1 : 0.07,
				filter: theme === "dark" ? "grayscale(1) invert(1)" : "grayscale(1)",
			}}
		/>
	);
}

function TeamColumn({
	team,
	palette,
	showScore,
	dimmed,
	stacked = false,
}: {
	team: StoryTeam;
	palette: Palette;
	showScore: boolean;
	dimmed: boolean;
	/** Apilado (sin marcador) el nombre usa todo el ancho y puede crecer. */
	stacked?: boolean;
}) {
	// Un partido por jugarse puede no traer posición ni récord todavía.
	const meta = [team.position, team.record].filter(Boolean).join(" · ");

	return (
		<div class="flex min-w-0 flex-col items-center text-center">
			<div
				class="relative flex size-[200px] shrink-0 items-center justify-center overflow-hidden rounded-full"
				style={{
					background: team.logo
						? (team.logoBackground ?? "#FFFFFF")
						: palette.primary,
				}}
			>
				{team.logo ? (
					<>
						<img
							src={team.logo}
							alt=""
							width={200}
							height={200}
							class="size-[136px] object-contain"
						/>
						{/* Mismo degradado que `crest-fade`: funde las esquinas de los
						escudos cuadrados con el círculo. En línea para que html-to-image
						no dependa de un pseudo-elemento. */}
						<span
							class="absolute inset-0 rounded-full"
							style={{
								background: `radial-gradient(closest-side, transparent 70%, ${team.logoBackground ?? "#FFFFFF"} 100%)`,
							}}
						/>
					</>
				) : (
					<span
						class="text-[60px] font-bold"
						style={{ color: palette.primaryFg }}
					>
						{team.initials}
					</span>
				)}
			</div>

			<p
				class="mt-[32px] w-full font-bold uppercase leading-[1.05] text-balance wrap-break-word"
				style={{
					fontSize: `${stacked ? Math.round(nameSize(team.name) * 1.5) : nameSize(team.name)}px`,
				}}
			>
				{team.name}
			</p>
			{meta ? (
				<p
					class="mt-[12px] text-[28px] uppercase tracking-wider"
					style={{ color: palette.mutedFg }}
				>
					{meta}
				</p>
			) : null}

			{showScore ? (
				<p
					class="mt-[28px] text-[180px] font-bold leading-none tabular-nums"
					style={{ color: palette.fg, opacity: dimmed ? 0.45 : 1 }}
				>
					{team.points}
				</p>
			) : null}
		</div>
	);
}

function Story({
	palette,
	theme,
	status,
	local,
	visiting,
	dateLabel,
	timeLabel,
	venue,
	weekLabel,
	tournamentLabel,
	siteLabel,
}: Omit<Props, "fileName" | "shareTitle"> & {
	palette: Palette;
	theme: StoryTheme;
}) {
	const showScore = status !== "upcoming";
	const decided = showScore && (local.isWinner || visiting.isWinner);

	return (
		<>
			<Watermark team={local} theme={theme} class="top-[180px] -left-[300px]" />
			<Watermark
				team={visiting}
				theme={theme}
				class="-right-[300px] bottom-[140px]"
			/>

			{/* Margen superior amplio: la UI de Stories tapa la franja de arriba. */}
			<div class="relative px-[72px] pt-[112px]">
				<div class="flex items-center justify-between gap-[32px]">
					<p class="text-[40px] font-bold uppercase leading-[1.05]">
						Are We
						<br />
						Playing?
					</p>
					<span
						class="rounded-full px-[28px] py-[14px] text-[26px] font-bold uppercase tracking-widest"
						style={{ background: palette.primary, color: palette.primaryFg }}
					>
						{STATUS_BADGE[status]}
					</span>
				</div>
				<p
					class="mt-[56px] text-center text-[26px] font-bold uppercase tracking-widest"
					style={{ color: palette.mutedFg }}
				>
					{tournamentLabel} · {weekLabel}
				</p>
			</div>

			<div class="relative flex flex-1 flex-col justify-center gap-[72px] px-[64px]">
				{showScore ? (
					<div class="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-[24px]">
						<TeamColumn
							team={local}
							palette={palette}
							showScore={showScore}
							dimmed={decided && !local.isWinner}
						/>
						<div class="flex flex-col items-center gap-[12px] self-end pb-[64px]">
							{/* La flecha apunta al marcador del ganador, como en la NBA. */}
							{decided ? (
								<span
									class="text-[40px] leading-none"
									style={{ color: palette.accentTextLarge }}
								>
									{local.isWinner ? "◂" : "▸"}
								</span>
							) : null}
							<span class="text-[40px] font-bold uppercase tracking-wider">
								{status === "finished"
									? "Final"
									: status === "live"
										? "Vivo"
										: "VS"}
							</span>
						</div>
						<TeamColumn
							team={visiting}
							palette={palette}
							showScore={showScore}
							dimmed={decided && !visiting.isWinner}
						/>
					</div>
				) : (
					// Sin marcador no hay nada que comparar lado a lado: los equipos se
					// apilan y cada nombre tiene el ancho completo.
					<div class="flex flex-col items-center gap-[40px]">
						<TeamColumn
							team={local}
							palette={palette}
							showScore={false}
							dimmed={false}
							stacked
						/>
						<div class="flex w-full items-center gap-[28px]">
							<span
								class="h-[3px] flex-1"
								style={{ background: palette.line }}
							/>
							<span class="text-[44px] font-bold uppercase tracking-wider">
								VS
							</span>
							<span
								class="h-[3px] flex-1"
								style={{ background: palette.line }}
							/>
						</div>
						<TeamColumn
							team={visiting}
							palette={palette}
							showScore={false}
							dimmed={false}
							stacked
						/>
					</div>
				)}

				<div class="flex flex-col items-center gap-[24px] text-center">
					<p class="text-[44px] font-bold">
						{dateLabel}
						{timeLabel !== "—" ? ` · ${timeLabel} hrs` : ""}
					</p>
					<p
						class="flex items-center gap-[12px] text-[30px] uppercase tracking-wider"
						style={{ color: palette.mutedFg }}
					>
						{venue}
					</p>
				</div>
			</div>

			{/* Igual abajo: la barra de "enviar mensaje" de Stories come ~200px. */}
			<p
				class="relative pb-[200px] text-center text-[30px] font-bold uppercase tracking-widest"
				style={{ color: palette.accentTextSmall }}
			>
				{siteLabel}
			</p>
		</>
	);
}

export default function MatchStory({ fileName, shareTitle, ...story }: Props) {
	const [theme, setTheme] = useState<StoryTheme>("dark");
	const [accent, setAccent] = useState(DEFAULT_ACCENT);
	const [isExporting, setIsExporting] = useState(false);
	const [canShareFiles, setCanShareFiles] = useState(false);

	const $dialog = useRef<HTMLDialogElement>(null);
	const $frame = useRef<HTMLDivElement>(null);
	const $story = useRef<HTMLDivElement>(null);
	/** Incrustar las fuentes es lo más caro del export; se reutiliza entre descargas. */
	const fontCss = useRef<string | null>(null);

	const palette = useMemo(() => buildPalette(theme, accent), [theme, accent]);
	const isPreset = ACCENT_PRESETS.some((preset) => preset.value === accent);

	// El color y el tema de la story se conservan entre partidos y visitas.
	useEffect(() => {
		try {
			const storedAccent = window.localStorage.getItem(
				LOCAL_STORAGE_STORY_ACCENT_KEY,
			);
			const rgb = storedAccent ? parseHex(storedAccent) : null;
			if (rgb) setAccent(toHex(rgb));

			const storedTheme = window.localStorage.getItem(
				LOCAL_STORAGE_STORY_THEME_KEY,
			);
			if (storedTheme === "dark" || storedTheme === "light") {
				setTheme(storedTheme);
			}
		} catch {
			// Modo incógnito o almacenamiento bloqueado: se quedan los valores por defecto.
		}
	}, []);

	/** Guarda la preferencia sin que un almacenamiento bloqueado rompa el cambio. */
	const remember = (key: string, value: string) => {
		try {
			window.localStorage.setItem(key, value);
		} catch {
			// La selección sigue aplicándose aunque no se pueda recordar.
		}
	};

	const pickTheme = useCallback((value: StoryTheme) => {
		setTheme(value);
		remember(LOCAL_STORAGE_STORY_THEME_KEY, value);
	}, []);

	const pickAccent = useCallback((value: string) => {
		const rgb = parseHex(value);
		if (!rgb) return;

		const hex = toHex(rgb);
		setAccent(hex);
		remember(LOCAL_STORAGE_STORY_ACCENT_KEY, hex);
	}, []);

	// La story mide 1080px fijos: se escala al ancho disponible para la vista previa.
	// Con el diálogo cerrado el marco mide 0; el observer recalcula al abrirlo.
	useEffect(() => {
		const frame = $frame.current;
		if (!frame) return;

		const resize = () => {
			frame.style.setProperty(
				"--story-scale",
				String(frame.clientWidth / STORY_WIDTH),
			);
		};

		resize();
		const observer = new ResizeObserver(resize);
		observer.observe(frame);

		return () => observer.disconnect();
	}, []);

	// `canShare` con archivos sólo existe en móvil; se comprueba tras hidratar.
	useEffect(() => {
		const probe = new File([new Blob()], "probe.png", { type: "image/png" });
		setCanShareFiles(Boolean(navigator.canShare?.({ files: [probe] })));
	}, []);

	const renderPng = useCallback(async () => {
		const node = $story.current;
		if (!node) throw new Error("No se encontró la story");

		const { getFontEmbedCSS, toPng } = await import("html-to-image");

		// Las imágenes AVIF tienen que estar decodificadas antes de clonar el nodo.
		await Promise.all(
			[...node.querySelectorAll("img")].map((img) =>
				img.decode().catch(() => undefined),
			),
		);
		await document.fonts.ready;

		fontCss.current ??= await getFontEmbedCSS(node);

		return toPng(node, {
			width: STORY_WIDTH,
			height: STORY_HEIGHT,
			pixelRatio: 1,
			cacheBust: false,
			fontEmbedCSS: fontCss.current,
			// El clon hereda el escalado de la vista previa; se anula para exportar a 1080×1920.
			style: { transform: "none", transformOrigin: "top left", margin: "0" },
		});
	}, []);

	const download = useCallback(async () => {
		setIsExporting(true);
		try {
			const dataUrl = await renderPng();
			const $link = document.createElement("a");
			$link.href = dataUrl;
			$link.download = fileName;
			$link.click();
			toast.success("Imagen descargada");
		} catch {
			toast.error("No se pudo generar la imagen");
		} finally {
			setIsExporting(false);
		}
	}, [fileName, renderPng]);

	const shareImage = useCallback(async () => {
		setIsExporting(true);
		try {
			const dataUrl = await renderPng();
			const blob = await (await fetch(dataUrl)).blob();
			const file = new File([blob], fileName, { type: "image/png" });

			if (!navigator.canShare?.({ files: [file] })) {
				throw new Error("Compartir no disponible");
			}

			await navigator.share({ files: [file], title: story.tournamentLabel });
		} catch (error) {
			// Cancelar el diálogo nativo lanza AbortError; no es un fallo que reportar.
			if ((error as Error)?.name !== "AbortError") {
				toast.error("No se pudo compartir la imagen");
			}
		} finally {
			setIsExporting(false);
		}
	}, [fileName, renderPng, story.tournamentLabel]);

	const shareLink = useCallback(async () => {
		const url = window.location.href;

		// La Web Share API sólo existe en algunos navegadores (sobre todo móviles);
		// en el resto se copia el enlace al portapapeles.
		if (navigator.share) {
			try {
				await navigator.share({ title: shareTitle, url });
			} catch (error) {
				if ((error as Error)?.name !== "AbortError") {
					toast.error("No se pudo compartir");
				}
			}
			return;
		}

		try {
			await navigator.clipboard.writeText(url);
			toast.success("Enlace copiado al portapapeles");
		} catch {
			toast.error("No se pudo copiar el enlace");
		}
	}, [shareTitle]);

	const close = () => $dialog.current?.close();

	return (
		<>
			<button
				type="button"
				onClick={() => $dialog.current?.showModal()}
				aria-haspopup="dialog"
				class="inline-flex cursor-pointer items-center gap-2 rounded-full border-2 border-current px-4 py-2 font-mono text-sm font-bold uppercase tracking-wider text-white transition-[transform,background-color,color] duration-150 hover:bg-white hover:text-neutral-950 focus-visible:scale-95"
			>
				<Share2 class="size-4" aria-hidden="true" />
				Compartir
			</button>

			{/* biome-ignore lint/a11y/useKeyWithClickEvents: el clic en el fondo es solo para mouse; con teclado cierra Escape (nativo del dialog) y el botón de cerrar */}
			<dialog
				ref={$dialog}
				aria-labelledby="share-title"
				onClick={(event) => {
					// Clic en el fondo (fuera del contenido) cierra.
					if (event.target === $dialog.current) close();
				}}
				class="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-xl overflow-y-auto overscroll-contain rounded-md bg-background p-0 text-foreground shadow-xl backdrop:bg-neutral-950/70"
			>
				<div class="flex flex-col gap-5 p-5 md:p-6">
					<div class="flex items-center justify-between gap-4">
						<h2
							id="share-title"
							class="font-mono text-xl font-bold uppercase tracking-wider"
						>
							Compartir
						</h2>
						<button
							type="button"
							onClick={close}
							aria-label="Cerrar"
							class="flex size-9 cursor-pointer items-center justify-center rounded-full hover:bg-surface-hover"
						>
							<X class="size-5" aria-hidden="true" />
						</button>
					</div>

					<div class="flex flex-wrap items-center justify-between gap-3">
						<fieldset class="flex items-center gap-1 rounded-md bg-surface p-1 shadow-xs">
							<legend class="sr-only">Tema de la imagen</legend>
							{(["dark", "light"] as const).map((option) => (
								<button
									key={option}
									type="button"
									onClick={() => pickTheme(option)}
									aria-pressed={theme === option}
									class="cursor-pointer rounded-sm px-3 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors duration-150 hover:bg-surface-hover aria-pressed:bg-primary aria-pressed:text-primary-foreground"
								>
									{option === "dark" ? "Oscuro" : "Claro"}
								</button>
							))}
						</fieldset>

						<button
							type="button"
							onClick={shareLink}
							class="inline-flex cursor-pointer items-center gap-2 rounded-md bg-surface px-3 py-2 text-xs font-bold uppercase tracking-wider shadow-xs transition-colors duration-150 hover:bg-surface-hover"
						>
							<Link2 class="size-4" aria-hidden="true" />
							Enlace
						</button>
					</div>

					<fieldset>
						<legend class="sr-only">Color de acento</legend>
						<div class="flex flex-wrap items-center gap-2">
							{ACCENT_PRESETS.map((preset) => (
								<button
									key={preset.value}
									type="button"
									onClick={() => pickAccent(preset.value)}
									aria-pressed={accent === preset.value}
									aria-label={preset.name}
									title={preset.name}
									class="flex size-8 cursor-pointer items-center justify-center rounded-full shadow-xs transition-transform duration-150 hover:scale-110 focus-visible:scale-110 motion-reduce:transition-none motion-reduce:hover:scale-100"
									style={{
										background: preset.value,
										// El anillo marca la selección; el icono la confirma sin depender del color.
										outline:
											accent === preset.value
												? "2px solid var(--foreground)"
												: "1px solid var(--line)",
										outlineOffset: accent === preset.value ? "2px" : "0",
									}}
								>
									{accent === preset.value ? (
										<Check
											class="size-4"
											style={{ color: readableTextOn(toRgb(preset.value)) }}
											aria-hidden="true"
										/>
									) : null}
								</button>
							))}

							<label
								class="flex cursor-pointer items-center gap-2 rounded-md bg-surface px-2.5 py-1.5 text-xs font-bold uppercase tracking-wider shadow-xs transition-colors duration-150 hover:bg-surface-hover focus-within:ring-2 focus-within:ring-ring"
								title="Elegir un color exacto"
							>
								<span
									class="size-4 shrink-0 rounded-full"
									style={{
										// Con un preset activo muestra la rueda de color; si el color es
										// libre, muestra cuál es.
										background: isPreset
											? "conic-gradient(#EF4444,#EAB308,#22C55E,#06B6D4,#3B82F6,#A855F7,#EF4444)"
											: accent,
										outline: isPreset
											? "1px solid var(--line)"
											: "2px solid var(--foreground)",
										outlineOffset: isPreset ? "0" : "1px",
									}}
									aria-hidden="true"
								/>
								Otro
								<input
									type="color"
									value={accent}
									onInput={(event) =>
										pickAccent((event.currentTarget as HTMLInputElement).value)
									}
									class="sr-only"
								/>
							</label>
						</div>
					</fieldset>

					<div class="mx-auto w-full max-w-[300px]">
						<div
							ref={$frame}
							class="relative w-full overflow-hidden rounded-md border border-line/70"
							style={{ aspectRatio: `${STORY_WIDTH} / ${STORY_HEIGHT}` }}
						>
							<div
								ref={$story}
								class="absolute top-0 left-0 flex origin-top-left flex-col overflow-hidden font-mono"
								style={{
									width: `${STORY_WIDTH}px`,
									height: `${STORY_HEIGHT}px`,
									transform: "scale(var(--story-scale, 1))",
									background: palette.bg,
									color: palette.fg,
								}}
							>
								<Story {...story} palette={palette} theme={theme} />
							</div>
						</div>
					</div>

					<div class="flex flex-wrap items-center justify-center gap-3">
						<button
							type="button"
							onClick={download}
							disabled={isExporting}
							class="inline-flex cursor-pointer items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-bold uppercase tracking-wider text-primary-foreground shadow-xs transition-transform duration-150 focus-visible:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
						>
							{isExporting ? (
								<Loader2
									class="size-4 animate-spin motion-reduce:animate-none"
									aria-hidden="true"
								/>
							) : (
								<Download class="size-4" aria-hidden="true" />
							)}
							Descargar 9:16
						</button>

						{canShareFiles ? (
							<button
								type="button"
								onClick={shareImage}
								disabled={isExporting}
								class="inline-flex cursor-pointer items-center gap-2 rounded-md bg-surface px-4 py-2.5 text-sm font-bold uppercase tracking-wider shadow-xs transition-colors duration-150 hover:bg-surface-hover focus-visible:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
							>
								<Share2 class="size-4" aria-hidden="true" />
								Compartir imagen
							</button>
						) : null}
					</div>

					<p
						class="text-center text-xs uppercase tracking-wider text-muted-foreground"
						aria-live="polite"
					>
						{isExporting ? "Generando imagen…" : "PNG 1080 × 1920 px"}
					</p>
				</div>
			</dialog>
		</>
	);
}
