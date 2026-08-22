# Site Critique & Improvement Spec

Audit of the running site at `localhost:3001` (Next.js 16.3.2, Tailwind v4). Every measurement
below was taken from the live DOM, not inferred from source.

---

## 0. The core diagnosis

You said "way too much text." The word counts say otherwise:

| Page | Words | Read time | Scroll (desktop) | Scroll (mobile) |
|---|---|---|---|---|
| `/` | 563 | 2.6 min | 6.4 screens | 4.8 screens |
| `/work` | 946 | 4.3 min | — | — |
| `/work/spoin` | 1,544 | 7.0 min | — | **15.2 screens** |
| `/systems` | 1,016 | 4.6 min | — | — |
| `/work/continuum` | 501 | 2.3 min | — | — |
| `/lab` | 380 | 1.7 min | — | — |

563 words is a *short* homepage. The problem is not volume — it's that **there is no
typographic hierarchy, so all 563 words arrive at the same time with the same weight.**

Measured font-size distribution of leaf text nodes on `/`:

```
12px → 51 nodes
11px → 13 nodes
10px → 10 nodes
14px →  6 nodes
16px →  4 nodes
36px →  1 node   ← the h1, and nothing else
```

**74 of 85 text nodes are ≤12px.** There is nothing between 16px and 36px. The eye has no
landing spots, so it reads everything or nothing — and a recruiter picks "nothing."

Compounding it: **19 bordered cards on the homepage**, all with the same border, radius,
and background. When everything is a card, nothing is emphasized. And ~20% of all text
nodes are `font-mono` (57 of 292 on `/work/spoin`), which flattens the remaining contrast.

So: fix hierarchy first, cut words second. Cutting words without fixing hierarchy just
produces a shorter wall.

---

## 1. Skim mode — your idea, specified

Good instinct. Two refinements that make it much stronger:

**1a. Skim mode should swap content, not hide it.** A CSS `display:none` toggle leaves the
skim view reading like a redacted document. Instead give every content block two authored
variants:

```ts
type Block = {
  skim: string;   // ≤ 90 chars, one line, leads with the noun or the number
  deep: ReactNode // current prose
}
```

Example — the Anchorate bullet:
- **deep** (current, 47 words): "Built a runtime policy interception layer between AI agents and their tools, with PII redaction and prompt injection detection lanes plus statistical and pgvector similarity-based anomaly detection over an append-only audit log (Python, FastAPI, PostgreSQL, Redis, LangGraph)."
- **skim**: "Policy firewall between AI agents and their tools — PII redaction, injection detection, audit log. *Python · FastAPI · Postgres · Redis*"

**1b. Apply it site-wide, not just `/`.** `/` is the *least* offending page. `/work/spoin` at
15.2 mobile screens and `/work` at 946 words are where a reader actually drowns. Same toggle,
same store, in the layout.

**Mechanics:**
- Default **on**. Persist in `localStorage` (`view-density: skim | full`).
- Shareable override: `?full=1` forces full so you can link a recruiter straight to depth.
- Toggle lives at the top-right of the content column (not in the nav rail — it's page
  state, not navigation). Label it `Skim ⇄ Full`, not an icon-only switch.
- Keyboard shortcut `S`. Announce the change to a live region for screen readers.
- Render both variants server-side and toggle with a `data-density` attribute on `<html>`
  + CSS, so there is no hydration flash and no layout jump.
- **Target: skim `/` fits in 1.5 desktop screens.** That is the acceptance test.

**1c. The alternative worth considering.** A toggle is a coin-flip on which mode the reader
lands in. The stronger version: make `/` skim-only and permanently short, and let depth live
behind links to `/work/*`. The toggle then only exists on case-study pages. I'd build the
toggle as asked, but design `/`'s skim view as if it were the only view.

---

## 2. Verified bugs — fix these regardless of any redesign

These are all confirmed against the running site, not speculation.

