export interface Tournament {
	id: string;
	division: string;
	category: string;
	/** Sólo la División II está dividida en conferencias. */
	conference?: string;
	season: string;
	finished: boolean;
	updated_at: string;
}
