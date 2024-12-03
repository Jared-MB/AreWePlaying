import { Card } from "@/components/match";
import { Welcome } from "@/core/hooks/useWelcome";
import { match } from "@/core/modules/matches";
import { notification } from "@/core/modules/notification";
import Header from "./components/header";

export default async function Page({
	searchParams,
}: {
	searchParams: URLSearchParams;
}) {
	const matches = await match.getMatches(searchParams);
	const notifications = await notification.getNotifications();

	return (
		<div>
			<Header />
			<main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
				{matches.map((match) => (
					<Card
						key={match.id}
						notificationActive={notifications.find(
							(n) => n.matchId === match.id,
						)}
						{...match}
					/>
				))}
				<Welcome />
			</main>
		</div>
	);
}
