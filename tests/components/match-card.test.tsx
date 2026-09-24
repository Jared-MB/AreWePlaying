// @vitest-environment happy-dom
import { cleanup, render, screen } from "@testing-library/preact";
import { afterEach, beforeEach, expect, test, vi } from "vitest";
import MatchCard from "@/components/match-card";

const confetti = vi.hoisted(() => vi.fn());
vi.mock("canvas-confetti", () => ({ default: confetti }));

let events: (HTMLElement | null)[] = [];
const onFavoriteMatch = (e: Event) =>
	events.push((e as CustomEvent<HTMLElement | null>).detail);

beforeEach(() => {
	window.localStorage.clear();
	confetti.mockClear();
	events = [];
	window.addEventListener("favorite-match", onFavoriteMatch);
	document.body.innerHTML = '<h1 id="are-we-playing" data-active="false"></h1>';
});
afterEach(() => {
	cleanup();
	window.removeEventListener("favorite-match", onFavoriteMatch);
});

const card = () => screen.getByText("contenido").parentElement as HTMLElement;

test("sin favoritos: tarjeta normal, sin confeti ni evento", () => {
	render(
		<MatchCard localTeamId="a" visitingTeamId="b">
			<span>contenido</span>
		</MatchCard>,
	);
	expect(card().getAttribute("data-active")).toBe("false");
	expect(confetti).not.toHaveBeenCalled();
	expect(events).toEqual([]);
});

test.each(["a", "b"])(
	"favorito %s: resalta, celebra y avisa a la página",
	(id) => {
		window.localStorage.setItem("favorites", JSON.stringify([id]));
		render(
			<MatchCard localTeamId="a" visitingTeamId="b">
				<span>contenido</span>
			</MatchCard>,
		);
		expect(card().getAttribute("data-active")).toBe("true");
		expect(screen.getByText("Juega uno de tus equipos favoritos")).toBeTruthy();
		expect(confetti).toHaveBeenCalledTimes(1);
		expect(confetti.mock.calls[0][0]).toMatchObject({
			disableForReducedMotion: true,
		});
		expect(
			document.getElementById("are-we-playing")?.getAttribute("data-active"),
		).toBe("true");
		expect(events).toEqual([card()]);
	},
);

test("celebrate={false}: resalta pero no celebra ni hace scroll", () => {
	window.localStorage.setItem("favorites", JSON.stringify(["a"]));
	render(
		<MatchCard localTeamId="a" visitingTeamId="b" celebrate={false}>
			<span>contenido</span>
		</MatchCard>,
	);
	expect(card().getAttribute("data-active")).toBe("true");
	expect(confetti).not.toHaveBeenCalled();
	expect(events).toEqual([]);
});

test("sin ids de equipo no hace nada aunque haya favoritos", () => {
	window.localStorage.setItem("favorites", JSON.stringify(["a"]));
	render(
		<MatchCard>
			<span>contenido</span>
		</MatchCard>,
	);
	expect(card().getAttribute("data-active")).toBe("false");
});
