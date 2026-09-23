/**
 * Devuelve la URL sólo si es http(s); si no, null.
 *
 * Los links de la sede vienen tal cual del API de alguien más y se publican
 * cada noche sin revisión: ni Astro ni Preact bloquean `javascript:` en un
 * `href`, así que se filtran aquí. De paso cubre el "-" con el que el API marca
 * una sede por definir.
 */
export function safeHttpUrl(value: string | null | undefined): string | null {
	if (!value) return null;

	try {
		const url = new URL(value.trim());
		return url.protocol === "http:" || url.protocol === "https:"
			? url.href
			: null;
	} catch {
		return null;
	}
}
