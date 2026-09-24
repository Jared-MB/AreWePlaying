/// <reference types="astro/client" />
import { experimental_AstroContainer as AstroContainer } from "astro/container";
import { getContainerRenderer } from "@astrojs/preact";
import { loadRenderers } from "astro:container";
import { afterEach, beforeAll, beforeEach, expect, test, vi } from "vitest";
import MatchDaySection from "@/components/MatchDaySection.astro";
import PastMatches from "@/components/PastMatches.astro";
import SelectDivision from "@/components/SelectDivision.astro";
import TodayMatches from "@/components/TodayMatches.astro";
import TopPerformers from "@/components/TopPerformers.astro";
import UpcomingMatches from "@/components/UpcomingMatches.astro";
import WeekMatches from "@/components/WeekMatches.astro";
import { getMatches } from "@/utils/get-matches";
import { getTournaments } from "@/utils/get-tournaments";
import { getWeeks } from "@/utils/get-weeks";
import { normalizeHtml } from "../normalize-html";
import { NOW, T1, TEAM, WEEK } from "../fixtures";

let container: AstroContainer;

beforeAll(async () => {
	container = await AstroContainer.create({
		renderers: await loadRenderers([getContainerRenderer()]),
	});
});

beforeEach(() => {
	vi.useFakeTimers({ now: NOW, toFake: ["Date"] });
});
afterEach(() => {
	vi.useRealTimers();
});

const render = async (
	component: Parameters<AstroContainer["renderToString"]>[0],
	props: Record<string, unknown> = {},
) => normalizeHtml(await container.renderToString(component, { props }));

async function week2() {
	const [tournament] = getTournaments();
	const group = (await getMatches(T1)).find((g) => g.id === WEEK.s2);
	const week = (await getWeeks(T1)).find((w) => w.id === WEEK.s2);
	if (!group || !week) throw new Error("fixtures");
	return { tournament, week, matches: group.data };
}

test('WeekMatches: los tres estados; una sede con link inseguro se muestra como "Por definir" (oculta el nombre)', async () => {
	const { week, matches } = await week2();
	expect(
		await render(WeekMatches, {
			matches,
			week,
			tournamentSlug: "division-i-varonil",
		}),
	).toMatchSnapshot();
});

test("MatchDaySection con subtítulo y h3", async () => {
	const { tournament, week, matches } = await week2();
	expect(
		await render(MatchDaySection, {
			tournament,
			week,
			matches,
			idPrefix: "next",
			subtitle: "sábado 26 de septiembre",
			celebrate: false,
			headingLevel: 3,
		}),
	).toMatchSnapshot();
});

test("PastMatches y UpcomingMatches de un equipo", async () => {
	const props = {
		teamId: TEAM.upMexico,
		tournamentId: T1,
		tournamentSlug: "division-i-varonil",
	};
	expect(await render(PastMatches, props)).toMatchSnapshot("pasados");
	expect(await render(UpcomingMatches, props)).toMatchSnapshot("próximos");
});

test("PastMatches y UpcomingMatches vacíos", async () => {
	const props = {
		teamId: "sin-partidos",
		tournamentId: T1,
		tournamentSlug: "division-i-varonil",
	};
	expect(await render(PastMatches, props)).toMatchSnapshot("pasados vacío");
	expect(await render(UpcomingMatches, props)).toMatchSnapshot(
		"próximos vacío",
	);
});

test("TopPerformers", async () => {
	expect(await render(TopPerformers)).toMatchSnapshot();
});

test("TodayMatches con partidos hoy", async () => {
	expect(await render(TodayMatches)).toMatchSnapshot();
});

test("TodayMatches sin partidos hoy cae a la próxima jornada", async () => {
	vi.setSystemTime(new Date("2026-09-27T12:00:00-06:00"));
	expect(await render(TodayMatches)).toMatchSnapshot();
});

test("SelectDivision marca el torneo activo", async () => {
	expect(
		await render(SelectDivision, {
			id: "division",
			defaultSelected: "division-ii-femenil-centro",
		}),
	).toMatchSnapshot();
});
