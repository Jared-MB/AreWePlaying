import { Suspense } from "react";

import {
	ScheduleTable,
	ScheduleTableSkeleton,
} from "@/components/schedule-table";
import {
	ScheduleFilters,
	ScheduleFiltersSkeleton,
} from "@/components/schedule-filters";

import { getMatchDays } from "@/use-cases/get-match-days";
import { getWeekById } from "@/use-cases/get-week-by-id";

import { HyperText } from "@/components/ui/hyper-text";
import { AreWePlaying } from "@/components/are-we-playing";
import { getWeeksByTournamentId } from "@/use-cases/get-weeks-by-tournament-id";
import { getMatches } from "@/use-cases/get-matches";
import { getWeek } from "@/use-cases/get-week";

export async function generateStaticParams() {
	const weeks = getMatchDays();
	return weeks.map((week) => ({
		week: week.id,
	}));
}

export default function Home({ params }: PageProps<"/[tournament]/[week]">) {
	return (
		<main className="container mx-auto px-4 py-8 md:py-12">
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
			<Suspense>
				<ScheduleFilterWrapper params={params} />
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
					<ScheduleTableWrapper params={params} />
				</Suspense>
			</section>
		</main>
	);
}

async function ScheduleTableWrapper({
	params: paramsProps,
}: {
	params: PageProps<"/[tournament]/[week]">["params"];
}) {
	const params = await paramsProps;

	const [matchesV2, week] = await Promise.all([
		getMatches({
			tournamentId: params.tournament,
			weekId: params.week,
		}),
		getWeek({
			tournamentId: params.tournament,
			weekId: params.week,
		}),
	]);

	return <ScheduleTable matches={matchesV2} week={week} />;
}

async function ScheduleFilterWrapper({
	params: paramsProps,
}: {
	params: PageProps<"/[tournament]/[week]">["params"];
}) {
	const { tournament } = await paramsProps;
	const weeks = await getWeeksByTournamentId(tournament);

	return (
		<Suspense fallback={<ScheduleFiltersSkeleton weeks={weeks} />}>
			<ScheduleFilters weeks={weeks} />
		</Suspense>
	);
}
