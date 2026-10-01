import { LOGO_BACKGROUNDS } from "virtual:logo-backgrounds";

/**
 * El color de fondo de un escudo cuadrado (esquinas opacas y del mismo color),
 * para pintar el círculo con él y fundir las esquinas hacia ese color en vez de
 * hacia blanco. Escudos transparentes o con fondo blanco devuelven null.
 *
 * Se calcula en build (ver `src/vite/logo-backgrounds.ts`): aquí sólo se busca.
 */
export function getLogoBackground(logo: string | null): string | null {
	return logo ? (LOGO_BACKGROUNDS[logo] ?? null) : null;
}
