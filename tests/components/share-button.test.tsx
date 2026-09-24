// @vitest-environment happy-dom
import {
	cleanup,
	fireEvent,
	render,
	screen,
	waitFor,
} from "@testing-library/preact";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import ShareButton from "@/components/share-button";
import { toast } from "./toast-mock";

vi.mock("sonner", async () => ({
	toast: (await import("./toast-mock")).toast,
}));

beforeEach(() => {
	toast.success.mockClear();
	toast.error.mockClear();
	window.history.replaceState(null, "", "/division-i-varonil/teams/uv");
});
afterEach(cleanup);

const click = () =>
	fireEvent.click(screen.getByRole("button", { name: "Compartir" }));

test("con Web Share comparte título, texto y la URL actual", async () => {
	const share = vi.fn().mockResolvedValue(undefined);
	vi.stubGlobal("navigator", { ...navigator, share });
	render(<ShareButton title="UV" text="Partidos de UV" />);

	click();
	await waitFor(() => expect(share).toHaveBeenCalled());
	expect(share).toHaveBeenCalledWith({
		title: "UV",
		text: "Partidos de UV",
		url: `${window.location.origin}/division-i-varonil/teams/uv`,
	});
	expect(toast.error).not.toHaveBeenCalled();
	expect(toast.success).not.toHaveBeenCalled();
});

test("cerrar el diálogo (AbortError) no es un error", async () => {
	const share = vi.fn().mockRejectedValue(new DOMException("x", "AbortError"));
	vi.stubGlobal("navigator", { ...navigator, share });
	render(<ShareButton title="UV" text="t" />);

	click();
	await waitFor(() => expect(share).toHaveBeenCalled());
	await Promise.resolve();
	expect(toast.error).not.toHaveBeenCalled();
});

test("otro error de Web Share avisa", async () => {
	vi.stubGlobal("navigator", {
		...navigator,
		share: vi.fn().mockRejectedValue(new Error("x")),
	});
	render(<ShareButton title="UV" text="t" />);

	click();
	await waitFor(() =>
		expect(toast.error).toHaveBeenCalledWith("No se pudo compartir"),
	);
});

test("sin Web Share copia el enlace", async () => {
	const writeText = vi.fn().mockResolvedValue(undefined);
	vi.stubGlobal("navigator", { clipboard: { writeText } });
	render(<ShareButton title="UV" text="t" />);

	click();
	await waitFor(() =>
		expect(toast.success).toHaveBeenCalledWith(
			"Enlace copiado al portapapeles",
		),
	);
	expect(writeText).toHaveBeenCalledWith(
		`${window.location.origin}/division-i-varonil/teams/uv`,
	);
});

test("si el portapapeles falla, avisa", async () => {
	vi.stubGlobal("navigator", {
		clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
	});
	render(<ShareButton title="UV" text="t" />);

	click();
	await waitFor(() =>
		expect(toast.error).toHaveBeenCalledWith("No se pudo copiar el enlace"),
	);
});
