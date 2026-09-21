// Base absoluta del sitio: la consume astro.config.ts (`site`) para las URLs
// canónicas y sociales, y las vistas que muestran el dominio (p. ej. la tarjeta
// 9:16 del detalle de partido).
export const SITE_URL = "https://areweplaying.com";

// Mismo dominio sin protocolo, para mostrarlo como texto.
export const SITE_HOST = new URL(SITE_URL).host;

// Enlaces que aparecen en más de un lugar (pie de página y la página "Acerca de").
export const REPO_URL = "https://github.com/Jared-MB/AreWePlaying";
export const ABE_URL = "https://www.abemexico.org/";

// Canales de contacto para avisos de retiro (los muestra "Acerca de" y los
// repite el User-Agent con el que scripts/populate.py consulta el API).
export const CONTACT_EMAIL = "amunozbaez669@gmail.com";
export const ISSUES_URL = `${REPO_URL}/issues`;
