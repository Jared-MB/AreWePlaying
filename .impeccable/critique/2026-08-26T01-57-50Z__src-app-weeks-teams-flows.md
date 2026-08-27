---
target: whole app (weeks + teams flows)
total_score: 20
max_score: 40
na_heuristics: 
p0_count: 1
p1_count: 3
timestamp: 2026-08-26T01-57-50Z
slug: src-app-weeks-teams-flows
---
Method: dual-agent (Assessment A: design-review sub-agent · Assessment B: detector + browser-evidence sub-agent, run isolated and in parallel)

## Design Health Score

| # | Heuristic | Score | Key Issue |
|---|---|---|---|
| 1 | Visibility of System Status | 3/4 | Good skeletons/status badges, but no `aria-current` on the active week, and the H1 scramble animation has no completion signal for assistive tech |
| 2 | Match Between System & Real World | 2/4 | English strings ("TEAMS", "Win Rate", "Record", "Yes!!") leak into an otherwise all-Spanish app; team badges use meaningless letter substrings instead of real identity |
| 3 | User Control and Freedom | 2/4 | No way to clear a selected university; invalid team URL silently redirects to `/teams` with zero explanation |
| 4 | Consistency and Standards | 2/4 | Two unreconciled "hard shadow" token families (black-opaque vs. purple-30%-alpha) confirmed independently by both assessments; win/loss shown color-only on one page, with a redundant "W"/"L" label on another |
| 5 | Error Prevention | 3/4 | Static params prevent most bad states, but nothing guards a stray bad team id |
| 6 | Recognition Rather Than Recall | 2/4 | Redundant "SEMANA 21" reprinted on every card in an already-filtered view; unlabeled "K" DevTools icon |
| 7 | Flexibility and Efficiency | 2/4 | Prefetching and a "pin your team" selector are real wins; no search across 17 teams, no keyboard shortcuts |
| 8 | Aesthetic and Minimalist Design | 1/4 | A live production DevTools bubble floats over every screen; measured text contrast at 4.4:1 (needs 4.5:1) in three places |
| 9 | Error Recovery | 1/4 | No `error.tsx` anywhere in the app; bad team id → silent redirect, no message |
| 10 | Help and Documentation | 2/4 | Footer disclaimer is honest and present, but no help/FAQ affordance beyond that |
| **Total** | | **20/40** | **Acceptable (bottom edge): significant improvements needed before users are happy** |

## Design Specificity Verdict

**LLM assessment:** The neo-brutalist shell (thick black borders, hard offset shadows, uppercase Space Mono, the confetti "your team plays today" moment with correct `prefers-reduced-motion` handling) is genuinely authored for this product — not category-interchangeable. But the content layer undercuts it: 7 of 17 teams collide on an identical "UNI" badge because it's computed as `shortName.split(" ")[0].substring(0,3)` on names that mostly start with "Universidad," and the two UVM campuses collide too — on the one page whose entire job is "tell teams apart at a glance." The app also ships English strings ("TEAMS", "Win Rate", "Record", and the confetti payoff "Yes!!") into a `lang="es"` product built for Spanish-speaking fans, breaking the brand voice exactly at its emotional peak moment.

**Deterministic scan:** `detect.mjs` returned exit code 2 with one finding — a `side-tab` (AI-slop accent-border) flag on `src/app/teams/page.tsx:92`. Both sub-agents independently assess this as a likely false positive: it's a structural column divider inside a `grid-cols-[1fr_auto]` layout, using the same `border-foreground` color as every other border in the component — consistent with the app's deliberate border language, not a generic accent stripe.

**Live browser evidence:** Script injection into the running page succeeded and captured 8 anti-pattern findings via console (low-contrast ×6, all-caps-body, wide-tracking) — detailed under Priority Issues and Minor Observations below. The live-server helper used to capture this was stopped afterward as part of cleanup, so there is no persistent on-page overlay left open; the findings themselves are the durable artifact.

## Overall Impression

The bones are good — a coherent, opinionated visual identity and one genuinely delightful, product-specific interaction (the confetti/auto-scroll "your team is playing today" moment). But the app currently ships debug tooling to production, has a data-derived team-identity bug that defeats its own core job for ~40% of teams, and mixes two languages in a product whose entire brief is "clean, fast, honest Spanish-language schedule browsing." These aren't taste calls — they're concrete, fixable defects, several confirmed by both the subjective review and the mechanical scan independently.

## What's Working

