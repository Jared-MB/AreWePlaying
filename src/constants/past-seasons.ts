import { SITE_HOST } from "./site";

/**
 * Torneos de temporadas pasadas que alguna vez tuvieron URL con UUID. Sus datos
 * ya no viven en este despliegue (cada uno sirve una sola temporada), así que
 * el id no se puede resolver aquí: se manda al subdominio de su temporada, que
 * sí lo conoce y lo traduce al slug.
 *
 * Las claves van en mayúsculas, como en tournaments.json.
 */
export const PAST_SEASON_TOURNAMENTS: Record<string, string> = {
	"1A38224C-1577-43EB-B69E-158D80024029": "2025-2026",
	"49F7D44A-6362-434C-A1E5-03FB72F076AF": "2025-2026",
	"066CC7C9-E88C-4595-8CF5-D5AAADF0AA33": "2025-2026",
	"8ADD5CDB-8E5D-4C42-B53E-EA1842208229": "2025-2026",
};

export const seasonOrigin = (season: string) =>
	`https://${season}.${SITE_HOST}`;
