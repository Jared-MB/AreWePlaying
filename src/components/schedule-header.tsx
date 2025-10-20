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
							<Link href="/">Horarios</Link>
						</Button>
						<Button
							variant="ghost"
							className="text-sm font-bold uppercase tracking-wider hover:!bg-primary hover:text-primary-foreground"
							asChild
						>
							<Link href="/teams">Equipos</Link>
						</Button>
						{/* <Button
							variant="ghost"
							className="text-sm font-bold uppercase tracking-wider hover:bg-primary hover:text-primary-foreground"
						>
							Standings
						</Button> */}
					</nav>

					<div className="flex items-center gap-4">
						<div className="hidden md:inline-block">
							<SelectUniversity />
						</div>
						{/*<Button
							variant="outline"
							className="border-2 border-foreground font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none bg-transparent"
						>
							Sign Up
						</Button>
						<Button className="border-2 border-foreground bg-primary font-bold uppercase tracking-wider text-primary-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
							Login
						</Button>*/}
					</div>
				</div>
			</div>
		</header>
	);
}
