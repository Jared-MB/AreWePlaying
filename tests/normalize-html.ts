import { Window } from "happy-dom";

/**
 * Reduce el HTML a lo que ve y usa una persona: texto, enlaces, fechas,
 * encabezados y atributos de accesibilidad. Las clases de Tailwind y los
 * atributos internos de Astro se descartan, así que un cambio de estilo no
 * rompe el snapshot, pero un texto, un enlace o un aria-label distinto sí.
 */
const KEPT_TAGS = new Set([
	"a",
	"article",
	"button",
	"dd",
	"dl",
	"dt",
	"h1",
	"h2",
	"h3",
	"h4",
	"header",
	"img",
	"input",
	"li",
	"main",
	"nav",
	"ol",
	"option",
	"section",
	"select",
	"table",
	"td",
	"th",
	"time",
	"tr",
	"ul",
	"label",
	"astro-island",
]);

const KEPT_ATTRS =
	/^(href|datetime|role|id|for|alt|src|title|target|rel|name|value|selected|disabled|hidden|client|aria-[\w-]+|data-(active|scroll-to-favorite))$/;

const SKIPPED_TAGS = new Set(["script", "style", "template", "svg"]);

export function normalizeHtml(html: string): string {
	const window = new Window();
	window.document.body.innerHTML = html;
	const lines: string[] = [];

	const walk = (node: Node, depth: number) => {
		for (const child of node.childNodes) {
			if (child.nodeType === 3) {
				const text = child.textContent?.replace(/\s+/g, " ").trim();
				if (text) lines.push(`${"  ".repeat(depth)}"${text}"`);
				continue;
			}
			if (child.nodeType !== 1) continue;

			const el = child as Element;
			const tag = el.tagName.toLowerCase();
			if (SKIPPED_TAGS.has(tag)) continue;

			if (!KEPT_TAGS.has(tag)) {
				const srOnly = el.classList.contains("sr-only");
				if (srOnly) lines.push(`${"  ".repeat(depth)}[sr-only]`);
				walk(el, srOnly ? depth + 1 : depth);
				continue;
			}

			const attrs = [...el.attributes]
				.filter((a) => KEPT_ATTRS.test(a.name))
				// Los ids de <select> llevan un UUID aleatorio.
				.map((a) =>
					a.name === "id" && /[0-9a-f]{8}-[0-9a-f]{4}-/.test(a.value)
						? `${a.name}=<uuid>`
						: `${a.name}=${JSON.stringify(a.value)}`,
				)
				.sort();
			lines.push(`${"  ".repeat(depth)}<${[tag, ...attrs].join(" ")}>`);
			walk(el, depth + 1);
		}
	};

	walk(window.document.body as unknown as Node, 0);
	window.close();
	return `\n${lines.join("\n")}\n`;
}
