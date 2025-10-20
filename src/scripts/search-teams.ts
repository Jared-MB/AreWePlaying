import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { API_URLS } from "../constants/apiUrl";

type ApiTeam = {
	EquipoID: string;
	Nombre: string;
	NombreCorte: string;
	Logo: string | null;
};

type OutputTeam = {
	id: string;
	name: string;
	shortName: string;
	logo: string | null;
};

const LOGO_DIR = path.join(process.cwd(), "public", "logos");

function isDataUrl(str: string): boolean {
	return /^data:image\/[a-zA-Z]+;base64,/.test(str);
}

function isHttpUrl(str: string): boolean {
	return /^https?:\/\//.test(str);
}

async function logoToBuffer(logo: string): Promise<Buffer> {
	if (isDataUrl(logo)) {
		const base64 = logo.split(",")[1] ?? "";
		return Buffer.from(base64, "base64");
	}
	if (isHttpUrl(logo)) {
		const res = await fetch(logo);
		const ab = await res.arrayBuffer();
		return Buffer.from(ab);
	}
	// Assume raw base64 string
	return Buffer.from(logo, "base64");
}

async function ensureLogoDir() {
	await fs.mkdir(LOGO_DIR, { recursive: true });
}

async function convertToAvif(
	buffer: Buffer,
	outFilePath: string,
): Promise<void> {
	await sharp(buffer).avif().toFile(outFilePath);
}

async function fetchTeams() {
	await ensureLogoDir();

	const response = await fetch(API_URLS.TEAMS);
	const teams = (await response.json()) as {
		mensaje: "Tabla";
		data: string;
	};

	const teamsData = JSON.parse(teams.data) as ApiTeam[];

	const mappedPromises = teamsData.map(async (team): Promise<OutputTeam> => {
		let logoOut: string | null = null;

		if (team.Logo) {
			try {
				const buffer = await logoToBuffer(team.Logo);
				const fileName = `${team.EquipoID}.avif`;
				const outPath = path.join(LOGO_DIR, fileName);
				await convertToAvif(buffer, outPath);
				logoOut = `/logos/${fileName}`;
			} catch (err) {
				console.warn(
					`Failed to process logo for team ${team.NombreCorte} (${team.EquipoID}):`,
					err,
				);
				logoOut = null;
			}
		}

		return {
			id: team.EquipoID,
			name: team.Nombre,
			shortName: team.NombreCorte,
			logo: logoOut,
		};
	});

	const mappedData = await Promise.all(mappedPromises);

	await fs.writeFile(
		"./src/assets/teams.json",
		JSON.stringify(mappedData, null, 2),
	);

	process.exit(0);
}

fetchTeams();
