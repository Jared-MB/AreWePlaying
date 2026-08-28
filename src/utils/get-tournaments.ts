import { readdir } from "node:fs/promises";
import { assetsDir } from "./assets-dir";

export async function getTournaments() {
	const entries = await readdir(assetsDir, {
		withFileTypes: true,
	});

	const dirs = entries
		.filter((e) => e.isDirectory())
		.map((e) => e.name.toLowerCase());

	return dirs;
}
