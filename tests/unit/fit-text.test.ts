import { expect, test } from "vitest";
import { fitText } from "@/og/fit-text";

const LONG_VENUE =
	"Gimnasio Auditorio de Usos Múltiples de la Universidad Michoacana de San Nicolás Hidalgo";

test("cabe al tamaño más grande", () => {
	expect(fitText("UV", { width: 400, sizes: [64, 48, 32], lines: 1 })).toEqual({
		text: "UV",
		fontSize: 64,
	});
});

test("baja de tamaño hasta que cabe en las líneas pedidas", () => {
	// 400 / (64·0.6) = 10 caracteres por línea; a 48 son 13.
	expect(
		fitText("UP MÉXICO CAMPUS", { width: 400, sizes: [64, 48, 32], lines: 2 }),
	).toEqual({ text: "UP MÉXICO\nCAMPUS", fontSize: 64 });
	expect(
		fitText("UNIVERSIDAD DEL VALLE DE MÉXICO", {
			width: 400,
			sizes: [64, 48, 32],
			lines: 2,
		}),
	).toMatchInlineSnapshot(`
		{
		  "fontSize": 32,
		  "text": "UNIVERSIDAD DEL
		VALLE DE MÉXICO",
		}
	`);
});

test("parte palabras más largas que la línea", () => {
	expect(
		fitText("INTERAMERICANA", { width: 240, sizes: [40], lines: 3 }),
	).toEqual({ text: "INTERAMERI\nCANA", fontSize: 40 });
});

test("si ni el más chico alcanza, recorta con puntos suspensivos", () => {
	expect(
		fitText(LONG_VENUE, { width: 600, sizes: [28, 22], lines: 1 }),
	).toMatchInlineSnapshot(`
		{
		  "fontSize": 22,
		  "text": "Gimnasio Auditorio de Usos Múltiples de la…",
		}
	`);
	expect(
		fitText("AAAA BBBB CCCC", { width: 60, sizes: [20], lines: 1 }),
	).toEqual({ text: "AAAA…", fontSize: 20 });
});

test("texto vacío", () => {
	expect(fitText("   ", { width: 100, sizes: [20], lines: 1 })).toEqual({
		text: "",
		fontSize: 20,
	});
});
