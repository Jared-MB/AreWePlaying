# Are We Playing? (ABE League Match Days)

A non‑profit, open‑source app focused on delivering a better UX to explore match days for several universities in the ABE league. We aggregate data from third‑party APIs and present it in a clean, fast, and accessible interface.

> Note: We are not affiliated with ABE or any university. Data is fetched from public endpoints and may change without notice.

## Why this exists

- Provide the match days of several ABE‑league universities in one place.
- Offer a friendly, fast, and mobile‑first UX over raw third‑party APIs.
- Keep the project open‑source and community‑driven, with transparency around data sources.

## Features

- Browse upcoming and past match days by week and date.
- Data fetched from third‑party endpoints and stored locally for quick development.
- Built with performance‑focused tooling (Next.js + Turbopack).

## Tech Stack

- Next.js `16@canary`
- React `@19`
- TypeScript `@5`
- Tailwind CSS `@4`
- Biome

## Data Sources

We fetch match day and match data from third‑party endpoints and persist JSON snapshots for local use:

- Match days: `https://scoretdi2025-eta.vercel.app/api/jornadas?torneoID=066CC7C9-E88C-4595-8CF5-D5AAADF0AA33`
- Matches by match day: `https://scoretdi2025-eta.vercel.app/api/partidos?jornadaID=<MATCH_DAY_ID>`

Scripts and outputs:

- `src/scripts/search-matchdays.ts` → writes `src/assets/match-days.json`
- `src/scripts/search-matches.ts` → reads `src/assets/match-days.json` and writes `src/assets/matches.json`

These files act as a local cache for development and testing.

## Project Structure

```
├── README.md
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── src/
│   ├── app/            # Next.js App Router pages/layout/styles
│   │   ├── layout.tsx  # Root layout, fonts, metadata
│   │   ├── page.tsx    # Home page (UI entry)
│   │   └── globals.css # Tailwind + theme variables
│   ├── assets/         # Generated JSON data (match days, matches)
│   └── scripts/        # TypeScript scripts to fetch/prepare data
└── ...
```

## Getting Started

### Prerequisites

- Node.js `>= 18`
- Package manager: `pnpm` (recommended), or `npm`/`yarn`

### Install

- `pnpm install`

### Run locally

- `pnpm dev` → starts Next.js with Turbopack at `http://localhost:3000`

### Build & start

- `pnpm build` → production build
- `pnpm start` → run the built app

## Fetching Fresh Data

To refresh local JSON snapshots:

- Fetch match days: `pnpm tsx src/scripts/search-match-days.ts`
- Fetch matches for all match days: `pnpm tsx src/scripts/search-matches.ts`

Tips:

- Be mindful of third‑party rate limits and availability.
- Re‑run these scripts when the league schedule updates.

## Deployment

- Deploy on Vercel for a streamlined Next.js workflow.
- Ensure scripts have been run and JSON assets are up to date if your UI depends on them.

## Contributing

This is a non‑profit, open‑source project. Contributions are welcome!

- Open issues for bugs, enhancements, or data corrections.
- Submit PRs with clear descriptions and minimal scope.
- Keep changes consistent with the existing style and tooling.

## Disclaimer

- Not affiliated with ABE or any university.
- Data is provided "as is" and may be incomplete or outdated.
- Respect third‑party API terms and attribution when applicable.

> [!IMPORTANT]
> If you are the owner of any API and disagree with this project or its usage, please contact us and we will address it promptly.
