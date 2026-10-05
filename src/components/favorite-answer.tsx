import { LOCAL_STORAGE_SEEN_RESULTS_KEY } from "@/constants/local-storage";
import {
	type Answer,
	getNewResults,
	markResultsSeen,
	type NewResult,
	resolveAnswer,
	type TeamAnswer,
} from "@/utils/favorite-answer";
import { readFavorites } from "@/utils/favorites";
import { formatLeagueSchedule } from "@/utils/league-date";
import { ArrowRight, Star } from "lucide-preact";
import { createPortal } from "preact/compat";
import { useEffect, useState } from "preact/hooks";

/** Contenedor estático debajo del H1 donde se pinta el detalle de la respuesta. */
export const FAVORITE_ANSWER_DETAIL_ID = "favorite-answer-detail";
/**
 * <script type="application/json"> con las respuestas por equipo. Va aparte y
 * no como prop de la isla: serializadas como atributo pesaban el triple.
 */
export const TEAM_ANSWERS_DATA_ID = "team-answers";

const MINUTE = 60 * 1000;

const STAMP_IN =
	"motion-safe:animate-[stamp-in_260ms_cubic-bezier(0.16,1,0.3,1)_both]";

/**
 * El "Yes!!" se queda en inglés porque contesta a la pregunta de la marca (y
 * así lo dicen también las páginas de torneo); lo demás va en español.
 */
const WORD: Record<Answer["kind"], { text: string; lang?: string }> = {
	live: { text: "Yes!!", lang: "en" },
	today: { text: "Yes!!", lang: "en" },
	tomorrow: { text: "¡Mañana!" },
	later: { text: "Aún no" },
	idle: { text: "Por ahora no" },
};

/** Cada sello cae un poco chueco, como puesto a mano. */
const STAMP_TILT = ["-rotate-2", "rotate-1", "-rotate-1"];

function readSeen(): Record<string, number> {
	try {
		const parsed: unknown = JSON.parse(
			window.localStorage.getItem(LOCAL_STORAGE_SEEN_RESULTS_KEY) || "{}",
		);
		return parsed && typeof parsed === "object" && !Array.isArray(parsed)
			? Object.fromEntries(
					Object.entries(parsed).filter(([, v]) => typeof v === "number"),
				)
			: {};
	} catch {
		return {};
	}
}

function writeSeen(seen: Record<string, number>) {
	try {
		window.localStorage.setItem(
			LOCAL_STORAGE_SEEN_RESULTS_KEY,
			JSON.stringify(seen),
		);
	} catch {
		// Sin almacenamiento el sello vuelve a caer en cada visita; no pasa nada.
	}
}

function readAnswers(): Record<string, TeamAnswer> {
	try {
		return JSON.parse(
			document.getElementById(TEAM_ANSWERS_DATA_ID)?.textContent || "{}",
		);
	} catch {
		return {};
	}
}

function describeWhen(answer: Exclude<Answer, { kind: "idle" }>) {
	const { day, time } = formatLeagueSchedule(answer.match.startsAt);

	switch (answer.kind) {
		case "live":
			return "Ya empezó";
		case "today":
			return `Hoy a las ${time}`;
		case "tomorrow":
			return `Mañana a las ${time}`;
		case "later":
			return `Faltan ${answer.days} días · ${day}`;
	}
}

function AnswerDetail({ answer }: { answer: Answer }) {
	if (answer.kind === "idle") {
		return (
			<p className="text-sm text-muted-foreground text-pretty">
				Tus equipos no tienen partidos programados por ahora.
			</p>
		);
	}

	return (
		<p className="min-w-0">
			<a
				href={answer.match.href}
				className="group inline-flex max-w-full items-center gap-2 text-sm font-bold uppercase tracking-wide touch-hitbox"
			>
				<Star
					className="size-4 shrink-0 fill-favorite-strong text-favorite-strong"
					aria-hidden="true"
				/>
				<span className="min-w-0 text-pretty underline decoration-primary decoration-2 underline-offset-4 group-hover:decoration-4">
					<span className="tabular-nums">{describeWhen(answer)}</span>
					{" · "}
					{answer.team} <span className="text-muted-foreground">vs</span>{" "}
					{answer.match.opponent}
					{answer.kind === "live" ? (
						<span className="font-normal normal-case text-muted-foreground">
							{" "}
							(sin marcador en vivo)
						</span>
					) : null}
				</span>
				<ArrowRight
					className="size-4 shrink-0 motion-safe:transition-transform group-hover:translate-x-0.5"
					aria-hidden="true"
				/>
			</a>
		</p>
	);
}

