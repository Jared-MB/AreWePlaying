/**
 * API URLs for `Division II` 2025 `ABE` tournament
 *
 * Please don't sue me 🙏
 */
export const API_URLS = {
	TEAMS:
		"https://scoretdi2025-eta.vercel.app/api/equipos?torneoID=066CC7C9-E88C-4595-8CF5-D5AAADF0AA33",
	MATCH_DAYS:
		"https://scoretdi2025-eta.vercel.app/api/jornadas?torneoID=066CC7C9-E88C-4595-8CF5-D5AAADF0AA33",
	MATCHES: (id: string): string =>
		`https://scoretdi2025-eta.vercel.app/api/partidos?jornadaID=${id}`,
	TEAM: (id: string): string =>
		`https://scoretdi2025-eta.vercel.app/api/jugadores?equipoID=${id}`,
	TEAMS_TABLE:
		"https://scoretdi2025-eta.vercel.app/api/tablaResumen?torneoID=066CC7C9-E88C-4595-8CF5-D5AAADF0AA33",
};
