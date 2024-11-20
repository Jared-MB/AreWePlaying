import { Card } from "@/components/match";
import { Welcome } from "@/core/hooks/useWelcome";
import { match } from "@/core/modules/matches";

export default async function Page() {
	const matches = await match.getMatches();

	return (
		<main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
			{matches.map((match) => (
				<Card key={match.id} {...match} />
			))}
			<Welcome />
		</main>
	);
}
