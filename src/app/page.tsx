import { ScheduleTable } from "@/components/schedule-table";
import {
	ScheduleFilters,
	ScheduleFiltersSkeleton,
} from "@/components/schedule-filters";
import { getMatchDays } from "@/use-cases/get-match-days";
import { Suspense } from "suspense-fallback-debugger";
import { HyperText } from "@/components/ui/hyper-text";
import type { ReadonlyURLSearchParams } from "next/navigation";
import { getMatchesByWeek } from "@/use-cases/get-matches-by-week";

export default function Home({
	searchParams,
}: {
	searchParams: Promise<ReadonlyURLSearchParams>;
}) {
	return (
		<main className="container mx-auto px-4 py-8 md:py-12">
			<h1>
				<HyperText className="mb-8 text-6xl font-bold uppercase tracking-wider md:text-8xl">
					Are We Playing?
				</HyperText>
			</h1>
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
	const matches = await getMatchesByWeek(currentWeekParam);

	return <ScheduleTable matches={matches} />;
}

async function ScheduleFilterWrapper() {
	const matchDays = await getMatchDays();

	return <ScheduleFilters weeks={matchDays} />;
}
