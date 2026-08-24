-- Schema for the site's backend features: live Spoin topics, threaded
-- comments/likes on Scratchpad and Projects content, session-based view
-- counts, and dynamically-updatable project metrics.
--
-- Run this once in the Supabase SQL editor for a fresh project. Idempotent
-- via IF NOT EXISTS / DROP POLICY IF EXISTS so it can be re-run safely.

-- ---------------------------------------------------------------------------
-- topics: Spoin's live/in-production topic list, plus visitor suggestions
-- ---------------------------------------------------------------------------
create table if not exists topics (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  note text,
  status text not null default 'suggested' check (status in ('suggested', 'in_production')),
  submitted_at timestamptz not null default now()
);

alter table topics enable row level security;

drop policy if exists "topics_select_all" on topics;
create policy "topics_select_all" on topics
  for select using (true);

drop policy if exists "topics_insert_suggestions" on topics;
create policy "topics_insert_suggestions" on topics
  for insert with check (status = 'suggested');

-- ---------------------------------------------------------------------------
-- comments: threaded, Reddit-style, keyed by (target_type, target_id) so it
-- covers both Scratchpad entries (target_id = slug) and Projects
-- (target_id = project id) without a separate join table.
-- ---------------------------------------------------------------------------
create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  target_type text not null check (target_type in ('scratchpad', 'project')),
  target_id text not null,
  parent_id uuid references comments (id) on delete cascade,
  nickname text not null check (char_length(nickname) between 1 and 40),
  body text not null check (char_length(body) between 1 and 2000),
  created_at timestamptz not null default now(),
  deleted_at timestamptz
);

create index if not exists comments_target_idx on comments (target_type, target_id);
create index if not exists comments_parent_idx on comments (parent_id);

alter table comments enable row level security;

drop policy if exists "comments_select_all" on comments;
create policy "comments_select_all" on comments
  for select using (true);

drop policy if exists "comments_insert_all" on comments;
create policy "comments_insert_all" on comments
  for insert with check (deleted_at is null);

-- ---------------------------------------------------------------------------
-- likes: one row per (target, session) -- a page-level like (this writeup,
-- this scratchpad entry, this project), not a per-comment upvote. A session
-- can insert and delete its own like freely (there's no real per-session
-- auth here, same trust model as comments/topic suggestions) -- the delete
-- policy is what makes the toggle-off actually work.
-- ---------------------------------------------------------------------------
create table if not exists likes (
  target_type text not null check (target_type in ('scratchpad', 'project')),
  target_id text not null,
  session_id uuid not null,
  created_at timestamptz not null default now(),
  primary key (target_type, target_id, session_id)
);

alter table likes enable row level security;

drop policy if exists "likes_select_all" on likes;
create policy "likes_select_all" on likes
  for select using (true);

drop policy if exists "likes_insert_all" on likes;
create policy "likes_insert_all" on likes
  for insert with check (true);

drop policy if exists "likes_delete_all" on likes;
create policy "likes_delete_all" on likes
  for delete using (true);

-- ---------------------------------------------------------------------------
-- views: same one-row-per-session shape as likes. "Any number of clicks
-- from one session is 1 view" falls out of the primary key for free.
-- ---------------------------------------------------------------------------
create table if not exists views (
  target_type text not null check (target_type in ('scratchpad', 'project')),
  target_id text not null,
  session_id uuid not null,
  first_viewed_at timestamptz not null default now(),
  primary key (target_type, target_id, session_id)
);

alter table views enable row level security;

drop policy if exists "views_select_all" on views;
create policy "views_select_all" on views
  for select using (true);

drop policy if exists "views_insert_all" on views;
create policy "views_insert_all" on views
  for insert with check (true);

-- ---------------------------------------------------------------------------
-- metrics: dynamically-updatable project metrics, seeded from the current
-- hardcoded values in frontend/src/content/projects.ts so the DB starts in
-- sync with what's already live. Written only via the update-metric Edge
-- Function (service role) -- no anon insert/update policy on purpose.
-- ---------------------------------------------------------------------------
create table if not exists metrics (
  id uuid primary key default gen_random_uuid(),
  project_id text not null,
  label text not null,
  value text not null,
  detail text,
  updated_at timestamptz not null default now(),
  unique (project_id, label)
);

alter table metrics enable row level security;

drop policy if exists "metrics_select_all" on metrics;
create policy "metrics_select_all" on metrics
  for select using (true);

-- Seed with today's published values (content/projects.ts) so the first
-- build-time fetch matches what's already on the site.
insert into metrics (project_id, label, value, detail) values
  ('spoin', 'Corpus Size', '8,935 Cards', '8,706 Questions in Postgres'),
  ('spoin', 'Read Latency', '< 50ms', 'Zero LLMs on read path'),
  ('spoin', 'Throughput', '218 cards/min peak', E'≈ 3.6 cards/sec'),
  ('spoin', 'Architecture', '57 ADRs', 'Sole system architect'),
  ('spoin', 'Unique Topics', '14', null)
on conflict (project_id, label) do nothing;
