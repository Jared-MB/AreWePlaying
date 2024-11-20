import {} from "@/components/ui/dialog";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { university } from "@/core/modules/university";
import AddUniversity from "./components/add-university";

export default async function UniversityPage() {
	const response = await university.getUniversities();

	return (
		<main className="flex flex-col gap-y-4 p-4">
			<header className="flex justify-between items-center">
				<h2 className="text-2xl text-purple-500">Universidades</h2>
				<AddUniversity />
			</header>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Nombre</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{response.map((university) => (
						<TableRow key={university.id}>
							<TableCell>{university.name}</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</main>
	);
}
