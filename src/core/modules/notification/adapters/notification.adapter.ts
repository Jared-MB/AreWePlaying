"use server";

import { getCookie } from "@/core/utils/cookies";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import type { Notification } from "../interfaces";
import {
	createNotificationService,
	deleteNotificationService,
	getNotificationsService,
	updateNotificationService,
} from "../services";

export const getNotifications = async (): Promise<Notification[]> => {
	const token = await getCookie("session");
	if (!token) {
		return [];
	}
	const notifications = await getNotificationsService();
	if (notifications.statusCode) {
		return [];
	}
	return notifications;
};

export const createNotification = async (matchId: number) => {
	const token = await getCookie("session");
	if (!token) {
		redirect("/login");
	}
	const response = await createNotificationService(matchId);
	if (response.statusCode) {
		redirect("/profile");
	}
	revalidateTag("notification");
};

export const toggleActiveNotification = async ({
	notificationId,
	notificationActive,
}: {
	notificationId: number;
	notificationActive: boolean;
}) => {
	const token = await getCookie("session");
	if (!token) {
		redirect("/login");
	}
	const response = await updateNotificationService({
		id: notificationId,
		isActive: !notificationActive,
	});
	if (response.statusCode) {
		redirect("/profile");
	}
	revalidateTag("notification");
};

export const deleteNotification = async (
	matchId: number,
	notificationId: number,
) => {
	const token = await getCookie("session");
	if (!token) {
		redirect("/login");
	}
	const response = await deleteNotificationService(matchId, notificationId);
	if (response.statusCode) {
		redirect("/profile");
	}
	revalidateTag("notification");
};