function ResultStamp({ result, index }: { result: NewResult; index: number }) {
	const isWin = result.points > result.opponentPoints;

	return (
		<li
			className={`${STAMP_TILT[index % STAMP_TILT.length]} ${result.isFresh ? STAMP_IN : ""}`}
			// Caen después de la respuesta, uno tras otro.
			style={
				result.isFresh
					? { animationDelay: `${300 + index * 140}ms` }
					: undefined
			}
		>
			<a
				href={result.href}
				className="group flex items-center gap-3 rounded-sm bg-surface py-1.5 pr-3 pl-1.5 ring-1 ring-line/45 transition-[background-color] hover:bg-surface-hover"
			>
				<span
					className={`stamp-ink shrink-0 px-2.5 py-1 text-xs font-bold uppercase tracking-[0.3em] text-inverse-foreground ${isWin ? "bg-primary" : "bg-inverse"}`}
				>
					{isWin ? "Victoria" : "Derrota"}
				</span>
				<span className="flex min-w-0 flex-wrap items-baseline gap-x-2 text-xs font-bold uppercase tracking-wide">
					<span className="break-words">{result.team}</span>
					<span className="whitespace-nowrap font-pixel text-xl leading-none tabular-nums">
						{result.points}–{result.opponentPoints}
					</span>
					<span className="break-words text-muted-foreground">
						<span className="sr-only">contra </span>
						<span aria-hidden="true">vs </span>
						{result.opponent}
					</span>
				</span>
			</a>
		</li>
	);
}

function NewResults({ results }: { results: NewResult[] }) {
	if (results.length === 0) return null;

	return (
		<section
			aria-labelledby="new-results"
			className="flex flex-wrap items-center gap-x-4 gap-y-3"
		>
			<h2
				id="new-results"
				className="text-xs font-bold uppercase tracking-wider text-muted-foreground"
			>
				Desde tu última visita
			</h2>
			{/* biome-ignore lint/a11y/noRedundantRoles: sin bullets Safari deja de anunciar la lista */}
			<ul role="list" className="flex flex-wrap gap-3">
				{results.map((result, index) => (
					<ResultStamp key={result.matchId} result={result} index={index} />
				))}
			</ul>
		</section>
	);
}

/**
 * El nombre del sitio es una pregunta: con favoritos guardados, la portada la
 * contesta para esta persona ("Yes!!", "¡Mañana!", "Aún no") y estampa los
 * resultados que salieron desde su última visita. Sin favoritos no dice nada:
 * la invitación a elegir uno vive en "Tus tickets".
 */
export default function FavoriteAnswer() {
	const [answers, setAnswers] = useState<Record<string, TeamAnswer>>({});
	const [favorites, setFavorites] = useState<string[]>();
	const [results, setResults] = useState<NewResult[]>([]);
	const [now, setNow] = useState(() => Date.now());
	const [detailTarget, setDetailTarget] = useState<HTMLElement | null>(null);

	useEffect(() => {
		const current = Date.now();
		const data = readAnswers();
		const saved = readFavorites();
		const seen = readSeen();
		const fresh = getNewResults(data, saved, seen, current);

		writeSeen(markResultsSeen(seen, fresh, current));
		setAnswers(data);
		setFavorites(saved);
		setResults(fresh);
		setNow(current);
		setDetailTarget(document.getElementById(FAVORITE_ANSWER_DETAIL_ID));

		// La respuesta cambia sola: "Aún no" pasa a "¡Mañana!" y luego a "Yes!!".
		const id = window.setInterval(() => setNow(Date.now()), MINUTE);
		return () => window.clearInterval(id);
	}, []);

	// Mientras no se leen los favoritos se reserva el lugar de la respuesta
	// (sólo si el script de la página vio que hay favoritos), para que el H1 no
	// brinque al hidratar.
	if (!favorites) {
		return (
			<span
				aria-hidden="true"
				className="invisible hidden text-5xl font-bold uppercase md:text-7xl in-data-has-favorites:inline-block"
			>
				Aún no
			</span>
		);
	}

	const answer = resolveAnswer(answers, favorites, now);
	if (!answer) return null;

	const isYes = answer.kind !== "later" && answer.kind !== "idle";

	return (
		<>
			<span
				key={answer.kind}
				lang={WORD[answer.kind].lang}
				className={`inline-block origin-left text-5xl font-bold uppercase md:text-7xl ${STAMP_IN} ${isYes ? "text-primary" : "text-muted-foreground"}`}
			>
				{WORD[answer.kind].text}
			</span>
			{detailTarget
				? createPortal(
						<>
							<AnswerDetail answer={answer} />
							<NewResults results={results} />
						</>,
						detailTarget,
					)
				: null}
		</>
	);
}
