// @vitest-environment happy-dom
import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/preact";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import MatchStory from "@/components/match-story";
import { toast } from "./toast-mock";

vi.mock("sonner", async () => ({
	toast: (await import("./toast-mock")).toast,
}));

const htmlToImage = vi.hoisted(() => ({
	getFontEmbedCSS: vi.fn(),
	toPng: vi.fn(),
}));
vi.mock("html-to-image", () => htmlToImage);

const team = (name: string, points: string, isWinner: boolean) => ({
	name,
	logo: null,
	initials: name.slice(0, 3),
	record: "1-1",
	position: "(2)",
	points,
	isWinner,
});

const props = {
	status: "finished" as const,
	local: team("UP MÉXICO", "76", true),
	visiting: team("UV", "57", false),
	dateLabel: "18 sep 2026",
	timeLabel: "14:00",
	venue: "CENTRO DEPORTIVO COYOACÁN",
	weekLabel: "SEMANA 1",
	tournamentLabel: "División I · Varonil",
	siteLabel: "areweplaying.com",
	fileName: "up-mexico-vs-uv-1.png",
};

const pressed = (name: string) =>
	screen.getByRole("button", { name }).getAttribute("aria-pressed");

beforeEach(() => {
	window.localStorage.clear();
	toast.success.mockClear();
	toast.error.mockClear();
	htmlToImage.getFontEmbedCSS.mockResolvedValue("/* fonts */");
	htmlToImage.toPng.mockResolvedValue("data:image/png;base64,AAAA");
	if (!document.fonts) {
		Object.defineProperty(document, "fonts", {
			value: { ready: Promise.resolve() },
			configurable: true,
		});
	}
});
afterEach(cleanup);

test("por defecto: tema oscuro y acento naranja", () => {
	render(<MatchStory {...props} />);
	expect(pressed("Oscuro")).toBe("true");
	expect(pressed("Claro")).toBe("false");
	expect(pressed("Naranja")).toBe("true");
});

test("restaura tema y acento guardados (el hex se normaliza a mayúsculas)", () => {
	window.localStorage.setItem("story-theme", "light");
	window.localStorage.setItem("story-accent", "#7a1129");
	render(<MatchStory {...props} />);
	expect(pressed("Claro")).toBe("true");
	expect(pressed("Guinda")).toBe("true");
	expect(pressed("Naranja")).toBe("false");
});

test("ignora valores guardados inválidos", () => {
	window.localStorage.setItem("story-theme", "sepia");
	window.localStorage.setItem("story-accent", "rojo");
	render(<MatchStory {...props} />);
	expect(pressed("Oscuro")).toBe("true");
	expect(pressed("Naranja")).toBe("true");
});

test("elegir tema y acento los recuerda", () => {
	render(<MatchStory {...props} />);
	fireEvent.click(screen.getByRole("button", { name: "Claro" }));
	fireEvent.click(screen.getByRole("button", { name: "Azul" }));
	expect(window.localStorage.getItem("story-theme")).toBe("light");
	expect(window.localStorage.getItem("story-accent")).toBe("#1D4ED8");
	expect(pressed("Azul")).toBe("true");
});

test("color libre desde el selector", () => {
	const { container } = render(<MatchStory {...props} />);
	const input = container.querySelector<HTMLInputElement>(
		'input[type="color"]',
	);
	if (!input) throw new Error("sin input de color");
	input.value = "#123456";
	fireEvent.input(input);
	expect(window.localStorage.getItem("story-accent")).toBe("#123456");
	expect(
		screen
			.getAllByRole("button")
			.filter((b) => b.getAttribute("aria-pressed") === "true")
			.map((b) => b.textContent),
	).toEqual(["Oscuro"]);
});

test("la story muestra los datos del partido", () => {
	const { container } = render(<MatchStory {...props} />);
	const text = container.textContent ?? "";
	for (const piece of [
		"UP MÉXICO",
		"UV",
		"76",
		"57",
		"18 sep 2026",
		"14:00 hrs",
		"CENTRO DEPORTIVO COYOACÁN",
		"SEMANA 1",
		"areweplaying.com",
		"Resultado final",
		"PNG 1080 × 1920 px",
	]) {
		expect(text).toContain(piece);
	}
});

test("partido por jugarse no muestra marcador", () => {
	const { container } = render(
		<MatchStory
			{...props}
			status="upcoming"
			local={team("UP MÉXICO", "76", false)}
			visiting={team("UV", "57", false)}
		/>,
	);
	expect(container.textContent).toContain("Próximo partido");
	expect(container.textContent).not.toContain("76");
});

test("descargar genera un PNG 1080×1920 con el nombre de archivo", async () => {
	const click = vi
		.spyOn(HTMLAnchorElement.prototype, "click")
		.mockImplementation(function (this: HTMLAnchorElement) {});
	render(<MatchStory {...props} />);

	fireEvent.click(screen.getByRole("button", { name: /Descargar 9:16/ }));
	await waitFor(() =>
		expect(toast.success).toHaveBeenCalledWith("Imagen descargada"),
	);

	expect(htmlToImage.toPng.mock.calls[0][1]).toMatchObject({
		width: 1080,
		height: 1920,
		pixelRatio: 1,
		fontEmbedCSS: "/* fonts */",
	});
	const link = click.mock.contexts[0] as HTMLAnchorElement;
	expect(link.download).toBe("up-mexico-vs-uv-1.png");
	expect(link.href).toBe("data:image/png;base64,AAAA");
});

test("si falla el render, avisa", async () => {
	htmlToImage.toPng.mockRejectedValue(new Error("canvas"));
	render(<MatchStory {...props} />);
	fireEvent.click(screen.getByRole("button", { name: /Descargar 9:16/ }));
	await waitFor(() =>
		expect(toast.error).toHaveBeenCalledWith("No se pudo generar la imagen"),
	);
});

test("sin soporte para compartir archivos no aparece el botón Compartir", () => {
	render(<MatchStory {...props} />);
	expect(screen.queryByRole("button", { name: /Compartir/ })).toBeNull();
});
