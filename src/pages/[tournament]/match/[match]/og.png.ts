import { DEFAULT_ACCENT, buildPalette } from "@/constants/story";
import { SITE_HOST } from "@/constants/site";
import { MatchOgCard, OG_HEIGHT, OG_WIDTH } from "@/og/match-card";
import { buildMatchCard } from "@/utils/get-match-card";
import { getMatchBySlug } from "@/utils/match-slug";
import { fetchTeamLogo } from "@/utils/fetch-team-logo";
import { getTeamsTable } from "@/utils/get-teams-table";
import { getTournamentBySlug } from "@/utils/tournament-slug";
import type { APIRoute } from "astro";
import satori from "satori";
import sharp from "sharp";

// On-demand: prerenderizar las ~1900 tarjetas alargaría cada build nocturno sin
// ganar nada. El CDN de Vercel las cachea tras el primer scrapeo y se purga en
// cada despliegue, así que un marcador nunca se queda viejo.
export const prerender = false;

// satori acepta TTF/OTF/WOFF, no WOFF2. Pesan 12 KB: se incrustan en el bundle
// en vez de pedirlos por red. El subset latin cubre los acentos de los nombres.
import regular from "@fontsource/space-mono/files/space-mono-latin-400-normal.woff?inline";
import bold from "@fontsource/space-mono/files/space-mono-latin-700-normal.woff?inline";

const decode = (dataUri: string) =>
	Buffer.from(dataUri.slice(dataUri.indexOf(",") + 1), "base64");

const FONTS = [
	{ name: "Space Mono", data: decode(regular), weight: 400 as const },
	{ name: "Space Mono", data: decode(bold), weight: 700 as const },
].map((font) => ({ ...font, style: "normal" as const }));

const palette = buildPalette("dark", DEFAULT_ACCENT);

export const GET: APIRoute = async ({ params, request }) => {
	// El CDN cachea por URL completa: con `?x=1`, `?x=2`… cualquiera forzaría un
	// render nuevo (satori + sharp) en cada petición. La tarjeta no lee la query,
	// así que se manda a la URL limpia, que sí queda cacheada.
	const url = new URL(request.url);
	if (url.search) {
		return new Response(null, {
			status: 301,
			headers: {
				Location: url.pathname,
				"Cache-Control": "public, max-age=0, s-maxage=31536000, immutable",
			},
		});
	}

	const tournament = getTournamentBySlug(params.tournament);
	if (!tournament) return new Response("Torneo no encontrado", { status: 404 });

	const tournamentId = tournament.id.toLowerCase();
	const found = await getMatchBySlug({ tournamentId, slug: params.match });
	if (!found) return new Response("Partido no encontrado", { status: 404 });

	const { match, week } = found;
	const teams = await getTeamsTable(tournamentId);

	const card = buildMatchCard({
		tournament,
		match,
		week,
		localStats: teams.find((t) => t.id === match.localTeamId),
		visitingStats: teams.find((t) => t.id === match.visitingTeamId),
	});

	// `buildMatchCard` resuelve el escudo contra `public/`, que aquí no existe.
	const [local, visiting] = await Promise.all(
		[match.localTeamId, match.visitingTeamId].map((teamId) =>
			fetchTeamLogo({ tournamentId, teamId, origin: request.url }),
		),
	);

	const svg = await satori(
		MatchOgCard({
			card: {
				...card,
				local: { ...card.local, logo: local },
				visiting: { ...card.visiting, logo: visiting },
			},
			palette,
			siteLabel: SITE_HOST,
		}),
		{ width: OG_WIDTH, height: OG_HEIGHT, fonts: FONTS },
	);

	// satori dibuja el texto como paths (embedFont), así que el SVG no depende de
	// ninguna fuente y sharp lo rasteriza igual que cualquier otro.
	const png = await sharp(Buffer.from(svg)).png().toBuffer();

	return new Response(new Uint8Array(png), {
		headers: {
			"Content-Type": "image/png",
			"Cache-Control": "public, max-age=0, s-maxage=31536000, immutable",
		},
	});
};
