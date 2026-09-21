// Las fechas de los partidos vienen como "dd/MM/yyyy HH:mm" en hora local de la
// liga, sin zona horaria. Aquí viven las conversiones para poder pintarlas como
// instantes absolutos.
const LEAGUE_TIME_ZONE = "America/Mexico_City";

// Crear un Intl.DateTimeFormat no es barato y estas fechas se recorren por
// miles, así que se reutiliza.
const partsFormatter = new Intl.DateTimeFormat("en-US", {
	timeZone: LEAGUE_TIME_ZONE,
	hour12: false,
	year: "numeric",
	month: "2-digit",
	day: "2-digit",
	hour: "2-digit",
	minute: "2-digit",
	second: "2-digit",
});

/** Diferencia (ms) entre la hora de la liga y UTC en un instante dado. */
function getLeagueOffset(instant: number) {
	const parts = partsFormatter.formatToParts(instant);

	const get = (type: Intl.DateTimeFormatPartTypes) =>
		Number(parts.find((p) => p.type === type)?.value);

	const asUtc = Date.UTC(
		get("year"),
		get("month") - 1,
		get("day"),
		get("hour") % 24,
		get("minute"),
		get("second"),
	);

	return asUtc - instant;
}

const epochCache = new Map<string, number>();

/**
 * Convierte "dd/MM/yyyy HH:mm" (hora de la liga) al instante absoluto en ms,
 * para que la fecha sea correcta desde cualquier zona horaria.
 */
function leagueDateToEpoch(value: string) {
	const cached = epochCache.get(value);
	if (cached !== undefined) return cached;

	const [day, time = "00:00"] = value.split(" ");
	const [dd, mm, yyyy] = day.split("/").map(Number);
	const [hh, min] = time.split(":").map(Number);

	const guess = Date.UTC(yyyy, mm - 1, dd, hh, min);
	// Dos pasadas: la primera usa el offset del instante equivocado, la segunda
	// ya cae del lado correcto de un cambio de horario.
	const offset = getLeagueOffset(guess - getLeagueOffset(guess));
	const epoch = guess - offset;

	epochCache.set(value, epoch);
	return epoch;
}

/**
 * "dd/MM/yyyy HH:mm" (hora de la liga) → ISO 8601 absoluto, para el atributo
 * `datetime` de <time>. Devuelve undefined si la fecha no se puede interpretar,
 * para no pintar un atributo inválido.
 */
export function toISODateTime(value: string) {
	const epoch = leagueDateToEpoch(value);
	return Number.isFinite(epoch) ? new Date(epoch).toISOString() : undefined;
}
