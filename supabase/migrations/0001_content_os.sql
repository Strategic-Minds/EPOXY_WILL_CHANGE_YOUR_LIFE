create extension if not exists pgcrypto;

create table if not exists assets (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  source_url text,
  file_name text,
  asset_type text,
  content_pillar text,
  project_type text,
  visual_quality_score int default 0,
  emotional_angle text,
  platform_fit text[],
  status text default 'new',
  created_at timestamptz default now()
);

create table if not exists content_items (
  id uuid primary key default gen_random_uuid(),
  asset_id uuid references assets(id) on delete set null,
  platform text,
  content_type text,
  hook text,
  caption text,
  script text,
  thumbnail_text text,
  cta text,
  landing_page text,
  seo_keywords text[],
  hashtags text[],
  risk_score int default 0,
  review_status text default 'draft',
  xyla_ready boolean default false,
  scheduled_at timestamptz,
  published_url text,
  status text default 'draft',
  created_at timestamptz default now()
);

create table if not exists review_queue (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid references content_items(id) on delete cascade,
  review_type text not null,
  risk_category text,
  reason text,
  owner text,
  decision text,
  notes text,
  reviewed_at timestamptz,
  status text default 'pending',
  created_at timestamptz default now()
);

create table if not exists xyla_queue (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid references content_items(id) on delete cascade,
  platform text,
  post_type text,
  caption text,
  asset_url text,
  cta text,
  landing_page text,
  handoff_status text default 'ready',
  xyla_post_id text,
  scheduled_at timestamptz,
  created_at timestamptz default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  source_platform text,
  source_post_url text,
  shopify_customer_id text,
  email text,
  phone text,
  lead_magnet text,
  interest_path text,
  crm_tag text,
  status text default 'new',
  created_at timestamptz default now()
);

create table if not exists metrics (
  id uuid primary key default gen_random_uuid(),
  content_item_id uuid references content_items(id) on delete cascade,
  platform text,
  views int default 0,
  likes int default 0,
  comments int default 0,
  shares int default 0,
  saves int default 0,
  clicks int default 0,
  leads int default 0,
  conversion_rate numeric,
  winner_score numeric,
  scale_decision text,
  captured_at timestamptz default now()
);

create table if not exists story_candidates (
  id uuid primary key default gen_random_uuid(),
  contact_name text,
  company text,
  email text,
  phone text,
  source text,
  story_angle text,
  permission_status text default 'not_requested',
  interview_status text default 'not_started',
  public_use_status text default 'not_approved',
  notes text,
  created_at timestamptz default now()
);

create index if not exists idx_content_review_status on content_items(review_status);
create index if not exists idx_content_xyla_ready on content_items(xyla_ready);
create index if not exists idx_xyla_handoff_status on xyla_queue(handoff_status);
create index if not exists idx_metrics_content_item on metrics(content_item_id);
