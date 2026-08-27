// Admin-only: append-only content history log. For each entry in the batch,
// compares it against the most recently logged version (by content_type +
// content_id) and inserts a new row only when it's new or actually changed
// -- never upserts, so every version stays forever. Entries that used to be
// logged under a submitted content_type but are absent from this batch get a
// 'removed' tombstone carrying their last known data, so a deleted scratchpad
// idea reads as "abandoned in 2027" rather than silently trailing off.
// Called from the site's build (scripts/log-content.ts), not from the browser.
//
// Required secrets (set via `supabase secrets set`):
//   ADMIN_SECRET               shared secret checked against the x-admin-secret header
//   SUPABASE_URL                (auto-provided by the Supabase runtime)
//   SUPABASE_SERVICE_ROLE_KEY   (auto-provided by the Supabase runtime)

import { createClient } from 'jsr:@supabase/supabase-js@2';

interface LogEntry {
  contentType: string;
  contentId: string;
  data: unknown;
  source?: string;
}

interface Provenance {
  sha?: string;
  message?: string;
  committedAt?: string;
}

interface Payload {
  entries: LogEntry[];
  // content_types the caller enumerated exhaustively this build. Only these
  // are eligible for tombstoning -- a type missing from this list is left
  // alone, so a partial batch can never mass-delete history.
  completeTypes?: string[];
  provenance?: Provenance;
}

// Postgres jsonb does not preserve object key order, so a plain
// JSON.stringify comparison between a freshly-fetched row and the original
// JS object spuriously reports "changed" on every build. Canonicalize both
// sides (recursively sort object keys) before comparing.
function canonicalize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(canonicalize);
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([k, v]) => [k, canonicalize(v)]),
    );
  }
  return value;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const adminSecret = Deno.env.get('ADMIN_SECRET');
  if (!adminSecret || req.headers.get('x-admin-secret') !== adminSecret) {
    return new Response('Unauthorized', { status: 401 });
  }

  let payload: Payload;
  try {
    payload = await req.json();
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }

  if (!Array.isArray(payload.entries)) {
    return new Response('entries must be an array', { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const prov = payload.provenance ?? {};
  const stamp = {
    git_sha: prov.sha ?? null,
    git_message: prov.message ?? null,
    git_committed_at: prov.committedAt ?? null,
  };

  const logged: string[] = [];
  const skipped: string[] = [];
  const removed: string[] = [];

  for (const entry of payload.entries) {
    const { contentType, contentId, data, source } = entry;
    if (!contentType || !contentId || data === undefined) continue;
    const key = `${contentType}/${contentId}`;

    const { data: existing } = await supabase
      .from('content_log')
      .select('data, change_type')
      .eq('content_type', contentType)
      .eq('content_id', contentId)
      .order('logged_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    // A previously-tombstoned entry that came back counts as 'added' again,
    // and must be re-logged even if its data matches the tombstone's payload.
    const wasRemoved = existing?.change_type === 'removed';
    const changeType = existing && !wasRemoved ? 'updated' : 'added';
    if (
      existing && !wasRemoved &&
      JSON.stringify(canonicalize(existing.data)) === JSON.stringify(canonicalize(data))
    ) {
      skipped.push(key);
      continue;
    }

    const { error } = await supabase.from('content_log').insert({
      content_type: contentType,
      content_id: contentId,
      data,
      change_type: changeType,
      source: source ?? null,
      ...stamp,
    });

    if (error) {
      return new Response(`Write failed on ${key}: ${error.message}`, { status: 500 });
    }
    logged.push(key);
  }

  // Tombstones. For each exhaustively-enumerated content_type, anything with
  // history but no entry in this batch has been deleted from the source.
  const completeTypes = Array.isArray(payload.completeTypes) ? payload.completeTypes : [];
  if (completeTypes.length > 0) {
    const present = new Set(payload.entries.map((e) => `${e.contentType}/${e.contentId}`));

    const { data: history, error: histErr } = await supabase
      .from('content_log')
      .select('content_type, content_id, data, change_type, logged_at, source')
      .in('content_type', completeTypes)
      .order('logged_at', { ascending: false });

    if (histErr) {
      return new Response(`Tombstone scan failed: ${histErr.message}`, { status: 500 });
    }

    // First row per key wins -- the ordering above makes that the latest.
    const latest = new Map<string, { data: unknown; change_type: string; source: string | null }>();
    for (const row of history ?? []) {
      const key = `${row.content_type}/${row.content_id}`;
      if (!latest.has(key)) {
        latest.set(key, { data: row.data, change_type: row.change_type, source: row.source });
      }
    }

    for (const [key, row] of latest.entries()) {
      if (present.has(key)) continue;
      if (row.change_type === 'removed') continue; // already tombstoned
      const [contentType, ...rest] = key.split('/');
      const contentId = rest.join('/');

      // Carry the last known data forward: the tombstone is a full record of
      // what existed at the moment it stopped existing, not an empty marker.
      const { error } = await supabase.from('content_log').insert({
        content_type: contentType,
        content_id: contentId,
        data: row.data,
        change_type: 'removed',
        source: row.source,
        ...stamp,
      });

      if (error) {
        return new Response(`Tombstone failed on ${key}: ${error.message}`, { status: 500 });
      }
      removed.push(key);
    }
  }

  return new Response(JSON.stringify({ ok: true, logged, skipped, removed }), {
    headers: { 'content-type': 'application/json' },
  });
});
