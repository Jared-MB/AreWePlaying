import {} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { match } from "@/core/modules/matches";
import { sport } from "@/core/modules/sport";
import { team } from "@/core/modules/team";
import AddMatch from "./components/add-match";

export default async function Match() {
	const teams = await team.getTeams();
	const sports = await sport.getSports();
	const matches = await match.getMatches(new URLSearchParams());

	return (
		<main className="flex flex-col gap-y-4 p-4">
			<header className="flex justify-between items-center">
				<h2 className="text-2xl text-purple-500">Partidos</h2>
				<AddMatch teams={teams} sports={sports} />
			</header>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Local</TableHead>
						<TableHead>Visitante</TableHead>
						<TableHead>Fecha</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{matches.map((match) => (
						<TableRow key={match.id}>
							<TableCell>{match.localTeam.name}</TableCell>
							<TableCell>{match.visitorTeam.name}</TableCell>
							<TableCell>{new Date(match.date).toDateString()}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</main>
	);
}
