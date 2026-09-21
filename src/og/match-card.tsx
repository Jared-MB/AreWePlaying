import { type Palette, STATUS_BADGE, type StoryTeam } from "@/constants/story";
import type { MatchCard } from "@/utils/get-match-card";
import { fitText } from "./fit-text";

/**
 * Tarjeta social 1200×630 del partido. La dibuja satori, así que sólo entiende
 * flexbox con estilos en línea: nada de Tailwind, de `grid` ni de unidades
 * relativas. Es la versión horizontal de la story 9:16 de `match-story.tsx`, con
 * la que comparte paleta y etiquetas (`@/constants/story`).
 */

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

const PADDING = 56;
const LOGO = 128;
const LOGO_GAP = 28;

/** Ancho útil de cada columna de equipo, con el "VS" al centro. */
const COLUMN = 430;
/** Lo que le queda al nombre una vez descontado el escudo. */
const NAME_WIDTH = COLUMN - LOGO - LOGO_GAP;

/** Anchos fijos de la fila Fecha / Hora / Sede, dentro de su caja. */
const META_GAP = 40;
const META_DATE = 230;
const META_TIME = 190;
const META_VENUE =
	OG_WIDTH - PADDING * 2 - 28 * 2 - META_DATE - META_TIME - META_GAP * 2;

function Team({
	team,
	palette,
	showScore,
	align,
}: {
	team: StoryTeam;
	palette: Palette;
	showScore: boolean;
	/** El equipo local mira a la izquierda y el visitante a la derecha. */
	align: "left" | "right";
}) {
	// Un partido por jugarse puede no traer posición ni récord todavía.
	const meta = [team.position, team.record].filter(Boolean).join(" · ");
	// Sin marcador sobra alto, así que cabe una línea más antes de recortar:
	// "Universidad La Salle Nezahualcóyotl" se salva entero.
	const name = fitText(team.name, {
		width: NAME_WIDTH,
		sizes: [44, 36, 30],
		lines: showScore ? 2 : 3,
	});

	return (
		<div
			style={{
				display: "flex",
				flexDirection: align === "left" ? "row" : "row-reverse",
				alignItems: "center",
				gap: LOGO_GAP,
				width: COLUMN,
			}}
		>
			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "center",
					width: LOGO,
					height: LOGO,
					flexShrink: 0,
					borderRadius: 64,
					border: `3px solid ${palette.line}`,
					background: team.logo ? "#FFFFFF" : palette.primary,
				}}
			>
				{team.logo ? (
					<img src={team.logo} width={104} height={104} alt="" />
				) : (
					<span
						style={{ fontSize: 40, fontWeight: 700, color: palette.primaryFg }}
					>
						{team.initials}
					</span>
				)}
			</div>

			<div
				style={{
					display: "flex",
					flexDirection: "column",
					alignItems: align === "left" ? "flex-start" : "flex-end",
					minWidth: 0,
					flex: 1,
				}}
			>
				<span
					style={{
						fontSize: name.fontSize,
						fontWeight: 700,
						lineHeight: 1.08,
						textTransform: "uppercase",
						textAlign: align,
						whiteSpace: "pre-line",
					}}
				>
					{name.text}
				</span>

				{meta ? (
					<span
						style={{
							marginTop: 10,
							fontSize: 22,
							letterSpacing: 1,
							textTransform: "uppercase",
							color: palette.mutedFg,
						}}
					>
						{meta}
					</span>
				) : null}

				{showScore ? (
					<span
						style={{
							marginTop: 6,
							fontSize: 84,
							fontWeight: 700,
							lineHeight: 1,
							color: team.isWinner ? palette.accentTextLarge : palette.fg,
						}}
					>
						{team.points}
					</span>
				) : null}
			</div>
		</div>
	);
}

