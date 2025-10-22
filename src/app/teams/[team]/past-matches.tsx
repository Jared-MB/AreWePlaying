import type { Route } from "next";

import { PrefetchLink } from "@/components/prefetch-link";
import { Card } from "@/components/ui/card";
import { getPastMatches } from "@/use-cases/get-past-matches";
import Link from "next/link";

export async function PastMatches({ teamId }: { teamId: string }) {
	const pastMatches = await getPastMatches(teamId);

	return (
		<>
			{pastMatches.length > 0 ? (
				<div className="space-y-3">
					{pastMatches.map((match) => {
						const isHome = match.localTeamId === teamId;

						const isWin = isHome
							? Number(match.localTeamPoints) > Number(match.visitingTeamPoints)
							: Number(match.visitingTeamPoints) >
								Number(match.localTeamPoints);

						return (
							<Card
								key={match.matchId}
								className="border-2 border-foreground bg-card p-0 shadow-[2px_2px_0px_0px_rgba(107,33,168,0.3)]"
							>
								<div className="p-4">
									<div className="mb-2 flex items-center justify-between">
										<div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
											{match.date}
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
									<div className="mb-2 flex items-center gap-2">
										<div
											className={`border-2 border-foreground px-3 py-1 font-mono text-lg font-bold ${
												isWin
													? "bg-primary text-primary-foreground"
													: "bg-destructive text-destructive-foreground"
											}`}
										>
											{isWin ? "W" : "L"}
										</div>
										<div className="font-mono text-2xl font-bold">
											{isHome
												? `${match.localTeamPoints} - ${match.visitingTeamPoints}`
												: `${match.visitingTeamPoints} - ${match.localTeamPoints}`}
										</div>
									</div>
									<div className="font-mono text-sm font-bold uppercase tracking-wide">
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
										rel="noopener noreferrer"
										className="mt-1 text-xs uppercase tracking-wider text-muted-foreground"
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
						NO HAY PARTIDOS JUGADOS
					</p>
				</div>
			)}
		</>
	);
}
