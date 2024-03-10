import type { Match } from "@/types";
import { create } from "zustand";

interface MatchStore {
	initialMatches: Match[];
	matches: Match[];
	setInitialMatches: (matches: Match[]) => void;
	setMatches: (matches: Match[]) => void;
}

export const useMatchStore = create<MatchStore>()((set) => ({
	initialMatches: [],
	matches: [],
	setInitialMatches: (matches) => set({ initialMatches: matches, matches }),
	setMatches: (matches) => set({ matches }),
}));
