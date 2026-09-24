// @vitest-environment happy-dom
import { act, cleanup, render, screen } from "@testing-library/preact";
import { afterEach, beforeEach, describe, expect, test, vi } from "vitest";
import FavoriteCountdown from "@/components/favorite-countdown";
import type { NextTeamMatch } from "@/utils/get-next-matches";

const NOW = new Date("2026-09-26T12:00:00-06:00").getTime();
const HOUR = 3_600_000;

const base: NextTeamMatch = {
	matchId: "m1",
	matchSlug: "buap-vs-uv-5",
	tournamentSlug: "division-i-varonil",
	teamSlug: "buap",
	opponentSlug: "uv",
	startsAt: NOW + 6 * HOUR,
	label: "sábado 26 de septiembre · 18:00 hrs",
	tournament: "División I · Varonil",
	team: "BUAP",
	teamId: "buap",
	opponent: "UV",
	isLocal: true,
	location: "GIMNASIO",
	locationUrl: "https://maps.example.com/g",
	week: "SEMANA 2",
};

const byTeam: Record<string, NextTeamMatch> = {
	buap: base,
	// UV juega el mismo partido que BUAP.
	uv: {
		...base,
		teamId: "uv",
		team: "UV",
		opponent: "BUAP",
		teamSlug: "uv",
		opponentSlug: "buap",
		isLocal: false,
	},
	tec: {
		...base,
		matchId: "m7",
		matchSlug: "tec-vs-up-7",
		startsAt: NOW + 2 * 24 * HOUR + 3 * HOUR,
		label: "lunes 28 de septiembre · 15:00 hrs",
		team: "TEC",
		teamId: "tec",
		opponent: "UP",
		teamSlug: "tec",
		opponentSlug: "up",
		location: "-",
		locationUrl: null,
		week: undefined,
	},
};

const favorites = (ids: string[]) =>
	window.localStorage.setItem("favorites", JSON.stringify(ids));

beforeEach(() => {
	vi.useFakeTimers({ now: NOW });
	window.localStorage.clear();
});
afterEach(() => {
	cleanup();
	vi.useRealTimers();
});

test("sin favoritos no pinta nada, pero avisa que ya se acomodó", async () => {
	const settled = vi.fn();
	window.addEventListener("favorite-countdown-settled", settled);
	const { container } = render(<FavoriteCountdown matchesByTeam={byTeam} />);
	await act(async () => {
		await vi.advanceTimersByTimeAsync(150);
	});

	expect(container.innerHTML).toBe("");
	expect(settled).toHaveBeenCalledTimes(1);
	window.removeEventListener("favorite-countdown-settled", settled);
});

test("favoritos sin próximo partido no pintan nada", () => {
	favorites(["nadie"]);
	const { container } = render(<FavoriteCountdown matchesByTeam={byTeam} />);
	expect(container.innerHTML).toBe("");
});

test("un favorito: tarjeta completa (golden)", () => {
	favorites(["buap"]);
	render(<FavoriteCountdown matchesByTeam={byTeam} />);

	expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(
		"Tu próximo partido",
	);
	const article = screen.getByRole("article");
	expect(article.textContent).toMatchInlineSnapshot(
		`"BUAP vs UVDivisión I · Varonil · SEMANA 2 · LocalFaltan 6 horas para el partido de BUAP: sábado 26 de septiembre · 18:00 hrs.00Días06Hrs00Min00Segsábado 26 de septiembre · 18:00 hrsLugar: GIMNASIO"`,
	);
	expect(
		[...article.querySelectorAll("a")].map((a) => [
			a.getAttribute("href"),
			a.getAttribute("aria-label"),
		]),
	).toMatchInlineSnapshot(`
		[
		  [
		    "/division-i-varonil/match/buap-vs-uv-5",
		    "Ver detalle del partido entre BUAP contra UV",
		  ],
		  [
		    "/division-i-varonil/teams/buap",
		    null,
		  ],
		  [
		    "/division-i-varonil/teams/uv",
		    null,
		  ],
		  [
		    "https://maps.example.com/g",
		    null,
		  ],
		]
	`);
	expect(article.querySelector("time")?.getAttribute("datetime")).toBe(
		"2026-09-27T00:00:00.000Z",
	);
});

test("dos favoritos que juegan entre sí: una sola tarjeta", () => {
	favorites(["uv", "buap"]);
	render(<FavoriteCountdown matchesByTeam={byTeam} />);
	expect(screen.getAllByRole("article")).toHaveLength(1);
	// Se queda con el primero de la lista de favoritos.
	expect(screen.getByRole("article").textContent).toContain("Visita");
});

test("varios partidos: ordenados por hora y título en plural", () => {
	favorites(["tec", "buap"]);
	render(<FavoriteCountdown matchesByTeam={byTeam} />);
	expect(screen.getByRole("heading", { level: 2 }).textContent).toBe(
		"Tus próximos partidos",
	);
	expect(
		screen
			.getAllByRole("article")
			.map((a) => a.querySelector("h3")?.textContent),
	).toEqual(["BUAP vs UV", "TEC vs UP"]);
	// Sin link de sede no hay enlace al mapa.
	const tec = screen.getAllByRole("article")[1];
	expect(tec.textContent).not.toContain("Lugar:");
});

describe("texto para lector de pantalla", () => {
	test.each([
		[2 * 24 * HOUR + 1, "Faltan 2 días"],
		[24 * HOUR, "Faltan 1 día"],
		[5 * HOUR + 59 * 60_000, "Faltan 5 horas"],
		[HOUR, "Faltan 1 hora"],
		[59 * 60_000 + 59_000, "Faltan 59 minutos"],
		[60_000, "Faltan 1 minuto"],
		[30_000, "Faltan 0 minutos"],
	])("a %d ms → %s", (remaining, text) => {
		favorites(["buap"]);
		render(
			<FavoriteCountdown
				matchesByTeam={{ buap: { ...base, startsAt: NOW + remaining } }}
			/>,
		);
		expect(document.querySelector(".sr-only")?.textContent).toBe(
			`${text} para el partido de BUAP: ${base.label}.`,
		);
	});
});

test("corre cada segundo y desaparece al llegar el salto inicial", async () => {
	favorites(["buap"]);
	const { container } = render(
		<FavoriteCountdown
			matchesByTeam={{ buap: { ...base, startsAt: NOW + 3_000 } }}
		/>,
	);
	const digits = () =>
		[...container.querySelectorAll(".tabular-nums")].map((d) => d.textContent);

	expect(digits()).toEqual(["00", "00", "00", "03"]);
	await act(async () => {
		await vi.advanceTimersByTimeAsync(1_000);
	});
	expect(digits()).toEqual(["00", "00", "00", "02"]);
	await act(async () => {
		await vi.advanceTimersByTimeAsync(2_000);
	});
	expect(container.innerHTML).toBe("");
});
