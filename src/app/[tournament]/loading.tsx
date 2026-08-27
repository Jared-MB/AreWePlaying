import { ScheduleFiltersSkeleton } from "@/components/schedule-filters";
import { ScheduleTableSkeleton } from "@/components/schedule-table";
import { HyperText } from "@/components/ui/hyper-text";
import { getMatchDays } from "@/use-cases/get-match-days";

export default function Loading() {
	const matchDays = getMatchDays();

	return (
		<main className="container mx-auto px-4 py-8 md:py-12">
			<header className="flex flex-col md:flex-row md:items-center md:justify-between gap-x-6 mb-8">
				<h1>
					<HyperText className="text-6xl font-bold uppercase md:text-8xl text-balance">
						Are We Playing?
					</HyperText>
				</h1>
			</header>
			<ScheduleFiltersSkeleton weeks={matchDays} />
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
				<ScheduleTableSkeleton />
			</section>
		</main>
	);
}
