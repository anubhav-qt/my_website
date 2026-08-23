# anubhavqt (my_website_v1)

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
data that I update by hand. For v2:

- Add a real backend and fetch all the data currently living in the frontend (profile, stack,
  experience, projects, ADRs) from it instead of bundling it at build time. Design the schemas
  off the current frontend's content shapes (`frontend/src/content/*.ts`) since that's already
  the real, working reference for what each piece of data needs to look like.
- GitHub projects update themselves periodically and automatically, pulling latest metrics and
  data (stars, commits, README changes, etc.) instead of me manually refreshing numbers in
  `content/projects.ts`.
- Serve all static content (build output, images, the resume PDF) through a CDN instead of
  straight from the origin.
- SEO pass: meta tags, Open Graph/social preview cards, sitemap, robots.txt, and whatever else
  is missing for the site to show up and look right when shared or crawled.
