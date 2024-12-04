import { beforeEach, describe, expect, test, vi } from "vitest";
import { getUsernameService } from "../services/user.service";
import { getUsername } from "./user.adapter";

vi.mock("next/navigation", () => {
	return {
		redirect: vi.fn(),
	};
});

vi.mock("@/core/utils/cookies", () => {
	return {
		getCookie: vi.fn(),
		setCookie: vi.fn(),
	};
});

vi.mock("../services/user.service", () => {
	return {
		getUsernameService: vi.fn(),
	};
});

describe("User", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test("Should get username", async () => {
		vi.mocked(getUsernameService).mockResolvedValue({
			id: "test-id",
			username: "test-username",
		});

		const data = await getUsername();
		expect(data).toEqual("test-username");
	});

	test("Should return null if token is invalid", async () => {
		vi.mocked(getUsernameService).mockResolvedValue(null);

		const data = await getUsername();
		expect(data).toBeNull();
	});

	test("Should return null if fetch fails", async () => {
		vi.mocked(getUsernameService).mockResolvedValue({
			statusCode: 401,
		});

		const data = await getUsername();
		expect(data).toBeNull();
	});
});
