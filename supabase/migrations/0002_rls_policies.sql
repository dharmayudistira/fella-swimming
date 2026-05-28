-- =====================================================
-- 0002_rls_policies.sql
-- Enable Row-Level Security on every public table and define
-- the public surface (anon) + admin surface (authenticated) policies.
--
-- Defense in depth: anon INSERT on registrations is allowed but the
-- Server Action uses the service-role client to bypass the
-- "INSERT ... RETURNING requires SELECT" gotcha (anon has no SELECT).
-- =====================================================

-- ----- Enable RLS on all tables ------------------------------------------

alter table registrations enable row level security;
alter table categories    enable row level security;
alter table articles      enable row level security;
alter table testimonials  enable row level security;
alter table profiles      enable row level security;

-- ----- registrations ------------------------------------------------------

-- Public form submissions (anon role).
create policy "anon can insert registrations"
  on registrations
  for insert
  to anon
  with check (true);

-- Admin full access.
create policy "authenticated can read registrations"
  on registrations
  for select
  to authenticated
  using (true);

create policy "authenticated can update registrations"
  on registrations
  for update
  to authenticated
  using (true)
  with check (true);

create policy "authenticated can delete registrations"
  on registrations
  for delete
  to authenticated
  using (true);

-- ----- categories ---------------------------------------------------------

create policy "anon can read categories"
  on categories
  for select
  to anon
  using (true);

create policy "authenticated can manage categories"
  on categories
  for all
  to authenticated
  using (true)
  with check (true);

-- ----- articles -----------------------------------------------------------

create policy "anon can read published articles"
  on articles
  for select
  to anon
  using (status = 'published');

create policy "authenticated can read all articles"
  on articles
  for select
  to authenticated
  using (true);

create policy "authenticated can insert articles"
  on articles
  for insert
  to authenticated
  with check (true);

create policy "authenticated can update articles"
  on articles
  for update
  to authenticated
  using (true)
  with check (true);

create policy "authenticated can delete articles"
  on articles
  for delete
  to authenticated
  using (true);

-- ----- testimonials -------------------------------------------------------

create policy "anon can read featured published testimonials"
  on testimonials
  for select
  to anon
  using (status = 'published' and featured = true);

create policy "authenticated can read all testimonials"
  on testimonials
  for select
  to authenticated
  using (true);

create policy "authenticated can insert testimonials"
  on testimonials
  for insert
  to authenticated
  with check (true);

create policy "authenticated can update testimonials"
  on testimonials
  for update
  to authenticated
  using (true)
  with check (true);

create policy "authenticated can delete testimonials"
  on testimonials
  for delete
  to authenticated
  using (true);

-- ----- profiles -----------------------------------------------------------

create policy "users can read their own profile"
  on profiles
  for select
  to authenticated
  using (id = (select auth.uid()));

create policy "users can upsert their own profile"
  on profiles
  for insert
  to authenticated
  with check (id = (select auth.uid()));

create policy "users can update their own profile"
  on profiles
  for update
  to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));
