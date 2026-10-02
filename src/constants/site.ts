// Base absoluta del sitio: la consume astro.config.ts (`site`) para las URLs
// canónicas y sociales, y las vistas que muestran el dominio (p. ej. la tarjeta
// 9:16 del detalle de partido).
//
// El dominio principal en Vercel es `www`: el apex responde 308 hacia él, así
// que una canónica o una og:image en el apex costaban una redirección extra.
// Para mostrarlo como texto se usa sin `www`, que es como se escribe.
export const SITE_HOST = "areweplaying.com";
export const SITE_URL = `https://www.${SITE_HOST}`;

// Enlaces que aparecen en más de un lugar (pie de página y la página "Acerca de").
export const REPO_URL = "https://github.com/Jared-MB/AreWePlaying";
export const ABE_URL = "https://www.abemexico.org/";

// Canales de contacto para avisos de retiro (los muestra "Acerca de" y los
// repite el User-Agent con el que scripts/populate.py consulta el API).
export const CONTACT_EMAIL = "contacto@areweplaying.com";
export const ISSUES_URL = `${REPO_URL}/issues`;
