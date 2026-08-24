# anubhav-qt (my_website_v1)

Personal site. Live at [anubhav-qt.dev](https://anubhav-qt.dev).

> **Status note**: v1. All pages (`/`, `/projects`, `/scratchpad`, `/contact`) are hand-crafted and finished. Content is static, sourced from `frontend/src/content/` and `frontend/src/data/synced-docs.json`.

## Stack

- **frontend/** — React 19 + TypeScript + Vite + Tailwind v4, deployed on Vercel
- **backend/** — not started yet; planned for v2 (see Roadmap below)

## Getting started

```bash
cd frontend
npm install
npm run dev       # http://localhost:5173
```

Other scripts (run from `frontend/`):

```bash
npm run build       # production build
npm run test         # simulator engine unit tests (tsx, not a framework)
npm run sync-docs    # pull ADR/architecture docs into src/data/synced-docs.json
```

## Structure

```
frontend/
  src/
    components/       # Nav, sections (Now/Work/Log/Stuff), the Spoin simulator
    content/          # site copy, project data, ADR log (from synced-docs.json)
    lib/simulator/    # the deterministic quota-governor simulation engine
  content/manifest.json  # points sync-docs at source ADR/architecture markdown
```

## Roadmap: v2

Right now everything in `frontend/src/content/` and `synced-docs.json` is static, checked-in
data that I update by hand. Reordered after a review pointed out that moving content behind a
runtime backend (the original item 1) directly undercuts an SEO pass (the original item 3):
runtime fetching is exactly what makes content hard to crawl, and a cold start or a 500 would
mean a recruiter sees an empty shell instead of a stale-but-present page. So SEO and static
data generation come first; a backend only if something concrete needs one.

1. **SEO pass** (in progress): per-route meta tags, Open Graph/Twitter cards, sitemap.xml,
   robots.txt, and prerendering static routes to HTML at build time so link-preview bots and
   non-JS crawlers see real content instead of an empty `<div id="root">`.
2. **Cron-based GitHub sync**: extend `sync-docs` with a scheduled GitHub Action that pulls
   fresh repo metrics (stars, commits, README changes) on a cron, writes them into
   `synced-docs.json`, commits, and lets Vercel redeploy. Same static-output pattern already
   used for ADRs, no new infrastructure or uptime surface.
3. **Backend**: shelved for now. I'm the only author, so "update by hand" is a git commit
   either way, and `content/*.ts` already gives type safety and PR diffs for free. Revisit only
   if there's a concrete capability that needs a runtime backend (auth, writes, per-visitor
   state), not just as a way to demonstrate backend skills, since Spoin (CQRS, two-pass quality
   gate, 55 ADRs) already does that better than a CRUD layer over my own bio would.
