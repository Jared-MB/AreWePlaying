import { CardContent } from "@/components/ui/card";
import { notification } from "@/core/modules/notification";
import Notification, { NotificationSkeleton } from "./notification";

export default async function Notifications() {
	const notifications = await notification.getNotifications();

	// WAIT 1000 SECONDS TO VERIFY FALLBACK
	const timeOut = async () => {
		await new Promise((resolve) => setTimeout(resolve, 1000));
	};

	await timeOut();

	return (
		<CardContent>
			{notifications.map((sub) => (
				<Notification key={sub.id} {...sub} />
			))}
		</CardContent>
	);
}

export const NotificationsSkeleton = () => {
	return (
		<CardContent>
			{Array.from({ length: 3 }).map((_, index) => (
				// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
				<NotificationSkeleton key={index} />
			))}
		</CardContent>
	);
};
