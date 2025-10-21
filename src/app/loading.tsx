import { ScheduleFiltersSkeleton } from "@/components/schedule-filters";

export default function loading() {
	return (
		<main className="container mx-auto px-4 py-8 md:py-12">
			<header className="flex flex-col md:flex-row md:items-center md:justify-between gap-x-6">
				<h1 className="mb-8 text-6xl font-bold uppercase md:text-8xl text-balance">
					ADW CK WLOFINGA
				</h1>
			</header>
			<ScheduleFiltersSkeleton />
		</main>
	);
}
