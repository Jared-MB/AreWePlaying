/**
 * Ajuste de texto para la tarjeta social.
 *
 * satori ignora `line-clamp`, y los nombres de equipo y las sedes vienen de la
 * API sin límite de largo ("Gimnasio Auditorio de Usos Múltiples de la
 * Universidad Michoacana de San Nicolás Hidalgo"): sin recortarlos, empujan el
 * pie fuera del lienzo.
 *
 * Space Mono es monoespaciada, así que el ancho se calcula exacto por número de
 * caracteres. El texto se devuelve ya partido en líneas y se pinta con
 * `whiteSpace: "pre-line"`, de modo que el render coincide con el cálculo.
 */

/** Avance de cada glifo en Space Mono, en múltiplos del tamaño de fuente. */
const ADVANCE = 0.6;

const charsPerLine = (width: number, fontSize: number) =>
	Math.max(1, Math.floor(width / (fontSize * ADVANCE)));

/** Corta por palabras, partiendo las que no quepan enteras en una línea. */
function wrap(text: string, perLine: number): string[] {
	const lines: string[] = [];
	let line = "";

	for (const word of text.trim().split(/\s+/)) {
		let rest = word;

		// Una palabra más larga que la línea ("INTERAMERICANA") se parte.
		while (rest.length > perLine) {
			if (line) {
				lines.push(line);
				line = "";
			}
			lines.push(rest.slice(0, perLine));
			rest = rest.slice(perLine);
		}

		if (!line) line = rest;
		else if (line.length + 1 + rest.length <= perLine) line += ` ${rest}`;
		else {
			lines.push(line);
			line = rest;
		}
	}

	if (line) lines.push(line);

	return lines.length > 0 ? lines : [""];
}

export interface FittedText {
	/** Texto ya partido en líneas, para `whiteSpace: "pre-line"`. */
	text: string;
	fontSize: number;
}

/**
 * Elige el mayor tamaño de `sizes` con el que el texto cabe en `lines` líneas.
 * Si ni el más pequeño alcanza, recorta con puntos suspensivos.
 */
export function fitText(
	text: string,
	{ width, sizes, lines }: { width: number; sizes: number[]; lines: number },
): FittedText {
	for (const fontSize of sizes) {
		const rows = wrap(text, charsPerLine(width, fontSize));

		if (rows.length <= lines) return { text: rows.join("\n"), fontSize };
	}

	const fontSize = sizes[sizes.length - 1];
	const perLine = charsPerLine(width, fontSize);
	const rows = wrap(text, perLine).slice(0, lines);
	const last = rows[rows.length - 1];

	rows[rows.length - 1] =
		`${last.length >= perLine ? last.slice(0, perLine - 1) : last}…`;

	return { text: rows.join("\n"), fontSize };
}
