import { getTeamById } from "@/use-cases/get-team-by-id";
import { getTeams } from "@/use-cases/get-teams";
import { ViewTransition } from "react";

export async function generateStaticParams() {
	const teams = await getTeams();
	return teams.map((team) => ({
		team: team.id,
	}));
}

export default async function TeamPage({ params }: PageProps<"/teams/[team]">) {
	const teamId = (await params).team;

	const team = await getTeamById(teamId);

	return (
		<div>
			<h3>
				<ViewTransition name={`team-${teamId}`}>
					<span>{team?.name}</span>
				</ViewTransition>
			</h3>
		</div>
	);
}
