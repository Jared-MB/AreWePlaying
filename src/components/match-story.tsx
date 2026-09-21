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
import { Check, Download, Loader2, Share2 } from "lucide-preact";
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
	dateLabel: string;
	timeLabel: string;
	venue: string;
	weekLabel: string;
	tournamentLabel: string;
	siteLabel: string;
	fileName: string;
}

/** Los nombres largos ("Anáhuac Querétaro") tienen que caber sin partir la retícula. */
function nameSize(name: string) {
	if (name.length > 24) return 42;
	if (name.length > 16) return 52;
	return 66;
}

function TeamRow({
	team,
	palette,
	showScore,
}: {
	team: StoryTeam;
	palette: Palette;
	showScore: boolean;
}) {
	// Un partido por jugarse puede no traer posición ni récord todavía.
	const meta = [team.position, team.record].filter(Boolean).join(" · ");

	return (
		<div class="flex items-center gap-[36px]">
			<div
				class="flex size-[168px] shrink-0 items-center justify-center overflow-hidden rounded-full"
				style={{
					background: team.logo ? "#FFFFFF" : palette.primary,
					border: `3px solid ${palette.line}`,
				}}
			>
				{team.logo ? (
					<img
						src={team.logo}
						alt=""
						width={168}
						height={168}
						class="size-[140px] object-contain"
					/>
				) : (
					<span
						class="text-[52px] font-bold"
						style={{ color: palette.primaryFg }}
					>
						{team.initials}
					</span>
				)}
			</div>

			<div class="min-w-0 flex-1">
				<p
					class="font-bold uppercase leading-[1.04] wrap-break-word"
					style={{ fontSize: `${nameSize(team.name)}px` }}
				>
					{team.name}
				</p>
				{meta ? (
					<p
						class="mt-[14px] text-[30px] uppercase tracking-wider"
						style={{ color: palette.mutedFg }}
					>
						{meta}
					</p>
				) : null}
			</div>

			{showScore ? (
				<p
					class="shrink-0 text-[128px] font-bold leading-none tabular-nums"
					style={{
						color: team.isWinner ? palette.accentTextLarge : palette.fg,
					}}
				>
					{team.points}
				</p>
			) : null}
		</div>
	);
}

function MetaBlock({
	label,
	value,
	palette,
}: {
	label: string;
	value: string;
	palette: Palette;
}) {
	return (
		<div class="min-w-0">
			<p
				class="text-[26px] font-bold uppercase tracking-widest"
				style={{ color: palette.mutedFg }}
			>
				{label}
			</p>
			<p class="mt-[8px] text-[40px] font-bold uppercase wrap-break-word">
				{value}
			</p>
		</div>
	);
}

