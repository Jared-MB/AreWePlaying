import { existsSync } from "node:fs";
import path from "node:path";

const logosDir = path.join(process.cwd(), "public/logos");

/**
 * No todos los equipos tienen escudo. Se comprueba en build para poder caer al
 * chip de iniciales en vez de dejar una imagen rota (o un hueco en la story).
 */
export function getTeamLogo({
	tournamentId,
	teamId,
}: {
	tournamentId: string;
	teamId: string;
}): string | null {
	const dir = tournamentId.toUpperCase();
	const file = `${teamId}.avif`;

	return existsSync(path.join(logosDir, dir, file))
		? `/logos/${dir}/${file}`
		: null;
}
