"use client";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import {} from "@/components/ui/popover";
import {} from "date-fns";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import type { DateRange } from "react-day-picker";

export function DateFilter() {
	const router = useRouter();
	const searchParams = useSearchParams();

	const [dateRange, setDateRange] = useState<DateRange | undefined>(
		JSON.parse(searchParams.get("fecha") || "null") || undefined,
	);

	const handleDateChange = (selectedDate: DateRange | undefined) => {
		setDateRange(selectedDate);
		const params = new URLSearchParams(searchParams);
		if (selectedDate) {
			params.set("fecha", JSON.stringify(selectedDate));
		} else {
			params.delete("fecha");
		}
		router.replace(`?${params.toString()}`);
	};

	useEffect(() => {
		if (!searchParams.get("fecha")) {
			setDateRange(undefined);
		}
	}, [searchParams]);

	return (
		<DatePickerWithRange
			onValueChange={(value) => handleDateChange(value)}
			date={dateRange}
		/>
	);
}
