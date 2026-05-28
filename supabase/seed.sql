-- =====================================================
-- supabase/seed.sql
-- Phase 1 dev/demo content: testimonials + articles.
-- Idempotent via ON CONFLICT — safe to re-run.
-- Apply via Supabase Studio SQL editor or `supabase db reset`.
-- =====================================================

-- ----- Testimonials (TASK-026) ---------------------------------------------
-- 3 featured published testimonials so the landing /#testimoni section
-- has content out of the box. display_order controls landing render order.

insert into testimonials (id, name, role, rating, text, featured, status, display_order)
values
  (
    '11111111-1111-1111-1111-111111111111',
    'Bunda Lala',
    'Anak 7 tahun · Privat',
    5,
    'Anakku awalnya takut banget masuk air. Setelah 5 sesi privat sama Coach Anis, sekarang udah berani lompat sendiri. Pelatihnya sabar banget.',
    true,
    'published',
    1
  ),
  (
    '22222222-2222-2222-2222-222222222222',
    'Ayah Iqbal',
    'Anak 5 & 8 tahun · Semi-Privat',
    5,
    'Saya pilih di sini karena semua info udah jelas di website. Harga, jadwal, profil pelatih — nggak perlu DM dulu. Sebagai ayah yang sibuk, ngehemat waktu banget.',
    true,
    'published',
    2
  ),
  (
    '33333333-3333-3333-3333-333333333333',
    'Bunda Sari',
    'Anak 6 tahun · Grup',
    5,
    'Tiga bulan ikut kelas grup, sekarang anak saya udah bisa freestyle dengan napas yang benar. Worth it banget — dan kolamnya bersih.',
    true,
    'published',
    3
  )
on conflict (id) do update
set
  name = excluded.name,
  role = excluded.role,
  rating = excluded.rating,
  text = excluded.text,
  featured = excluded.featured,
  status = excluded.status,
  display_order = excluded.display_order;

-- ----- Articles (TASK-034) -------------------------------------------------
-- 2 published articles seeded so /artikel and /artikel/[slug] have content
-- for the magic moment demo. Each ends with a contextual CTA back to
-- /#jenis-kelas. content_html is the rendered Tiptap output; content jsonb
-- mirrors the same body for editor round-tripping in Phase 4.

insert into articles (
  id,
  slug,
  title,
  excerpt,
  content,
  content_html,
  cover_image_url,
  cover_image_alt,
  author_name,
  reading_time_minutes,
  status,
  seo_title,
  seo_description,
  published_at
)
values
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'usia-ideal-anak-mulai-les-renang',
    'Usia ideal anak mulai les renang — dan kenapa nggak harus terlalu cepat',
    'Banyak orang tua bertanya: umur berapa anak sebaiknya mulai les renang? Jawaban singkatnya 4 tahun. Tapi ada nuansa penting yang sering terlewat.',
    '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Banyak orang tua bertanya: umur berapa anak sebaiknya mulai les renang? Jawaban singkat: sekitar 4 tahun. Tapi ada nuansa penting yang sering terlewat."}]}]}'::jsonb,
    $$<p>Banyak orang tua bertanya: <em>umur berapa anak sebaiknya mulai les renang?</em> Jawaban singkatnya, sekitar 4 tahun. Tapi ada nuansa penting yang sering terlewat.</p>
