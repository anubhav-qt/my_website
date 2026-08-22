# Build spec: Full UI overhaul — "The Wall" visual system

You are redesigning the existing site at `F:\my_website` (Next.js 16, TypeScript, Tailwind v4).
This is a **visual and structural overhaul**, not a content rewrite — the underlying facts
(experience, projects, ADRs) stay true to the source docs, but almost everything about how
they're presented changes: less prose, more graphics, a real icon system, a real color and
type identity instead of the current default-blue/slate/system-font look.

Read this whole document before touching code. It supersedes the visual instructions in
`ANTIGRAVITY_PROMPT.md` (keep that file's §0 content-sourcing rules and §1 thesis — those
are still correct) but replaces its design-system and page-layout sections.

---

## 0. Why this overhaul, in one paragraph

The current build reads as a wall of 12px grey text in bordered cards with the stock Tailwind
blue accent and the system font stack — recognizable as an AI-scaffolded portfolio rather than
a designed one. Word counts are actually fine (563 words on the homepage) but there's no
typographic hierarchy and no graphics, so everything reads as equally unimportant. This spec
fixes both: fewer words per screen, replaced by icons, diagrams, timelines, and small charts
that carry the same information faster. Where text remains, it gets a real type scale so it's
scannable instead of uniform.

---

## 1. Design system

### 1.1 Typography

Adopt via `next/font` (no more raw system font stack):

- **Display / headings** — `Fraunces` (variable, use weights 380–600, optical size `soft`).
  A serif with real character — warm, editorial, distinct from every SaaS-blue portfolio.
  Used for `h1`/`h2`/`h3` and for large standalone numbers (stat tiles).
- **Body / UI** — `Geist Sans` (Vercel's font, free via `next/font/google` or `geist` npm
  package). Clean, humanist, excellent at small sizes.
- **Mono** — `JetBrains Mono`. **Reserve it strictly for code, identifiers, ADR numbers, and
  literal data values** (latency numbers, model names, file paths). Do not use mono for nav
  labels, section headers, or body copy — currently ~20% of all text is mono and it flattens
  everything. Target under 8%.

Type scale (apply everywhere, this is the fix for "everything is 12px"):

```
Display   40 / 48   Fraunces 560   -0.02em   (page h1)
H2        28 / 34   Fraunces 500   -0.01em   (section headers — currently missing entirely)
H3        20 / 28   Fraunces 500
Lede      19 / 30   Geist 400                (the one thesis sentence per page)
Body      16 / 26   Geist 400
Small     14 / 22   Geist 450                (captions, metadata)
Micro     12 / 16   Geist Mono 500 uppercase (badges, tags ONLY — not body text)
Stat      44 / 44   Fraunces 560            (big numbers in stat tiles)
```

### 1.2 Color — drop blue entirely

Current `--accent: #2563eb` is literal Tailwind `blue-600` on a `slate` neutral ramp. Replace
with a warm ink/paper system:

```css
:root {
  --bg-page:        #faf7f2;   /* warm paper, not cool slate */
  --bg-surface:     #ffffff;
  --bg-subtle:      #f1ece1;
  --ink-900:        #1c1a17;   /* near-black warm ink, not slate */
  --ink-600:        #4a4540;
  --ink-400:        #8a8378;
  --line:           #e4ddd0;   /* hairline rule color, replaces most borders */
  --line-strong:    #cfc4b0;
  --accent:         #b3541e;   /* burnt copper — the "generated/stochastic" color */
  --accent-ink:     #7a3814;
  --wall:           #1c1a17;   /* the "deterministic" color: ink itself, not a hue */
  --success:        #3f6b3f;
  --danger:         #a3372c;
}
.dark {
  --bg-page:        #16140f;
  --bg-surface:     #1e1b15;
  --bg-subtle:      #262119;
  --ink-900:        #f4efe6;
  --ink-600:        #b8ac98;
  --ink-400:        #7c7264;
  --line:           #322c22;
  --line-strong:    #453e30;
  --accent:         #e08a4f;
  --accent-ink:     #f0a870;
  --wall:           #f4efe6;
  --success:        #7fae7f;
  --danger:         #d97462;
}
```

