/**
 * Convierte un texto a un fragmento de URL legible: sin acentos, sin signos y
 * en minúsculas. Es la base de todas las URLs del sitio, así que cualquier
 * cambio aquí invalida los enlaces ya compartidos.
 */
export const slugify = (value: string) =>
	value
		.normalize("NFD")
		.replace(/[̀-ͯ]/g, "")
		.replace(/[^a-zA-Z0-9]+/g, "-")
		.replace(/^-|-$/g, "")
		.toLowerCase();
