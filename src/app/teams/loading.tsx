import { TeamCardSkeleton } from "@/components/team-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function TeamsLoading() {
	return (
		<main className="min-h-screen bg-background">
			<div className="p-4 md:p-8">
				<div className="mx-auto max-w-7xl">
					<header className="mb-12 border-8 border-foreground bg-foreground p-8 text-background shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
						<h1 className="font-mono text-7xl font-bold uppercase leading-none tracking-tighter md:text-9xl">
							TEAMS
						</h1>
						<div className="mt-6 flex flex-wrap gap-8 border-t-4 border-background pt-6">
							<div>
								<Skeleton className="h-13 w-22 mt-3" />
								<Skeleton className="h-4 w-32 mt-3" />
							</div>
							{/*<div>
								<div className="font-mono text-5xl font-bold md:text-7xl">
									{teams.filter((t) => t.league === "varonil").length}
								</div>
								<div className="font-mono text-sm uppercase tracking-wider opacity-70">
									Varonil
								</div>
							</div>
							<div>
								<div className="font-mono text-5xl font-bold md:text-7xl">
									{teams.filter((t) => t.league === "femenil").length}
								</div>
								<div className="font-mono text-sm uppercase tracking-wider opacity-70">
									Femenil
								</div>
							</div>*/}
						</div>
					</header>

					<div className="group mb-8 block">
						<div className="border-4 border-foreground bg-primary shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
							<div className="border-b-4 border-foreground bg-background px-6 py-3">
								<div className="font-mono text-sm font-bold uppercase tracking-wider text-muted-foreground">
									🏆 Top Performer
								</div>
							</div>
							<div className="grid gap-0 md:grid-cols-[1fr_auto]">
								<div className="p-8">
									{/*<div
										className={`mb-4 inline-block border-2 border-background px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider ${
											topTeam.league === "varonil"
												? "bg-background text-foreground"
												: "bg-secondary text-secondary-foreground"
										}`}
									>
										{topTeam.league}
									</div>*/}
									<Skeleton className="h-11 mt-2 mb-7 w-[60%]" />
									<div className="flex gap-8 pt-4">
										<div className="flex flex-col gap-3">
											<Skeleton className="h-13 w-42" />
											<Skeleton className="h-4 w-20" />
										</div>
										<div className="flex flex-col gap-3">
											<Skeleton className="h-13 w-36" />
											<Skeleton className="h-4 w-16" />
										</div>
									</div>
								</div>
								<div className="flex items-center justify-center border-l-4 border-foreground bg-background p-8 md:w-64">
									<div className="flex h-40 w-40 items-center justify-center border-4 border-foreground bg-primary text-5xl font-bold text-primary-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"></div>
								</div>
							</div>
						</div>
					</div>
					<section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3  gap-6">
						{Array.from({ length: 6 }).map((_, i) => (
							<TeamCardSkeleton key={i} />
						))}
					</section>
				</div>
			</div>
		</main>
	);
}