Rationale: copper/amber is warm, uncommon in tech portfolios (which are almost all blue or
purple), and it maps directly onto the site's actual thesis — **copper = the generated,
stochastic side of the wall; ink/black = the deterministic, proven side.** Use this mapping
literally in diagrams (§1.4), not just as decoration.

Replace card borders with **hairline rules** (`--line`) as the default separator. Reserve
bordered "cards" (`rounded-lg border`) for exactly two things going forward: (a) the
interactive simulator, (b) ADR entries. If everything is a card, nothing is — cards should
mean "this is a distinct interactive/reference artifact."

### 1.3 Iconography — build a real system, not sprinkled lucide

Keep `lucide-react` for generic UI chrome (search, close, arrows, menu). But build two custom
pieces:

**A. The Wall glyph** — one small SVG motif (16–24px), reused everywhere the site's thesis
appears: a vertical line with circles/dots on one side (stochastic) and squares/solid fill on
the other (deterministic). Use it:
- In the nav rail next to the site identity (replaces the plain pulsing dot)
- Next to every "Decision" beat in the 4-beat project cards
- As a tiny favicon-adjacent mark

```svg
<svg viewBox="0 0 24 24" width="18" height="18">
  <!-- left side: 3 scattered circles (generated/stochastic) -->
  <circle cx="4" cy="6" r="1.4" fill="var(--accent)" opacity="0.9"/>
  <circle cx="7" cy="11" r="1" fill="var(--accent)" opacity="0.6"/>
  <circle cx="3" cy="16" r="1.2" fill="var(--accent)" opacity="0.75"/>
  <!-- the wall itself -->
  <rect x="11" y="2" width="2" height="20" fill="var(--wall)"/>
  <!-- right side: 3 aligned squares (deterministic/proven) -->
  <rect x="16" y="4" width="3" height="3" fill="var(--wall)"/>
  <rect x="16" y="10.5" width="3" height="3" fill="var(--wall)"/>
  <rect x="16" y="17" width="3" height="3" fill="var(--wall)"/>
</svg>
```

**B. Pictogram tiles for the stack/skills grid.** Replace the current comma-separated text
list ("Languages: Python, TypeScript") with a grid of small square tiles, one per
skill/technology: a monoline icon (use `simple-icons` React components where a real brand
mark exists — Python, TypeScript, PostgreSQL, Docker, Next.js, PyTorch, Redis all have one;
`npm install simple-icons` or `@icons-pack/react-simple-icons`) + the name in `Small` size
underneath. For tools without a simple-icons entry (LangChain, LangGraph, FastAPI has one
actually), fall back to a relevant lucide icon (e.g. `GitBranch` for LangGraph) — never fall
back to plain text with no glyph.

Layout: `grid grid-cols-4 sm:grid-cols-6 gap-3`, each tile `aspect-square`, icon centered at
28px, label in 11px Geist below, no border — just the icon, on hover a hairline underline
appears. This single change removes ~120 words of running prose from the homepage.

### 1.4 Diagrams — replace every ASCII/nested-div diagram with real inline SVG

The current LangGraph pipeline diagram (`pl-4`/`pl-6`/`pl-8` nested divs simulating a tree)
breaks below 400px and can't be styled. Replace with hand-built inline SVG, theme-aware via
`currentColor` / `var(--ink-900)` / `var(--accent)`, viewBox-scaled so it never overflows.

Required diagrams (build all three as reusable components in `src/components/diagrams/`):

1. **`WallDiagram`** — the homepage hero graphic. Two zones divided by a vertical wall line.
   Left zone (labeled "Generated"): a handful of soft circles in `--accent`, gently
   drifting/pulsing via CSS (`@keyframes float`, respects `prefers-reduced-motion`). Right
   zone (labeled "Proven"): a rigid grid of squares in `--wall`, static. A short caption below:
   *"The model writes prose. Everything that must be true is checked outside it."* This
   replaces the current 297-character opening paragraph as the primary hero element — text
   drops to one sentence, the diagram carries the rest.

