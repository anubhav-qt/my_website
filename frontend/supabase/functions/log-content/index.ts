// Admin-only: append-only content history log. For each entry in the batch,
// compares it against the most recently logged version (by content_type +
// content_id) and inserts a new row only when it's new or actually changed
// -- never upserts, so every version stays forever. Called from the site's
// build (scripts/log-content.ts), not from the browser.
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
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const adminSecret = Deno.env.get('ADMIN_SECRET');
  if (!adminSecret || req.headers.get('x-admin-secret') !== adminSecret) {
    return new Response('Unauthorized', { status: 401 });
  }

  let payload: { entries: LogEntry[] };
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

  const logged: string[] = [];
  const skipped: string[] = [];

  for (const entry of payload.entries) {
    const { contentType, contentId, data } = entry;
    if (!contentType || !contentId || data === undefined) continue;
    const key = `${contentType}/${contentId}`;

    const { data: existing } = await supabase
      .from('content_log')
      .select('data')
      .eq('content_type', contentType)
      .eq('content_id', contentId)
      .order('logged_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const changeType = existing ? 'updated' : 'added';
    if (existing && JSON.stringify(existing.data) === JSON.stringify(data)) {
      skipped.push(key);
      continue;
    }

    const { error } = await supabase
      .from('content_log')
      .insert({ content_type: contentType, content_id: contentId, data, change_type: changeType });

    if (error) {
      return new Response(`Write failed on ${key}: ${error.message}`, { status: 500 });
    }
    logged.push(key);
  }

  return new Response(JSON.stringify({ ok: true, logged, skipped }), {
    headers: { 'content-type': 'application/json' },
  });
});
