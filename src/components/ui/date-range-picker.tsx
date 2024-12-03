"use client";

import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import type * as React from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/core/utils";

export function DatePickerWithRange({
	className,
	onValueChange,
	date,
}: React.HTMLAttributes<HTMLDivElement> & {
	onValueChange?: (value: DateRange | undefined) => void;
	date?: DateRange;
}) {
	// const [date, setDate] = React.useState<DateRange | undefined>({
	// 	from: new Date(2022, 0, 20),
	// 	to: addDays(new Date(2022, 0, 20), 20),
	// });

	const handleDayRange = (selected: DateRange | undefined) => {
		// setDate(selected);
		onValueChange?.(selected);
	};

	return (
		<div className={cn("grid gap-2 w-full md:w-fit", className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant={"outline"}
						className={cn(
							"w-full md:min-w-[244px] justify-start text-left font-normal",
							!date && "text-muted-foreground",
						)}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, "LLL dd, y")} -{" "}
									{format(date.to, "LLL dd, y")}
								</>
							) : (
								format(date.from, "LLL dd, y")
							)
						) : (
							<span>Selecciona una fecha</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						initialFocus
						mode="range"
						defaultMonth={date?.from}
						selected={date}
						onSelect={handleDayRange}
						numberOfMonths={2}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
