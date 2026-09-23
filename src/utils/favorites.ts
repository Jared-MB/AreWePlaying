import { LOCAL_STORAGE_FAVORITES_KEY } from "@/constants/local-storage";

/**
 * IDs de los equipos favoritos. localStorage puede estar bloqueado (modo
 * privado, cookies apagadas) o traer basura escrita a mano: en cualquier caso
 * se trata como "sin favoritos" en vez de tumbar la isla.
 */
export function readFavorites(): string[] {
	try {
		const parsed: unknown = JSON.parse(
			window.localStorage.getItem(LOCAL_STORAGE_FAVORITES_KEY) || "[]",
		);

		return Array.isArray(parsed)
			? parsed.filter((id): id is string => typeof id === "string")
			: [];
	} catch {
		return [];
	}
}

/** Devuelve false si no se pudo guardar (almacenamiento bloqueado o lleno). */
export function writeFavorites(favorites: string[]): boolean {
	try {
		window.localStorage.setItem(
			LOCAL_STORAGE_FAVORITES_KEY,
			JSON.stringify(favorites),
		);
		return true;
	} catch {
		return false;
	}
}
