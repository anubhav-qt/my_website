// Runs as part of npm's "prebuild" step. Gathers every hand-written content
// entry (career, education, scratchpad writeups/notes/ideas/links, project
// copy) and posts it to the log-content Edge Function, which appends a new
// content_log row only for entries that are new or actually changed since
// the last logged version. Purely an append-only personal archive -- the
// frontend never reads content_log, and this script is not the source of
// truth for anything on the site.
//
// Soft-fails like fetch-metrics.mjs: if the required env vars aren't set
// (e.g. a local dev build), it just skips instead of breaking the build.

import { EXPERIENCE, EDUCATION } from '../src/content/site.ts';
import { WRITEUPS, MILDLY_INTERESTING_STUFF, RANDOM_IDEAS, LINKS } from '../src/content/scratchpad.ts';

const url = process.env.VITE_SUPABASE_URL;
const adminSecret = process.env.ADMIN_SECRET;

async function main() {
  if (!url || !adminSecret) {
    console.log('[log-content] no Supabase URL / ADMIN_SECRET set, skipping');
    return;
  }

  const entries = [
    ...EXPERIENCE.map((e) => ({ contentType: 'career', contentId: e.id, data: e })),
    { contentType: 'education', contentId: 'education', data: EDUCATION },
    ...WRITEUPS.map((w) => ({ contentType: 'writeup', contentId: w.id, data: w })),
    ...MILDLY_INTERESTING_STUFF.map((n) => ({ contentType: 'mildly-interesting', contentId: n.id, data: n })),
    ...RANDOM_IDEAS.map((n) => ({ contentType: 'random-idea', contentId: n.id, data: n })),
    ...LINKS.map((l) => ({ contentType: 'link', contentId: l.id, data: l })),
  ];

  const res = await fetch(`${url}/functions/v1/log-content`, {
    method: 'POST',
    headers: { 'x-admin-secret': adminSecret, 'content-type': 'application/json' },
    body: JSON.stringify({ entries }),
  });

  if (!res.ok) {
    console.warn(`[log-content] request failed (${res.status}): ${await res.text()}`);
    return;
  }

  const result = await res.json();
  console.log(`[log-content] logged ${result.logged.length}, unchanged ${result.skipped.length}`);
}

main().catch((err) => {
  console.warn('[log-content] unexpected error, continuing build:', err.message);
});
