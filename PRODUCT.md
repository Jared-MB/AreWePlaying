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

## Visual Style

Neutral and clean: content-first, high contrast, no decoration that competes with schedules and scores. `src/styles/global.css` is the source of truth for tokens; this section records intent, not a copy of the values.

- **Stack**: Tailwind CSS 4 with CSS variables in OKLCH, exposed through `@theme inline` (shadcn-style token names: `background`, `foreground`, `primary`, `muted`, `border`…). Use tokens, never hard-coded colors.
- **Theming**: light and dark, switched with the `.dark` class on `<html>`. The saved choice (`localStorage` `theme`) wins; otherwise `prefers-color-scheme`. Every new token needs both values.
- **Color**: white / near-black surfaces with a single warm orange `primary` (`oklch(0.71 0.19 39.57)`, same in both themes) as the accent. Purple is reserved for focus rings and chart ramps. Neutral `surface` / `surface-hover` / `line` for cards and borders; `destructive` for errors; a gold `favorite` for the favorites star. The highlighted card (favorite team's match) sits on `primary` and uses the `highlight-*` tokens for legible content.
- **Typography**: Space Mono (`font-sans` and `font-mono`) for all text, with wide tracking (`--tracking-normal: 0.05em`) and small uppercase bold labels. Geist Pixel (`font-pixel`) only for numerals and display accents (match numbers, countdown). Use `tabular-nums` for numbers and `translate="no"` on identifiers.
- **Shape and depth**: base radius `0.625rem` (`rounded-lg`, with `sm`/`md`/`xl` derived from it). Shadows are hard offsets with no blur (`2px 2px 0`), all derived from `--shadow-color` and `--shadow-opacity`; themes only change those two.
- **Motifs, kept restrained**: match cards are ticket-like (colored stub, dashed divider, notched edges, a tear animation) and the team pages use thicker black frames with inverted blocks (`frame`, `inverse`, `hard-shadow`). Use these motifs where they already exist; don't spread them to new surfaces.
- **Layout**: mobile-first single column inside a `container` with `px-4`/`px-6` gutters; sticky header with a bottom border (`line/70`); spacing from Tailwind's `0.25rem` scale.
- **Motion**: functional only (ticket tear and stamp-in), and CSS animations stay behind `prefers-reduced-motion: no-preference`.
- **Accessibility**: skip-to-content link, visible `:focus-visible` rings, `touch-hitbox` for small targets.

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
