# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Fans, students, and family of ABE-league university basketball teams. Their core job: quickly answer "when/where does my team play" (or "did we win?"), often on mobile, without wading through the official site or raw API output.

## Product Purpose

Are We Playing? presents ABE-league (Mexican university basketball) match days, matches, and team standings in a clean, fast, accessible interface. It covers every tournament of the current season — Division I and II, Varonil and Femenil, split by conference where the league does — and exists to make that schedule/results data easy to browse instead of forcing fans to dig through the official league site.

## Positioning

Same underlying data as the official ABE site and other score sources, but a much faster, mobile-first, distraction-free UX for finding match days and teams. The mechanism is interface quality, not exclusive or additional data — a competitor with the same API access could not truthfully claim the same UX-first focus and speed.

## Operating Context

- Data is fetched from third-party public endpoints (`scoretdi2025-eta.vercel.app`) and persisted as local JSON snapshots under `src/assets/<TOURNAMENT_ID>/` by a Python script (`pnpm populate`, `scripts/populate.py`). Those snapshots are the app's only data source — the site itself never calls the API.
- The snapshots are refreshed once per build and once nightly by a GitHub Action, which commits only when the data actually changed and thereby triggers a redeploy.
- Built with Astro and deployed on Vercel: pages are prerendered, with server islands (today's matches, top performers), the per-match social cards, and legacy-URL redirects served on demand.
- Each deployment serves a single season, selected with the `SEASON` environment variable; past seasons live on their own subdomain.
- Core browsing flows: tournament picker (`/`), the project explainer (`/acerca`), match days by week (`/[tournament]`, `/[tournament]/[week]`), standings and team detail with upcoming/past matches (`/[tournament]/teams`, `/[tournament]/teams/[team]`), and match detail (`/[tournament]/match/[match]`) with a countdown and a shareable 9:16 story image.
- Favorites are per-visitor and stored in the browser (`localStorage`); there are no accounts and no server-side user state.
- Spanish-language UI (`lang="es"`); content, copy, and code comments are in Spanish.

## Capabilities and Constraints

- Non-profit, open-source, community-driven; no ads or monetization — this is a binding commitment, not just current state.
- Not affiliated with ABE or any university; must not imply official status.
- Data may be outdated or incomplete since it depends on third-party endpoints that can change without notice.
- The upstream API is someone else's server and is treated as a courtesy, not an entitlement: finished tournaments are never refetched, nothing is refetched twice within 24 hours, and data that doesn't change mid-tournament (weeks, teams, logos) is fetched once and reused. Future work must not move data fetching into the runtime or otherwise multiply requests to it.

## Brand Commitments

- Name: "Are We Playing?" (ABE League Match Days).
- The unofficial/data-freshness disclaimer must stay prominent in the UI (currently in the site footer, linking to the official ABE site and to `/acerca`) — future work must keep communicating that data is third-party, may be stale/incomplete, and that the project isn't affiliated with ABE.
- `/acerca` is the plain-language explanation of the project for non-technical visitors: what the site is, where the data comes from, how often it updates, and what the project is not. It must stay readable by someone who doesn't know what an API is, and must keep stating that scores are not live.
- GitHub repo linked in the footer (open-source transparency).
- Shared images (social cards, story images) carry the site's own domain and must not be styled to look like official ABE or university material.

## Evidence on Hand

No usage data, press, or testimonials on hand. Future work must not fabricate any.

## Product Principles

- Speed and mobile-first usability over feature breadth — the product's whole value is a better interface on top of data anyone could technically access.
- Never imply official/affiliated status with ABE or any university.
- Keep data provenance and freshness honest and visible rather than hidden in fine print.
- Be a good citizen of the third-party API: fetch as little as possible, as rarely as possible, and never from the visitor's browser.
- Stay free and open — no paths that require monetization or gating.
