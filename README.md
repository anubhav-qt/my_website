# my_website_v2

```
──────────────────────────────────────────
  personal site + dev log
  live at anubhav-qt.dev
──────────────────────────────────────────
```

> **Status**: v3.1. v1 was a static site (four hand-designed pages, no backend). v2 added a
> Supabase backend: live Spoin topics, threaded comments with both page-level and
> per-comment likes, session-deduped view counts, and build-time metrics pulled from the
> database, across Projects and every Scratchpad category (not just writeups). v3 made it
> work on every screen: the PC-only layout got a narrow one underneath it, a tier below
> that for small phones and folds, and it now scales itself up on wide viewports so a
> browser's default zoom shows the size it was designed at. See [Layout](#layout).

## Stack

| | |
|---|---|
| **frontend/** | React 19 · TypeScript · Vite · Tailwind v4 · deployed on Vercel |
| **backend** | Supabase (Postgres + Edge Functions), see [Backend](#backend) below |

## Quickstart

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

Backend features (topics, comments, likes, views) degrade quietly to "not available"
until `.env.local` has real Supabase credentials, so the site runs fine without them.

```bash
cp .env.example .env.local   # then fill in VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
```

## Scripts

Run from `frontend/`:

```bash
npm run dev            # local dev server
npm run build           # typecheck, build, prerender routes to static HTML
npm run lint             # oxlint
npm run test              # simulator engine unit tests
npm run sync-docs          # pull ADR/architecture docs into src/data/synced-docs.json
```

## Structure

```
frontend/
  src/
    components/        # Nav, sections, SpoinTopics, CommentThread, ContentMeta, the Spoin simulator
    content/           # site copy, project data, scratchpad entries
    lib/               # supabase client, session id, shared types
    hooks/             # useSupabaseQuery, useViewTracking, useLikeTracking, useSEO
  scripts/
    fetch-metrics.mjs   # prebuild: pulls live metrics from Supabase
    update_metrics.py   # CLI for pushing a new metric value (see below)
    manage_topics.py    # CLI for adding/promoting/rejecting live topics
  supabase/
    schema.sql          # full DB schema + RLS policies
    functions/           # wake-ping, update-metric, manage-topic Edge Functions
```

## Layout

One column, capped at `max-w-2xl` and centered. Three pieces make that work everywhere.

**Breakpoints.** Tailwind's `sm` (640px) splits narrow from wide. Below it the fixed label
columns the wide layout leans on (stack groups, project audit rows, scratchpad dates,
contact channels) stack label-over-value instead of sitting side by side, ProfileRail's
sidebar turns into a row of tabs, the Spoin simulator's quota grid scrolls horizontally
behind a sticky label column, and tap targets grow. A custom `xs` tier at 380px (defined in
`@theme`, see `frontend/src/index.css`) covers small phones and folds, where a 430px
iPhone's padding and type are too generous. The layout holds to roughly 240px, narrower
than anything shipping (a Galaxy Fold cover screen is 344px, a first-gen iPhone SE 320px).

**Reflow before shrinking.** Once the type is this small, scaling it down further to win
back width costs more than it buys. So when a row stops fitting, it wraps: the nav's view
badge and the resume button on `/` both drop to a line of their own, still pinned right by
`ml-auto`, rather than squeezing everything on the line. Restructuring is the third option
when wrapping alone is not enough, which is what ProfileRail's sidebar does when it turns
into a row of tabs below `sm`.

**Page zoom.** `body { zoom: 1.25 }` above 880px. The column stops growing at `max-w-2xl`,
so past that width the page only gains empty margin and the type reads small, which is why
125% looked right on a desktop monitor and 100% did not. Scaling the page is what a visitor
would otherwise do by hand, and doing it in CSS meant the 160-odd hardcoded pixel values in
the components (arbitrary Tailwind sizes plus icon `size` props, none of which follow the
root font size) did not have to be rewritten. Media queries are not affected by zoom, so
the effective layout width is always the viewport over 1.25 and never drops below 704px,
staying clear of the 640px breakpoint.

**Two things that fight the zoom**, both already handled, both worth knowing before adding
more: `100vh` still means the unzoomed viewport, so there is no `min-h-screen` on the app
wrapper and `body` paints the background instead. And `getBoundingClientRect` returns
zoomed pixels, so the simulator's SVG connector overlay carries a `viewBox` matched to its
measured size rather than assuming one unit is one pixel.

## Backend

One Supabase project backs four things, all degrading gracefully when unconfigured:

- **Live Spoin topics** — a read-only feed of in-production topics plus a
  suggest-a-topic form, shown on `/projects`.
- **Comments** — threaded, nickname-only, no accounts. Every Scratchpad category
  (writeups, mildly interesting stuff, random ideas, links) and every project entry gets
  its own thread.
- **Likes, two scopes** — a page-level like (one heart for "this writeup"/"this project"
  as a whole) and a separate per-comment like (Reddit-style, one per individual comment).
  Both are session-scoped and independently toggleable.
- **Views, two scopes** — per-content views (one per browser session per writeup/project/
  scratchpad entry, only recorded on actual engagement: opening a writeup, expanding a
  collapsed entry, not just from a list rendering) and a separate site-wide view, one per
  browser session for the whole site regardless of how many pages that session visits,
  recorded once on app load and shown as the badge in the nav. The two are not the same
  number — the nav badge does not sum every per-content view.

Schema and RLS policies live in `frontend/supabase/schema.sql` (source of truth, paste
into the Supabase SQL editor to apply). Everything anonymous visitors touch is
insert-only or delete-only-their-own; nothing they do can read or overwrite what someone
else wrote.

Both view scopes share one dedup rule: the `views` table's primary key is
`(target_type, target_id, session_id)`, so any number of reloads, tab closes/reopens, or
new windows in the same browser collapse to a single row — a new row only appears from a
genuinely different `localStorage` (a different browser, a private/incognito window, or a
different device). Site-wide view recording has been live since **2026-08-24 21:25:57
UTC** (the first row in the `views` table with `target_type = 'site'`) — any total shown
reflects visits from that point on, not all-time traffic before the feature existed.

`frontend/src/lib/bot.ts` skips recording (and skips the wake-ping) for requests that look
like a link-preview crawler (LinkedIn, Slack, Discord, Twitter, etc. all self-identify in
their user-agent, and most run stock headless Chrome without hiding `navigator.webdriver`)
-- sharing a link and having that platform unfurl it no longer inflates the count. This is
a best-effort filter for polite, self-identifying bots, not real bot detection: anything
actively trying to look like a real browser gets through, same as it would for any
client-side check. Treat the counter as a rough engagement number, not analytics-grade
traffic -- Vercel Analytics (already wired up) is the real source for that.

### Updating a metric

Project metrics (corpus size, throughput, etc. on `/projects`) are static at build time,
sourced from Supabase and baked in by `scripts/fetch-metrics.mjs` during `npm run build`.
To push a new value:

```bash
cd frontend
python scripts/update_metrics.py
```

Or double-click `frontend/scripts/update-metrics.bat` on Windows. It walks you through
picking a metric, shows the current value, and confirms before sending. If the value
actually changed, it fires a Vercel Deploy Hook automatically and the new number is live
within a minute or two. No change, no rebuild.

Needs `.env.local` (Supabase URL + anon key) and `.secrets.local` (admin secret) in
`frontend/`, both gitignored.

### Managing live topics

Visitors can only *suggest* a topic (RLS lets anyone insert, nothing else). To promote a
suggestion to live, add one directly, reject a suggestion, or pull a topic back off the
live list:

```bash
cd frontend
python scripts/manage_topics.py
```

Or double-click `frontend/scripts/manage-topics.bat`. Same config as `update_metrics.py`
above.
