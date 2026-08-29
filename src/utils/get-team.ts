import { getTeamsTable } from "./get-teams-table";

export async function getTeam({
	teamId,
	tournamentId,
}: {
	tournamentId: string;
	teamId: string;
}) {
	const teams = await getTeamsTable(tournamentId);

	const team = teams.find((t) => t.id === teamId);
	return team;
}