2. **`PipelineDiagram`** — replaces the ASCII pipeline on `/work/spoin`. A real flow diagram:
   boxes (`resolve_and_plan_topic` → `generate_subtopic_cards` → `gate_and_persist`) connected
   by SVG paths with arrowheads, fan-out shown as branching paths with a small `×N` badge, not
   prose describing branching. Label each box with a one-line purpose, not a paragraph.

3. **`QuotaGridDiagram`** — a static preview version of the simulator's live grid (key × model
   matrix as colored cells) for use in the homepage NOW section and in `/systems`, so the
   simulator's visual language is recognizable before a visitor clicks into it.

### 1.5 Data visualization for stats — replace bare numbers with small charts

Every "X" number currently sits in a plain bordered box as text. Replace with `src/components/
StatTile.tsx` variants:

- **Gauge tile** — semicircular gauge (SVG arc, `stroke-dasharray` trick) for the `<50ms`
  latency stat: arc fills to ~5% of a 0–1000ms scale, labeled `<50ms`, subtext "swipe latency,
  zero LLM in path."
- **Bar-growth tile** — for the 14 → 130 cards/min benchmark: three small horizontal bars
  (Run 1 / Run 2A / Run 2B) with the labels as the actual numbers, not a 4-column text table
  as the primary view (keep the full table further down for engineers who want it).
- **Counter tile** — big `Stat` (44px Fraunces) number with a one-line label underneath, no
  border, no card — just ink on paper. Use for CGPA, ADR count.
- **Sparkline tile** — tiny inline SVG trend line, for anything with a "before → after" shape.

Build these as composable primitives, not one-off markup per page.

### 1.6 Motion — make it real this time

