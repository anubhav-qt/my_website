# Build spec: Anubhav's portfolio site

You are implementing a personal portfolio site from scratch in `F:\my_website` (currently empty).
This document is the complete brief. Read it fully before writing code.

---

## 0. Context you need first

Two private project repos live on this machine. **Read them before writing any case-study content** —
all project copy must come from these, never invented:

- `E:\spoin_bundle` — the flagship. `docs/adr/` (49 ADRs), `docs/architecture/`, `apps/{api,web,worker}`, `packages/`
- `E:\continuum` — planning-phase project. `README.md`, `docs/`

Highest-value files:

- `E:\spoin_bundle\docs\architecture\generation-pipeline.md`
- `E:\spoin_bundle\docs\architecture\overview.md`
- `E:\spoin_bundle\docs\architecture\content-model.md`
- `E:\spoin_bundle\docs\adr\0028-key-model-quota-ladder.md`
- `E:\spoin_bundle\docs\adr\0029-questions-join-generator-pool.md`
- `E:\spoin_bundle\docs\adr\0030-two-pass-quality-gate.md`
- `E:\spoin_bundle\docs\adr\0040-per-cell-call-serialization.md`
- `E:\spoin_bundle\docs\adr\0041-per-group-gate-and-persist.md`
- `E:\spoin_bundle\docs\adr\0026-one-shot-generation-to-completion.md`
- `E:\spoin_bundle\docs\adr\0025-batched-llm-topic-matching.md`
- `E:\spoin_bundle\docs\architecture\generation-pipeline-run-2-benchmark.md`

**Spoin's source is closed.** The site publishes the *reasoning trail* (ADRs, architecture, decisions),
never source code, secrets, API keys, `.env` contents, or internal task notes. Do not copy code bodies
from `apps/` or `packages/` into the site. Architecture prose and ADR reasoning are fine and intended.

---

## 1. The thesis — this drives every design decision

The site has one idea, stated in the hero and evidenced by every project:

> **Anubhav draws a hard line between what must be provable and what is allowed to be generated,
> and puts the expensive, unreliable thing on the far side of it.**

Call this **the determinism wall**. It recurs everywhere and is the reason the site exists:

- **Spoin** — the read path never calls an LLM; a CQRS wall separates generation from serving
- **Continuum** — invalidation instead of blind regeneration; QC is deterministic code, narrative checks trace to graph node IDs
- **Trotter** — a "deterministic scoring wall"; Gemini is only handed already-computed numbers
- **Fraud Vote** — OpenCV + embeddings decide; no model is trusted with the verdict
- **Secondary Screen** — 3 static files instead of 300MB of Electron

Do **not** use vague framing like "I build systems to understand complicated things." Lead with the wall.

**Audience: recruiter-first, engineer-deep.** Every page must give a recruiter a complete, satisfying
40-second read above the fold, with depth available below it or one click away. Both audiences, but every
layout tradeoff resolves in favor of the recruiter.

---

## 2. Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Deploys to Vercel (`anubhavqt.vercel.app`; custom domain later — don't hardcode the host anywhere)
- **The site repo is public.** No secrets, no `.env` values, no private keys in committed content.
- MDX for case-study content
- No CMS, no database, no auth
- Animation: prefer CSS/SVG and a small hand-rolled state machine. Do not pull in a heavyweight
  animation or diagramming dependency for the simulator (see §5) — it needs custom layout and custom
  timing control that a generic library will fight.

---

## 3. Routes and navigation

Multi-route with a **persistent nav rail**: fixed left rail on desktop, top bar on mobile.
`⌘K` / `Ctrl+K` command palette as a *shortcut*, not the primary navigation — the rail is primary.
The palette indexes: every route, every project, every SYSTEMS principle, resume, GitHub.