function Meta({
	label,
	value,
	palette,
	width,
}: {
	label: string;
	value: string;
	palette: Palette;
	width: number;
}) {
	const fitted = fitText(value, { width, sizes: [30, 26], lines: 2 });

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				width,
			}}
		>
			<span
				style={{
					fontSize: 20,
					fontWeight: 700,
					letterSpacing: 2,
					textTransform: "uppercase",
					color: palette.mutedFg,
				}}
			>
				{label}
			</span>
			<span
				style={{
					marginTop: 6,
					fontSize: fitted.fontSize,
					fontWeight: 700,
					textTransform: "uppercase",
					whiteSpace: "pre-line",
				}}
			>
				{fitted.text}
			</span>
		</div>
	);
}

export function MatchOgCard({
	card,
	palette,
	siteLabel,
}: {
	card: MatchCard;
	palette: Palette;
	siteLabel: string;
}) {
	const showScore = card.status !== "upcoming";

	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				justifyContent: "space-between",
				width: OG_WIDTH,
				height: OG_HEIGHT,
				padding: PADDING,
				background: palette.bg,
				color: palette.fg,
				fontFamily: "Space Mono",
			}}
		>
			<div style={{ display: "flex", flexDirection: "column" }}>
				<div
					style={{
						display: "flex",
						alignItems: "flex-start",
						justifyContent: "space-between",
						gap: 32,
					}}
				>
					<span
						style={{
							fontSize: 34,
							fontWeight: 700,
							lineHeight: 1.05,
							textTransform: "uppercase",
							whiteSpace: "pre-line",
						}}
					>
						{"Are We\nPlaying?"}
					</span>

					<span
						style={{
							maxWidth: 420,
							fontSize: 20,
							fontWeight: 700,
							letterSpacing: 2,
							textAlign: "right",
							textTransform: "uppercase",
							color: palette.mutedFg,
						}}
					>
						{card.tournamentLabel}
					</span>
				</div>

				<div style={{ display: "flex", marginTop: 20 }}>
					<span
						style={{
							padding: "10px 22px",
							borderRadius: 12,
							fontSize: 20,
							fontWeight: 700,
							letterSpacing: 2,
							textTransform: "uppercase",
							background: palette.primary,
							color: palette.primaryFg,
						}}
					>
						{STATUS_BADGE[card.status]}
					</span>
				</div>
			</div>

			<div
				style={{
					display: "flex",
					alignItems: "center",
					justifyContent: "space-between",
					gap: 24,
				}}
			>
				<Team
					team={card.local}
					palette={palette}
					showScore={showScore}
					align="left"
				/>

				<span
					style={{
						fontSize: 28,
						fontWeight: 700,
						letterSpacing: 3,
						textTransform: "uppercase",
						color: palette.mutedFg,
					}}
				>
					vs
				</span>

				<Team
					team={card.visiting}
					palette={palette}
					showScore={showScore}
					align="right"
				/>
			</div>

			<div style={{ display: "flex", flexDirection: "column" }}>
				<div
					style={{
						display: "flex",
						gap: META_GAP,
						padding: 28,
						borderRadius: 20,
						background: palette.surface,
					}}
				>
					<Meta
						label="Fecha"
						value={card.dateLabel}
						palette={palette}
						width={META_DATE}
					/>
					<Meta
						label="Hora"
						value={`${card.timeLabel} hrs`}
						palette={palette}
						width={META_TIME}
					/>
					<Meta
						label="Sede"
						value={card.venue}
						palette={palette}
						width={META_VENUE}
					/>
				</div>

				<div
					style={{
						display: "flex",
						alignItems: "center",
						justifyContent: "space-between",
						marginTop: 24,
						gap: 24,
					}}
				>
					<span
						style={{
							fontSize: 20,
							fontWeight: 700,
							letterSpacing: 2,
							textTransform: "uppercase",
							color: palette.mutedFg,
						}}
					>
						{card.weekLabel}
					</span>
					<span
						style={{
							fontSize: 20,
							fontWeight: 700,
							letterSpacing: 2,
							textTransform: "uppercase",
							color: palette.accentTextSmall,
						}}
					>
						{siteLabel}
					</span>
				</div>
			</div>
		</div>
	);
}