| # | Issue | Evidence |
|---|---|---|
| 1 | **"Resume" links to `github.com/anubhav-qt`.** Both in the desktop rail and the mobile drawer. `/resume.pdf` returns **404**. A recruiter clicking "Resume" lands on a repo list. | [NavRail.tsx:198](src/components/NavRail.tsx:198), [NavRail.tsx:127](src/components/NavRail.tsx:127) |
| 2 | **All animation classes are dead.** `animate-in`, `fade-in`, `zoom-in-95`, `slide-in-from-top-2`, `duration-300` require `tailwindcss-animate`, which is not in `package.json`. Computed `animation-name: none`, `duration: 0s`. The site has **zero motion** — including the command palette open and the mobile drawer. | verified in-browser |
| 3 | **`py-0.2` is not a valid Tailwind class.** Resolves to `0px`. 6 occurrences. Every badge using it has no vertical padding and looks squashed. | `NavRail.tsx:177`, `CommandPalette.tsx:277`, `lab/page.tsx:96`, `SpoinSimulator.tsx:405,439,563` |
| 4 | **Two `<h1>` on every page** (NavRail identity + page title), and the overview has **zero `<h2>`** — the outline goes `H1 → H1 → H3 → H4`. Section labels ("Professional Experience") are `<div>`s. Bad for SEO and screen readers. | verified in-browser |
| 5 | **Dark-mode flash on every load.** Theme is applied in a `useEffect`; the server sends `<html class="h-full antialiased">` with no theme class and there's no blocking inline script. Dark-mode users get a white flash on every navigation. | verified: no theme script in `<head>` |
| 6 | **Contrast failure.** `--text-muted` `#64748b` on dark `--bg-surface` `#11141d` = **3.87:1** — fails WCAG AA (needs 4.5). It's used at 10–11px, the worst possible pairing. On `--bg-page` it's 4.11:1, still failing. | computed |
| 7 | **Simulator control bar is clipped on mobile.** At 375px the control row is 377px wide inside a 333px box with `overflow-x: visible`, clipped by the parent's `overflow: hidden`. The `5x` speed button and the ADR-0040 toggle are unreachable. | verified at 375×812 |
| 8 | **16 tap targets under 40px on mobile `/`.** Contact links are 28–30px tall; the "Source" links on project cards are **17px** tall. Below the 44px iOS / 48px Android minimum. | verified |
| 9 | **`/robots.txt`, `/sitemap.xml`, `/opengraph-image` all 404.** No OG image means every LinkedIn/Slack/Twitter share of this site renders as a blank text card. | verified |
| 10 | **Command palette a11y.** No `role="dialog"` / `aria-modal`, no focus trap, no body scroll lock, clicking the backdrop does nothing (the outer div has no handler — only the inner has `stopPropagation`), and arrow-key selection never scrolls the highlighted row into view. | [CommandPalette.tsx](src/components/CommandPalette.tsx) |
| 11 | Footer's "Spoin Flagship" uses a raw `<a href="/work/spoin">` instead of `<Link>` — full page reload. | [layout.tsx:38](src/app/layout.tsx:38) |
| 12 | `metadataBase` is `https://anubhavqt.vercel.app`. Confirm that's the shipping domain, or OG/canonical URLs will be wrong. | [layout.tsx:11](src/app/layout.tsx:11) |

---

## 3. Content contradictions — a recruiter who reads carefully will catch these

**Project data is duplicated across four files with no shared source**: `app/page.tsx`,
`app/work/page.tsx`, `components/CommandPalette.tsx`, `app/systems/page.tsx`. It has already
drifted:

- **Paribelle has three different stacks.**
  - `/` : "NestJS REST API with Swagger, PostgreSQL with TypeORM, Next.js 14 App Router with TanStack Query & Zustand. 48 users onboarded."
  - `/work` : "decoupled BFF architecture in **Express**/Postgres" — tech badges say `Node.js`, `Express`.
  - `/systems` : "**NestJS** + TypeORM pessimistic locking."
  - Only `/` mentions the 48 users.

- **Spoin's model names contradict inside a single page.** §3 prose says exhausting
  `gemini-2.5-flash` leaves `gemini-1.5-flash` untouched; the Thinking Pool bullet directly
  below lists `gemini-3.7-flash, gemini-3.6-flash, gemini-3.5-flash, gemini-3-flash-preview`.
  Pick one naming and make it real.

**Fix:** one `content/projects.ts` as the single source of truth, with a `skim`/`deep`
description pair per project (see §1). Every page, the palette, and `/systems` read from it.
This also unblocks skim mode cleanly.

