import { getCookie } from "@/core/utils/cookies";
import { beforeEach, describe, expect, test, vi } from "vitest";
import {
	createNotificationService,
	deleteNotificationService,
	getNotificationsService,
	updateNotificationService,
} from "../services";
import {
	createNotification,
	deleteNotification,
	getNotifications,
	toggleActiveNotification,
} from "./notification.adapter";

vi.mock("next/navigation", () => {
	return {
		redirect: vi.fn(),
	};
});

vi.mock("next/cache", () => {
	return {
		revalidateTag: vi.fn(),
	};
});

vi.mock("@/core/utils/cookies", () => {
	return {
		getCookie: vi.fn(() => "test-token"),
		setCookie: vi.fn(),
	};
});

vi.mock("../services", () => {
	return {
		getNotificationsService: vi.fn(),
		createNotificationService: vi.fn(),
		deleteNotificationService: vi.fn(),
		updateNotificationService: vi.fn(),
	};
});

describe("Notification", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test("Should get notifications", async () => {
		vi.mocked(getNotificationsService).mockResolvedValue([
			{
				id: 1,
				matchId: 1,
				userId: 1,
				isActive: true,
			},
		]);

		const data = await getNotifications();
		expect(data).toEqual([
			{
				id: 1,
				matchId: 1,
				userId: 1,
				isActive: true,
			},
		]);
	});

	test("Should return empty array if there is not token", async () => {
		vi.mocked(getCookie).mockReturnValue(Promise.resolve(undefined));

		const data = await getNotifications();
		expect(data).toEqual([]);
	});

	test("Should return empty array if fetch fails", async () => {
		vi.mocked(getNotificationsService).mockResolvedValue({
			statusCode: 401,
		});

		const data = await getNotifications();
		expect(data).toEqual([]);
	});
});

describe("Create Notification", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test("Should create notification", async () => {
		vi.mocked(createNotificationService).mockResolvedValue({
			id: 1,
			matchId: 1,
			userId: 1,
			isActive: true,
		});

		const data = await createNotification(1);
		expect(data).toBeUndefined();
	});
});

describe("Toggle Active Notification", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test("Should toggle active notification", async () => {
		vi.mocked(updateNotificationService).mockResolvedValue({
			id: 1,
			matchId: 1,
			userId: 1,
			isActive: true,
		});

		const data = await toggleActiveNotification({
			notificationId: 1,
			notificationActive: true,
		});
		expect(data).toBeUndefined();
	});
});

describe("Delete Notification", () => {
	beforeEach(() => {
		vi.clearAllMocks();
	});

	test("Should delete notification", async () => {
		vi.mocked(deleteNotificationService).mockResolvedValue({
			id: 1,
			matchId: 1,
			userId: 1,
			isActive: true,
		});

		const data = await deleteNotification(1, 1);
		expect(data).toBeUndefined();
	});
});