1. **The confetti "Yes!!" flow** (`src/components/are-we-playing.tsx`) checks whether the selected team plays today, auto-scrolls to the match, fires confetti, and correctly disables for `prefers-reduced-motion` — this is the one moment where "interface quality is the product" (per PRODUCT.md's positioning) is fully realized.
2. **Status-badge language** (`EN CURSO` / `NO INICIADO` / `COMPLETADO`) pairs color, text, and border — avoiding color-only signaling where it matters most.
3. **The hover pattern** (`hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none`) gives every card/button a consistent, tactile, brand-appropriate response — a real interaction system, not default framework styling.

## Priority Issues

**[P1] Team badges collide, defeating the app's core "find your team fast" job**
- **Why it matters**: `team.shortName.split(" ")[0].substring(0,3)` (`src/components/team-card.tsx:39`, `schedule-table.tsx:64/89`, `teams/page.tsx:94`, `teams/[team]/page.tsx:93`) produces the identical "UNI" badge for 7 of 17 real teams (names starting "Universidad ___"), and both UVM campuses also collide. This isn't cosmetic — it's the specific mechanism the Teams page exists to provide.
- **Fix**: The app already fetches `/logos/${team.id}.avif` for OpenGraph metadata (`teams/[team]/page.tsx:52`) — reuse that asset for the badge instead of a computed substring.
- **Suggested command**: $impeccable polish

**[P1] English strings break the Spanish-only brand promise**
- **Why it matters**: `<html lang="es">` and nearly every string in the app is Spanish, but `/teams` renders "TEAMS" (`teams/page.tsx:20`), "Top Performer" / "Win Rate" / "Record" (`teams/page.tsx:54,79,86`, `team-card.tsx:63,72`), and the confetti payoff literally says "Yes!!" (`are-we-playing.tsx:76`) — English at the app's single best emotional beat.
- **Fix**: Translate to "Equipos" / "Mejor Equipo" / "% de Victorias" / "Récord" / "¡Sí juegan!" (or equivalent).
- **Suggested command**: $impeccable clarify

**[P1] Invalid `border-3` class silently disables the "your team is playing" emphasis border**
- **Why it matters**: `src/components/schedule-table.tsx:34` conditionally applies `border-3` to highlight a match involving the user's selected team — but Tailwind v4's default scale only defines `border`/`border-2`/`border-4`/`border-8`, and no custom `border-3` token exists in `globals.css`'s `@theme inline` block. The class most likely generates no CSS, so the one micro-interaction meant to say "hey, this is your team" silently does nothing.
- **Fix**: Change to `border-4` (or register a custom `border-3` utility if the thinner weight is intentional) and visually confirm the emphasis renders.
- **Suggested command**: $impeccable audit

**[P2] Accessibility shortfalls: sub-AA contrast, color-only status, unlabeled icon link**
- **Why it matters**: Live-page measurement found `#6b7280` text at 4.4:1 against `#f5f3ff`/`#f3f4f6` backgrounds — just under the 4.5:1 AA minimum — on the match date sub-line, week badge, and status badge (`schedule-table.tsx:46,50,142`). Separately, `schedule-table.tsx:73-84,98-109` encodes win/loss by background color alone (no "W"/"L" text), while `teams/[team]/past-matches.tsx:56` correctly pairs color with a text label for the same concept — an internal inconsistency, and a real barrier for colorblind users on the busier page. The GitHub icon link (`layout.tsx:78-84`) also has no `aria-label`, unlike the correctly-labeled link right above it.
- **Fix**: Darken `muted-foreground` slightly to clear 4.5:1, add a text W/L cue to the weeks-page score display to match team-detail, and add `aria-label="Ver código fuente en GitHub"` to the icon link.
- **Suggested command**: $impeccable audit

## Persona Red Flags

**Jordan (confused first-timer)**: The "Rama: Femenil" pill on `/teams` looks like an active filter choice, but varonil is commented out in source (`teams/page.tsx:31-46`) — Jordan may hunt for a toggle that doesn't exist, with no explanation why. The unlabeled "K" DevTools bubble (top-right, every page) invites a curious click into raw internal debug data instead of help.

**Sam (accessibility-dependent)**: Tabbing through 21 identically-announced "SEMANA N" links with no `aria-current` gives no "you are here" signal. The DevTools trigger's only accessible name is the single letter "K" — meaningless to a screen reader, and shouldn't be reachable by real users at all.

**Riley (stress tester)**: A bogus team URL silently redirects to `/teams` with no error state — confirmed, not hypothetical. The 7-team badge collision and UVM campus collision are exactly the data-shape edge case Riley goes looking for, and it's present in the real 17-team dataset today.

## Minor Observations

- Desktop week selector renders all 21 week buttons at once (`schedule-filters.tsx:89-104`) with no grouping — mobile already collapses this to a `<Select>`; desktop never got the same treatment.
- `/teams` and `/teams/[team]` hide the university selector below `md` (`schedule-header.tsx:33`) with no mobile substitute — only `/weeks` provides one. A mobile user can't switch teams from the Teams page.
- Team names are forced `uppercase` via CSS on ~31-character strings (`schedule-table.tsx:69,94`) — flagged by the live detector as an all-caps-body readability concern.
- `src/app/teams/page.tsx` has no `loading.tsx` (its siblings `weeks` and `teams/[team]` both have one), and no route in the app has an `error.tsx`.
- `src/use-cases/get-matches-by-week.ts` imports a 130KB `matches.json` directly into the client component `are-we-playing.tsx` — a candidate for unnecessary client-bundle weight.
- The H1 "scramble" animation (`src/components/ui/hyper-text.tsx`) has no `prefers-reduced-motion` guard, unlike the confetti trigger which correctly disables itself.
- No explicit negative-state message when the selected team isn't playing this week — the UI just stays quiet rather than reassuring the user.

## Questions to Consider

- What if the team badge showed the real crest you're already fetching for OpenGraph — would that single fix also make the shadow-token and language cleanup feel like finishing one coherent pass instead of three separate ones?
- What if "not playing this week" got its own explicit, honest card instead of silence — would that close the emotional valley on the majority of visits as well as the confetti closes the minority-case peak?
- Is the 21-button desktop week wall serving anyone, or is it just what's left after the mobile fallback was built and desktop was never revisited?
