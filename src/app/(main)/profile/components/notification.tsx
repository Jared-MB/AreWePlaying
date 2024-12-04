import { Skeleton } from "@/components/ui/skeleton";
import type { Notification as NotificationInterface } from "@/core/modules/notification/interfaces";
import { cn } from "@/core/utils";
import { Bell } from "lucide-react";
import NotificationActions from "./notification-actions";

export default function Notification(sub: NotificationInterface) {
	return (
		<article
			key={sub.id}
			className="flex items-center justify-between py-2 border-b last:border-b-0"
		>
			<div
				className={cn(
					"flex items-center space-x-4 duration-300",
					!sub.isActive && "opacity-50",
				)}
			>
				<Bell className={sub.id ? "text-primary" : "text-muted-foreground"} />
				<div>
					<p className="font-medium">
						{sub.match.localTeam.name} vs {sub.match.visitorTeam.name}
					</p>
					<div className="text-muted-foreground">
						<small className="capitalize">{sub.match.sport.name}</small>
						<span className="px-1">-</span>
						<small className="capitalize">{sub.match.gender}</small>
					</div>
				</div>
			</div>
			<NotificationActions
				id={sub.id}
				isActive={sub.isActive}
				matchId={sub.match.id}
				ariaLabel={`${sub.match.localTeam.name} vs ${sub.match.visitorTeam.name}`}
			/>
		</article>
	);
}

export const NotificationSkeleton = () => {
	return (
		<article className="flex items-center justify-between py-2 border-b last:border-b-0">
			<div className="flex items-center space-x-4 duration-300">
				<Bell className="text-primary" />
				<div>
					<p className="font-medium flex flex-row gap-x-4 items-center min-w-[240px]">
						<Skeleton className="w-full h-4 rounded-md" />
						vs
						<Skeleton className="w-full h-4 rounded-md" />
					</p>
					<div className="text-muted-foreground flex flex-row gap-x-4 items-center min-w-[180px]">
						<Skeleton className="w-1/2 h-3 rounded-md" />
						<span className="px-1">-</span>
						<Skeleton className="w-1/2 h-3 rounded-md" />
					</div>
				</div>
			</div>
			{/* <NotificationActions
				id={sub.id}
				isActive={sub.isActive}
				matchId={sub.match.id}
				ariaLabel={`${sub.match.localTeam.name} vs ${sub.match.visitorTeam.name}`}
			/> */}
		</article>
	);
};
