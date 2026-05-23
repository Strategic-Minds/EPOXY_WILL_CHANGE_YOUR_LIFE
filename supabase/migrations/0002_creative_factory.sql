create table if not exists creative_batches (
  id uuid primary key default gen_random_uuid(),
  objective text not null,
  theme text not null,
  audience text,
  platform text,
  asset_notes text,
  quantity integer default 10,
  cta text,
  landing_page text,
  approval_level text default 'draft_only',
  status text default 'draft',
  top_candidates jsonb default '[]'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists creative_assets (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid references creative_batches(id) on delete cascade,
  source_type text,
  source_url text,
  asset_name text,
  asset_notes text,
  tags text[] default '{}',
  created_at timestamptz default now()
);

create table if not exists image_packets (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid references creative_batches(id) on delete cascade,
  title text,
  platform text,
  audience text,
  hook text,
  prompt text,
  visual_direction text,
  caption text,
  cta text,
  landing_page text,
  hashtags text[] default '{}',
  risk_score integer default 0,
  viral_score integer default 0,
  approval_status text default 'draft',
  render_status text default 'not_rendered',
  created_at timestamptz default now()
);

create table if not exists video_packets (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid references creative_batches(id) on delete cascade,
  title text,
  platform text,
  audience text,
  hook text,
  script text,
  scene_notes text,
  caption text,
  cta text,
  landing_page text,
  hashtags text[] default '{}',
  risk_score integer default 0,
  viral_score integer default 0,
  approval_status text default 'draft',
  render_status text default 'not_rendered',
  created_at timestamptz default now()
);

create table if not exists heygen_packets (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid references creative_batches(id) on delete cascade,
  title text,
  platform text,
  audience text,
  hook text,
  script text,
  scene_notes text,
  avatar_direction text,
  voice_direction text,
  caption text,
  cta text,
  landing_page text,
  risk_score integer default 0,
  viral_score integer default 0,
  approval_status text default 'draft',
  render_status text default 'not_rendered',
  created_at timestamptz default now()
);

create table if not exists xyla_content_packets (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid references creative_batches(id) on delete cascade,
  platform text,
  content_type text,
  hook text,
  caption text,
  visual_direction text,
  cta text,
  landing_page text,
  hashtags text[] default '{}',
  risk_score integer default 0,
  viral_score integer default 0,
  approval_status text default 'draft',
  handoff_status text default 'not_ready',
  created_at timestamptz default now()
);

create table if not exists render_queue (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid references creative_batches(id) on delete cascade,
  packet_type text not null,
  packet_id uuid not null,
  render_tool text,
  approval_status text default 'pending',
  render_status text default 'not_rendered',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists creative_scores (
  id uuid primary key default gen_random_uuid(),
  batch_id uuid references creative_batches(id) on delete cascade,
  packet_type text not null,
  packet_id uuid not null,
  viral_score integer default 0,
  brand_score integer default 0,
  clarity_score integer default 0,
  risk_score integer default 0,
  notes text,
  created_at timestamptz default now()
);

create table if not exists winning_patterns (
  id uuid primary key default gen_random_uuid(),
  pattern_name text not null,
  source_packet_type text,
  source_packet_id uuid,
  hook_pattern text,
  visual_pattern text,
  caption_pattern text,
  platform text,
  performance_notes text,
  created_at timestamptz default now()
);

create index if not exists creative_batches_status_idx on creative_batches(status);
create index if not exists image_packets_batch_idx on image_packets(batch_id);
create index if not exists video_packets_batch_idx on video_packets(batch_id);
create index if not exists heygen_packets_batch_idx on heygen_packets(batch_id);
create index if not exists xyla_content_packets_batch_idx on xyla_content_packets(batch_id);
create index if not exists render_queue_status_idx on render_queue(render_status, approval_status);
