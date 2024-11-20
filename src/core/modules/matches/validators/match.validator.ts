import { z } from "zod";

export const MatchSchema = z.object({
	localTeamId: z.string(),
	visitorTeamId: z.string(),
	date: z.date(),
	hour: z.string(),
	location: z.string(),
	gender: z.enum(["varonil", "femenil"]),
	sportId: z.string(),
});
