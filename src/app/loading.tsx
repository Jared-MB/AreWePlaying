import { ScheduleFiltersSkeleton } from "@/components/schedule-filters";
import { HyperText } from "@/components/ui/hyper-text";

export default function loading() {
	return (
		<main className="container mx-auto px-4 py-8 md:py-12">
			<h1>
				<HyperText className="mb-8 text-6xl font-bold uppercase tracking-wider md:text-8xl">
					Are We Playing?
				</HyperText>
			</h1>
			<ScheduleFiltersSkeleton />
		</main>
	);
}
