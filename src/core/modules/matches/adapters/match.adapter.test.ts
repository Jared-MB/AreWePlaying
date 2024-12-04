import { revalidateTag } from "next/cache";
import { beforeEach, describe, expect, test, vi } from "vitest";
import type { Match } from "../interfaces";
import { getMatchesService } from "../services";
import { getMatches, uploadMatch } from "./match.adapter";

vi.mock("next/cache", () => {
	return {
		revalidateTag: vi.fn(),
	};
});

vi.mock("../services", () => {
	return {
		getMatchesService: vi.fn(),
		uploadMatchService: vi.fn(),
	};
});

const MATCHES: Match[] = [
	{
		id: 1,
		date: new Date(),
		hour: "12:00",
		location: "test-location",
		gender: "test-gender",
		sportId: 1,
		localTeamId: 1,
		visitorTeamId: 1,
		localTeam: {
			id: 1,
			name: "test-local-team-name",
			logo: "test-local-team-logo",
			universityId: 1,
		},
		visitorTeam: {
			id: 1,
			name: "test-visitor-team-name",
			logo: "test-visitor-team-logo",
			universityId: 12,
		},
		sport: {
			id: 1,
			name: "test-sport-name",
		},
	},
];

describe("Matches", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test("Should get matches", async () => {
		vi.mocked(getMatchesService).mockResolvedValue(MATCHES);
		const data = await getMatches(new URLSearchParams());
		expect(data).toEqual(MATCHES);
	});

	test("Should upload match", async () => {
		const date = new Date();
		const payload = new FormData();
		payload.append("localTeamId", "1");
		payload.append("visitorTeamId", "1");
		payload.append("date", date.toISOString());
		payload.append("hour", "12:00");
		payload.append("location", "test-location");
		payload.append("gender", "varonil");
		payload.append("sportId", "1");

		const response = await uploadMatch(date, undefined, payload);
		expect(response).toBeUndefined();
		expect(revalidateTag).toHaveBeenCalledOnce();
	});

	test("Should return error if payload is invalid", async () => {
		const payload = new FormData();

		const response = await uploadMatch(new Date(), undefined, payload);
		expect(response).toBeTypeOf("object");
		expect(response).toHaveProperty("gender");
		expect(response).toHaveProperty("hour");
		expect(response).toHaveProperty("location");
		expect(response).toHaveProperty("localTeamId");
		expect(response).toHaveProperty("visitorTeamId");
		expect(response).toHaveProperty("sportId");
	});
});
