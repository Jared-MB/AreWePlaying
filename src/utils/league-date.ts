// Las fechas de los partidos vienen como "dd/MM/yyyy HH:mm" en hora local de la
// liga, sin zona horaria. Aquí viven las conversiones para poder compararlas
// contra "hoy" en el servidor y contra el reloj del visitante en el cliente.
export const LEAGUE_TIME_ZONE = "America/Mexico_City";

// Crear un Intl.DateTimeFormat no es barato y estas fechas se recorren por
// miles al armar la próxima jornada, así que se reutilizan.
const dayFormatter = new Intl.DateTimeFormat("es-MX", {
	timeZone: LEAGUE_TIME_ZONE,
	day: "2-digit",
	month: "2-digit",
	year: "numeric",
});

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

const dateTimeFormatter = new Intl.DateTimeFormat("es-MX", {
	timeZone: LEAGUE_TIME_ZONE,
	weekday: "long",
	day: "numeric",
	month: "long",
	hour: "2-digit",
	minute: "2-digit",
	hour12: false,
});

/** Fecha de hoy en la zona horaria de la liga, con el formato dd/MM/yyyy de los partidos. */
export function getLeagueToday(now = new Date()) {
	return dayFormatter.format(now);
}

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
 * para que la cuenta regresiva sea correcta desde cualquier zona horaria.
 */
export function leagueDateToEpoch(value: string) {
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

/** "sábado 26 de septiembre · 18:00", en hora de la liga. */
export function formatLeagueDateTime(epoch: number) {
	const parts = dateTimeFormatter.formatToParts(epoch);
	const value = (type: Intl.DateTimeFormatPartTypes) =>
		parts.find((p) => p.type === type)?.value ?? "";

	const day = `${value("weekday")} ${value("day")} de ${value("month")}`;

	return `${day} · ${value("hour")}:${value("minute")} hrs`;
}

/** "sábado 26 de septiembre", en hora de la liga, a partir de "dd/MM/yyyy". */
export function formatLeagueDay(day: string) {
	const parts = dateTimeFormatter.formatToParts(leagueDateToEpoch(day));
	const value = (type: Intl.DateTimeFormatPartTypes) =>
		parts.find((p) => p.type === type)?.value ?? "";

	return `${value("weekday")} ${value("day")} de ${value("month")}`;
}

/** Ordena fechas "dd/MM/yyyy" cronológicamente sin construir objetos Date. */
export function toSortableDay(day: string) {
	const [dd, mm, yyyy] = day.split("/");
	return `${yyyy}${mm}${dd}`;
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
