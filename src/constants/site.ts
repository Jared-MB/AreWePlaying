// Base absoluta del sitio: la consume astro.config.ts (`site`) para las URLs
// canónicas y sociales, y las vistas que muestran el dominio (p. ej. la tarjeta
// 9:16 del detalle de partido).
export const SITE_URL = "https://areweplaying.com";

// Mismo dominio sin protocolo, para mostrarlo como texto.
export const SITE_HOST = new URL(SITE_URL).host;

// Enlaces que aparecen en más de un lugar (pie de página y la página "Acerca de").
export const REPO_URL = "https://github.com/Jared-MB/AreWePlaying";
export const ABE_URL = "https://www.abemexico.org/";
