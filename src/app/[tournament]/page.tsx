import { getCurrentWeek } from "@/lib/get-current-week";
import { getWeeksByTournamentId } from "@/use-cases/get-weeks-by-tournament-id";
import { cacheLife } from "next/cache";
import { redirect } from "next/navigation";

export default async function WeeksPage({
	params,
}: PageProps<"/[tournament]">) {
	"use cache";
	cacheLife("days");

	const { tournament } = await params;
	const weeks = await getWeeksByTournamentId(tournament);
	const currentWeek = getCurrentWeek(weeks);

	redirect(`/${tournament}/${currentWeek?.id}`);
}
