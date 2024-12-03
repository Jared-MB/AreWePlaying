import { BtnCleanFilters } from "@/components/btn-clean";
import { sport } from "@/core/modules/sport";
import { Suspense } from "react";
import CategoryFilter from "./category-filter";
import { DateFilter } from "./date-filter";
import SportFilter from "./sports-filter";

export default async function Filters() {
	const sports = await sport.getSports();

	return (
		<Suspense>
			<ul className="flex flex-col md:flex-row gap-y-6 md:gap-y-0 items-start gap-x-4">
				<li>
					<CategoryFilter />
				</li>
				<li>
					<SportFilter sports={sports} />
				</li>
				<li>
					<DateFilter />
				</li>
				<li>
					<BtnCleanFilters />
				</li>
			</ul>
		</Suspense>
	);
}
