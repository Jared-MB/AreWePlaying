// @vitest-environment happy-dom
import { cleanup, fireEvent, render, screen } from "@testing-library/preact";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import FavoriteButton from "@/components/favorite-button";
import { toast, toastText } from "./toast-mock";

vi.mock("sonner", async () => ({
	toast: (await import("./toast-mock")).toast,
}));

beforeEach(() => {
	window.localStorage.clear();
	toast.mockClear();
	toast.error.mockClear();
});
afterEach(cleanup);

const button = () => screen.getByRole("button");

test("arranca apagado sin favoritos", async () => {
	render(<FavoriteButton id="t-1" />);
	expect(button().getAttribute("data-active")).toBe("false");
	expect(button().title).toBe("Agregar a favoritos");
	expect(button().textContent).toBe("Agregar a favoritos");
});

test("arranca encendido si el id ya estaba guardado", async () => {
	window.localStorage.setItem("favorites", JSON.stringify(["t-0", "t-1"]));
	render(<FavoriteButton id="t-1" />);
	expect(button().getAttribute("data-active")).toBe("true");
	expect(button().title).toBe("Quitar de favoritos");
});

test("agregar y quitar conserva a los demás favoritos y avisa", async () => {
	window.localStorage.setItem("favorites", JSON.stringify(["t-0"]));
	render(<FavoriteButton id="t-1" />);

	fireEvent.click(button());
	expect(JSON.parse(window.localStorage.getItem("favorites") ?? "")).toEqual([
		"t-0",
		"t-1",
	]);
	expect(toastText(toast.mock.calls[0])).toBe("Se agregó a favoritos");
	expect(button().getAttribute("data-active")).toBe("true");

	fireEvent.click(button());
	expect(JSON.parse(window.localStorage.getItem("favorites") ?? "")).toEqual([
		"t-0",
	]);
	expect(toastText(toast.mock.calls[1])).toBe("Se quitó de favoritos");
	expect(button().getAttribute("data-active")).toBe("false");
});

test("relee el almacenamiento al hacer clic (otra pestaña pudo cambiarlo)", async () => {
	render(<FavoriteButton id="t-1" />);
	// Otra pestaña lo agregó después de montar.
	window.localStorage.setItem("favorites", JSON.stringify(["t-1"]));

	fireEvent.click(button());
	expect(JSON.parse(window.localStorage.getItem("favorites") ?? "")).toEqual(
		[],
	);
	expect(toastText(toast.mock.calls[0])).toBe("Se quitó de favoritos");
});

test("si no se puede guardar, avisa y no cambia el estado", async () => {
	render(<FavoriteButton id="t-1" />);
	vi.spyOn(window.localStorage, "setItem").mockImplementation(() => {
		throw new DOMException("full", "QuotaExceededError");
	});

	fireEvent.click(button());
	expect(toast.error).toHaveBeenCalledWith(
		"No se pudo guardar el favorito en este navegador",
	);
	expect(toast).not.toHaveBeenCalled();
	expect(button().getAttribute("data-active")).toBe("false");
});
