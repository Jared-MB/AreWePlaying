import { ScheduleTable } from "@/components/schedule-table";
import {
	ScheduleFilters,
	ScheduleFiltersSkeleton,
} from "@/components/schedule-filters";
import { getMatchDays } from "@/use-cases/get-match-days";
import { Suspense } from "suspense-fallback-debugger";
import { HyperText } from "@/components/ui/hyper-text";
import { isAfter, parse } from "date-fns";
import { connection } from "next/server";
import type { ReadonlyURLSearchParams } from "next/navigation";

export default async function Home({
	searchParams,
}: {
	searchParams: Promise<ReadonlyURLSearchParams>;
}) {
	await connection();
	const matchDays = await getMatchDays();
	const params = new URLSearchParams(await searchParams);

	const currentWeekParam = params.get("week");

	function currentWeekFn() {
		const currentDate = new Date();

		for (const matchDay of matchDays) {
			if (
				isAfter(parse(matchDay.date, "dd/MM/yyyy", new Date()), currentDate)
			) {
				const index = matchDays.indexOf(matchDay);
				return matchDays[index - 1];
			}
		}
	}

	const currentWeek = currentWeekFn();

	return (
		<main className="container mx-auto px-4 py-8 md:py-12">
			<h1>
				<HyperText className="mb-8 text-6xl font-bold uppercase tracking-wider md:text-8xl">
					Are We Playing?
				</HyperText>
			</h1>
			<Suspense fallback={<ScheduleFiltersSkeleton weeks={matchDays} />}>
				<ScheduleFilters
					weeks={matchDays}
					currentWeek={currentWeekParam ?? currentWeek?.id}
				/>
			</Suspense>
			<ScheduleTable week={currentWeekParam ?? currentWeek?.id} />
		</main>
	);
}
