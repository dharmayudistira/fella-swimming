-- =====================================================
-- supabase/seed.sql
-- Dev/demo content: testimonials, articles, and admin-side registrations.
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

-- ----- Registrations (Phase 3 dev data) ------------------------------------
-- Seven leads covering every status (baru, dihubungi, trial, daftar,
-- tidak_lanjut) and every class_type prefix (PRIV, SEMI, GRUP, REG) so the
-- admin dashboard, pendaftaran list, status badges, and modal all have
-- realistic content to render.
--
-- `display_id` is NOT set here — the BEFORE INSERT trigger
-- generate_display_id() owns it. created_at is relative to now() so the
-- "Lead baru hari ini" / "Pendaftaran bulan ini" counters always look
-- sensible regardless of when the seed runs.
--
-- Re-running is safe: ON CONFLICT (id) DO UPDATE refreshes the editable
-- fields. display_id and created_at stay stable (we never overwrite them
-- in the DO UPDATE clause).

insert into registrations (
  id,
  student_name,
  student_age,
  student_gender,
  student_experience,
  preferred_class_type,
  preferred_schedule,
  preferred_location,
  parent_name,
  parent_whatsapp,
  parent_email,
  notes,
  status,
  internal_notes,
  contacted_at,
  created_at
)
values
  -- 1. BARU — privat, baru saja masuk
  (
    'd0000001-0000-0000-0000-000000000001',
    'Arif Pratama',
    6,
    'laki_laki',
    'sedikit_bisa',
    'privat',
    'Sabtu pagi atau Minggu sore',
    'Kolam Anggrek, Sidoarjo',
    'Risa Wahyuni',
    '628123456789',
    null,
    'Anak masih shy di awal, tapi sebenarnya senang main air di rumah. Boleh kalau pelatihnya perempuan?',
    'baru',
    null,
    null,
    now() - interval '12 minutes'
  ),
  -- 2. BARU — semi-privat, masuk sore ini
  (
    'd0000001-0000-0000-0000-000000000002',
    'Dini Nuraini',
    5,
    'perempuan',
    'belum_bisa',
    'semi_privat',
    'Minggu pagi',
    null,
    'Bagus Setiawan',
    '628157788112',
    'bagus.setiawan@example.com',
    'Pengen barengan sama sepupunya (8 tahun). Belum tahu jadwal sepupunya, nanti dikabari lagi.',
    'baru',
    null,
    null,
    now() - interval '2 hours'
  ),
  -- 3. DIHUBUNGI — grup, sudah di-WA tapi belum trial
  (
    'd0000001-0000-0000-0000-000000000003',
    'Kayla Hanifa',
    8,
    'perempuan',
    'sudah_bisa_dasar',
    'grup',
    'Weekday sore',
    'Kolam Anggrek, Sidoarjo',
    'Vina Lestari',
    '628212233445',
    null,
    null,
    'dihubungi',
    'Sudah respon di WA, minta info paket bulanan. Kirim brosur paket 12 sesi besok pagi.',
    now() - interval '1 day',
    now() - interval '1 day 4 hours'
  ),
  -- 4. DIHUBUNGI — semi-privat, baru di-WA hari ini
  (
    'd0000001-0000-0000-0000-000000000004',
    'Reza Mahendra',
    8,
    'laki_laki',
    'sedikit_bisa',
    'semi_privat',
    'Sabtu pagi',
    null,
    'Mira Sasmita',
    '628112233445',
    null,
    null,
    'dihubungi',
    'Coach Anis sudah follow-up via WA. Ortu mau diskusi dulu sama suami.',
    now() - interval '3 hours',
    now() - interval '5 hours'
  ),
  -- 5. TRIAL — semi-privat, sudah trial pertama
  (
    'd0000001-0000-0000-0000-000000000005',
    'Rama Adyatma',
    7,
    'laki_laki',
    'sedikit_bisa',
    'semi_privat',
    'Sabtu sore',
    'Kolam Anggrek, Sidoarjo',
    'Sari Mahesa',
    '628139988776',
    'sari.mahesa@example.com',
    'Anak ke-2. Adiknya juga rencananya nyusul kalau Rama cocok.',
    'trial',
    'Trial sesi 1 sudah jalan Sabtu kemarin. Coach Anis report anak antusias, lanjut Sabtu depan.',
    now() - interval '3 days',
    now() - interval '4 days'
  ),
  -- 6. DAFTAR — privat, sudah commit paket
  (
    'd0000001-0000-0000-0000-000000000006',
    'Nadia Felicia',
    4,
    'perempuan',
    'belum_bisa',
    'privat',
    'Fleksibel — utamakan weekday sore',
    'Kolam Anggrek, Sidoarjo',
    'Putri Anggraini',
    '628195566334',
    null,
    'Pertama kali les renang. Anak masih takut, pengen pelan-pelan dulu.',
    'daftar',
    'Sudah bayar paket 8 sesi via transfer. Sesi pertama dijadwalkan Senin minggu depan dengan Coach Mira.',
    now() - interval '5 days',
    now() - interval '6 days'
  ),
  -- 7. TIDAK_LANJUT — grup → belum yakin, sudah pasif 1 minggu
  (
    'd0000001-0000-0000-0000-000000000007',
    'Citra Larasati',
    6,
    'perempuan',
    'sedikit_bisa',
    'belum_yakin',
    null,
    null,
    'Anggun Wijaya',
    '628134455667',
    null,
    'Belum yakin kelas privat atau grup, pengen tanya-tanya dulu.',
    'tidak_lanjut',
    'WA dua kali tidak dibalas. Coba lagi minggu depan, kalau tetap pasif tutup leadnya.',
    now() - interval '6 days',
    now() - interval '8 days'
  )
on conflict (id) do update
set
  student_name = excluded.student_name,
  student_age = excluded.student_age,
  student_gender = excluded.student_gender,
  student_experience = excluded.student_experience,
  preferred_class_type = excluded.preferred_class_type,
  preferred_schedule = excluded.preferred_schedule,
  preferred_location = excluded.preferred_location,
  parent_name = excluded.parent_name,
  parent_whatsapp = excluded.parent_whatsapp,
  parent_email = excluded.parent_email,
  notes = excluded.notes,
  status = excluded.status,
  internal_notes = excluded.internal_notes,
  contacted_at = excluded.contacted_at;
