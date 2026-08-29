import type { Match } from "@/types/match";
import type { TeamPosition } from "@/types/team";
import type { Week } from "@/types/week";

// The tournament JSON is bundled by Vite instead of read with `node:fs`: the
// Cloudflare adapter prerenders inside a worker, which has no filesystem.
// Keys look like "../assets/<TOURNAMENT_ID>/matches.json".

const matchesByPath = import.meta.glob<{ data: Match[]; id: string }[]>(
	"../assets/*/matches.json",
	{ eager: true, import: "default" },
);

const weeksByPath = import.meta.glob<Week[]>("../assets/*/weeks.json", {
	eager: true,
	import: "default",
});

const teamsTableByPath = import.meta.glob<TeamPosition[]>(
	"../assets/*/teams-table.json",
	{ eager: true, import: "default" },
);

function read<T>(
	files: Record<string, T>,
	tournamentId: string,
	fileName: string,
): T {
	const key = `../assets/${tournamentId.toUpperCase()}/${fileName}`;
	const data = files[key];

	if (!data) {
		throw new Error(`No ${fileName} for tournament "${tournamentId}"`);
	}

	return data;
}

export function readTournamentIds() {
	return Object.keys(matchesByPath).map((key) => key.split("/")[2]);
}

export function readMatches(tournamentId: string) {
	return read(matchesByPath, tournamentId, "matches.json");
}

export function readWeeks(tournamentId: string) {
	return read(weeksByPath, tournamentId, "weeks.json");
}

export function readTeamsTable(tournamentId: string) {
	return read(teamsTableByPath, tournamentId, "teams-table.json");
}
