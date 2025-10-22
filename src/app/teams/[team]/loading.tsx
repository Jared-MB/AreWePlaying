import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { PastMatchesSkeleton } from "./past-matches";
import { UpcomingMatchesSkeleton } from "./upcoming-matches";

export default function TeamLoading() {
	return (
		<main className="p-4 md:p-8">
			<div className="mx-auto max-w-7xl">
				{/* Back Link */}
				<Link
					href="/teams"
					className="mb-6 inline-block border-2 border-foreground bg-muted px-4 py-2 font-mono text-sm font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(107,33,168,0.3)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
				>
					← REGRESAR
				</Link>

				{/* Team Header */}
				<header className="mb-8 border-b-4 border-foreground pb-6">
					<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
						<div className="grid grid-cols-[auto_1fr] gap-4 max-w-[75%]">
							<div className="flex size-20 items-center justify-center border-4 border-foreground bg-primary text-3xl font-bold text-primary-foreground"></div>
							<Skeleton className="w-96 h-12 mt-2" />
							{/*<div
									className={`mt-2 inline-block border border-foreground px-3 py-1 text-sm font-bold uppercase tracking-wider ${
										team.league === "varonil"
											? "bg-primary text-primary-foreground"
											: "bg-secondary text-secondary-foreground"
									}`}
								>
									{team.league}
								</div>*/}
						</div>

						{/* Team Stats */}
						<section className="flex gap-4">
							<article className="border-2 border-foreground bg-card p-4 text-center">
								<Skeleton className="h-4 w-18 mx-auto" />
								<Skeleton className="h-7 w-25 mt-3 mb-1 mx-1" />
							</article>
							<article className="border-2 border-foreground bg-card p-4 text-center">
								<Skeleton className="h-4 w-18 mx-auto" />
								<Skeleton className="h-7 w-20 mt-3 mb-1 mx-1" />
							</article>
						</section>
					</div>
				</header>

				{/* Players Section */}
				{/*<div className="mb-8">
					<h2 className="mb-4 border-b-2 border-foreground pb-2 font-mono text-3xl font-bold uppercase tracking-wider">
						ROSTER
					</h2>
					<div className="space-y-2">
						{team.players.map((player) => (
							<Card
								key={player.number}
								className="border-2 border-foreground bg-card p-0 shadow-[2px_2px_0px_0px_rgba(107,33,168,0.3)]"
							>
								<div className="grid grid-cols-12 items-center gap-4 p-4">
									<div className="col-span-2 md:col-span-1">
										<div className="flex h-12 w-12 items-center justify-center border-2 border-foreground bg-primary font-mono text-xl font-bold text-primary-foreground">
											{player.number}
										</div>
									</div>

									<div className="col-span-10 md:col-span-4">
										<div className="font-mono text-lg font-bold uppercase tracking-wide">
											{player.name}
										</div>
										<div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
											{player.position}
										</div>
									</div>

									<div className="col-span-12 grid grid-cols-3 gap-4 border-t-2 border-foreground pt-4 md:col-span-7 md:border-l-2 md:border-t-0 md:pl-4 md:pt-0">
										<div className="text-center">
											<div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
												PPG
											</div>
											<div className="font-mono text-xl font-bold">
												{player.ppg}
											</div>
										</div>
										<div className="text-center">
											<div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
												RPG
											</div>
											<div className="font-mono text-xl font-bold">
												{player.rpg}
											</div>
										</div>
										<div className="text-center">
											<div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
												APG
											</div>
											<div className="font-mono text-xl font-bold">
												{player.apg}
											</div>
										</div>
									</div>
								</div>
							</Card>
						))}
					</div>
				</div>*/}

				{/* Matches Section */}
				<section className="grid gap-8 md:grid-cols-2">
					{/* Past Matches */}
					<article>
						<div className="border-b-2 border-foreground">
							<Skeleton className="h-7 w-52 mb-4" />
						</div>
						<div className="pt-4">
							<PastMatchesSkeleton />
						</div>
					</article>

					{/* Upcoming Matches */}
					<article>
						<div className="border-b-2 border-foreground">
							<Skeleton className="h-7 w-56 mb-4" />
						</div>
						<div className="pt-4">
							<UpcomingMatchesSkeleton />
						</div>
					</article>
				</section>
			</div>
		</main>
	);
}
