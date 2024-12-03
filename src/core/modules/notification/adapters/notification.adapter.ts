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
	return notifications;
};

export const createNotification = async (matchId: number) => {
	const token = await getCookie("session");
	if (!token) {
		redirect("/login");
	}
	await createNotificationService(matchId);
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
	await updateNotificationService({
		id: notificationId,
		isActive: !notificationActive,
	});
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
	await deleteNotificationService(matchId, notificationId);
	revalidateTag("notification");
};
