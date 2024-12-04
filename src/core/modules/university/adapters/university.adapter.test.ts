import { describe, expect, test, vi } from "vitest";

vi.mock("next/cache", () => {
	return {
		revalidateTag: vi.fn(),
	};
});

vi.mock("../services", () => {
	return {
		getUniversitiesService: vi.fn(),
		uploadUniversityService: vi.fn(),
	};
});

import { revalidateTag } from "next/cache";
import { getUniversitiesService } from "../services";
import { getUniversities, uploadUniversity } from "./university.adapter";

describe("University", () => {
	test("Should get universities", async () => {
		const universities = [
			{
				id: 1,
				name: "test-university-name",
			},
		];

		vi.mocked(getUniversitiesService).mockResolvedValue(universities);
		const data = await getUniversities();
		expect(data).toEqual(universities);
	});

	test("Should upload university", async () => {
		const payload = new FormData();
		payload.append("name", "test-university-name");

		const response = await uploadUniversity(undefined, payload);
		expect(response).toBeUndefined();
		expect(revalidateTag).toHaveBeenCalledOnce();
	});
});