**Also:** the footer claims "All project claims grounded in verifiable documentation" — but
the ADR `sourcePath`s in `content/manifest.json` are local `E:/spoin_bundle/...` paths. Nothing
on the site is actually verifiable by a visitor. Either link real artifacts (public repo, a
rendered ADR, a screenshot of the Postgres row count) or drop the claim. An unverifiable
claim of verifiability is worse than no claim.

---

## 4. Recruiter-path problems

**4a. The homepage never states your thesis.** The `<title>` says "The Determinism Wall."
The homepage says the phrase *zero times*. That thesis — a hard line between what must be
provable and what may be generated — is the single most differentiating thing here, and it's
absent from the page that decides whether anyone keeps reading. It should be the first
sentence under your name, in ~20px type:

> I draw a hard line between what a system must prove and what it's allowed to generate.
> The model never sits on the read path.

Then the proof points. Right now the opening paragraph is a 297-character run-on that lists
technologies — indistinguishable from a thousand other portfolios.

**4b. The proof-point grid picks the wrong four.** Currently: CGPA · 5,004 cards · 33 ADRs ·
<50ms latency, all four rendered identically.
- **CGPA 9.28** is the weakest signal for a backend/AI-infra role and it's in slot one.
- **"33 ADRs written"** and **"5,004 cards"** are effort metrics, not impact. A recruiter has
  no idea whether 5,004 is impressive.
- Make **one** dominant (the `<50ms` / no-LLM-on-read-path one — it's the thesis made
  measurable) at 2× size, and the rest secondary. Reframe effort → impact:
  *"5,004 cards generated at 130/min on $0 of paid API quota"* lands; *"5,004 cards"* doesn't.

**4c. The percentage stack reads as inflation.** Blinkadz: 95% · 85% · 90% · 60% in four
consecutive bullets. Four round unsourced percentages in a row triggers skepticism rather
than confidence. Keep the two you can defend and say how they were measured; drop the rest.

**4d. There is no "what I want" statement.** Recruiters filter on fit before skill. One line —
"Looking for backend/infra work on agent systems, data pipelines, or LLM serving. Remote or
Jaipur/Bangalore." — does more than the entire skills grid.

**4e. No resume artifact.** See bug #1. Generate a real PDF, put it in `public/`, and make
"Download Resume" a **primary** button in the hero next to the email. That is the #1 action a
recruiter wants and it currently doesn't exist.

**4f. The nav rail's fake telemetry hurts you.** `● Online` with a pulsing green dot and
`Vercel / Next.js` at the bottom of the rail reads as status-dashboard cosplay — a static site
announcing it is "online." Same for the pulsing dot on the availability badge. Delete both;
keep the availability badge as static text.

---

## 5. "It looks generic" — yes, and here's exactly why

The site is wearing the 2026 default-portfolio uniform, and every element of it is a
recognizable stock choice:

- `--accent: #2563eb` — Tailwind `blue-600`, on a `slate` neutral ramp. This is *literally*
  the Tailwind docs palette.
- `font-family` is the raw system stack. **No typeface has been chosen.** `next/font` is not
  used at all.
- Lucide icons, `rounded-xl`, `border-subtle`, card-on-surface, everywhere.
- Left rail + ⌘K palette + dark toggle — the exact shape of every AI-scaffolded dev portfolio.

Individually fine; together they're a fingerprint. **The fastest single change with the
largest effect is choosing a typeface and abandoning blue.**

Pick **one** direction and commit fully. Don't blend.

**(A) Technical editorial — my recommendation.** It's what the content already is: ADRs,
incident write-ups, benchmark tables. Lean in.
- Headings: a display serif — `Instrument Serif`, `Newsreader`, or `Source Serif 4`.
- Body: `Inter` or `Geist` at **17px**, line-height 1.6.
- Mono: `JetBrains Mono` or `Berkeley Mono` — reserved *only* for code, identifiers, and
  numeric data. Never for labels or nav (currently 20% of text is mono; target under 8%).
- Kill card borders on the homepage. Use ruled horizontal lines and whitespace to separate
  sections. Keep the card treatment exclusively for the simulator and ADR entries, so cards
  come to *mean* "interactive artifact."
- Accent: one non-blue — deep amber `#b45309`, or oxblood `#9f1239`. Reserve it strictly for
  the determinism-wall motif.
- Figure-numbered diagrams with captions ("Fig. 3 — quota grid search order"). Sidenotes
  instead of parentheticals.