`animate-in`/`fade-in`/`zoom-in-95`/`slide-in-from-top-2` classes are currently dead
(`tailwindcss-animate` isn't installed — verified, `animation-name: none` computed). Either:
- `npm install tailwindcss-animate` and register it in the Tailwind v4 config properly, **or**
- write ~6 custom `@keyframes` in `globals.css` (`fade-in`, `slide-up`, `scale-in`) and use
  those class names instead.

Either way, wrap every use in `@media (prefers-reduced-motion: reduce) { animation: none }`.
Add a real transition to: page content on route change (fade+slight rise, ~200ms), the command
palette open/close (currently instant despite claiming `zoom-in-95`), the mobile drawer, and
the `WallDiagram`'s drifting circles.

### 1.7 Spacing & density

Increase whitespace between sections (currently `space-y-12`, mostly fine) but **decrease
internal card padding and text density** — the goal of "more graphical, less text" means each
screen should have 1–2 focal graphics and short supporting labels, not a graphic bolted onto
the existing paragraph. When adding a diagram or icon grid, delete the prose it replaces —
don't keep both.

---

## 2. Global component changes

### 2.1 Nav rail

- Replace the plain pulsing green dot next to the name with the **Wall glyph** (§1.3A).
- Remove the "Resume" link entirely for now — the current one points at GitHub as a stand-in
  and there's no real resume artifact yet. Don't fabricate one. Replace that slot with nothing,
  or with the GitHub link alone (already present elsewhere in the rail) — don't duplicate it.
- Remove the fake `● Online` / `Vercel / Next.js` status footer — reads as a status dashboard
  cosplaying, not as information a recruiter needs.
- Keep the ⌘K palette trigger, but restyle it with the new type/color system: `Geist` not mono
  for the placeholder text, mono only for the `⌘K` kbd badge.

### 2.2 Command palette

Fix while restyling (was already broken, now visible under the new motion system):
- Add `role="dialog"` `aria-modal="true"`, trap focus, lock body scroll while open.
- Backdrop click should close it (currently only the inner panel stops propagation; the
  backdrop itself has no handler).
- Scroll the highlighted row into view on arrow-key navigation.
- Give it the real open/close transition from §1.6.

### 2.3 4-beat project cards (`/work`)

Currently: 2×2 grid of four identically-styled grey boxes at 12px, six times over. Redesign:
- **Problem / Constraint** collapse into one compact "Context" line (Small, 14px) — these two
  beats are usually short and don't need separate boxes.
- **Decision** gets the Wall glyph next to its label and becomes the visually dominant block
  (this is the thesis-bearing beat).
- **What Broke** keeps its distinct treatment (currently rose-tinted, keep that — it's good,
  the honesty signal is valuable) but add a small `AlertTriangle`-style icon instead of relying
  on color alone.
- Tech stack row becomes pictogram tiles (§1.3B) at small size (20px icons, no label, tooltip
  on hover) instead of a wrapped row of text badges.

### 2.4 Experience section (`/`)

Replace the two bordered prose blocks (Anchorate, Blinkadz) with a **vertical timeline**
component: a vertical line with a dot per role, date range in mono/Small to the left, role +
company as H3, and **at most 2 bullet points per role**, each ≤ 12 words, each prefixed with a
small relevant lucide icon (e.g. `ShieldCheck` for the governance work, `Zap` for the 95%
speed-up). Move the fuller detail (current full bullet text) into a "Details" disclosure
(`<details>`) per role, collapsed by default — this is the skim/deep split from the earlier
conversation, applied structurally instead of via a separate toggle component.

### 2.5 Stat grid (`/`)

Replace the current 4-up plain-text grid with the StatTile variants from §1.5: one gauge tile
(latency), one bar-growth tile (throughput), two counter tiles (ADRs, CGPA — demote CGPA to
smallest tile, it's the weakest signal for this audience). Make the latency gauge visually
dominant (2 columns wide on desktop) since it's the thesis made measurable.

---

## 3. Page-by-page rebuild

For each page below: **delete the prose block named, replace with the graphic named.** Keep
the underlying facts (they're sourced correctly already per `ANTIGRAVITY_PROMPT.md` §0) but
compress every remaining sentence — target word counts are hard ceilings, not suggestions.

### 3.1 `/` — Home (target: ≤280 words total, down from 563)

1. Hero: `WallDiagram` (§1.4.1) as the dominant visual, one Lede-sized sentence beneath it
   (the thesis, currently absent from the page entirely — add it):
   > "I draw a hard line between what a system must prove and what it's allowed to generate."
2. Availability badge + email/GitHub/LinkedIn row: keep, restyle with new palette, remove the
   pulsing dot (static text badge instead).
3. Stat grid: §2.5.
4. Experience: timeline, §2.4.
5. Flagship systems (Spoin/Continuum): keep as two tiles but replace the paragraph description
   with 3 pictogram tiles (stack) + one Small-size outcome line each, no more.
6. Open-source projects grid: each card shrinks to icon (category glyph: brain icon for
   ML, shield for security, terminal for infra) + title + **one line ≤ 14 words** + pictogram
   stack row. Delete the current 2-sentence descriptions.
7. Skills/education: skills become the pictogram grid (§1.3B), full stop — delete the
   "Languages: Python, TypeScript" style text rows entirely. Education becomes one compact
   line: degree, school, dates, GPA as a small counter tile — delete the bullet list (Dean's
   List, IEEE chapter role move into the timeline `<details>` for the education entry if kept
   at all, or drop — they're the weakest signal on the page).

### 3.2 `/work` — index

- Header prose: cut to one sentence.
- 4-beat cards: §2.3.
- Keep the flagship banner but reduce to icon + title + one outcome line (matches home §3.1.5).

### 3.3 `/work/spoin`

- Reorder: H1 → one-sentence thesis → **simulator moved up directly below** (currently 958px
  down, should be immediate) → `QuotaGridDiagram` static preview → prose sections.
- Replace the ASCII pipeline diagram with `PipelineDiagram` (§1.4.2).
- Benchmark section: replace the 4-column mono table as the primary view with the bar-growth
  `StatTile` (§1.5); keep the full table below it collapsed in a `<details>` labeled "Full
  benchmark table" for engineers who want every column.
- ADR trail: keep as bordered entries (this is the one place cards are still correct per
  §1.2) but each entry gets the Wall glyph next to its ADR number, and truncate `summary` to
  one line with a `<details>` for the rest if any summary exceeds ~25 words.
- Add the one-line simulator objective from the earlier critique: *"Toggle serialization off,
  run it, and count the 429s."* directly above the controls.

### 3.4 `/work/continuum`

- Apply the same pictogram/timeline/diagram treatment. Given it's the shortest page already
  (501 words), focus mainly on adding one diagram (the state-multigraph/invalidation concept)
  rather than aggressive cutting — a small `InvalidationDiagram` showing one node change
  cascading to two dependent nodes with a struck-through "regenerate everything" alternative
  crossed out, would communicate the core idea faster than the current paragraph.

### 3.5 `/systems`

- This page is inherently a text page (principle + evidence quotes) — keep it, but add the
  `QuotaGridDiagram` or `WallDiagram` as a small recurring motif per principle instead of a
  numbered `01`/`02` text label, and compress each evidence excerpt to one line with a
  `<details>` for the full quote. Target: cut from 1,016 words to under 500 visible by default.

### 3.6 `/lab`

- Lowest priority. Apply the type scale and pictogram category tags at minimum. Consider
  cutting this page or merging into `/systems` if time is short — it's the least
  recruiter-relevant page and currently duplicates `/systems`' territory.

---

## 4. Explicit deletions (do these regardless of what else ships)

- Remove all four `--accent: #2563eb`-derived blue usages — full palette swap per §1.2.
- Remove the "Resume" link (both nav locations) — do not link to GitHub as a stand-in.
- Remove the pulsing `● Online` footer status in the nav rail.
- Remove the 4 stacked round percentages in the Blinkadz bullets (95%/85%/90%/60% in a row) —
  keep at most 2, and only ones you can defend if asked.
- Fix `py-0.2` → `py-0.5` (or whatever the intended value was) everywhere it appears:
  `NavRail.tsx`, `CommandPalette.tsx`, `lab/page.tsx`, `SpoinSimulator.tsx` (3 occurrences).
- Fix `pl-4.5` in `NavRail.tsx` → nearest real Tailwind spacing value.
- Reconcile the Paribelle stack description — pick one truth (NestJS or Express, not both) and
  use it in `/`, `/work`, and `/systems`.
- Reconcile Spoin's model names — the prose says `gemini-2.5-flash`/`gemini-1.5-flash` in one
  paragraph and `gemini-3.7-flash`/`gemini-3.6-flash`/etc. in the very next one. Pick the real
  model names from the source docs (`E:\spoin_bundle`) and use them consistently.
- Add anti-FOUC inline theme script in `<head>` (blocking, reads `localStorage` before paint)
  so dark-mode users stop getting a white flash on every navigation.
- Raise `--text-muted`-equivalent contrast — the new `--ink-400` on `--bg-surface` must hit
  ≥4.5:1 in both themes; check with computed luminance before shipping, not by eye.
- Fix the mobile simulator control bar overflow (control row is wider than its container and
  gets clipped instead of wrapping/scrolling) and audit tap targets — nothing under 40px.

---

## 5. What NOT to change

- Keep the simulator's actual simulation logic (`src/lib/simulator/engine.ts`) — only its
  surrounding chrome, control layout, and the diagrams around it are in scope here.
- Keep the persistent-left-rail + ⌘K IA — it's a reasonable shape, the visual system around it
  is what's changing.
- Keep all factual content sourced from `E:\spoin_bundle` / `E:\continuum` as-is; this spec
  only changes *how much of it* is prose vs. graphic and *how it looks*, not the underlying
  claims (except the two explicit contradictions in §4, which are actual bugs).

---

## 6. Acceptance checklist

- [ ] Zero occurrences of `#2563eb` or any blue hex remain
- [ ] `next/font` in use for Fraunces + Geist + JetBrains Mono; no raw system font stack
- [ ] Homepage word count ≤ 280 (measure via `document.querySelector('main').innerText`)
- [ ] At least 3 custom SVG diagrams exist and render (`WallDiagram`, `PipelineDiagram`,
      `QuotaGridDiagram` at minimum)
- [ ] Stack/skills render as icon tiles, zero comma-separated tech lists remain
- [ ] `animate-in` etc. classes either removed or backed by a real, installed animation source
      (verify `getComputedStyle(el).animationName !== 'none'` on an animated element)
- [ ] Mobile simulator controls fully reachable at 375px width, no clipped/overflowing rows
- [ ] Contrast-checked: body text ≥4.5:1 against its background in both themes
- [ ] "Resume" link removed from both nav locations
- [ ] Paribelle stack description and Spoin model names are each stated once, consistently,
      across every page that mentions them
