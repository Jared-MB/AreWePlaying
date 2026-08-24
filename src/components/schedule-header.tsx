import Link from "next/link";

import { Button } from "@/components/ui/button";
import { SelectUniversity } from "./select-university";

export function ScheduleHeader() {
	return (
		<header className="border-b-4 border-foreground bg-background sticky top-0 z-10">
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between py-6">
					<nav className="flex items-center gap-6 md:gap-8">
						<Button
							variant="ghost"
							className="text-sm font-bold uppercase tracking-wider hover:!bg-primary hover:text-primary-foreground"
							asChild
						>
							<Link href="/weeks" aria-label="Ver horarios">
								Horarios
							</Link>
						</Button>
						<Button
							variant="ghost"
							className="text-sm font-bold uppercase tracking-wider hover:!bg-primary hover:text-primary-foreground"
							asChild
						>
							<Link href="/teams" aria-label="Ver equipos">
								Equipos
							</Link>
						</Button>
					</nav>

					<div className="flex items-center gap-4">
						<div className="hidden md:inline-block">
							<SelectUniversity />
						</div>
					</div>
				</div>
			</div>
		</header>
	);
}
