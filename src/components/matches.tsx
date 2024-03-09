"use client";

import Match from "@/components/match";
import useMatch from "@/hooks/useMatch";
import { MatchService } from "@/services/match.service";
import { useMatchStore } from "@/store/matches.store";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function Matches() {
	const { initialMatches, setInitialMatches, matches } = useMatchStore();

	const { changeMatches } = useMatch();

	const { data } = useQuery({
		queryKey: ["matches"],
		queryFn: MatchService.getMatches,
	});

	useEffect(() => {
		if (data) {
			setInitialMatches(data);
		}
	}, [data]);

	useEffect(() => {
		changeMatches();
	}, [initialMatches]);

	if (!data) return <div>Loading...</div>;

	if (matches.length === 0)
		return (
			<>
				{data.map((match) => (
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
			</>
		);

	return (
		<>
			{matches.map((match) => (
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
		</>
	);

	// ...
}
