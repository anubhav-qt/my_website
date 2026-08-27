// Runs as part of npm's "prebuild" step. Gathers every hand-written content
// entry (profile, career, education, stack, currently-making, scratchpad
// writeups/notes/ideas/links, project copy) and posts it to the log-content
// Edge Function, which appends a new content_log row only for entries that are
// new or actually changed since the last logged version, and tombstones any
// entry that has disappeared from the source since the last build.
//
// Purely an append-only personal archive -- the frontend never reads
// content_log, and this script is not the source of truth for anything on the
// site. It exists so the archive can answer "what did this say in 2026, and
// when did I stop saying it", which git can answer too but only for as long as
// anyone still has the repo.
//
// Soft-fails like fetch-metrics.mjs: if the required env vars aren't set
// (e.g. a local dev build), it just skips instead of breaking the build.

import { execFileSync } from 'node:child_process';
import { PROFILE, EXPERIENCE, EDUCATION, STACK_GROUPS, CURRENTLY_MAKING } from '../src/content/site.ts';
import { WRITEUPS, MILDLY_INTERESTING_STUFF, RANDOM_IDEAS, LINKS } from '../src/content/scratchpad.ts';
import { PROJECTS, RAW_PROJECTS } from '../src/content/projects.ts';

const url = process.env.VITE_SUPABASE_URL;
const adminSecret = process.env.ADMIN_SECRET;

interface Entry {
  contentType: string;
  contentId: string;
  data: unknown;
  source: string;
}

function slug(label: string): string {
  return label.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

// Which commit is being built. Vercel builds from a detached checkout, so this
// is the commit that produced the deploy, not necessarily the tip of a branch.
// Returns empty strings rather than throwing: a build outside a git checkout
// should still log, just without provenance.
function gitProvenance() {
  const read = (args: string[]) => {
    try {
      return execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    } catch {
      return '';
    }
  };
  return {
    sha: read(['rev-parse', 'HEAD']) || undefined,
    message: read(['log', '-1', '--format=%B']) || undefined,
    committedAt: read(['log', '-1', '--format=%cI']) || undefined,
  };
}

async function main() {
  if (!url || !adminSecret) {
    console.log('[log-content] no Supabase URL / ADMIN_SECRET set, skipping');
    return;
  }

  const SITE = 'src/content/site.ts';
  const SCRATCHPAD = 'src/content/scratchpad.ts';
  const PROJECTS_SRC = 'src/content/projects.ts';

  const entries: Entry[] = [
    { contentType: 'profile', contentId: 'profile', data: PROFILE, source: SITE },
    { contentType: 'education', contentId: 'education', data: EDUCATION, source: SITE },
    ...EXPERIENCE.map((e) => ({ contentType: 'career', contentId: e.id, data: e, source: SITE })),
    ...STACK_GROUPS.map((g) => ({ contentType: 'stack', contentId: slug(g.label), data: g, source: SITE })),
    ...Object.entries(CURRENTLY_MAKING).map(([id, v]) => ({
      contentType: 'currently-making', contentId: id, data: v, source: SITE,
    })),

    ...WRITEUPS.map((w) => ({ contentType: 'writeup', contentId: w.id, data: w, source: SCRATCHPAD })),
    ...MILDLY_INTERESTING_STUFF.map((n) => ({ contentType: 'mildly-interesting', contentId: n.id, data: n, source: SCRATCHPAD })),
    ...RANDOM_IDEAS.map((n) => ({ contentType: 'random-idea', contentId: n.id, data: n, source: SCRATCHPAD })),
    ...LINKS.map((l) => ({ contentType: 'link', contentId: l.id, data: l, source: SCRATCHPAD })),

    // Authored copy, untouched by the live-metrics merge.
    ...RAW_PROJECTS.map((p) => ({ contentType: 'project-source', contentId: p.id, data: p, source: PROJECTS_SRC })),
    // What the page actually rendered, live metric values included. Churns
    // whenever a metric moves, which is the point: it dates every number.
    ...PROJECTS.map((p) => ({ contentType: 'project', contentId: p.id, data: p, source: PROJECTS_SRC })),
  ];

  // Every type above is enumerated exhaustively from its module, so the Edge
  // Function may tombstone anything it has history for that isn't in this
  // batch. Adding a type here without listing all of its entries would
  // wrongly mark the missing ones as removed.
  const completeTypes = [...new Set(entries.map((e) => e.contentType))];

  const res = await fetch(`${url}/functions/v1/log-content`, {
    method: 'POST',
    headers: { 'x-admin-secret': adminSecret, 'content-type': 'application/json' },
    body: JSON.stringify({ entries, completeTypes, provenance: gitProvenance() }),
  });

  if (!res.ok) {
    console.warn(`[log-content] request failed (${res.status}): ${await res.text()}`);
    return;
  }

  const result = await res.json();
  const removed = result.removed?.length ? `, removed ${result.removed.length}` : '';
  console.log(`[log-content] logged ${result.logged.length}, unchanged ${result.skipped.length}${removed}`);
}

main().catch((err) => {
  console.warn('[log-content] unexpected error, continuing build:', err.message);
});
