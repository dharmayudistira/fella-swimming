-- =====================================================
-- 0003_storage_buckets.sql
-- Public-read storage buckets for article covers, inline article
-- images, and testimonial photos. Writes restricted to authenticated
-- admin users.
-- =====================================================

-- ----- Buckets -----------------------------------------------------------

insert into storage.buckets (id, name, public)
values
  ('article-images',     'article-images',     true),
  ('article-covers',     'article-covers',     true),
  ('testimonial-photos', 'testimonial-photos', true)
on conflict (id) do nothing;

-- ----- Policies -----------------------------------------------------------
-- Anon read is granted automatically by `public = true` on the bucket.
-- Writes (INSERT / UPDATE / DELETE) require an authenticated session.

create policy "authenticated can upload to article-images"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'article-images');

create policy "authenticated can update article-images"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'article-images')
  with check (bucket_id = 'article-images');

create policy "authenticated can delete article-images"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'article-images');

create policy "authenticated can upload to article-covers"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'article-covers');

create policy "authenticated can update article-covers"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'article-covers')
  with check (bucket_id = 'article-covers');

create policy "authenticated can delete article-covers"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'article-covers');

create policy "authenticated can upload to testimonial-photos"
  on storage.objects
  for insert
  to authenticated
  with check (bucket_id = 'testimonial-photos');

create policy "authenticated can update testimonial-photos"
  on storage.objects
  for update
  to authenticated
  using (bucket_id = 'testimonial-photos')
  with check (bucket_id = 'testimonial-photos');

create policy "authenticated can delete testimonial-photos"
  on storage.objects
  for delete
  to authenticated
  using (bucket_id = 'testimonial-photos');
