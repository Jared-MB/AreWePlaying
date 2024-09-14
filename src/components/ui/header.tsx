import Link from "next/link";
import { Suspense } from "react";
import { BtnCleanFilters } from "../btn-clean";
import CategoryFilter from "../category-Filter";
import { DateFilter } from "../date-filter";
import SportFilter from "../sports-filter";

export default function Header() {
	return (
		<header className="flex items-center justify-between gap-x-8 py-6 px-16 fixed h-[5.5rem] w-full z-50 bg-white">
			<h1>
				<Link href="/" className="text-primary font-medium text-3xl ">
					AreWePlaying?
				</Link>
			</h1>
			<Suspense>
				<ul className="flex gap-x-4">
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
			<span>Menu</span>
		</header>
	);
}
