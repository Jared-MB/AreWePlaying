import tournaments from "@/assets/tournaments.json";
import { CardBold } from "@/components/ui/card";
import Link from "next/link";

export default function MainPage() {
	return (
		<main className="container mx-auto px-4 py-8 md:py-12 grid grid-cols-2 gap-6">
			{tournaments.map((t) => (
				<Link href={`/${t.id}/`} key={t.id}>
					<CardBold className="p-6">
						<div className="mb-4 flex items-start justify-between gap-4">
							<span className="flex h-16 w-fit px-6 shrink-0 items-center justify-center border-2 border-foreground bg-foreground text-lg font-bold text-background">
								División {t.division}
							</span>
							<div className="font-mono font-bold text-lg h-10 w-fit px-6 bg-primary text-primary-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] grid place-items-center">
								{t.conference}
							</div>
						</div>
						<div className="border-t-4 border-foreground pt-4 font-mono text-xl font-bold uppercase leading-tight tracking-tight">
							{t.category === "men" ? "Varonil" : "Femenil"}
						</div>
					</CardBold>
				</Link>
			))}
		</main>
	);
}
