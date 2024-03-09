import { MATCHES } from "@/data/matches";
import type { Match } from "@/types";

// biome-ignore lint/complexity/noStaticOnlyClass: <explanation>
export class MatchService {
    public static async getMatches(): Promise<Match[]> {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(MATCHES);
            }, 1000);
        });
    }
}