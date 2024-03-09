import Match from "@/components/match";
import { MATCHES } from "@/data/matches";

export default function Home() {
	return (
		<main className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 px-16 pb-6 relative top-28">
			{MATCHES.map((match) => (
				<Match
					key={match.id}
					away={{
						name: match.university.name,
						logo: match.university.image.url,
					}}
					local={match.isLocal}
					date={match.date}
					location={match.location}
					sport={match.sport.name}
					gender={match.gender}
				/>
			))}
		</main>
	);
}
