import { beforeEach, describe, expect, test, vi } from "vitest";
import { loginService, registerService, verifyTokenService } from "../services";
import { login, register, verifyToken } from "./auth.adapter";

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

vi.mock("../services", () => {
	return {
		loginService: vi.fn(),
		registerService: vi.fn(),
		verifyTokenService: vi.fn(),
	};
});

describe("Login", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test("Should login", async () => {
		vi.mocked(loginService).mockResolvedValue({
			access_token: "test-token",
		});

		const form = new FormData();
		form.append("username", "testing");
		form.append("password", "testing");
		const data = await login(undefined, form);
		expect(data).toBeUndefined();
	});

	test("Should return error is payload is invalid", async () => {
		const form = new FormData();
		form.append("username", "test");
		form.append("password", "test");

		const data = await login(undefined, form);
		expect(data).toBeTypeOf("object");
		expect(data).toHaveProperty("username");
		expect(data).toHaveProperty("password");
	});
});

describe("Register", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test("Should register", async () => {
		vi.mocked(registerService).mockResolvedValue({
			id: "test-id",
		});

		const form = new FormData();
		form.append("username", "testing");
		form.append("password", "testing");
		form.append("email", "testing@example.com");
		form.append("name", "Testing");

		const data = await register(undefined, form);
		expect(data).toBeUndefined();
	});

	test("Should return error is payload is invalid", async () => {
		const form = new FormData();
		form.append("username", "test");
		form.append("password", "test");
		form.append("email", "testexample.com");
		form.append("name", "Test");

		const data = await register(undefined, form);
		expect(data).toBeTypeOf("object");
		expect(data).toHaveProperty("username");
		expect(data).toHaveProperty("password");
		expect(data).toHaveProperty("email");
		expect(data).toHaveProperty("name");
	});
});

describe("Verify Token", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test("Should return false if token is invalid", async () => {
		vi.mocked(verifyTokenService).mockResolvedValue({
			statusCode: 401,
		});

		const data = await verifyToken();
		expect(data).toBe(false);
	});

	test("Should return user data if token is valid", async () => {
		vi.mocked(verifyTokenService).mockResolvedValue({
			id: "test-id",
			username: "test-username",
		});

		const data = await verifyToken();
		expect(data).toEqual({
			id: "test-id",
			username: "test-username",
		});
	});
});
