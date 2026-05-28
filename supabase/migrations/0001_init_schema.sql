-- =====================================================
-- 0001_init_schema.sql
-- Initial schema for Fellaswimming: registrations, articles,
-- categories, testimonials, profiles + enums, triggers, indexes.
-- =====================================================

-- ----- Enums ---------------------------------------------------------------

create type registration_status as enum (
  'baru',
  'dihubungi',
  'trial',
  'daftar',
  'tidak_lanjut'
);

create type class_type as enum (
  'privat',
  'semi_privat',
  'grup',
  'belum_yakin'
);

create type article_status as enum (
  'draft',
  'published'
);

create type testimonial_status as enum (
  'draft',
  'published'
);

-- ----- Tables --------------------------------------------------------------

create table registrations (
  id uuid primary key default gen_random_uuid(),
  display_id text unique not null,
  -- Step 1: student info
  student_name text not null,
  student_age int not null check (student_age >= 3 and student_age <= 80),
  student_gender text not null
    check (student_gender in ('laki_laki', 'perempuan')),
  student_experience text not null
    check (student_experience in ('belum_bisa', 'sedikit_bisa', 'sudah_bisa_dasar', 'mahir')),
  -- Step 2: class preference
  preferred_class_type class_type not null,
  preferred_schedule text,
  preferred_location text,
  -- Step 3: contact
  parent_name text not null,
  parent_whatsapp text not null,
  parent_email text,
  notes text,
  -- Admin-managed
  status registration_status not null default 'baru',
  internal_notes text,
  contacted_at timestamptz,
  -- Audit
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  created_at timestamptz not null default now()
);

create table articles (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content jsonb not null,
  content_html text not null,
  cover_image_url text not null,
  cover_image_alt text not null,
  category_id uuid references categories(id) on delete set null,
  author_name text not null default 'Tim Fellaswimming',
  reading_time_minutes int not null default 5,
  status article_status not null default 'draft',
  seo_title text,
  seo_description text,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null,
  updated_by uuid references auth.users(id) on delete set null
);

create table testimonials (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  rating int not null check (rating between 1 and 5),
  text text not null,
  photo_url text,
  featured boolean not null default false,
  status testimonial_status not null default 'draft',
  display_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  created_at timestamptz not null default now()
);

-- ----- updated_at auto-trigger --------------------------------------------

create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_registrations_updated_at
  before update on registrations
  for each row execute function set_updated_at();

create trigger trg_articles_updated_at
  before update on articles
  for each row execute function set_updated_at();

create trigger trg_testimonials_updated_at
  before update on testimonials
  for each row execute function set_updated_at();

-- ----- display_id trigger for registrations -------------------------------
-- Format: {PREFIX}-{YYYY}-{NNNN}
-- PRIV / SEMI / GRUP / REG sequences shared yearly per prefix.

create sequence if not exists reg_seq_priv;
create sequence if not exists reg_seq_semi;
create sequence if not exists reg_seq_grup;
create sequence if not exists reg_seq_reg;

create or replace function generate_display_id()
returns trigger as $$
declare
  prefix text;
  year_part text;
  seq_val int;
begin
  year_part := to_char(now(), 'YYYY');
  case new.preferred_class_type
    when 'privat' then
      prefix := 'PRIV';
      seq_val := nextval('reg_seq_priv');
    when 'semi_privat' then
      prefix := 'SEMI';
      seq_val := nextval('reg_seq_semi');
    when 'grup' then
      prefix := 'GRUP';
      seq_val := nextval('reg_seq_grup');
    else
      prefix := 'REG';
      seq_val := nextval('reg_seq_reg');
  end case;
  new.display_id := prefix || '-' || year_part || '-' || lpad(seq_val::text, 4, '0');
  return new;
end;
$$ language plpgsql;

create trigger trg_registrations_display_id
  before insert on registrations
  for each row execute function generate_display_id();

-- ----- Indexes ------------------------------------------------------------

create index idx_registrations_status_created
  on registrations(status, created_at desc);

create index idx_articles_slug
  on articles(slug);

create index idx_articles_status_published
  on articles(status, published_at desc)
  where status = 'published';

create index idx_testimonials_featured
  on testimonials(status, featured, display_order)
  where status = 'published' and featured = true;

create index idx_articles_created_by
  on articles(created_by);
