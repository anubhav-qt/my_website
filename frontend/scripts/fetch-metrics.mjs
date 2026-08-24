// Runs as npm's "prebuild" step, before `vite build`. Fetches the latest
// `metrics` rows from Supabase and writes them to
// src/data/live-metrics.json, which content/projects.ts merges over its
// static metrics literals.
//
// If the fetch fails (no project provisioned yet, network error, etc.) the
// existing live-metrics.json is left untouched, so the build ships whatever
// was last fetched successfully instead of failing outright -- the
// "prerender the older metric otherwise" behavior from the build spec.

import { writeFile, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const OUT_PATH = fileURLToPath(new URL('../src/data/live-metrics.json', import.meta.url));

const url = process.env.VITE_SUPABASE_URL;
const anonKey = process.env.VITE_SUPABASE_ANON_KEY;

async function main() {
  if (!url || !anonKey) {
    console.log('[fetch-metrics] no Supabase env vars set, skipping (keeping existing live-metrics.json if any)');
    return;
  }

  const res = await fetch(`${url}/rest/v1/metrics?select=project_id,label,value,detail`, {
    headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
  });

  if (!res.ok) {
    console.warn(`[fetch-metrics] fetch failed (${res.status}), keeping existing live-metrics.json if any`);
    return;
  }

  const rows = await res.json();
  const byProject = {};
  for (const row of rows) {
    (byProject[row.project_id] ??= []).push({ label: row.label, value: row.value, detail: row.detail ?? undefined });
  }

  await writeFile(OUT_PATH, JSON.stringify(byProject, null, 2) + '\n');
  console.log(`[fetch-metrics] wrote ${rows.length} metric rows across ${Object.keys(byProject).length} project(s)`);
}

main().catch(async (err) => {
  console.warn('[fetch-metrics] unexpected error, keeping existing live-metrics.json if any:', err.message);
  try {
    await readFile(OUT_PATH);
  } catch {
    await writeFile(OUT_PATH, '{}\n');
  }
});
