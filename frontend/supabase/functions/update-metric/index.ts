// Admin-only: upserts a metric row and, if the write actually changed
// anything, triggers a Vercel Deploy Hook so the site rebuilds with the new
// value. Called directly (e.g. via curl) with a shared secret -- there's no
// admin UI for this, the site has exactly one operator.
//
// Required secrets (set via `supabase secrets set`):
//   ADMIN_SECRET         shared secret checked against the x-admin-secret header
//   SUPABASE_URL          (auto-provided by the Supabase runtime)
//   SUPABASE_SERVICE_ROLE_KEY  (auto-provided by the Supabase runtime)
//   VERCEL_DEPLOY_HOOK_URL  URL from Vercel Project Settings -> Git -> Deploy Hooks

import { createClient } from 'jsr:@supabase/supabase-js@2';

interface UpdateMetricPayload {
  projectId: string;
  label: string;
  value: string;
  detail?: string | null;
}

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  const adminSecret = Deno.env.get('ADMIN_SECRET');
  if (!adminSecret || req.headers.get('x-admin-secret') !== adminSecret) {
    return new Response('Unauthorized', { status: 401 });
  }

  let payload: UpdateMetricPayload;
  try {
    payload = await req.json();
  } catch {
    return new Response('Invalid JSON body', { status: 400 });
  }

  const { projectId, label, value, detail } = payload;
  if (!projectId || !label || !value) {
    return new Response('projectId, label, and value are required', { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  const { data: existing } = await supabase
    .from('metrics')
    .select('value, detail')
    .eq('project_id', projectId)
    .eq('label', label)
    .maybeSingle();

  const unchanged = existing && existing.value === value && (existing.detail ?? null) === (detail ?? null);

  const { error } = await supabase
    .from('metrics')
    .upsert(
      { project_id: projectId, label, value, detail: detail ?? null, updated_at: new Date().toISOString() },
      { onConflict: 'project_id,label' },
    );

  if (error) {
    return new Response(`Write failed: ${error.message}`, { status: 500 });
  }

  if (unchanged) {
    return new Response(JSON.stringify({ ok: true, deployed: false, reason: 'value unchanged' }), {
      headers: { 'content-type': 'application/json' },
    });
  }

  const deployHookUrl = Deno.env.get('VERCEL_DEPLOY_HOOK_URL');
  let deployed = false;
  if (deployHookUrl) {
    const hookResponse = await fetch(deployHookUrl, { method: 'POST' });
    deployed = hookResponse.ok;
  }

  return new Response(JSON.stringify({ ok: true, deployed }), {
    headers: { 'content-type': 'application/json' },
  });
});
