import { describe, expect, test, vi } from "vitest";
import { getSportsService } from "../services/sport.service";
import { getSports } from "./sport.adapter";

vi.mock("../services/sport.service", () => {
	return {
		getSportsService: vi.fn(),
	};
});

describe("Sport", () => {
	test("Should get sport", async () => {
		const sportId = 1;
		vi.mocked(getSportsService).mockResolvedValue([
			{ id: sportId, name: "test-sport-name" },
		]);
		const data = await getSports();
		expect(data).toEqual([{ id: sportId, name: "test-sport-name" }]);
	});
});
