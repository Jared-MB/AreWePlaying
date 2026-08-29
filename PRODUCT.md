# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Fans, students, and family of ABE-league university basketball teams. Their core job: quickly answer "when/where does my team play" (or "did we win?"), often on mobile, without wading through the official site or raw API output.

## Product Purpose

Are We Playing? presents ABE-league (Mexican university basketball, Division II 2025 tournament) match days, matches, and team standings in a clean, fast, accessible interface. It exists to make that schedule/results data easy to browse instead of forcing fans to dig through the official league site.

## Positioning

Same underlying data as the official ABE site and other score sources, but a much faster, mobile-first, distraction-free UX for finding match days and teams. The mechanism is interface quality, not exclusive or additional data — a competitor with the same API access could not truthfully claim the same UX-first focus and speed.

## Operating Context

- Data is fetched from third-party public endpoints (`scoretdi2025-eta.vercel.app`) for a specific tournament ID and persisted as local JSON snapshots via a Python script (`pnpm populate`, `src/scripts/populate.py`) for use during development/build.
- Core browsing flows: match days by week (`/weeks/[week]`), teams list and team detail with upcoming/past matches (`/teams`, `/teams/[team]`).
- Spanish-language UI (`lang="es"`); content and copy are in Spanish.
- Deployed on Vercel.

## Capabilities and Constraints

- Non-profit, open-source, community-driven; no ads or monetization — this is a binding commitment, not just current state.
- Not affiliated with ABE or any university; must not imply official status.
- Data may be outdated or incomplete since it depends on third-party endpoints that can change without notice.

## Brand Commitments

- Name: "Are We Playing?" (ABE League Match Days).
- The unofficial/data-freshness disclaimer must stay prominent in the UI (currently in the site footer, linking to the official ABE site) — future work must keep communicating that data is third-party, may be stale/incomplete, and that the project isn't affiliated with ABE.
- GitHub repo linked in the footer (open-source transparency).

## Evidence on Hand

No usage data, press, or testimonials on hand. Future work must not fabricate any.

## Product Principles

- Speed and mobile-first usability over feature breadth — the product's whole value is a better interface on top of data anyone could technically access.
- Never imply official/affiliated status with ABE or any university.
- Keep data provenance and freshness honest and visible rather than hidden in fine print.
- Stay free and open — no paths that require monetization or gating.
