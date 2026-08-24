// Admin-only: promotes a suggested topic to live, adds a new topic directly
// as live, reverts a live topic back to suggested, or rejects (deletes) a
// suggestion. Anonymous visitors can only insert a 'suggested' row (see
// schema.sql's topics_insert_suggestions policy) -- everything else here
// needs the service role key, which bypasses RLS.
//
// Required secrets (same as update-metric):
//   ADMIN_SECRET   shared secret checked against the x-admin-secret header
//   SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY  (auto-provided by the runtime)

import { createClient } from 'jsr:@supabase/supabase-js@2';

interface ManageTopicPayload {
  action: 'promote' | 'add' | 'revert' | 'reject';
  id?: string;
  title?: string;
  note?: string | null;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const adminSecret = Deno.env.get('ADMIN_SECRET');
  if (!adminSecret || req.headers.get('x-admin-secret') !== adminSecret) {
    return new Response('Unauthorized', { status: 401 });
  }

  let payload: ManageTopicPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  switch (payload.action) {
    case 'add': {
      if (!payload.title) return new Response('title is required', { status: 400 });
      const { data, error } = await supabase
        .from('topics')
        .insert({ title: payload.title, note: payload.note ?? null, status: 'in_production' })
        .select()
        .single();
      if (error) return new Response(`Insert failed: ${error.message}`, { status: 500 });
      return json({ ok: true, topic: data });
    }
    case 'promote':
    case 'revert': {
      if (!payload.id) return new Response('id is required', { status: 400 });
      const status = payload.action === 'promote' ? 'in_production' : 'suggested';
      const { data, error } = await supabase.from('topics').update({ status }).eq('id', payload.id).select().single();
      if (error) return new Response(`Update failed: ${error.message}`, { status: 500 });
      return json({ ok: true, topic: data });
    }
    case 'reject': {
      if (!payload.id) return new Response('id is required', { status: 400 });
      const { error } = await supabase.from('topics').delete().eq('id', payload.id);
      if (error) return new Response(`Delete failed: ${error.message}`, { status: 500 });
      return json({ ok: true });
    }
    default:
      return new Response("action must be one of: add, promote, revert, reject", { status: 400 });
  }
});

function json(body: unknown): Response {
  return new Response(JSON.stringify(body), { headers: { 'content-type': 'application/json' } });
}
