"use client";

import type { TeamPosition } from "@/types/team";

import Link from "next/link";
import { ViewTransition } from "react";

import { cn } from "@/lib/utils";
import { useUniversity } from "@/hooks/use-university";

export function TeamCard({ team }: { team: TeamPosition }) {
	const university = useUniversity((state) => state.university);

	return (
		<Link
			key={team.id}
			href={`/teams/${team.id}`}
			className={cn("group block basis-1/3")}
		>
			<div
				className={cn(
					"h-full border-4 border-foreground bg-card transition-all hover:translate-x-[2px] hover:translate-y-[2px] ",
					university === team.id
						? "shadow-[6px_6px_0px_0px_rgba(107,33,168,1)] hover:shadow-[2px_2px_0px_0px_rgba(107,33,168,1)]"
						: "shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]",
				)}
			>
				<div className="relative h-3 border-b-4 border-foreground bg-muted">
					<div
						className="h-full bg-primary"
						style={{ width: `${team.percentage}%` }}
					/>
				</div>

				<div className="p-6">
					<div className="mb-4 flex items-start justify-between gap-4">
						<div className="flex h-16 w-16 shrink-0 items-center justify-center border-2 border-foreground bg-foreground text-lg font-bold text-background">
							{team.shortName.split(" ")[0].substring(0, 3)}
						</div>

						{/*<div
												className={`border border-foreground px-2 py-1 text-xs font-bold uppercase tracking-wider ${
													team.league === "varonil"
														? "bg-primary text-primary-foreground"
														: "bg-secondary text-secondary-foreground"
												}`}
											>
												{team.league}
											</div>*/}
						<div className="font-mono font-bold text-lg size-10 bg-primary text-primary-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] grid place-items-center">
							{team.position}
						</div>
					</div>

					<h2
						className={cn(
							"mb-4 font-mono text-xl font-bold uppercase leading-tight tracking-tight",
							university === team.id ? "text-primary" : "",
						)}
					>
						<ViewTransition name={`team-${team.id}`}>
							<span>{team.shortName}</span>
						</ViewTransition>
					</h2>

					<div className="flex items-end justify-between border-t-4 border-foreground pt-4">
						<div>
							<div className="font-mono text-3xl font-bold leading-none">
								{team.percentage}%
							</div>
							<div className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
								Win Rate
							</div>
						</div>
						<div className="text-right">
							<div className="font-mono text-2xl font-bold leading-none">
								{team.wins}-{team.losses}
							</div>
							<div className="mt-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
								W-L
							</div>
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
}
