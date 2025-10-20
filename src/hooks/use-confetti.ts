"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ConfettiStore {
	hasThrownConfetti: boolean;
	setHasThrownConfetti: (value: boolean) => void;
}

export const useConfettiStore = create<ConfettiStore>()(
	persist(
		(set) => ({
			hasThrownConfetti: false,
			setHasThrownConfetti: (value) => set({ hasThrownConfetti: value }),
		}),
		{
			name: "confetti-store",
		},
	),
);