**(B) Terminal/dossier.** Fully mono, zero border-radius, hairline rules, one phosphor accent
(amber or green), density as an intentional feature. Thematically perfect for "determinism,"
but high-risk: it fights readability and reads as a gimmick if executed at 90%.

**(C) Blueprint/schematic.** Faint grid-paper ground, hairline strokes, isometric system
diagrams, IBM Plex Sans + Plex Mono, cyan-on-navy. Distinctive and on-theme; more illustration
work than the other two.

**Concrete typographic scale to adopt** (this alone fixes the "wall of text" feeling):

```
Display  40/1.1   -0.02em   (page h1)
H2       28/1.25  -0.01em   (section — currently missing entirely)
H3       20/1.3
Lede     19/1.55            (the one-sentence thesis)
Body     17/1.6             (currently 12px!)
Small    14/1.5             (metadata, captions)
Micro    12/1.4             (badges only — currently the entire site)
```

Also: `--border-subtle` `#e2e8f0` in light mode on a `#f8fafc` page is nearly invisible; the
cards read as floating grey rectangles. Either raise the contrast or (better) remove the
borders per direction A.

---

## 6. The simulator — your best asset, badly placed

It's genuinely the most differentiated thing on the site: a deterministic, perturbable
simulation of your own quota governor, with an ADR-0040 toggle that demonstrates a real
production bug. Nobody else has this. Problems:

1. **It's 958px down on mobile** and roughly a screen down on desktop — below the fold on the
   page it defines. Move it directly under the H1 + a 5-bullet TL;DR, before all prose.
2. **It's invisible from the homepage.** Put a small autoplaying, non-interactive loop of the
   quota grid on `/` with a "Try it →" overlay. That converts a skim into a click far better
   than the text link does.
3. **No "why am I looking at this"** on first paint. Add a one-line objective above the
   controls: *"Watch the ADR-0040 bug: toggle serialization off and count the 429s."*
   Then a **"Run the failure case"** preset button that turns serialization off, adds 3
   same-project keys, and runs — a single click that produces the whole story.
4. **14 controls exposed at once** (Run/Step/Reset/1x/2x/5x/toggle/static/3 tabs/2 key buttons).
   Progressive disclosure: primary row = Run + the ADR toggle. Everything else behind "Advanced."
