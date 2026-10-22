import { ABE_URL } from "@/constants/site";
import type { Match } from "@/types/match";
import type { Tournament } from "@/types/tournament";
import { getTournamentLabel } from "./get-match-card";
import { toISODateTime } from "./league-date";

export const SITE_NAME = "Are We Playing?";

export const DEFAULT_DESCRIPTION =
	"Calendario y resultados de la liga ABE de básquetbol universitario: partidos de cada jornada, tabla de posiciones y próximos juegos de cada equipo.";

/** Describe /og.png, la imagen social por defecto, para lectores de pantalla. */
export const DEFAULT_IMAGE_ALT =
	"Are We Playing? Yes!! Calendario de partidos de la liga ABE, jornada por jornada.";

/** "Tabla de posiciones · División I · Femenil | Are We Playing?" */
export function pageTitle(...parts: string[]) {
	return [parts.filter(Boolean).join(" · "), SITE_NAME]
		.filter(Boolean)
		.join(" | ");
}

/**
 * "División I Femenil" o "División II Varonil Centro": la forma en que se
 * escribe en un buscador, sin los separadores de getTournamentLabel.
 */
export function getTournamentSearchLabel(tournament: Tournament) {
	return getTournamentLabel(tournament).replaceAll(" · ", " ");
}

// Palabras que van en minúscula dentro de un nombre propio en español.
const LOWERCASE_WORDS = new Set([
	"de",
	"del",
	"la",
	"las",
	"los",
	"y",
	"e",
	"en",
]);

/**
 * "UNIVERSIDAD ANÁHUAC MÉXICO NORTE" → "Universidad Anáhuac México Norte". El
 * API manda los nombres completos en mayúsculas; en un resultado de búsqueda se
 * leen mejor (y no parecen gritar) con mayúscula inicial.
 */
export function toTitleCase(name: string) {
	return name
		.toLocaleLowerCase("es-MX")
		.split(/\s+/)
		.filter(Boolean)
		.map((word, index) =>
			index > 0 && LOWERCASE_WORDS.has(word)
				? word
				: word.charAt(0).toLocaleUpperCase("es-MX") + word.slice(1),
		)
		.join(" ");
}

/**
 * JSON-LD que va dentro de un <script>: `<` escapado para que ningún nombre
 * que venga del API pueda cerrar la etiqueta.
 */
export function serializeJsonLd(data: object) {
	return JSON.stringify(data).replaceAll("<", "\\u003c");
}

/** Nombre del sitio en los resultados de Google (WebSite en la portada). */
export function buildWebSiteJsonLd(siteUrl: string) {
	return {
		"@context": "https://schema.org",
		"@type": "WebSite",
		name: SITE_NAME,
		alternateName: "Are We Playing",
		url: siteUrl,
		inLanguage: "es-MX",
		description: DEFAULT_DESCRIPTION,
	};
}

interface TeamRef {
	/** Nombre corto, el que se usa en todo el sitio ("ANÁHUAC NORTE"). */
	name: string;
	/** Nombre completo de la universidad, si se conoce. */
	fullName?: string;
	/** URL absoluta de la página del equipo. */
	url: string;
}

function sportsTeam({ name, fullName, url }: TeamRef) {
	return {
		"@type": "SportsTeam",
		name,
		...(fullName && fullName !== name
			? { alternateName: toTitleCase(fullName) }
			: {}),
		url,
		sport: "Basketball",
	};
}

const LEAGUE = {
	"@type": "SportsOrganization",
	name: "Liga ABE",
	url: ABE_URL,
};

/** SportsTeam de schema.org para la página de un equipo. */
export function buildTeamJsonLd({
	tournament,
	logo,
	...team
}: TeamRef & { tournament: Tournament; logo?: string | null }) {
	return {
		"@context": "https://schema.org",
		...sportsTeam(team),
		description: `Equipo de básquetbol de la liga ABE, ${getTournamentLabel(tournament)}.`,
		...(logo ? { logo } : {}),
		memberOf: LEAGUE,
	};
}

interface MatchJsonLdInput {
	match: Match;
	tournament: Tournament;
	/** URL absoluta de la página del partido. */
	url: string;
	/** URL absoluta de la imagen social del partido. */
	image: string;
	/** null si la sede está por definir. */
	venue: string | null;
	venueUrl: string | null;
	home: TeamRef;
	away: TeamRef;
}

/** SportsEvent de schema.org para la página de un partido. */
export function buildMatchJsonLd({
	match,
	tournament,
	url,
	image,
	venue,
	venueUrl,
	home,
	away,
}: MatchJsonLdInput) {
	return {
		"@context": "https://schema.org",
		"@type": "SportsEvent",
		name: `${match.localTeam} vs ${match.visitingTeam}`,
		description: `Partido de básquetbol de la liga ABE, ${getTournamentLabel(tournament)}.`,
		url,
		image,
		sport: "Basketball",
		startDate: toISODateTime(match.date),
		eventStatus: "https://schema.org/EventScheduled",
		eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
		...(venue
			? {
					location: {
						"@type": "Place",
						name: venue,
						address: venue,
						...(venueUrl ? { url: venueUrl } : {}),
					},
				}
			: {}),
		homeTeam: sportsTeam(home),
		awayTeam: sportsTeam(away),
		organizer: LEAGUE,
	};
}
