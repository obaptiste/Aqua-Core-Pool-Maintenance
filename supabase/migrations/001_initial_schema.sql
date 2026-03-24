-- PoolPro initial schema
-- Run this in the Supabase SQL editor or via `supabase db push`

-- Enable UUID extension (usually already enabled)
create extension if not exists "pgcrypto";

-- ============================================================
-- POOLS
-- ============================================================
create table if not exists pools (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users on delete cascade,
  name           text not null,
  volume_litres  int,
  pool_type      text check (pool_type in ('outdoor', 'indoor', 'spa', 'hydrotherapy')),
  location       text,
  created_at     timestamptz default now(),
  updated_at     timestamptz default now()
);

-- Row-level security: users can only see their own pools
alter table pools enable row level security;

create policy "Users manage own pools"
  on pools for all
  using  (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- READINGS
-- ============================================================
create table if not exists readings (
  id                uuid    primary key default gen_random_uuid(),
  pool_id           uuid    references pools(id) on delete cascade not null,
  read_at           timestamptz not null,
  free_chlorine     numeric(5,2),
  combined_chlorine numeric(5,2),
  ph                numeric(4,2),
  alkalinity        numeric(6,1),
  calcium_hardness  numeric(6,1),
  cyanuric_acid     numeric(6,1),
  temperature       numeric(5,1),
  turbidity         text check (turbidity in ('clear','slightly-cloudy','cloudy','very-cloudy')),
  notes             text,
  -- Maintenance checks (stored as JSONB for flexibility)
  checks_completed  jsonb default '{}',
  created_at        timestamptz default now()
);

-- Row-level security: readings are accessible via pool ownership
alter table readings enable row level security;

create policy "Users manage readings on own pools"
  on readings for all
  using  (exists (select 1 from pools p where p.id = pool_id and p.user_id = auth.uid()))
  with check (exists (select 1 from pools p where p.id = pool_id and p.user_id = auth.uid()));

-- ============================================================
-- PHOTO ATTACHMENTS (for future photo-log feature)
-- ============================================================
create table if not exists reading_photos (
  id          uuid primary key default gen_random_uuid(),
  reading_id  uuid references readings(id) on delete cascade not null,
  storage_key text not null,  -- Supabase Storage object path
  caption     text,
  created_at  timestamptz default now()
);

alter table reading_photos enable row level security;

create policy "Users manage photos on own readings"
  on reading_photos for all
  using (exists (
    select 1
    from readings r
    join pools p on p.id = r.pool_id
    where r.id = reading_id and p.user_id = auth.uid()
  ))
  with check (exists (
    select 1
    from readings r
    join pools p on p.id = r.pool_id
    where r.id = reading_id and p.user_id = auth.uid()
  ));

-- ============================================================
-- HELPFUL VIEW: readings with pool info
-- ============================================================
create or replace view readings_with_pool as
  select
    r.*,
    p.name         as pool_name,
    p.volume_litres,
    p.pool_type
  from readings r
  join pools p on p.id = r.pool_id;

-- ============================================================
-- UPDATED-AT TRIGGER
-- ============================================================
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger pools_updated_at
  before update on pools
  for each row execute function set_updated_at();

-- ============================================================
-- INDEXES
-- ============================================================
create index if not exists readings_pool_id_read_at on readings(pool_id, read_at desc);
create index if not exists pools_user_id on pools(user_id);
