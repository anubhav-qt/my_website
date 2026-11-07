# my_website_v4

```
•
  •
    •      my little corner
  •        anubhav-qt.dev
•
```

live at **[anubhav-qt.dev](https://www.anubhav-qt.dev)**

**Look**: Breader's ([github.com/anubhav-qt/breader](https://github.com/anubhav-qt/breader)) on a dense,
list-based dev-log layout. A black page, white ink, hairline-edged cards, Doto's dot matrix for
interface text, Dongle for names, IBM Plex Mono for reading. Colour belongs to the content, one
book colour per project, section and tag.

**Stack**: React 19 · TypeScript · Vite · Tailwind v4 · Vercel · Supabase (Postgres + Edge Functions)

## Ship from this machine

Like Breader's `infra/ship.sh`, this site can be checked, built and published locally without
GitHub Actions. It still uses the existing Vercel project and domain.

```sh
cd frontend
npx vercel login
npm run ship:link                  # once per checkout, links paribelle/my-website
npm run ship                      # clean dev: checks, tests, local build, push, deploy, verify
npm run ship -- build deploy live  # repeat selected steps; check always runs first
```

Commit changes before shipping. The script refuses to overwrite a newer `origin/dev` and checks
that the prebuilt output belongs to the commit and resume being deployed. It uploads the local
production build with Vercel's `--prebuilt` flow, then checks the public app bundle, resume hash
and new scratchpad entries. The static output uses Vercel's Build Output API directly, including
the prerendered page routes, so Windows does not need symlink privileges for Vercel's builders.
Stop any local dev or preview server before shipping on Windows so `npm ci` can replace native
dependencies. Keep the existing `ADMIN_SECRET` in `frontend/.secrets.local` for content archiving;
Vercel cannot pull sensitive values. Vercel login, pulled settings and release records stay
in ignored local files. The existing Git integration can still make previews from `dev`.

The public resume lives at `frontend/public/resume.pdf`. Its editable base is kept separately
at `E:/career/resumes/base/resume.json` with `render_resume.py`; the personal `$anubhav-resume` skill
finds it across chats. Tailored application copies do not automatically replace the public PDF.