```
/                  Hero (the wall, one sentence) · NOW (Spoin, Continuum — one line each) · index
/work              Short cards: Trotter, Fraud Vote, Secondary Screen
/work/spoin        Flagship case study + the interactive centerpiece (§5)
/work/continuum    Living WIP, dated changelog, explicitly labeled in-progress
/systems           Cross-cutting principles (§6)
/lab               Open questions / in-progress. NOT a graveyard.
```

Resume link: small, in the rail corner. Not a hero CTA.

**Every project entry follows the same four-beat structure:**
`Problem → the constraint → the decision → what broke`

The fourth beat is mandatory and must be honest. "What broke" is the highest-signal part of the site —
ADR-0040 (§5.4) is the model for it.

**Explicitly do not build:** aphorism/"thinking" fragments, `[ABANDONED]` or `[PROBABLY A BAD IDEA]`
buckets, a `sleep: ██░░ 14%` bar, or a Konami code. These were considered and rejected — they undercut
a job-hunting portfolio.

---

## 4. Visual register — "technical editorial"

Reads like a well-set engineering paper, not a terminal costume.

- Serious, readable type at a real editorial scale; generous whitespace; strong vertical rhythm
- **One** restrained accent color. Not a gradient. Not neon.
- Monospace **only where it carries meaning**: code identifiers, ADR numbers, model ids, metrics, grid cells.
  Never for body copy or headings.
- Light and dark both supported and both deliberate. Define a full token set; don't let dark mode be an inversion.
- The pages stay quiet. **The simulator carries all the visual energy.** If a page competes with it, tone the page down.

---

## 5. THE CENTERPIECE — Spoin: generation pipeline + quota governor

This is the single most important thing on the site. Budget accordingly. It lives on `/work/spoin`,
full-bleed, with the prose case study above and below it.

It is a **live simulation the visitor perturbs** — not a video, not a scroll-scrubbed replay, not a
static diagram. The visitor changes inputs and watches the mechanism react.

One canvas, two halves.

### 5.1 Left half — the LangGraph run

Source of truth: `docs/architecture/generation-pipeline.md`. Render the real graph:

```
START
 └─ Send fan-out: one branch per topic_id   (independent — a topic that's already
    │                                        curriculum'd never waits on a sibling)
    ▼
 resolve_and_plan_topic
    - topic already exists (matching decided that upstream, ADR-0025, outside this graph)
    - if curriculum_generated_at unset → ONE generate_curriculum() call → persist Subtopic rows,
      grouped across difficulty tiers by subtopic_group_id (the model decides which tiers a
      concept needs — never a mechanical beginner/intermediate/advanced grid)
    - if already curriculum'd → skip straight to loading existing subtopics
    │
    └─ Send fan-out: one branch per subtopic GROUP (not per tier)
       ▼
    generate_subtopic_cards
       - concurrent across groups AND topics
       - tiers WITHIN a group run SEQUENTIALLY, lowest difficulty first: the higher tier's
         generate_cards() receives the lower tier's actual card BODIES as `builds_on` context
       - gates + persists its OWN group right here before returning (ADR-0041):
           structural check → pass 1 correction → near-duplicate detection (local embeddings,
           sequential, BETWEEN the two passes) → pass 2 verification   (ADR-0030)
           every draft becomes exactly one of an active `Card` or a `rejected_card` row
           accepted cards get embedded, archetype-derived, bootstrap CardStats
           THEN generates questions FROM the cards just persisted, and persists those too
       ▼
 fan-in → gate_and_persist
       - everything is ALREADY persisted; this only aggregates item_reports into the
         per-topic run report and marks each GenerationJob done
```

**Make these three things visually unmistakable — they are the whole point:**

1. **Cards go live per group, not per run.** When a group finishes, its feed items appear immediately
   while sibling groups are still running. Show a small live "feed" filling in beside the graph.
2. **Tiers within a group are sequential; groups are concurrent.** The visual must not blur these.
3. **Fan-in does no writing.** The final node is lightweight bookkeeping only.

