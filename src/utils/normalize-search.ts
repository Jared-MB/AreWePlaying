/** "ANÁHUAC  Norte " → "anahuac norte": sin acentos, en minúsculas y sin espacios de sobra. */
export function normalizeSearch(text: string) {
	return text
		.normalize("NFD")
		.replace(/\p{Diacritic}/gu, "")
		.toLowerCase()
		.replace(/\s+/g, " ")
		.trim();
}