<h2>Kenapa 4 tahun jadi titik nyaman</h2>
<p>Pada usia ini, anak sudah punya kontrol motorik halus yang cukup untuk belajar gerakan dasar — mengapung, menendang, mengatur napas. Mereka juga sudah bisa mengikuti instruksi sederhana dari pelatih tanpa menangis.</p>
<p>Sebelum 4 tahun, latihan biasanya lebih mirip "main air aman" — kenalan dengan air, bermain sambil dipegang orang tua. Manfaatnya ada, tapi belum bisa disebut "les renang" dalam arti teknis.</p>
<h2>Tanda anak siap mulai</h2>
<ul>
<li>Berani basah muka tanpa panik.</li>
<li>Bisa mengikuti instruksi 2 langkah ("ayo masuk, terus pegang ini").</li>
<li>Punya stamina untuk sesi 30–45 menit tanpa rewel.</li>
</ul>
<h2>Yang sering bikin orang tua salah hitung</h2>
<p>Kadang orang tua memaksa anak mulai di umur 3 karena teman sebayanya sudah ikut. Padahal kalau anak masih takut air, sesi pertama yang traumatis justru bikin dia menghindari kolam selama setahun ke depan. Lebih baik tunggu 6 bulan, mulai dengan kelas privat, dan biarkan dia adaptasi pelan-pelan.</p>
<h2>Apa yang kami sarankan</h2>
<p>Kalau anak kamu sudah 4 tahun ke atas dan kelihatan nyaman main air, kelas semi-privat biasanya cocok. Kalau masih takut, mulai dari privat — pelatih bisa fokus 100% di anak kamu.</p>
<hr>
<p><strong>Mau cek kelas yang pas untuk anak kamu?</strong> Lihat detail tiga jenis kelas — Privat, Semi-Privat, Grup — di halaman utama. Tim kami juga bisa bantu via WhatsApp kalau masih ragu.</p>
<p><a href="/#jenis-kelas">Lihat jenis kelas →</a></p>$$,
    '/images/article-placeholder-sky.svg',
    'Placeholder cover — sky tones',
    'Tim Fellaswimming',
    5,
    'published',
    'Usia ideal anak mulai les renang — Fellaswimming',
    'Kapan waktu terbaik anak mulai les renang? Kami jelaskan tanda kesiapan, kenapa 4 tahun jadi titik nyaman, dan rekomendasi kelas pertama.',
    now() - interval '7 days'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'bedanya-kelas-privat-semi-dan-grup',
    'Bedanya kelas Privat, Semi-Privat, dan Grup — pilih sesuai gaya belajar anak',
    'Tiga jenis kelas, tiga pendekatan berbeda. Kami uraikan kapan masing-masing kelas paling cocok — supaya kamu nggak salah pilih.',
    '{"type":"doc","content":[{"type":"paragraph","content":[{"type":"text","text":"Tiga jenis kelas, tiga pendekatan berbeda. Berikut panduan singkatnya."}]}]}'::jsonb,
    $$<p>Tiga jenis kelas, tiga pendekatan berbeda. Berikut panduan ringkas untuk Bunda &amp; Ayah yang lagi pilih-pilih.</p>
<h2>Privat (1 : 1)</h2>
<p>Satu anak, satu pelatih. <strong>Paling cocok untuk:</strong> anak yang masih takut air, anak yang perlu adaptasi pelan-pelan, atau anak yang sudah mahir dan mau fokus teknik kompetisi. Kelemahan: paling mahal, dan beberapa anak justru lebih cepat berkembang kalau ada teman sebaya.</p>
<h2>Semi-Privat (1 : 2–3)</h2>
<p>Dua sampai tiga anak, satu pelatih. <strong>Paling cocok untuk:</strong> kakak-adik yang mau belajar bareng, anak yang punya teman dekat, atau anak yang butuh motivasi sosial tanpa kehilangan perhatian individual. Pilihan paling populer di Fellaswimming — sweet spot antara harga dan attention.</p>
<h2>Grup (1–2 : 4–6)</h2>
<p>Empat sampai enam anak, satu sampai dua pelatih. <strong>Paling cocok untuk:</strong> anak yang sudah berani di air, suka suasana ramai, dan mau progres rutin tanpa biaya tinggi. Bukan untuk anak yang masih takut — perhatian pelatih harus dibagi.</p>
<h2>Cara cepat menentukan</h2>
<ul>
<li>Anak baru pertama kali ke kolam → <strong>Privat</strong>.</li>
<li>Anak sudah nyaman main air, punya saudara/teman seumuran → <strong>Semi-Privat</strong>.</li>
<li>Anak sudah bisa berenang dasar, mau latihan rutin → <strong>Grup</strong>.</li>
</ul>
<p>Masih bingung? Daftar dulu pilih "Belum yakin" — tim kami WhatsApp untuk ngobrol singkat soal anak kamu sebelum menentukan kelas.</p>
<hr>
<p><strong>Sudah punya gambaran kelas yang cocok?</strong> Lihat detail lengkap masing-masing kelas — harga, jadwal, dan apa yang dipelajari di setiap sesi.</p>
<p><a href="/#jenis-kelas">Lihat jenis kelas →</a></p>$$,
    '/images/article-placeholder-turq.svg',
    'Placeholder cover — turquoise tones',
    'Tim Fellaswimming',
    6,
    'published',
    'Bedanya kelas Privat, Semi-Privat, dan Grup — Fellaswimming',
    'Privat, Semi-Privat, atau Grup? Panduan singkat memilih kelas renang anak berdasarkan gaya belajar, kesiapan, dan kebutuhan keluarga.',
    now() - interval '3 days'
  )
on conflict (id) do update
set
  slug = excluded.slug,
  title = excluded.title,
  excerpt = excluded.excerpt,
  content = excluded.content,
  content_html = excluded.content_html,
  cover_image_url = excluded.cover_image_url,
  cover_image_alt = excluded.cover_image_alt,
  author_name = excluded.author_name,
  reading_time_minutes = excluded.reading_time_minutes,
  status = excluded.status,
  seo_title = excluded.seo_title,
  seo_description = excluded.seo_description,
  published_at = excluded.published_at;
