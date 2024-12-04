import { revalidateTag } from "next/cache";
import { describe, expect, test, vi } from "vitest";
import { getTeamsService } from "../services/team.service";
import { getTeams, uploadTeam } from "./team.adapter";

vi.mock("next/cache", () => {
	return {
		revalidateTag: vi.fn(),
	};
});

vi.mock("../../images", () => {
	return {
		image: {
			uploadImage: vi.fn(),
		},
	};
});

vi.mock("../services/team.service", () => {
	return {
		getTeamsService: vi.fn(),
		uploadTeamService: vi.fn(),
	};
});

describe("Team", () => {
	test("Should get teams", async () => {
		const teams = [
			{
				id: 1,
				name: "test-team-name",
				logo: "test-team-logo",
				universityId: 1,
			},
		];

		vi.mocked(getTeamsService).mockResolvedValue(teams);
		const data = await getTeams();
		expect(data).toEqual(teams);
	});

	test("Should upload team", async () => {
		vi.mocked(getTeamsService).mockResolvedValue([
			{
				id: 1,
				name: "test-team-name",
				logo: "test-team-logo",
				universityId: 1,
			},
		]);

		const payload = new FormData();
		payload.append("name", "test-team-name");
		payload.append("universityId", "1");
		payload.append("logo", "test-team-logo");

		const response = await uploadTeam(undefined, payload);
		expect(response).toBeUndefined();
		expect(revalidateTag).toHaveBeenCalledOnce();
	});
});
