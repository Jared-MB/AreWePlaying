import type { MetadataRoute } from "next";
import teams from "@/assets/teams.json";

export async function generateSitemaps() {
	return teams.map((team) => [
		{
			id: team.id,
		},
	]);
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	return teams.map((team) => ({
		url: `https://are-we-playing.vercel.app/teams/${team.id}`,
		lastModified: new Date(),
	}));
}
