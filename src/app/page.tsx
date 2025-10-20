import type { ReadonlyURLSearchParams } from "next/navigation";

import { Suspense } from "suspense-fallback-debugger";

import { ScheduleTable } from "@/components/schedule-table";
import {
	ScheduleFilters,
	ScheduleFiltersSkeleton,
} from "@/components/schedule-filters";

import { getMatchesByWeek } from "@/use-cases/get-matches-by-week";
import { getMatchDays } from "@/use-cases/get-match-days";
import { getWeekById } from "@/use-cases/get-week-by-id";

import { HyperText } from "@/components/ui/hyper-text";
import { AreWePlaying } from "@/components/are-we-playing";

export default function Home({
	searchParams,
}: {
	searchParams: Promise<ReadonlyURLSearchParams>;
}) {
	return (
		<main
			className="container mx-auto px-4 py-8 md:py-12"
			suppressHydrationWarning
		>
			<header className="flex flex-col md:flex-row md:items-center md:justify-between gap-x-6">
				<h1>
					<HyperText className="mb-8 text-6xl font-bold uppercase md:text-8xl text-balance">
						Are We Playing?
					</HyperText>
				</h1>
				<AreWePlaying />
			</header>
			<Suspense fallback={<ScheduleFiltersSkeleton />}>
				<ScheduleFilterWrapper />
			</Suspense>
			<Suspense>
				<ScheduleTableWrapper searchParams={searchParams} />
			</Suspense>
		</main>
	);
}

async function ScheduleTableWrapper({
	searchParams,
}: {
	searchParams: Promise<ReadonlyURLSearchParams>;
}) {
	const params = new URLSearchParams(await searchParams);
	const currentWeekParam = params.get("week") ?? undefined;

	const [matches, week] = await Promise.all([
		getMatchesByWeek(currentWeekParam),
		getWeekById(currentWeekParam),
	]);

	return <ScheduleTable matches={matches} week={week} />;
}

async function ScheduleFilterWrapper() {
	const matchDays = await getMatchDays();

	return <ScheduleFilters weeks={matchDays} />;
}
