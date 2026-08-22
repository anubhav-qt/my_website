# anubhavqt

Personal site. A single scrolling page — nav links scroll to sections in place, nothing reloads.

## Stack

- **frontend/** — React 19 + TypeScript + Vite + Tailwind v4
- **backend/** — not started yet; planned in FastAPI when there's something for it to do

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
