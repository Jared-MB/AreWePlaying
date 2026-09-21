/**
 * Índice slug → entidad. Los datos se regeneran cada noche desde la API de la
 * ABE (scripts/populate.py), así que un equipo nuevo podría chocar con otro ya
 * existente. Si eso pasa preferimos romper el build —y que falle el workflow—
 * antes que publicar el sitio con una página menos y sin avisar.
 */
export function buildSlugMap<T>(
	items: T[],
	getSlug: (item: T) => string,
	describe: (item: T) => string,
	context: string,
): Map<string, T> {
	const map = new Map<string, T>();

	for (const item of items) {
		const slug = getSlug(item);
		const existing = map.get(slug);

		if (existing) {
			throw new Error(
				`Slug duplicado "${slug}" en ${context}: "${describe(existing)}" y "${describe(item)}". Las URLs deben ser únicas.`,
			);
		}

		map.set(slug, item);
	}

	return map;
}
