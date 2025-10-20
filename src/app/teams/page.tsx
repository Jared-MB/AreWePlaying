import { getTeams } from "@/use-cases/get-teams";
import Link from "next/link";
import { ViewTransition } from "react";

export default async function TeamsPage() {
	const teams = await getTeams();
	return (
		<div>
			<h3>[STILL IN PROGRESS]</h3>
			{teams.map((team) => (
				<div key={team.id}>
					<Link
						href={`/teams/${team.id}`}
						className="text-foreground hover:text-primary transition-colors"
					>
						<ViewTransition name={`team-${team.id}`}>
							<span>{team.name}</span>
						</ViewTransition>
					</Link>
				</div>
			))}
		</div>
	);
}
