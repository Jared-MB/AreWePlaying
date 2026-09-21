// Base absoluta del sitio: la consume astro.config.ts (`site`) para las URLs
// canónicas y sociales, y las vistas que muestran el dominio (p. ej. la tarjeta
// 9:16 del detalle de partido).
export const SITE_URL = "https://2025-2026.areweplaying.com";

// Mismo dominio sin protocolo, para mostrarlo como texto.
export const SITE_HOST = new URL(SITE_URL).host;

// Dominio principal: siempre sirve la temporada vigente. Los despliegues de
// temporadas pasadas enlazan aquí para devolver a la gente a lo que está vivo.
export const CURRENT_SEASON_URL = "https://areweplaying.com";
