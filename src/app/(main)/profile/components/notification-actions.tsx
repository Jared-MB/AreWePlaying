"use client";

import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { notification } from "@/core/modules/notification";
import { X } from "lucide-react";
import { useState } from "react";

export default function NotificationActions({
	id,
	matchId,
	isActive,
	ariaLabel,
}: {
	matchId: number;
	id: number;
	isActive: boolean;
	ariaLabel: `${string} vs ${string}`;
}) {
	const [disabled, setDisabled] = useState(false);

	return (
		<div className="flex items-center space-x-2">
			<Switch
				disabled={disabled}
				defaultChecked={isActive}
				onCheckedChange={async () => {
					setDisabled(true);
					await notification.toggleActiveNotification({
						notificationId: id,
						notificationActive: isActive,
					});
					setDisabled(false);
				}}
				className="disabled:opacity-50"
				aria-label={`Toggle ${ariaLabel} notifications`}
			/>
			<Button
				variant="ghost"
				size="icon"
				onClick={async () => {
					await notification.deleteNotification(matchId, id);
				}}
				aria-label={`Remove ${ariaLabel} subscription`}
			>
				<X className="h-4 w-4" />
			</Button>
		</div>
	);
}
