import type { Match } from "@/types/match";
import type { Route } from "next";

import { Card } from "@/components/ui/card";
import Link from "next/link";

export function ScheduleTable({ matches }: { matches: Match[] }) {
	return (
		<div className="space-y-4">
			{/* Desktop Table Header */}
			<div className="hidden border-b-2 border-foreground pb-4 md:grid md:grid-cols-12 md:gap-4">
				<div className="col-span-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
					Fecha
				</div>
				<div className="col-span-5 text-sm font-bold uppercase tracking-wider text-muted-foreground">
					Equipos
				</div>
				<div className="col-span-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
					Lugar
				</div>
				<div className="col-span-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
					Estatus
				</div>
			</div>

			{/* Games List */}
			{matches.map((game) => (
				<Card
					key={game.matchId}
					className="border-2 border-foreground bg-card p-0 shadow-[2px_2px_0px_0px_rgba(107,33,168,0.3)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
				>
					<div className="grid gap-4 p-6 md:grid-cols-12 md:items-center">
						{/* Time */}
						<div className="col-span-12 md:col-span-2">
							<div className="text-xs font-bold uppercase tracking-wider text-muted-foreground md:hidden mb-1">
								Fecha
							</div>
							<div className="font-bold">{game.date.split(" ")[1]} HRS</div>
							<div className="text-sm text-muted-foreground">
								{game.date.split(" ")[0]}
							</div>
							<div className="mt-2 flex flex-wrap gap-2">
								<div className="inline-block border border-foreground bg-muted px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
									[SEMANA]
								</div>
								{/* <div
									className={`inline-block border border-foreground px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${
										game.league === "varonil"
											? "bg-primary text-primary-foreground"
											: "bg-secondary text-secondary-foreground"
									}`}
								>
									{game.league}
								</div> */}
							</div>
						</div>

						{/* Matchup */}
						<div className="col-span-12 md:col-span-5">
							<div className="text-xs font-bold uppercase tracking-wider text-muted-foreground md:hidden mb-1">
								Equipos
							</div>
							<div className="space-y-2">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center border-2 border-foreground bg-primary text-xs font-bold text-primary-foreground">
										{game.localTeam.split(" ")[0].substring(0, 3)}
									</div>
									<div className="flex flex-1 items-center justify-between">
										<div className="font-bold uppercase tracking-wide">
											{game.localTeam}
										</div>
										{game.started === 0 || game.live === 0 ? (
											<div
												className={`border-2 border-foreground px-4 py-1 text-2xl font-bold ${
													game.localTeamPoints > (game.visitingTeamPoints || 0)
														? "bg-primary text-primary-foreground"
														: "bg-muted text-muted-foreground"
												}`}
											>
												{game.localTeamPoints}
											</div>
										) : null}
									</div>
								</div>
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center border-2 border-foreground bg-secondary text-xs font-bold text-secondary-foreground">
										{game.visitingTeam.split(" ")[0].substring(0, 3)}
									</div>
									<div className="flex flex-1 items-center justify-between">
										<div className="font-bold uppercase tracking-wide">
											{game.visitingTeam}
										</div>
										{game.started === 0 || game.live === 0 ? (
											<div
												className={`border-2 border-foreground px-4 py-1 text-2xl font-bold ${
													game.visitingTeamPoints > (game.localTeamPoints || 0)
														? "bg-primary text-primary-foreground"
														: "bg-muted text-muted-foreground"
												}`}
											>
												{game.visitingTeamPoints}
											</div>
										) : null}
									</div>
								</div>
							</div>
						</div>

						{/* Venue */}
						<div className="col-span-12 md:col-span-3">
							<div className="text-xs font-bold uppercase tracking-wider text-muted-foreground md:hidden mb-1">
								Lugar
							</div>
							<Link
								href={game?.locationUrl as Route}
								target="_blank"
								rel="noreferrer noopener"
								className="text-sm font-bold uppercase tracking-wide"
							>
								{game.location}
							</Link>
						</div>

						{/* Status */}
						<div className="col-span-12 md:col-span-2">
							<div className="text-xs font-bold uppercase tracking-wider text-muted-foreground md:hidden mb-1">
								Estatus
							</div>
							<div
								className={`inline-block border-2 border-foreground px-3 py-1 text-xs font-bold uppercase tracking-wider ${
									game.live === 1
										? "bg-primary text-primary-foreground"
										: game.started === 1
											? "bg-muted text-muted-foreground"
											: "bg-primary text-primary-foreground"
								}`}
							>
								{game.live === 1
									? "EN CURSO"
									: game.started === 1
										? "NO INICIADO"
										: "COMPLETADO"}
							</div>
						</div>
					</div>
				</Card>
			))}
		</div>
	);
}
