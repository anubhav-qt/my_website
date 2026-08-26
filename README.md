# my_website_v3.1

```
──────────────────────────────────────────
  personal site + dev log
──────────────────────────────────────────
```
live at **[anubhav-qt.dev](https://www.anubhav-qt.dev)**

<table>
<tr>
<td><img src="screenshots/home.png" width="400" alt="home page"></td>
<td><img src="screenshots/projects.png" width="400" alt="projects page"></td>
</tr>
<tr>
<td><img src="screenshots/scratchpad.png" width="400" alt="scratchpad page"></td>
<td><img src="screenshots/contact.png" width="400" alt="contact page"></td>
</tr>
</table>

**Stack**: React 19 · TypeScript · Vite · Tailwind v4 · Vercel · Supabase (Postgres + Edge Functions)

## Quickstart

```bash
cd frontend
npm install
npm run dev          # http://localhost:5173
```

Backend features (topics, comments, likes, views) degrade quietly to "not available" until
`.env.local` has real Supabase credentials — the site runs fine without them.

```bash
cp .env.example .env.local   # then fill in VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY
```

## Scripts

Run from `frontend/`:

```bash
npm run build                    # typecheck, build, prerender to static HTML
npm run lint                     # oxlint
npm run test                     # simulator engine unit tests
npm run sync-docs                # pull ADR/architecture docs into src/data/synced-docs.json
python scripts/update_metrics.py # push a new project metric to Supabase
python scripts/manage_topics.py  # promote/reject/remove live Spoin topics
```

The last two also run as `frontend/scripts/*.bat` on Windows. Both need `.env.local` and
`.secrets.local` (admin secret) in `frontend/`, gitignored.

## Notes for later

- **Backend**: one Supabase project, RLS-gated (anonymous visitors can only insert or
  delete their own rows). Schema in `frontend/supabase/schema.sql`. Two separate view
  scopes (per-content, site-wide) and two separate like scopes (per-page, per-comment) —
  see `frontend/src/hooks/` for how they're deduped by session.
- **Responsive system**: `sm` (640px) splits the narrow layout from the wide one, a custom
  `xs` tier (380px) tightens small phones and folds further, and `body { zoom: 1.25 }`
  above 880px scales the whole page up since the column caps at `max-w-2xl` and stops
  growing. Full rationale in `frontend/src/index.css` and `AGENTS.md`.