5. **Mobile is broken** (bug #7) — the control row clips.
6. Add a **result readout**: after a run, one sentence — "Serialized: 0 rate-limit errors,
   130 cards/min. Unserialized: 7 errors, 2 cells poisoned." Right now the payoff is left for
   the viewer to infer.
7. Consider a **shareable state URL** (`?keys=3&serialize=0`) so you can link a specific
   scenario in an application email. Small effort, memorable.

---

## 7. Structure & IA

- **`/lab` and `/systems` overlap heavily** and are both low-traffic for a recruiter. `/systems`
  is 1,016 words of principle-plus-evidence; `/lab` is open questions. Consider merging into
  one `/thinking` page, or cutting `/lab` until there are entries a stranger would care about.
  Six nav items for a personal site is two too many.
- **Nav label "Overview / Profile"** — the slash is a hedge. Call it "Home" or "Profile."
- **The 4-beat audit format on `/work` is strong** — Problem/Constraint/Decision/What Broke is
  a genuinely good frame and "What Broke" is rare and credible. But it renders as a 2×2 grid of
  four identical grey boxes per project, six times, at 12px. In skim mode show *only* the
  Decision line. In full mode, make "What Broke" visually dominant, since it's the part that
  differentiates you.
- **The ASCII pipeline diagram** in the Spoin prose is built from nested `pl-4`/`pl-6`/`pl-8`
  divs — it breaks below ~400px and can't be styled. Replace with a real inline SVG
  (theme-aware via `currentColor`), figure-numbered.
- **Add "Last updated" per case study.** Portfolios rot; a date signals the opposite.
- **Add a print stylesheet.** Recruiters print or PDF profiles. Currently `/` prints as a
  chopped-up dark mess. `@media print`: force light, drop the rail, expand skim → full,
  show link URLs.
- **The benchmark table** (Run 1 vs 2 Part A vs 2 Part B) is the most persuasive object on the
  site and it's at the bottom of a 15-screen page in 11px mono. Promote it.

---

## 8. Accessibility (beyond what's in §2)

- Add `prefers-reduced-motion` handling once real animations exist (the simulator already
  respects it — good).
- Focus-visible rings are nowhere in `globals.css`; keyboard users have no visible focus
  indicator on cards or nav.
- `<html lang="en">` is set — good. Add `<meta name="theme-color">` per scheme.
- The mobile drawer doesn't trap focus or lock body scroll.
- Icon-only buttons: `ThemeToggle` has `aria-label` (good); the mobile menu button too (good).
  The simulator's tab buttons need `role="tab"` / `aria-selected`.
- Colour is the only channel distinguishing the 4-beat boxes (grey/amber/blue/rose dots) —
  fine, since they're also labelled. Keep it that way.

---

## 9. SEO / meta / performance

- Add `app/opengraph-image.tsx` (Next 16 supports generating it at build). Right now every
  shared link is a blank card.
- Add `app/sitemap.ts` and `app/robots.ts`.
- Add JSON-LD `Person` schema with `sameAs` for GitHub/LinkedIn — cheap, and it's how you
  show up as an entity rather than a page.
- Per-page `metadata` exists only on `/work/spoin`. `/work`, `/systems`, `/lab`, `/continuum`
  all inherit the root title. Every page should have its own title + description.
- `next/font` is unused — adopting it is required for §5 anyway and eliminates layout shift.
- Lucide is imported per-icon (good, tree-shakes). `page.tsx` imports 18 icons and uses ~8 —
  harmless but worth cleaning.

---

## 10. Ideas that would actually differentiate

Ranked by (impact ÷ effort):

1. **A "60-second version" as the literal default.** Name, one-line thesis, three numbers,
   two buttons (Resume, Email), three project links. That *is* skim mode done right.
2. **"Two doors" at the top:** `I'm hiring →` and `I'm an engineer →`. Two audiences, two
   paths, no compromise page. Very few portfolios do this and it reads as considerate rather
   than clever.
3. **A postmortem page.** You already write "What Broke" for every project. Collect them into
   one `/incidents` page — five real production failures and their fixes. Almost no junior
   portfolio has this, and it's the fastest way to read as senior.
4. **Make one number auditable.** Pick a single claim — "5,004 cards" — and show the actual
   `SELECT count(*)` output, or a live read-only endpoint. One verified number buys trust for
   all the unverified ones.
5. **Homepage simulator loop** (see §6.2).
6. **Shareable simulator states** (see §6.7).
7. **A `keyboard-first` reading mode**: `J`/`K` to move between sections, `S` for skim, `?` for
   the shortcut sheet. Consistent with the site's engineering-tool posture — but only add it
   *after* the palette's a11y is fixed, or it compounds the problem.

---

## 11. Suggested order of work

**Ship first (a day, all bugs, no design risk):**
1. Real `resume.pdf` + fix both Resume links (§2.1)
2. Install `tailwindcss-animate` or strip the dead classes (§2.2)
3. Fix `py-0.2` (§2.3)
4. Anti-FOUC theme script in `<head>` (§2.5)
5. Fix `--text-muted` contrast + raise minimum font size to 14px (§2.6)
6. Mobile simulator control row + tap targets (§2.7, §2.8)
7. `opengraph-image`, `sitemap`, `robots`, per-page metadata (§2.9, §9)
8. Single `content/projects.ts`; resolve the Paribelle and Gemini contradictions (§3)

**Then (the real fix):**
9. Adopt the type scale + a typeface + drop blue (§5) — this is what kills "generic"
10. Rewrite the homepage around the thesis sentence and one dominant metric (§4a, §4b)
11. Skim mode with authored `skim`/`deep` pairs, site-wide, default on (§1)
12. Restructure `/work/spoin`: TL;DR → simulator → prose → benchmark → ADRs (§6, §7)

**Then (differentiation):**
13. Two doors (§10.2), `/incidents` (§10.3), homepage simulator loop (§6.2)
14. Merge or cut `/lab` (§7)

---

## Note on the last item

Fixing hierarchy (step 9) and cutting text (step 11) are *both* needed, but in that order.
If skim mode ships onto the current 12px-everything layout, the result will be a shorter wall
of 12px text — and it'll read as "not enough information" instead of "easy to scan." The type
scale has to land first for skim mode to feel like a feature rather than a redaction.