Every real generator call (curriculum, topic matching, card generation, question generation) passes
through a shared `asyncio.Semaphore` (`SPOIN_MAX_CONCURRENT_GENERATION_CALLS`) before reaching the grid.
Render the semaphore as a visible chokepoint between the two halves — calls queue at it.

### 5.2 Right half — the `(key_index × model)` quota grid

Source of truth: ADR-0028, amended by 0029, 0030, 0040.

Draw a **grid**, not a list. Rows = models (ladder order, strongest at top). Columns = key indices.
Two independent pools, each with its own governor and its own ladder:

| Pool | Calls | Ladder |
|---|---|---|
| **thinking** | `generate_curriculum`, `match_topics`, `correct_cards`, `verify_cards`, `grade_free_text` | baseline Flash models, newest→oldest |
| **generator** | `generate_cards`, `generate_questions` | "lite" Flash models, newest→oldest |

The split rule, worth surfacing as a callout: *the thinking pool covers every call where a weak model
has a real consequence — a bad curriculum, a bad match, a bad judgment, a bad grade. Card writing is
pure prose that the quality gate independently checks afterward, so it gets the cheap high-volume ladder
instead of competing for the thinking budget.*

**Search order: model first, then key, and it never waits.**
Walk the ladder top-down; for each model, try every key in order. The first cell with room on **both**
RPD and RPM is used immediately. A model is skipped only once *every* key is exhausted for it. A key
that's merely RPM-capped this second is skipped in favor of the next key or model — **never slept on**.
Only when the entire grid is spent does `acquire()` raise `QuotaExhaustedError`.

Animate the search: a visible cursor walking model-first-then-key, rejecting cells with a reason.

**RPD is persisted, RPM is not.** Render this difference:

- RPD lives in `QuotaLedger` in Postgres (`backend=f"gemini:{key_index}:{model}"`) and survives across
  the worker's separate cron passes → an RPD-dead cell stays dark for the rest of the day
- RPM is an in-process sliding window, reset every worker run → an RPM-capped cell visibly recovers

**Quota exhaustion is not job failure.** When the grid is fully spent, the worker catches
`QuotaExhaustedError` *specifically*, before the generic handler, and requeues the `GenerationJob` as
**`pending`, not `failed`**. Show the job returning to the queue, then resuming *exactly where it left
off* on a later pass — safe because the pipeline is idempotent per topic (ADR-0026). This is the
graceful-degradation beat; give it a moment of screen time.

