import type { StoryTeam } from "@/constants/story";
import type { MatchStatus } from "./get-match-status";

export interface HeroTeam extends StoryTeam {
	role: "Local" | "Visitante";
	/** Enlace a la página del equipo. */
	href: string;
}

export interface MatchHero {
	status: MatchStatus;
	statusLabel: string;
	/** "División I · Femenil · Semana 1 · Partido 5" */
	eyebrow: string;
	/** "UANL vs UPAEP": el <h1> (sólo para lectores de pantalla) y el título al compartir. */
	title: string;
	/** "viernes 18 de septiembre de 2026" */
	date: string;
	/** "12:00", o cadena vacía si la API no manda hora. */
	time: string;
	venue: string;
	venueUrl: string | null;
	local: HeroTeam;
	visiting: HeroTeam;
}
