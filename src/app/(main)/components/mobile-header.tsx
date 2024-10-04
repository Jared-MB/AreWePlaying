import { AvatarProfile } from "@/components/avatar";
import {
	Sheet,
	SheetContent,
	SheetHeader,
	SheetTitle,
	SheetTrigger,
} from "@/components/ui/sheet";
import Filters from "./filters/filters";

export default function MobileHeader() {
	return (
		<Sheet>
			<SheetTrigger className="flex xl:hidden">
				<AvatarProfile />
			</SheetTrigger>
			<SheetContent className="w-[400px] sm:w-[540px] bg-zinc-50 dark:bg-background">
				<SheetHeader>
					<SheetTitle className="text-2xl text-purple-500">
						Filtrar resultados
					</SheetTitle>
				</SheetHeader>
				<section className="pt-6">
					<Filters />
				</section>
			</SheetContent>
		</Sheet>
	);
}