export default function MatchStory({
	status,
	local,
	visiting,
	dateLabel,
	timeLabel,
	venue,
	weekLabel,
	tournamentLabel,
	siteLabel,
	fileName,
}: Props) {
	const [theme, setTheme] = useState<StoryTheme>("dark");
	const [accent, setAccent] = useState(DEFAULT_ACCENT);
	const [isExporting, setIsExporting] = useState(false);
	const [canShareFiles, setCanShareFiles] = useState(false);

	const $frame = useRef<HTMLDivElement>(null);
	const $story = useRef<HTMLDivElement>(null);
	/** Incrustar las fuentes es lo más caro del export; se reutiliza entre descargas. */
	const fontCss = useRef<string | null>(null);

	const palette = useMemo(() => buildPalette(theme, accent), [theme, accent]);
	const showScore = status !== "upcoming";
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

	const share = useCallback(async () => {
		setIsExporting(true);
		try {
			const dataUrl = await renderPng();
			const blob = await (await fetch(dataUrl)).blob();
			const file = new File([blob], fileName, { type: "image/png" });

			if (!navigator.canShare?.({ files: [file] })) {
				throw new Error("Compartir no disponible");
			}

			await navigator.share({ files: [file], title: tournamentLabel });
		} catch (error) {
			// Cancelar el diálogo nativo lanza AbortError; no es un fallo que reportar.
			if ((error as Error)?.name !== "AbortError") {
				toast.error("No se pudo compartir la imagen");
			}
		} finally {
			setIsExporting(false);
		}
	}, [fileName, renderPng, tournamentLabel]);

	return (
		<div class="flex flex-col gap-6">
			<div class="flex flex-wrap items-center justify-between gap-3">
				<h2 class="font-mono text-xl font-bold uppercase tracking-wider">
					Para compartir
				</h2>

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
			</div>

			<fieldset>
				<legend class="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
					Color institucional
				</legend>
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

			<div class="mx-auto w-full max-w-[360px]">
				<div
					ref={$frame}
					class="relative w-full overflow-hidden rounded-md shadow-xs"
					style={{ aspectRatio: `${STORY_WIDTH} / ${STORY_HEIGHT}` }}
				>
					<div
						ref={$story}
						class="absolute top-0 left-0 flex origin-top-left flex-col font-mono"
						style={{
							width: `${STORY_WIDTH}px`,
							height: `${STORY_HEIGHT}px`,
							transform: "scale(var(--story-scale, 1))",
							background: palette.bg,
							color: palette.fg,
						}}
					>
						{/* Margen superior amplio: la UI de Stories tapa la franja de arriba. */}
						<div class="px-[72px] pt-[104px]">
							<div class="flex items-start justify-between gap-[32px]">
								<p class="text-[46px] font-bold uppercase leading-[1.05]">
									Are We
									<br />
									Playing?
								</p>
								<p
									class="max-w-[420px] text-right text-[26px] font-bold uppercase tracking-widest"
									style={{ color: palette.mutedFg }}
								>
									{tournamentLabel}
								</p>
							</div>

							<span
								class="mt-[56px] inline-block rounded-[14px] px-[28px] py-[14px] text-[28px] font-bold uppercase tracking-widest"
								style={{
									background: palette.primary,
									color: palette.primaryFg,
								}}
							>
								{STATUS_BADGE[status]}
							</span>
						</div>

						<div class="flex flex-1 flex-col justify-center px-[72px]">
							<div class="flex flex-col gap-[48px]">
								<TeamRow team={local} palette={palette} showScore={showScore} />

								<div class="flex items-center gap-[28px]">
									<span
										class="h-[3px] flex-1"
										style={{ background: palette.line }}
									/>
									<span
										class="text-[34px] font-bold uppercase tracking-widest"
										style={{ color: palette.mutedFg }}
									>
										vs
									</span>
									<span
										class="h-[3px] flex-1"
										style={{ background: palette.line }}
									/>
								</div>

								<TeamRow
									team={visiting}
									palette={palette}
									showScore={showScore}
								/>
							</div>
						</div>

						{/* Igual abajo: la barra de "enviar mensaje" de Stories come ~200px. */}
						<div class="px-[72px] pb-[120px]">
							<div
								class="rounded-[24px] p-[48px]"
								style={{ background: palette.surface }}
							>
								<div class="grid grid-cols-2 gap-[40px]">
									<MetaBlock
										label="Fecha"
										value={dateLabel}
										palette={palette}
									/>
									<MetaBlock
										label="Hora"
										value={`${timeLabel} hrs`}
										palette={palette}
									/>
								</div>
								<div class="mt-[40px]">
									<MetaBlock label="Sede" value={venue} palette={palette} />
								</div>
							</div>

							<div class="mt-[40px] flex items-center justify-between gap-[24px]">
								<p
									class="text-[28px] font-bold uppercase tracking-widest"
									style={{ color: palette.mutedFg }}
								>
									{weekLabel}
								</p>
								<p
									class="text-[28px] font-bold uppercase tracking-widest"
									style={{ color: palette.accentTextSmall }}
								>
									{siteLabel}
								</p>
							</div>
						</div>
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
						onClick={share}
						disabled={isExporting}
						class="inline-flex cursor-pointer items-center gap-2 rounded-md bg-surface px-4 py-2.5 text-sm font-bold uppercase tracking-wider shadow-xs transition-colors duration-150 hover:bg-surface-hover focus-visible:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
					>
						<Share2 class="size-4" aria-hidden="true" />
						Compartir
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
	);
}
