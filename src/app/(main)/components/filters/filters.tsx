import { BtnCleanFilters } from "@/components/btn-clean";
import { Suspense } from "react";
import CategoryFilter from "./category-filter";
import { DateFilter } from "./date-filter";
import SportFilter from "./sports-filter";

export default function Filters() {
	return (
		<Suspense>
			<ul className="flex flex-col md:flex-row gap-y-6 md:gap-y-0 items-start gap-x-4">
				<li>
					<CategoryFilter />
				</li>
				<li>
					<SportFilter />
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
