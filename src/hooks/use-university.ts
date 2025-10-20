"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UniversityState {
	university: string;
	setUniversity: (university: string) => void;
}

export const useUniversity = create<UniversityState>()(
	persist(
		(set) => ({
			university: "",
			setUniversity: (university: string) => set({ university }),
		}),
		{
			name: "are-we-playing:university",
		},
	),
);
