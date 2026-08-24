// Trivial health-check endpoint, called once on app mount (see
// frontend/src/App.tsx) so the project's request-activity clock stays warm.
// No DB access needed -- this alone is enough to count as "activity" against
// Supabase's 7-day free-tier pause window.

Deno.serve(() => {
  return new Response(JSON.stringify({ ok: true }), {
    headers: { 'content-type': 'application/json' },
  });
});
