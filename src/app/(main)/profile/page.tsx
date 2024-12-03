import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { notification } from "@/core/modules/notification";
import { getUser } from "@/core/modules/user/adapters/user.adapter";
import { cn } from "@/core/utils";
import { Bell } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { UserMenu } from "../components/user-menu";
import NotificationActions from "./components/notification-actions";

export default async function ProfilePage() {
	const user = await getUser();

	if (!user) {
		redirect("/");
	}

	const notifications = await notification.getNotifications();

	return (
		<div>
			<header className="flex items-center justify-between gap-x-8 py-6 px-16 h-[5.5rem] z-50">
				<h1>
					<Link href="/" className="text-primary font-medium text-3xl ">
						AreWePlaying?
					</Link>
				</h1>
				<UserMenu />
			</header>
			<main className="container mx-auto p-4">
				<h2 className="text-2xl font-bold mb-4">
					Administra tus notificaciones
				</h2>
				<Card className="mb-6">
					<CardHeader>
						<CardTitle>Tus notificaciones</CardTitle>
						<CardDescription>
							Administra tus notificaciones de los partidos que te interesan
						</CardDescription>
					</CardHeader>
					<CardContent>
						{notifications.map((sub) => (
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
									<Bell
										className={
											sub.id ? "text-primary" : "text-muted-foreground"
										}
									/>
									<div>
										<p className="font-medium">
											{sub.match.localTeam.name} vs {sub.match.visitorTeam.name}
										</p>
										<div className="text-muted-foreground">
											<small className="capitalize">
												{sub.match.sport.name}
											</small>
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
						))}
					</CardContent>
				</Card>
			</main>
		</div>
	);
}
