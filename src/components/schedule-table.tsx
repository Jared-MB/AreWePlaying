import { Card } from "@/components/ui/card";
import { getMatchesByWeek } from "@/use-cases/get-matches-by-week";

const games = [
	{
		time: "7:00 PM - 9:00 PM",
		date: "NOV 15, 2024",
		week: "Week 1",
		league: "varonil",
		homeTeam: "DUKE BLUE DEVILS",
		awayTeam: "KENTUCKY WILDCATS",
		venue: "CAMERON INDOOR STADIUM",
		status: "COMPLETED",
		homeScore: 88,
		awayScore: 76,
	},
	{
		time: "8:30 PM - 10:30 PM",
		date: "NOV 16, 2024",
		week: "Week 1",
		league: "femenil",
		homeTeam: "KANSAS JAYHAWKS",
		awayTeam: "NORTH CAROLINA TAR HEELS",
		venue: "ALLEN FIELDHOUSE",
		status: "COMPLETED",
		homeScore: 92,
		awayScore: 89,
	},
	{
		time: "6:00 PM - 8:00 PM",
		date: "NOV 17, 2024",
		week: "Week 2",
		league: "varonil",
		homeTeam: "GONZAGA BULLDOGS",
		awayTeam: "UCLA BRUINS",
		venue: "MCCARTHEY ATHLETIC CENTER",
		status: "LIVE",
		homeScore: 45,
		awayScore: 42,
	},
	{
		time: "9:00 PM - 11:00 PM",
		date: "NOV 18, 2024",
		week: "Week 2",
		league: "femenil",
		homeTeam: "VILLANOVA WILDCATS",
		awayTeam: "UCONN HUSKIES",
		venue: "FINNERAN PAVILION",
		status: "UPCOMING",
	},
	{
		time: "7:30 PM - 9:30 PM",
		date: "NOV 19, 2024",
		week: "Week 3",
		league: "varonil",
		homeTeam: "MICHIGAN STATE SPARTANS",
		awayTeam: "PURDUE BOILERMAKERS",
		venue: "BRESLIN CENTER",
		status: "UPCOMING",
	},
	{
		time: "8:00 PM - 10:00 PM",
		date: "NOV 20, 2024",
		week: "Week 3",
		league: "femenil",
		homeTeam: "DUKE BLUE DEVILS",
		awayTeam: "GONZAGA BULLDOGS",
		venue: "CAMERON INDOOR STADIUM",
		status: "COMPLETED",
		homeScore: 78,
		awayScore: 84,
	},
];

export async function ScheduleTable({ week }: { week?: string }) {
	const matches = await getMatchesByWeek(week);

	return (
		<div className="space-y-4">
			{/* Desktop Table Header */}
			<div className="hidden border-b-2 border-foreground pb-4 md:grid md:grid-cols-12 md:gap-4">
				<div className="col-span-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
					Fecha
				</div>
				<div className="col-span-5 text-sm font-bold uppercase tracking-wider text-muted-foreground">
					Equipos
				</div>
				<div className="col-span-3 text-sm font-bold uppercase tracking-wider text-muted-foreground">
					Lugar
				</div>
				<div className="col-span-2 text-sm font-bold uppercase tracking-wider text-muted-foreground">
					Estatus
				</div>
			</div>

			{/* Games List */}
			{matches.map((game, index) => (
				<Card
					key={game.matchId}
					className="border-2 border-foreground bg-card p-0 shadow-[2px_2px_0px_0px_rgba(107,33,168,0.3)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none"
				>
					<div className="grid gap-4 p-6 md:grid-cols-12 md:items-center">
						{/* Time */}
						<div className="col-span-12 md:col-span-2">
							<div className="text-xs font-bold uppercase tracking-wider text-muted-foreground md:hidden mb-1">
								Fecha
							</div>
							<div className="font-bold">{game.date.split(" ")[1]} HRS</div>
							<div className="text-sm text-muted-foreground">
								{game.date.split(" ")[0]}
							</div>
							<div className="mt-2 flex flex-wrap gap-2">
								<div className="inline-block border border-foreground bg-muted px-2 py-0.5 text-xs font-bold uppercase tracking-wider text-muted-foreground">
									[SEMANA]
								</div>
								{/* <div
									className={`inline-block border border-foreground px-2 py-0.5 text-xs font-bold uppercase tracking-wider ${
										game.league === "varonil"
											? "bg-primary text-primary-foreground"
											: "bg-secondary text-secondary-foreground"
									}`}
								>
									{game.league}
								</div> */}
							</div>
						</div>

						{/* Matchup */}
						<div className="col-span-12 md:col-span-5">
							<div className="text-xs font-bold uppercase tracking-wider text-muted-foreground md:hidden mb-1">
								Equipos
							</div>
							<div className="space-y-2">
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center border-2 border-foreground bg-primary text-xs font-bold text-primary-foreground">
										{game.localTeam.split(" ")[0].substring(0, 3)}
									</div>
									<div className="flex flex-1 items-center justify-between">
										<div className="font-bold uppercase tracking-wide">
											{game.localTeam}
										</div>
										{game.started === 0 || game.live === 0 ? (
											<div
												className={`border-2 border-foreground px-4 py-1 text-2xl font-bold ${
													game.localTeamPoints! > (game.visitingTeamPoints || 0)
														? "bg-primary text-primary-foreground"
														: "bg-muted text-muted-foreground"
												}`}
											>
												{game.localTeamPoints}
											</div>
										) : null}
									</div>
								</div>
								<div className="flex items-center gap-3">
									<div className="flex h-10 w-10 items-center justify-center border-2 border-foreground bg-secondary text-xs font-bold text-secondary-foreground">
										{game.visitingTeam.split(" ")[0].substring(0, 3)}
									</div>
									<div className="flex flex-1 items-center justify-between">
										<div className="font-bold uppercase tracking-wide">
											{game.visitingTeam}
										</div>
										{game.started === 0 || game.live === 0 ? (
											<div
												className={`border-2 border-foreground px-4 py-1 text-2xl font-bold ${
													game.visitingTeamPoints! > (game.localTeamPoints || 0)
														? "bg-primary text-primary-foreground"
														: "bg-muted text-muted-foreground"
												}`}
											>
												{game.visitingTeamPoints}
											</div>
										) : null}
									</div>
								</div>
							</div>
						</div>

						{/* Venue */}
						<div className="col-span-12 md:col-span-3">
							<div className="text-xs font-bold uppercase tracking-wider text-muted-foreground md:hidden mb-1">
								Lugar
							</div>
							<div className="text-sm font-bold uppercase tracking-wide">
								{game.location}
							</div>
						</div>

						{/* Status */}
						<div className="col-span-12 md:col-span-2">
							<div className="text-xs font-bold uppercase tracking-wider text-muted-foreground md:hidden mb-1">
								Estatus
							</div>
							<div
								className={`inline-block border-2 border-foreground px-3 py-1 text-xs font-bold uppercase tracking-wider ${
									game.live === 1
										? "bg-primary text-primary-foreground"
										: game.started === 1
											? "bg-muted text-muted-foreground"
											: "bg-primary text-primary-foreground"
								}`}
							>
								{game.live === 1
									? "EN CURSO"
									: game.started === 1
										? "NO INICIADO"
										: "COMPLETADO"}
							</div>
						</div>
					</div>
				</Card>
			))}
		</div>
	);
}
