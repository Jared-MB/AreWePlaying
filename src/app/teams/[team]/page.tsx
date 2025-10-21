import type { Metadata } from "next";
import type { ResolvingMetadata } from "next";

import { getTeamPosition } from "@/use-cases/get-team-position";
import { getTeams } from "@/use-cases/get-teams";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ViewTransition } from "react";

export async function generateStaticParams() {
	const teams = await getTeams();
	return teams.map((team) => ({
		team: team.id,
	}));
}

export async function generateMetadata(
	{ params }: PageProps<"/teams/[team]">,
	parent: ResolvingMetadata,
): Promise<Metadata> {
	const { team: teamId } = await params;

	const team = await getTeamPosition(teamId);

	const previousImages = (await parent).openGraph?.images || [];

	if (!team) {
		return {
			title: "Equipo no encontrado",
			description: "El equipo que buscas no existe.",
		};
	}

	return {
		title: `${team.name} - ${team.shortName}`,
		description: `Partidos, estadísticas y calendario de ${team.shortName} en la liga ABE`,
		keywords: [team.name, team.shortName, "baloncesto", "liga ABE"],
		openGraph: {
			type: "website",
			title: `${team.name} - ${team.shortName}`,
			description: `Partidos, estadísticas y calendario de ${team.shortName} en la liga ABE`,
			siteName: "Are We Playing?",
			url: new URL(
				`/logos/${team.id}.avif`,
				process.env.NEXT_PUBLIC_SITE_URL,
			).toString(),
			images: [
				{
					url: `/logos/${team.id}.avif`,
					width: 200,
					height: 200,
					type: "image/avif",
				},
			],
			locale: "es_ES",
		},
		icons: previousImages.concat({
			url: `/logos/${team.id}.avif`,
			width: 128,
			height: 128,
			type: "image/avif",
		}),
	};
}

export default async function TeamPage({ params }: PageProps<"/teams/[team]">) {
	const teamId = (await params).team;

	const team = await getTeamPosition(teamId);

	if (!team) {
		redirect("/teams");
	}

	return (
		<div className="p-4 md:p-8">
			<div className="mx-auto max-w-7xl">
				{/* Back Link */}
				<Link
					href="/teams"
					className="mb-6 inline-block border-2 border-foreground bg-muted px-4 py-2 font-mono text-sm font-bold uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(107,33,168,0.3)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
				>
					← REGRESAR
				</Link>

				{/* Team Header */}
				<div className="mb-8 border-b-4 border-foreground pb-6">
					<div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
						<div className="flex items-start gap-4">
							<div className="flex h-24 w-24 items-center justify-center border-4 border-foreground bg-primary text-3xl font-bold text-primary-foreground">
								{team.shortName.split(" ")[0].substring(0, 3)}
							</div>
							<div>
								<h1 className="font-mono text-4xl font-bold uppercase tracking-wider md:text-6xl">
									<ViewTransition name={`team-${teamId}`}>
										<span>{team.shortName}</span>
									</ViewTransition>
								</h1>
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
						</div>

						{/* Team Stats */}
						<div className="flex gap-4">
							<div className="border-2 border-foreground bg-card p-4 text-center">
								<div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
									Record
								</div>
								<div className="mt-1 font-mono text-2xl font-bold">
									{team.wins}W - {team.losses}L
								</div>
							</div>
							<div className="border-2 border-foreground bg-card p-4 text-center">
								<div className="text-sm font-bold uppercase tracking-wider text-muted-foreground">
									Win Rate
								</div>
								<div className="mt-1 font-mono text-3xl font-bold text-primary">
									{team.wr}%
								</div>
							</div>
						</div>
					</div>
				</div>

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
				<div className="grid gap-8 md:grid-cols-2">
					{/* Past Matches */}
					{/*<div>
						<h2 className="mb-4 border-b-2 border-foreground pb-2 font-mono text-3xl font-bold uppercase tracking-wider">
							PAST MATCHES
						</h2>
						{team.pastMatches.length > 0 ? (
							<div className="space-y-3">
								{team.pastMatches.map((match, index) => (
									<Card
										key={index}
										className="border-2 border-foreground bg-card p-0 shadow-[2px_2px_0px_0px_rgba(107,33,168,0.3)]"
									>
										<div className="p-4">
											<div className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
												{match.date}
											</div>
											<div className="mb-2 flex items-center gap-2">
												<div
													className={`border-2 border-foreground px-3 py-1 font-mono text-lg font-bold ${
														match.result === "W"
															? "bg-primary text-primary-foreground"
															: "bg-destructive text-destructive-foreground"
													}`}
												>
													{match.result}
												</div>
												<div className="font-mono text-2xl font-bold">
													{match.score}
												</div>
											</div>
											<div className="font-mono text-sm font-bold uppercase tracking-wide">
												vs {match.opponent}
											</div>
											<div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
												{match.venue}
											</div>
										</div>
									</Card>
								))}
							</div>
						) : (
							<div className="border-2 border-foreground bg-muted p-6 text-center">
								<p className="font-mono text-sm font-bold uppercase tracking-wider text-muted-foreground">
									NO PAST MATCHES
								</p>
							</div>
						)}
					</div>*/}

					{/* Upcoming Matches */}
					{/*<div>
						<h2 className="mb-4 border-b-2 border-foreground pb-2 font-mono text-3xl font-bold uppercase tracking-wider">
							UPCOMING MATCHES
						</h2>
						{team.upcomingMatches.length > 0 ? (
							<div className="space-y-3">
								{team.upcomingMatches.map((match, index) => (
									<Card
										key={index}
										className="border-2 border-foreground bg-card p-0 shadow-[2px_2px_0px_0px_rgba(107,33,168,0.3)]"
									>
										<div className="p-4">
											<div className="mb-2 flex items-center justify-between">
												<div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
													{match.date}
												</div>
												<div className="font-mono text-sm font-bold">
													{match.time}
												</div>
											</div>
											<div className="mb-2 font-mono text-lg font-bold uppercase tracking-wide">
												vs {match.opponent}
											</div>
											<div className="text-xs uppercase tracking-wider text-muted-foreground">
												{match.venue}
											</div>
										</div>
									</Card>
								))}
							</div>
						) : (
							<div className="border-2 border-foreground bg-muted p-6 text-center">
								<p className="font-mono text-sm font-bold uppercase tracking-wider text-muted-foreground">
									NO UPCOMING MATCHES
								</p>
							</div>
						)}
					</div>*/}
				</div>
			</div>
		</div>
	);
}
