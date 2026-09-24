/** Ids y referencias de los fixtures, para no repetir UUIDs en cada test. */
export const T1 = "AAAAAAAA-AAAA-4AAA-8AAA-000000000001";
export const T2 = "BBBBBBBB-BBBB-4BBB-8BBB-000000000002";
export const T3_OTHER_SEASON = "CCCCCCCC-CCCC-4CCC-8CCC-000000000003";

export const TEAM = {
	upMexico: "aaaaaaa1-0000-4000-8000-000000000001",
	uv: "aaaaaaa2-0000-4000-8000-000000000002",
	tec: "aaaaaaa3-0000-4000-8000-000000000003",
	buap: "aaaaaaa4-0000-4000-8000-000000000004",
	uagro: "bbbbbbb1-0000-4000-8000-000000000001",
	lobos: "bbbbbbb2-0000-4000-8000-000000000002",
} as const;

export const WEEK = {
	s1: "a0000000-0000-4000-8000-000000000001",
	s2: "a0000000-0000-4000-8000-000000000002",
	s3: "a0000000-0000-4000-8000-000000000003",
	s4: "a0000000-0000-4000-8000-000000000004",
	/** Grupo de partidos cuya jornada no existe en weeks.json. */
	orphan: "a0000000-0000-4000-8000-000000000009",
	t2s1: "b0000000-0000-4000-8000-000000000001",
} as const;

export const MATCH = (n: number) => `a1000000-0000-4000-8000-00000000000${n}`;
export const T2_MATCH = (n: number) =>
	`b1000000-0000-4000-8000-00000000000${n}`;

/**
 * Sábado 26/09/2026 a mediodía en Ciudad de México (UTC-6, sin horario de
 * verano desde 2022). Ese día T1 tiene un partido terminado (10:00), uno en
 * vivo que arrancó justo ahora (12:00) y uno por jugarse (18:00).
 */
export const NOW = new Date("2026-09-26T12:00:00-06:00");
