import { describe, expect, test } from "vitest";
import {
	buildMatchCard,
	getTournamentLabel,
	teamInitials,
} from "@/utils/get-match-card";
import { getMatchesWithWeek } from "@/utils/get-match";
import { getTeamsTable } from "@/utils/get-teams-table";
import { getTournaments } from "@/utils/get-tournaments";
import { MATCH, T1, T2, T2_MATCH } from "../fixtures";

async function cardFor(tournamentId: string, matchId: string) {
	const tournament = getTournaments().find((t) => t.id === tournamentId);
	if (!tournament) throw new Error(tournamentId);

	const found = (await getMatchesWithWeek(tournamentId)).find(
		({ match }) => match.matchId === matchId,
	);
	if (!found) throw new Error(matchId);

	const table = await getTeamsTable(tournamentId);
	return buildMatchCard({
		tournament,
		match: found.match,
		week: found.week,
		localStats: table.find((t) => t.id === found.match.localTeamId),
		visitingStats: table.find((t) => t.id === found.match.visitingTeamId),
	});
}

describe("buildMatchCard", () => {
	test("terminado: gana el de más puntos y se usan posición/récord del partido", async () => {
		const card = await cardFor(T1, MATCH(1));
		expect(card).toMatchInlineSnapshot(`
			{
			  "dateLabel": "18 sep 2026",
			  "local": {
			    "initials": "UP",
			    "isWinner": true,
			    "logo": null,
			    "name": "UP MÉXICO",
			    "points": "76",
			    "position": "(2)",
			    "record": "1-1",
			  },
			  "status": "finished",
			  "timeLabel": "14:00",
			  "tournamentLabel": "División I · Varonil",
			  "venue": "CENTRO DEPORTIVO COYOACÁN",
			  "visiting": {
			    "initials": "UV",
			    "isWinner": false,
			    "logo": null,
			    "name": "UV",
			    "points": "57",
			    "position": "(1)",
			    "record": "3-0",
			  },
			  "weekLabel": "SEMANA 1",
			}
		`);
	});

	test("empate: nadie gana", async () => {
		const card = await cardFor(T1, MATCH(2));
		expect([card.local.isWinner, card.visiting.isWinner]).toEqual([
			false,
			false,
		]);
		// Sede "-" es "por definir".
		expect(card.venue).toBe("Por definir");
	});

	test("en vivo: ya marca al que va ganando", async () => {
		const card = await cardFor(T1, MATCH(4));
		expect(card.status).toBe("live");
		expect([card.local.isWinner, card.visiting.isWinner]).toEqual([
			true,
			false,
		]);
	});

	test("por jugarse: posición y récord caen a la tabla general", async () => {
		const card = await cardFor(T1, MATCH(5));
		expect(card).toMatchInlineSnapshot(`
			{
			  "dateLabel": "26 sep 2026",
			  "local": {
			    "initials": "BUA",
			    "isWinner": false,
			    "logo": null,
			    "name": "BUAP",
			    "points": "0",
			    "position": "(4)",
			    "record": "0-3",
			  },
			  "status": "upcoming",
			  "timeLabel": "18:00",
			  "tournamentLabel": "División I · Varonil",
			  "venue": "GIMNASIO",
			  "visiting": {
			    "initials": "UV",
			    "isWinner": false,
			    "logo": null,
			    "name": "UV",
			    "points": "0",
			    "position": "(1)",
			    "record": "3-0",
			  },
			  "weekLabel": "SEMANA 2",
			}
		`);
	});

	test("sin hora y con semana", async () => {
		const card = await cardFor(T1, MATCH(7));
		expect(card.dateLabel).toBe("4 oct 2026");
		expect(card.timeLabel).toBe("—");
		expect(card.weekLabel).toBe("SEMANA 3");
	});

	test("sin semana: weekLabel cae al nombre del torneo", async () => {
		const card = await cardFor(T1, MATCH(8));
		expect(card.weekLabel).toBe("División I · Varonil");
	});

	test("torneo que no arranca: posición 0 y 0 partidos es 'sin dato'", async () => {
		const card = await cardFor(T2, T2_MATCH(1));
		expect(card.local.position).toBe("");
		expect(card.local.record).toBe("");
		expect(card.tournamentLabel).toBe("División II · Femenil · Centro");
		expect(card.weekLabel).toBe("SEMANA 1");
		expect(card.local.initials).toBe("UAG");
		expect(card.visiting.initials).toBe("LOB");
	});
});

test("teamInitials: tres letras de la primera palabra", () => {
	expect(teamInitials("UP MÉXICO")).toBe("UP");
	expect(teamInitials("TEC. DE MTY")).toBe("TEC");
	expect(teamInitials("UAGRO")).toBe("UAG");
	expect(teamInitials("")).toBe("");
});

test("getTournamentLabel", () => {
	const [t1, t2] = getTournaments();
	expect(getTournamentLabel(t1)).toBe("División I · Varonil");
	expect(getTournamentLabel(t2)).toBe("División II · Femenil · Centro");
});
