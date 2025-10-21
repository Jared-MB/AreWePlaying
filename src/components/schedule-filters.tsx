"use client";

import type { MatchDay } from "@/types/match-day";

import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { PrefetchLink } from "./prefetch-link";
import { SelectUniversity } from "./select-university";
import { useCurrentWeek } from "@/hooks/use-current-week";

export function ScheduleFilters({ weeks }: { weeks: MatchDay[] }) {
	const week = useCurrentWeek(weeks);

	const params = useSearchParams();

	const selectedWeek = params.get("week") ?? week.currentWeek?.id;

	const [selectedLeague, setSelectedLeague] = useState<string>("femenil");

	const router = useRouter();

	useEffect(() => {
		if (!params.get("week")) {
			router.replace(`?week=${selectedWeek}`);
		}
	}, [params]);

	return (
		<div className="mb-12 space-y-6">
			{/* League Filter - Horizontal Pills */}
			<div className="flex items-center justify-between">
				<div className="flex flex-wrap items-center gap-3">
					<span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
						Rama:
					</span>
					<div className="flex flex-wrap gap-2">
						{/* <Button
						onClick={() => setSelectedLeague("all")}
						size="sm"
						className={`hover:text-primary-foreground border-2 border-foreground font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none ${
							selectedLeague === "all"
								? "bg-primary text-primary-foreground"
								: "bg-background text-foreground"
						}`}
					>
						Ambas
					</Button>
					<Button
						onClick={() => setSelectedLeague("varonil")}
						size="sm"
						className={`hover:text-primary-foreground border-2 border-foreground font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none ${
							selectedLeague === "varonil"
								? "bg-primary text-primary-foreground"
								: "bg-background text-foreground"
						}`}
					>
						Varonil
					</Button> */}
						<Button
							onClick={() => setSelectedLeague("femenil")}
							size="sm"
							className={`hover:text-primary-foreground border-2 border-foreground font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none ${
								selectedLeague === "femenil"
									? "bg-primary text-primary-foreground"
									: "bg-background text-foreground"
							}`}
						>
							Femenil
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
					{weeks.map((week) => (
						<Button
							key={week.id}
							size="sm"
							asChild
							className={`duration-300 hover:text-primary-foreground border-2 border-foreground font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none ${
								selectedWeek === week.id
									? "bg-foreground text-background"
									: "bg-background text-foreground"
							}`}
						>
							<PrefetchLink href={`?week=${week.id}`}>{week.week}</PrefetchLink>
						</Button>
					))}
				</div>
			</div>

			<div className="h-[4px] bg-foreground" />
		</div>
	);
}

export function ScheduleFiltersSkeleton() {
	return (
		<div className="mb-12 space-y-6">
			<div className="flex flex-wrap items-center gap-3">
				<span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
					Rama:
				</span>
				<div className="flex flex-wrap gap-2">
					{/* <Button
						size="sm"
						className={`hover:text-primary-foreground border-2 border-foreground font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none ${"bg-background text-foreground"}`}
					>
						Ambas
					</Button>
					<Button
						size="sm"
						className={`hover:text-primary-foreground border-2 border-foreground font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none ${"bg-background text-foreground"}`}
					>
						Varonil
					</Button> */}
					<Button
						size="sm"
						className={`hover:text-primary-foreground border-2 border-foreground font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none ${"bg-primary text-primary-foreground"}`}
					>
						Femenil
					</Button>
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
					{Array.from({ length: 18 }, (_, i) => ({
						id: i + 1,
						week: `Week ${i + 1}`,
					})).map((week) => (
						<Button
							key={week.id}
							size="sm"
							className="duration-300 hover:text-primary-foreground border-2 border-foreground font-bold uppercase tracking-wider shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none bg-background text-foreground"
						>
							Semana {week.id}
						</Button>
					))}
				</div>
			</div>

			{/* Bottom Divider */}
			<div className="h-[4px] bg-foreground" />
		</div>
	);
}
