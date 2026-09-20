// Base absoluta del sitio: la consume astro.config.ts (`site`) para las URLs
// canónicas y sociales, y las vistas que muestran el dominio (p. ej. la tarjeta
// 9:16 del detalle de partido).
export const SITE_URL = "https://are-we-playing.vercel.app";

// Mismo dominio sin protocolo, para mostrarlo como texto.
export const SITE_HOST = new URL(SITE_URL).host;
