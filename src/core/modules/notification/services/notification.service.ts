"use server";
import { createHeaders } from "../../http";
import type { Notification } from "../interfaces";

export const getNotificationsService = async () => {
	const response = await fetch(`${process.env.SERVER_API}/notification`, {
		method: "GET",
		headers: await createHeaders(),
		next: {
			tags: ["notification"],
		},
	});
	return response.json();
};

export const createNotificationService = async (matchId: number) => {
	const response = await fetch(`${process.env.SERVER_API}/notification`, {
		method: "POST",
		headers: await createHeaders(),
		body: JSON.stringify({
			matchId,
		}),
	});
	return response.json();
};

export const updateNotificationService = async (
	notification: Partial<Notification>,
) => {
	const response = await fetch(`${process.env.SERVER_API}/notification`, {
		method: "PATCH",
		headers: await createHeaders(),
		body: JSON.stringify(notification),
	});
	return response.json();
};

export const deleteNotificationService = async (
	matchId: number,
	notificationId: number,
) => {
	const response = await fetch(`${process.env.SERVER_API}/notification`, {
		method: "DELETE",
		headers: await createHeaders(),
		body: JSON.stringify({
			matchId,
			id: notificationId,
		}),
	});
	return response.json();
};
