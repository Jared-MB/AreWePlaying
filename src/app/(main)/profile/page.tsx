import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getUser } from "@/core/modules/user/adapters/user.adapter";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { UserMenu } from "../components/user-menu";
import Notifications, {
	NotificationsSkeleton,
} from "./components/notifications";

export default async function ProfilePage() {
	const user = await getUser();

	if (!user) {
		redirect("/");
	}

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
					<Suspense fallback={<NotificationsSkeleton />}>
						<Notifications />
					</Suspense>
				</Card>
			</main>
		</div>
	);
}