Also worth a callout: total daily capacity for a pool is *(each model's RPD) × (number of keys)*, summed
down the ladder. Adding a key from a genuinely separate Google Cloud project adds a whole row to the
grid. Adding a key from the *same* project adds nothing — limits are per project, not per key. Let the
visitor discover this by adding a same-project key and seeing capacity not move.

### 5.3 Visitor controls

- number of API keys (and whether a new key is a separate project or the same one)
- number of topics
- subtopic groups per topic, and tiers per group
- drain a specific model's RPD
- force a 429 on a cell
- run / pause / step / reset, and a speed control

### 5.4 The ADR-0040 toggle — the best thing on the site

Ship a switch labeled something like **"same-cell call serialization: on / off"**.

- **On** (current behavior): calls to the same `(key, model)` cell are serialized.
- **Off** (the bug as it actually shipped): `acquire()` grants a cell and returns *before the real call
  fires*, so concurrent tasks burst a single cell past its true RPM and trigger **429s the local ledger
  did not predict** — the governor believes the cell has room while the API disagrees.

Annotate it plainly: this bug was found in production, during real end-to-end grid rotation under real
exhaustion, and fixed in ADR-0040. A visitor flipping that switch and watching phantom 429s appear is
the strongest single signal on the entire site. Do not bury it.

### 5.5 Simulator engineering notes

- Build the **state machine first, headless, with tests.** Reducer + tick function, fully deterministic,
  seeded RNG. Then render it. Do not entangle simulation state with React render state.
- Deterministic and reproducible: same seed + same controls → same run, every time.
- Must degrade honestly: `prefers-reduced-motion` gets a static, fully-labeled end-state diagram with
  the same annotations, not a broken animation.
- Must be keyboard-operable and screen-reader-legible. Provide a text summary of run state.
- Must not jank on a mid-range laptop. Cap concurrent animated elements; this is a portfolio, and a
  stuttering performance demo actively argues against the thesis.
- Mobile: the two halves stack; the grid stays legible. If it can't be good on a phone, show the static
  annotated version there rather than a cramped simulator.

---

## 6. `/systems` — the cross-cutting principles

Six principles. Each gets: the principle stated plainly, then **two or three real excerpts from real
projects as evidence**, each linking to the case study it came from. This page is what turns seven
unrelated project cards into one coherent argument.

1. **Determinism Boundaries** — Spoin's CQRS read/write wall; Trotter's scoring wall; Fraud Vote's verdict
2. **Invalidation** — Continuum re-running one hop at a time instead of blind regeneration
3. **Read/Write Decoupling** — Spoin's read path never calling an LLM; sub-50ms feed
4. **Convergence** — the two-pass quality gate (ADR-0030); prevention-over-detection in subtopic reuse
5. **Graceful Degradation** — `QuotaExhaustedError` → requeue `pending`, resume idempotently (ADR-0028/0026)
6. **Schema-First Scaling** — the `(key, model)` grid replacing a flat key list; ADRs as the unit of change

Pull the evidence from the real docs. Do not paraphrase into something vaguer than the source.

---

## 7. Content sync

Write `scripts/sync-docs.ts` (run manually, not at build time — the source repos won't exist on Vercel).

- Reads from `E:\spoin_bundle\docs` and `E:\continuum\docs`
- Driven by a committed **manifest** (`content/manifest.json`) listing which ADRs/architecture docs to
  publish, in what order, under what section, with what display title. The manifest exists because the
  script must know which of 49 ADRs to render and how to group them — it is a curation list.
- Emits MDX into `content/` with frontmatter: title, source path, ADR number, status, date, summary
- Rewrites relative ADR cross-links (`../adr/0029-....md`) into working site links
- Idempotent, and reports what changed
- Never emits anything outside `content/`; never copies from `apps/` or `packages/`

`/work/continuum` renders a **real dated changelog** from frontmatter, so "last updated" is truthful.
Continuum is planning-phase with no implementation — label that explicitly and without embarrassment.
Frame it as an open design problem being worked, never as a shipped thing.

---

## 8. Build order

1. Scaffold: Next.js App Router + TS + Tailwind, design tokens, type scale, rail nav, ⌘K palette
2. MDX rendering + `scripts/sync-docs.ts` + manifest
3. `/work/spoin` prose case study — must be shippable and complete on its own, before the simulator exists
4. **The simulator** — headless state machine + tests first, then canvas, then controls, then the ADR-0040 toggle
5. `/work/continuum`, `/systems`, `/lab`, short project cards on `/work`
6. Polish: a11y pass, reduced-motion, mobile, Lighthouse, metadata/OG, Vercel deploy

**Ship each step complete.** A half-built section is worse than a conventional portfolio that's finished —
this design only works if it's done. If something has to be cut, cut whole sections, not the finish on them.

---

## 9. Non-negotiables

- Every technical claim traces to a real doc in `E:\spoin_bundle` or `E:\continuum`. Invent nothing.
  If a number isn't in the docs, don't put a number on the site.
- No source code, secrets, `.env` contents, or API keys in committed content.
- The four-beat structure (`problem → constraint → decision → what broke`) on every project entry.
- Recruiter gets a complete 40-second read above the fold on every page.
- The simulator is deterministic, accessible, reduced-motion-safe, and doesn't jank.
- Nothing ships half-finished.
