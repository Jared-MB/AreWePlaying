import { getCurrentWeek } from "@/lib/get-current-week";
import { cacheLife } from "next/cache";
import { redirect } from "next/navigation";

export default async function WeeksPage() {
	"use cache";
	cacheLife("days");

	const currentWeek = getCurrentWeek();

	redirect(`/weeks/${currentWeek?.id}`);
}
