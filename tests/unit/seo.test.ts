import { describe, expect, test } from "vitest";
import type { Match } from "@/types/match";
import type { Tournament } from "@/types/tournament";
import {
	buildMatchJsonLd,
	buildTeamJsonLd,
	buildWebSiteJsonLd,
	getTournamentSearchLabel,
	pageTitle,
	SITE_NAME,
	serializeJsonLd,
	toTitleCase,
} from "@/utils/seo";

const DIVISION_II: Tournament = {
	id: "T",
	division: "II",
	category: "Varonil",
	conference: "Centro",
	season: "2026-2027",
	finished: false,
	updated_at: "2026-10-21T00:00:00Z",
};

const MATCH = {
	localTeam: "UAGRO",
	visitingTeam: "LOBOS BUAP",
	date: "26/09/2026 18:00",
} as Match;

const URLS = {
	url: "https://example.com/division-ii-varonil-centro/match/uagro-vs-lobos-buap-1",
	image:
		"https://example.com/division-ii-varonil-centro/match/uagro-vs-lobos-buap-1/og.png",
	home: {
		name: "UAGRO",
		fullName: "UNIVERSIDAD AUTÓNOMA DE GUERRERO",
		url: "https://example.com/division-ii-varonil-centro/teams/uagro",
	},
	away: {
		name: "LOBOS BUAP",
		url: "https://example.com/division-ii-varonil-centro/teams/lobos-buap",
	},
};

describe("pageTitle", () => {
	test("une las partes con · y termina con el nombre del sitio", () => {
		expect(pageTitle("Tabla de posiciones", "Liga ABE División I")).toBe(
			"Tabla de posiciones · Liga ABE División I | Are We Playing?",
		);
	});

	test("ignora partes vacías; sin partes queda sólo el sitio", () => {
		expect(pageTitle("", "Semana 1")).toBe("Semana 1 | Are We Playing?");
		expect(pageTitle()).toBe(SITE_NAME);
	});
});

test("getTournamentSearchLabel quita los separadores", () => {
	expect(getTournamentSearchLabel(DIVISION_II)).toBe(
		"División II Varonil Centro",
	);
});

test("toTitleCase: nombres completos del API legibles en un buscador", () => {
	expect(toTitleCase("UNIVERSIDAD ANÁHUAC MÉXICO NORTE")).toBe(
		"Universidad Anáhuac México Norte",
	);
	expect(toTitleCase("CENTRO DE ENSEÑANZA TÉCNICA Y SUPERIOR  TIJUANA")).toBe(
		"Centro de Enseñanza Técnica y Superior Tijuana",
	);
});

test("buildTeamJsonLd", () => {
	expect(
		buildTeamJsonLd({
			tournament: DIVISION_II,
			...URLS.home,
			logo: "https://example.com/logo.avif",
		}),
	).toMatchObject({
		"@type": "SportsTeam",
		name: "UAGRO",
		alternateName: "Universidad Autónoma de Guerrero",
		url: URLS.home.url,
		logo: "https://example.com/logo.avif",
		memberOf: { name: "Liga ABE" },
	});
});

test("serializeJsonLd escapa < para no cerrar el <script>", () => {
	expect(serializeJsonLd({ name: "</script><b>" })).toBe(
		'{"name":"\\u003c/script>\\u003cb>"}',
	);
});

test("buildWebSiteJsonLd", () => {
	expect(buildWebSiteJsonLd("https://example.com/")).toMatchObject({
		"@type": "WebSite",
		name: SITE_NAME,
		url: "https://example.com/",
	});
});

describe("buildMatchJsonLd", () => {
	test("SportsEvent con equipos, hora absoluta y sede", () => {
		const data = buildMatchJsonLd({
			match: MATCH,
			tournament: DIVISION_II,
			venue: "GIMNASIO",
			venueUrl: "https://maps.example.com/gimnasio",
			...URLS,
		});

		expect(data).toMatchObject({
			"@type": "SportsEvent",
			name: "UAGRO vs LOBOS BUAP",
			startDate: "2026-09-27T00:00:00.000Z",
			url: URLS.url,
			image: URLS.image,
			location: {
				"@type": "Place",
				name: "GIMNASIO",
				url: "https://maps.example.com/gimnasio",
			},
			homeTeam: {
				name: "UAGRO",
				alternateName: "Universidad Autónoma de Guerrero",
				url: URLS.home.url,
			},
			awayTeam: { name: "LOBOS BUAP", url: URLS.away.url },
		});
		expect(data.awayTeam).not.toHaveProperty("alternateName");
		expect(data.description).toContain("División II · Varonil · Centro");
	});

	test("sin sede no inventa un lugar", () => {
		const data = buildMatchJsonLd({
			match: MATCH,
			tournament: DIVISION_II,
			venue: null,
			venueUrl: null,
			...URLS,
		});

		expect(data).not.toHaveProperty("location");
	});
});
