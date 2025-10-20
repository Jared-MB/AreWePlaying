"use client";

import { useCurrentWeek } from "@/hooks/use-current-week";
import { useUniversity } from "@/hooks/use-university";
import { getMatchDays } from "@/use-cases/get-match-days";
import { getMatchesByWeek } from "@/use-cases/get-matches-by-week";
import { useQuery } from "@tanstack/react-query";
import { isSameDay, parse } from "date-fns";
import confetti from "canvas-confetti";
import { useConfettiStore } from "@/hooks/use-confetti";
import { useEffect } from "react";

export function AreWePlaying() {
	const { data: matchDays } = useQuery({
		queryKey: ["matchDays"],
		queryFn: getMatchDays,
	});

	const { currentWeek, today } = useCurrentWeek(matchDays ?? []);

	const { data: matches } = useQuery({
		queryKey: ["matches", currentWeek?.id],
		queryFn: () => getMatchesByWeek(currentWeek?.id),
	});

	const university = useUniversity((state) => state.university);

	const isPlaying = matches?.some(
		(match) =>
			(match.localTeamId === university ||
				match.visitingTeamId === university) &&
			isSameDay(
				parse(match.date.split(" ")[0], "dd/MM/yyyy", new Date()),
				today,
			),
	);

	const hasThrownConfetti = useConfettiStore(
		(state) => state.hasThrownConfetti,
	);
	const setHasThrownConfetti = useConfettiStore(
		(state) => state.setHasThrownConfetti,
	);

	useEffect(() => {
		setHasThrownConfetti(false);
	}, [university]);

	useEffect(() => {
		if (isPlaying && !hasThrownConfetti) {
			confetti({
				particleCount: 60,
				spread: 100,
				startVelocity: 45,
				origin: { y: 0.6 },
				gravity: 0.5,
				disableForReducedMotion: true,
			});
			setHasThrownConfetti(true);
		}
	}, [isPlaying]);

	if (!isPlaying) return null;

	return (
		<span className="mb-8 text-6xl font-bold uppercase md:text-8xl text-primary">
			Yes!!
		</span>
	);
}
