import { PrefetchLink } from "@/components/prefetch-link";
import { Card } from "@/components/ui/card";
import { getUpcomingMatches } from "@/use-cases/get-upcoming-matches";
import type { Route } from "next";
import Link from "next/link";

export async function UpcomingMatches({ teamId }: { teamId: string }) {
	const upcomingMatches = await getUpcomingMatches(teamId);

	return (
		<>
			{upcomingMatches.length > 0 ? (
				<div className="space-y-3">
					{upcomingMatches.map((match) => {
						const isHome = match.localTeamId === teamId;

						return (
							<Card
								key={match.matchId}
								className="border-2 border-foreground bg-card p-0 shadow-[2px_2px_0px_0px_rgba(107,33,168,0.3)]"
							>
								<div className="p-4">
									<div className="mb-2 flex items-center justify-between">
										<div className="flex flex-col gap-1">
											<div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
												{match.date.split(" ")[0]}
											</div>
											<div className="font-mono text-sm font-bold">
												{match.date.split(" ")[1]} HRS
											</div>
										</div>
										<div
											className={`border border-foreground px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${
												isHome
													? "bg-primary text-primary-foreground"
													: "bg-muted text-muted-foreground"
											}`}
										>
											{isHome ? "EN CASA" : "VISITANTE"}
										</div>
									</div>

									<div className="mb-2 font-mono text-lg font-bold uppercase tracking-wide">
										vs{" "}
										<PrefetchLink
											href={
												`/teams/${isHome ? match.visitingTeamId : match.localTeamId}` as Route
											}
										>
											{isHome ? match.visitingTeam : match.localTeam}
										</PrefetchLink>
									</div>
									<Link
										href={match.locationUrl as Route}
										target="_blank"
										rel="noreferrer noopener"
										className="text-xs uppercase tracking-wider text-muted-foreground"
									>
										{match.location}
									</Link>
								</div>
							</Card>
						);
					})}
				</div>
			) : (
				<div className="border-2 border-foreground bg-muted p-6 text-center">
					<p className="font-mono text-sm font-bold uppercase tracking-wider text-muted-foreground">
						NO HAY MAS PARTIDOS POR JUGAR
					</p>
				</div>
			)}
		</>
	);
}
