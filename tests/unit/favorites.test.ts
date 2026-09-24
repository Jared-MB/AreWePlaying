// @vitest-environment happy-dom
import { beforeEach, expect, test, vi } from "vitest";
import { LOCAL_STORAGE_FAVORITES_KEY } from "@/constants/local-storage";
import { readFavorites, writeFavorites } from "@/utils/favorites";

beforeEach(() => {
	window.localStorage.clear();
});

test("la llave de localStorage no cambia (perdería los favoritos guardados)", () => {
	expect(LOCAL_STORAGE_FAVORITES_KEY).toBe("favorites");
});

test("ida y vuelta", () => {
	expect(readFavorites()).toEqual([]);
	expect(writeFavorites(["a", "b"])).toBe(true);
	expect(window.localStorage.getItem("favorites")).toBe('["a","b"]');
	expect(readFavorites()).toEqual(["a", "b"]);
});

test.each([
	["no es JSON", []],
	['{"a":1}', []],
	['"a"', []],
	["null", []],
	['["a",1,null,"b",{}]', ["a", "b"]],
	["", []],
])("basura en localStorage %j → %j", (raw, expected) => {
	window.localStorage.setItem("favorites", raw);
	expect(readFavorites()).toEqual(expected);
});

test("almacenamiento bloqueado (acceder a localStorage lanza)", () => {
	vi.spyOn(window, "localStorage", "get").mockImplementation(() => {
		throw new DOMException("blocked", "SecurityError");
	});
	expect(readFavorites()).toEqual([]);
	expect(writeFavorites(["a"])).toBe(false);
});

test("almacenamiento lleno (setItem lanza)", () => {
	vi.spyOn(window.localStorage, "setItem").mockImplementation(() => {
		throw new DOMException("full", "QuotaExceededError");
	});
	expect(writeFavorites(["a"])).toBe(false);
});
