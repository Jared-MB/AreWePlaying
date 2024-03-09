import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

import { format } from "@formkit/tempo";

import type { Match as MatchType } from "@/types";
import { FORMAT_DATE, LOCALE } from "@/constants/date";

interface MatchProps {
	away: {
		name: string;
		logo: string;
	};
	local: boolean;
	sport: string;
	date: MatchType["date"];
	location: string;
	gender: MatchType["gender"];
}

export default function Match({
	away,
	local,
	sport,
	date,
	location,
	gender,
}: MatchProps) {
	return (
		<Card className="h-fit">
			<CardHeader className="flex flex-row justify-between items-start">
				<div className="flex flex-row items-center gap-x-4">
					<Avatar className="w-16 h-16">
						<AvatarImage src="/img/lobos-buap.webp" />
						<AvatarFallback>BUAP</AvatarFallback>
					</Avatar>
					vs.
					<Avatar className="border  w-16 h-16">
						<AvatarImage src={away.logo} />
						<AvatarFallback>{away.name}</AvatarFallback>
					</Avatar>
				</div>
				<div className="flex items-center gap-x-2">
					<Badge className="capitalize">{sport}</Badge>
					<Badge className="capitalize">{gender}</Badge>
				</div>
			</CardHeader>
			{/* <Separator /> */}
			<CardContent className="flex flex-col gap-y-2 text-sm text-muted-foreground">
				<span className="text-purple-500 text-xl font-semibold">
					BUAP vs. {away.name}
				</span>
				<div className="flex flex-col gap-y-0.5">
					<span>
						{location} - {local ? "Local" : "Visitante"}
					</span>
					{/* <span>1:00 PM - Marzo 18, 2024</span> */}
					<span className="capitalize">
						{format(date, FORMAT_DATE, LOCALE)}
					</span>
				</div>
			</CardContent>
		</Card>
	);
}
