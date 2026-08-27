"use client";

import { Button } from "@/components/ui/button";
import { useParams } from "next/navigation";
import { PrefetchLink } from "./prefetch-link";
import {
	SelectUniversity,
	SelectUniversitySkeleton,
} from "./select-university";
import { useCurrentWeek } from "@/hooks/use-current-week";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import { useRouter } from "next/navigation";
import type { Route } from "next";
import Link from "next/link";
import tournaments from "@/assets/tournaments.json";
import type { Week } from "@/types/week";

export function ScheduleFilters({ weeks }: { weeks: Week[] }) {
	const week = useCurrentWeek(weeks);

	const { week: weekId, tournament: tournamenId } = useParams();

	const tournament = tournaments.find((t) => t.id === tournamenId);
	const tournamentsByConference = tournaments.filter(
		(t) =>
			t.conference === tournament?.conference &&
			t.division === tournament.division,
	);

	const womenTournament = tournamentsByConference.find(
		(t) => t.category === "women",
	);
	const menTournament = tournamentsByConference.find(
		(t) => t.category === "men",
	);

	const selectedWeek = weekId?.toString() ?? week.currentWeek?.id;

	const router = useRouter();

	const handleWeekChange = (week: string) => {
		router.push(`/${tournamenId}/${week}`);
	};

	return (
		<div className="mb-12 space-y-6">
			{/* League Filter - Horizontal Pills */}
			<div className="flex items-center justify-between">
				<div className="flex flex-wrap items-center gap-3">
					<span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
						Rama:
					</span>
					<div className="flex flex-wrap gap-2">
						<Button
							size="sm"
							className={`hover:text-primary-foreground border-2 border-foreground font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none ${
								tournamenId === womenTournament?.id
									? "bg-primary text-primary-foreground"
									: "bg-background text-foreground"
							}`}
							asChild
						>
							<Link href={`/${womenTournament?.id}/${weekId}`}>Femenil</Link>
						</Button>
						<Button
							size="sm"
							className={`hover:text-primary-foreground border-2 border-foreground font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none ${
								tournamenId === menTournament?.id
									? "bg-primary text-primary-foreground"
									: "bg-background text-foreground"
							}`}
							asChild
						>
							<Link href={`/${menTournament?.id}/${weekId}`}>Varonil</Link>
						</Button>
					</div>
				</div>
				<div className="inline-block md:hidden">
					<SelectUniversity />
				</div>
			</div>

			{/* Divider */}
			<div className="h-[2px] bg-foreground" />

			{/* Week and Team Filters - Side by Side */}
			<div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-12">
				{/* Week Filter */}
				<div className="flex flex-wrap gap-2">
					<span className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center mr-1">
						Semana:
					</span>
					<Select value={selectedWeek} onValueChange={handleWeekChange}>
						<SelectTrigger className="md:hidden !bg-primary border-2 [&>svg]:fill-primary-foreground border-foreground text-primary-foreground font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
							<SelectValue placeholder="Selecciona una semana" />
						</SelectTrigger>
						<SelectContent>
							{weeks.map((week) => (
								<SelectItem key={week.id} value={week.id}>
									{week.week}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{weeks.map((week) => (
						<Button
							key={week.id}
							size="sm"
							asChild
							className={`hidden md:grid place-content-center duration-300 hover:text-primary-foreground border-2 border-foreground font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none ${
								selectedWeek === week.id
									? "bg-foreground text-background"
									: "bg-background text-foreground"
							}`}
						>
							<PrefetchLink href={`/${tournamenId}/${week.id}` as Route}>
								{week.week}
							</PrefetchLink>
						</Button>
					))}
				</div>
			</div>
			<div className="h-[4px] bg-foreground" />
		</div>
	);
}

export function ScheduleFiltersSkeleton({ weeks }: { weeks: Week[] }) {
	return (
		<div className="mb-12 space-y-6">
			{/* League Filter - Horizontal Pills */}
			<div className="flex items-center justify-between">
				<div className="flex flex-wrap items-center gap-3">
					<span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
						Rama:
					</span>
					<div className="flex flex-wrap gap-2">
						<Button
							size="sm"
							className={`hover:text-primary-foreground border-2 border-foreground font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none bg-background text-foreground`}
						>
							Femenil
						</Button>
						<Button
							size="sm"
							className={`hover:text-primary-foreground border-2 border-foreground font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none bg-background text-foreground`}
						>
							Varonil
						</Button>
					</div>
				</div>
				<div className="inline-block md:hidden">
					<SelectUniversitySkeleton />
				</div>
			</div>

			{/* Divider */}
			<div className="h-[2px] bg-foreground" />

			{/* Week and Team Filters - Side by Side */}
			<div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-12">
				{/* Week Filter */}
				<div className="flex flex-wrap gap-2">
					<span className="text-xs font-bold uppercase tracking-widest text-muted-foreground flex items-center mr-1">
						Semana:
					</span>
					<Select>
						<SelectTrigger className="md:hidden !bg-primary border-2 [&>svg]:fill-primary-foreground border-foreground text-primary-foreground font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
							<SelectValue placeholder="Selecciona una semana" />
						</SelectTrigger>
						<SelectContent>
							{weeks.map((week) => (
								<SelectItem key={week.id} value={week.id}>
									{week.week}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					{weeks.map((week) => (
						<Button
							key={week.id}
							size="sm"
							asChild
							className={`hidden md:grid place-content-center duration-300 hover:text-primary-foreground border-2 border-foreground font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none bg-background text-foreground`}
						>
							<Link href={`/weeks/${week.id}` as Route}>{week.week}</Link>
						</Button>
					))}
				</div>
			</div>
			<div className="h-[4px] bg-foreground" />
		</div>
	);
}
