import {
	HydrationBoundary,
	QueryClient,
	dehydrate,
} from "@tanstack/react-query";

import { MatchService } from "@/services/match.service";
import Matches from "../components/matches";
import { Suspense } from "react";

export default async function Home() {
	const queryClient = new QueryClient();

	await queryClient.prefetchQuery({
		queryKey: ["matches"],
		queryFn: MatchService.getMatches,
	});

	return (
		<main className="relative top-28 min-h-[calc(100dvh-11.75rem)]">
			<section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-16 pb-6">
				<HydrationBoundary state={dehydrate(queryClient)}>
					<Suspense>
						<Matches />
					</Suspense>
				</HydrationBoundary>
			</section>
		</main>
	);
}
