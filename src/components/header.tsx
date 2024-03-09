import { SlidersHorizontal } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import MatchFilters from "./match-filters";

export default function Header() {
	return (
		<header className="flex flex-row items-center justify-between md:justify-center gap-x-8 py-6 px-16 fixed h-[5.5rem] w-full z-50 bg-white">
			<h1 className="text-purple-500 font-medium text-3xl md:text-2xl">
				AreWePlaying?
			</h1>
			<MatchFilters isDesktop />
			<Sheet>
				<SheetTrigger className=" md:hidden">
					<SlidersHorizontal className="text-muted-foreground" />
				</SheetTrigger>
				<SheetContent>
					<MatchFilters />
				</SheetContent>
			</Sheet>
		</header>
	);
}
