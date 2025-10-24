import type { ReadonlyURLSearchParams } from "next/navigation";

import { Suspense } from "suspense-fallback-debugger";

import {
	ScheduleTable,
	ScheduleTableSkeleton,
} from "@/components/schedule-table";
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
			<header className="flex flex-col md:flex-row md:items-center md:justify-between gap-x-6 mb-8">
				<h1>
					<HyperText className="text-6xl font-bold uppercase md:text-8xl text-balance">
						Are We Playing?
					</HyperText>
				</h1>
				<Suspense>
					<AreWePlaying />
				</Suspense>
			</header>
			<Suspense fallback={<ScheduleFiltersSkeleton />}>
				<ScheduleFilterWrapper />
			</Suspense>
			<section className="space-y-4">
				{/* Desktop Table Header */}
				<header className="hidden border-b-2 border-foreground pb-4 md:grid md:grid-cols-12 md:gap-4">
					<div className="col-span-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
						Fecha
					</div>
					<div className="col-span-5 text-sm font-bold uppercase tracking-wider text-muted-foreground">
						Equipos
					</div>
					<div className="col-span-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
						Lugar
					</div>
					<div className="col-span-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
						Estatus
					</div>
				</header>
				<Suspense fallback={<ScheduleTableSkeleton />}>
					<ScheduleTableWrapper searchParams={searchParams} />
				</Suspense>
			</section>
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
