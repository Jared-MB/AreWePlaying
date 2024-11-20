import {} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { team } from "@/core/modules/team";
import { university } from "@/core/modules/university";
import AddTeam from "./components/add-team";

export default async function TeamPage() {
	const universities = await university.getUniversities();
	const teams = await team.getTeams();

	return (
		<main className="flex flex-col gap-y-4 p-4">
			<header className="flex justify-between items-center">
				<h2 className="text-2xl text-purple-500">Equipos</h2>
				<AddTeam universities={universities} />
			</header>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Nombre</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{teams.map((team) => (
						<TableRow key={team.id}>
							<TableCell>{team.name}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</main>
	);
}
