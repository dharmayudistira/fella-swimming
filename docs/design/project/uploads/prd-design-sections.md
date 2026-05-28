# Fellaswimming — Design Spec Extract (PRD § 8 + § 9)

> Standalone extract from `docs/prd.md` containing only the UI/UX Requirements and Design System sections. Use this file when uploading to Claude Design (or any visual design tool) where the full PRD is too large.
>
> For broader brand and strategic context, also load `.impeccable.md` and (optionally) `docs/product-vision.md`.

## Product Quick Context

- **Product:** Fellaswimming — swim school website for an existing business in Sidoarjo, Indonesia. Web app, responsive (mobile-dominant), built with Next.js 16 + Supabase + Tailwind v4 + shadcn-ui.
- **Primary persona:** Mama Risa, 38, full-time mom in Sidoarjo, researches thoroughly before deciding swim lessons for her kids. Late-evening phone scroll on 360-390px viewport.
- **Brand voice:** Friendly Guide (peer parent, not corporate). Bahasa Indonesia with personalized address mix (Bunda/Ayah for headlines, "kamu" for body, neutral for forms).
- **Visual mood:** Soft Aquatic — sky blue + soft turquoise + sandy beige + soft coral, on warm sand background. Rounded humanist typography. Editorial-magazine structure meets calm wellness. References: Halodoc, Headspace, @keluargakita Instagram, Delta app by eToro.
- **Public surfaces** (landing, daftar, artikel): mobile + desktop responsive. **Admin surfaces** (login, dashboard, CMS): desktop-only.
- **Hard bans** (per `.impeccable.md`): no side-stripe borders (border-left 3px+ accent stripes), no gradient text, no glassmorphism, no cartoon mascots, no hard-sell exclamations, no countdown timers, no pure white or pure black.

---

## 8. UI/UX Requirements

### Screen: Landing
**Route:** `/`
**Purpose:** Convert visitors into leads (form submission) via comprehensive information + soft education prompts.
**Layout:** Single scroll, vertical sections. Mobile: stacked. Desktop: max-width 1280px with 64px horizontal padding, sections retain similar vertical rhythm.

States:
- **Loading:** Skeleton for testimoni section only (server-rendered sections are static).
- **Populated:** All sections render in order: Hero → Tentang Singkat → Jenis Kelas → Pelatih → Galeri → Testimoni → Lokasi → Footer CTA → Footer.
- **Error:** If testimonials fetch fails, section gracefully omitted (no error UI on public surface).

Key Interactions:
- Hero CTA "Daftar Sekarang" → navigate to `/daftar`
- Anchor scroll on header nav links (Kelas, Pelatih, Artikel, Lokasi)
- Testimoni section: swipeable on mobile, button-paginated on desktop
- Lokasi: "Buka di Google Maps" opens new tab to a Google Maps URL with the exact address

Components Used: HeroSection, KelasSection, PelatihSection, GallerySection, TestimoniSection, LokasiSection, FooterCTA, Footer; shadcn Button, Card, Badge.

---

### Screen: Daftar
**Route:** `/daftar`
**Purpose:** Capture lead via guided 3-step form with confirmation.
**Layout:** Single column, max-width 480px (mobile-first), centered. Progress indicator at top showing current step (1/3, 2/3, 3/3). Form below. Back / Continue buttons at bottom.

States:
- **Step 1 / Step 2 / Step 3:** Form fields per step, with validation errors inline.
- **Submitting:** Continue button shows spinner, form disabled.
- **Confirmation:** Replaces form with ConfirmationPanel showing display_id and next-steps copy.
- **Error:** Toast at top with "Gagal kirim. Coba lagi." and retry available.

Key Interactions:
- Continue: validate current step → if valid, advance step.
- Back: regress one step, preserve form state.
- Final Submit: invoke `submitRegistration` action; on success, show confirmation; on error, show toast.
- All inputs: `Enter` advances to next field; on the last field of each step, `Enter` triggers Continue.

Form fields per step:
- **Step 1 (Info Anak):** student_name (text), student_age (number, 3-80), student_gender (radio: laki-laki / perempuan), student_experience (radio: belum bisa / sedikit bisa / sudah bisa dasar / mahir)
- **Step 2 (Kelas):** preferred_class_type (radio with descriptions: Privat / Semi-Privat / Grup / Belum Yakin), preferred_schedule (text, e.g. "Sabtu pagi"), preferred_location (text)
- **Step 3 (Kontak):** parent_name (text), parent_whatsapp (text, normalized to 62xxxxxxxxxx), parent_email (optional), notes (textarea, optional)

Components Used: RegistrationWizard, StepStudent, StepClass, StepContact, ConfirmationPanel; shadcn Input, Label, Select, RadioGroup, Textarea, Button, Toast.

---

### Screen: Artikel Index
**Route:** `/artikel`
**Purpose:** Browse all published articles, encourage deeper reading.
**Layout:** Page header (title + short intro), articles grid (1-col mobile, 2-col tablet, 3-col desktop), pagination.

States:
- **Empty (no articles):** "Artikel baru sedang dipersiapkan. Cek lagi minggu depan."
- **Populated:** Grid of ArticleCard components.
- **Loading next page:** Spinner replaces "Load more" button.

Key Interactions:
- Click article card → navigate to `/artikel/[slug]`
- Click "Load more" → fetch next 12 articles (P1; P0 can use simple pagination with `?page=N`)

ArticleCard contents: cover image, title, excerpt (2-3 lines), publish date (Bahasa Indonesia format), reading time estimate.

Components Used: ArticleList, ArticleCard, shadcn Card, Button.

---

### Screen: Artikel Detail
**Route:** `/artikel/[slug]`
**Purpose:** Deliver educational content, drive to landing via contextual CTA.
**Layout:** Centered article column max-width 65ch. Cover image at top (full-bleed on mobile, max-width contained on desktop). Title, meta (author, date, reading time), body, contextual CTA at end, "Lihat artikel lain" link below.

States:
- **Populated:** Full article render.
- **Not found:** Next.js 404 page.

Key Interactions:
- Contextual CTA → navigate to `/` with anchor (e.g. `/#jenis-kelas`).
- "Lihat artikel lain" → navigate to `/artikel`.

Article body styles: prose container with controlled max-width, comfortable line-height for sustained reading (1.7), generous paragraph spacing, inline images with rounded corners and lazy loading.

Components Used: ArticleRenderer, shadcn Button, Skeleton (loading state for related links).

---

### Screen: Login
**Route:** `/login`
**Purpose:** Admin authentication.
**Layout:** Centered card, max-width 360px. Logo at top, form (email, password), "Lupa password?" link below.

States:
- **Idle / Filling:** Form interactive.
- **Submitting:** Submit button shows spinner.
- **Error:** Toast or inline error "Email atau password salah".

Key Interactions:
- Submit → `signIn` action.
- "Lupa password" link → `/lupa-password`.

Components Used: shadcn Input, Label, Button, Card; LoginForm.

---

### Screen: Lupa Password
**Route:** `/lupa-password`
**Purpose:** Request password reset email.
**Layout:** Centered card. Email input, Submit button, link back to login.

States:
- **Idle / Filling:** Form interactive.
- **Submitting:** Spinner.
- **Submitted:** Replace form with "Email reset terkirim. Cek inbox kamu, ya."

Key Interactions:
- Submit → `requestPasswordReset` action.

Components Used: shadcn Input, Label, Button, Card.

---

### Screen: Reset Password
**Route:** `/reset-password`
**Purpose:** Set new password using token from email link.
**Layout:** Centered card. Two password fields (new + confirm), Submit button.

States:
- **Valid token:** Form interactive.
- **Invalid/expired token:** "Tautan tidak valid atau sudah kedaluwarsa. Minta reset baru."
- **Submitting:** Spinner.
- **Success:** Redirect to `/admin`.

Key Interactions:
- Submit → `resetPassword` action.

Components Used: shadcn Input, Label, Button, Card.

---

### Screen: Admin Home
**Route:** `/admin`
**Purpose:** At-a-glance overview of recent lead activity.
**Layout:** Sidebar nav (left, fixed) + main content (right). Header with logout button. Main content: 3 StatCard tiles in a row + RecentLeadsTable + quick links to artikel/testimoni.

States:
- **Loading:** Skeleton for StatCards and table.
- **Populated:** Live counts and recent leads.
- **Empty:** "Belum ada pendaftaran. Begitu masuk, akan muncul di sini."

Key Interactions:
- Click row in RecentLeadsTable → open PendaftaranModal with that lead.
- Click quick link → navigate to artikel or testimoni page.

StatCard variants: "Pendaftaran Bulan Ini", "Lead Baru Hari Ini", "Menunggu Follow-up".

Components Used: AdminSidebar, StatCard, RecentLeadsTable, PendaftaranModal.

---

### Screen: Pendaftaran List
**Route:** `/admin/pendaftaran`
**Purpose:** Triage and manage all leads.
**Layout:** Sidebar + main. Main: page header with title + filter tabs + search input, then table with pagination footer.

States:
- **Loading:** Skeleton table.
- **Populated:** Rows of leads.
- **Empty (no leads ever):** "Belum ada pendaftaran masuk."
- **Empty (filtered):** "Tidak ada lead dengan filter ini."

Key Interactions:
- Click row → open PendaftaranModal.
- Status filter tab → refetch with filter.
- Search input (debounced 300ms) → refetch with search.
- Pagination → next/previous page.

Filter tabs: All, Baru, Dihubungi, Trial, Daftar, Tidak Lanjut.
Table columns: display_id, student_name, parent_name, parent_whatsapp, preferred_class_type, status (badge), created_at.

Components Used: PendaftaranTable, PendaftaranModal, StatusBadge, shadcn Tabs, Input, Button, Table, Skeleton.

---

### Screen: Pendaftaran Modal (component, not a route)
**Purpose:** Edit lead status and notes, deep-link to WhatsApp.
**Layout:** shadcn Dialog. Header: display_id + parent_name. Body: full lead detail in read-only fields (student info, class preference, contact, original notes), then editable status dropdown, internal notes textarea, WhatsApp button. Footer: Save and Close buttons.

States:
- **Idle:** Editable.
- **Saving:** Save button shows spinner.
- **Error:** Toast with rollback (optimistic update rolled back).

Key Interactions:
- Change status → form dirty.
- Click WhatsApp → opens `wa.me/<phone>?text=<template>` in new tab.
- Save → updateRegistrationStatus action with optimistic update.

WhatsApp template: `Halo Bunda/Ayah {parent_name}, ini Fellaswimming. Kami menerima pendaftaran (ref: {display_id}) untuk {student_name}. Boleh kami atur jadwal trial?`

Components Used: shadcn Dialog, Select, Textarea, Button, Toast.

---

### Screen: Artikel List
**Route:** `/admin/artikel`
**Purpose:** Manage all articles.
**Layout:** Sidebar + main. Main: page header with "New Article" button, filter tabs, search input, then table.

States:
- **Loading:** Skeleton table.
- **Populated:** Rows of articles with action buttons.
- **Empty:** "Belum ada artikel. Mulai dengan tombol 'New Article'."

Key Interactions:
- Click "New Article" → navigate to `/admin/artikel/new`.
- Click Edit → navigate to `/admin/artikel/[id]/edit`.
- Click Delete → confirm dialog → delete.
- Toggle Publish/Unpublish.

Filter tabs: All, Draft, Published.
Table columns: title, status, category, updated_at.

Components Used: ArtikelTable, shadcn Tabs, Input, Button, AlertDialog, Skeleton.

---

### Screen: Artikel Editor
**Route:** `/admin/artikel/new`, `/admin/artikel/[id]/edit`
**Purpose:** Compose or edit articles.
**Layout:** Sidebar + main. Main is wide (max-width 960px), single column. Header with title input + Save Draft + Publish buttons. Below: slug input, excerpt textarea, cover image upload, category select, SEO inputs, then Tiptap editor (full-width).

States:
- **Idle / Editing:** Editor interactive.
- **Uploading image:** Inline progress bar in Tiptap toolbar.
- **Saving:** Buttons disabled, spinner.
- **Saved:** Toast confirmation.
- **Error:** Toast with detail.

Key Interactions:
- Tiptap toolbar: bold, italic, heading (h2/h3), link, image, bullet list, ordered list, quote, youtube.
- Image upload: toolbar button → file picker → upload to Supabase Storage → insert image URL into editor.
- Save Draft → upserts article with status=draft.
- Publish → upserts article with status=published, sets published_at if not set.

Components Used: TiptapEditor, shadcn Input, Label, Textarea, Select, Button, Toast.

---

### Screen: Testimoni List
**Route:** `/admin/testimoni`
**Purpose:** Manage testimonials.
**Layout:** Sidebar + main. Main: page header + "New Testimoni" button + sortable list/table.

States:
- **Loading:** Skeleton rows.
- **Populated:** Sortable list.
- **Empty:** "Belum ada testimoni. Tambah satu untuk muncul di landing."

Key Interactions:
- Drag handle → reorder (live preview + persist on drop).
- Click row → open TestimoniModal.
- Toggle Featured → save inline.
- Delete → confirm → delete.

Columns: drag handle, order, name, role, rating (stars), status, featured (switch), actions.

Components Used: TestimoniTable, SortableRow (dnd-kit), TestimoniModal, shadcn AlertDialog, Switch, Button.

---

### Screen: Testimoni Modal (component)
**Purpose:** Add or edit a testimonial.
**Layout:** shadcn Dialog. Form: name, role, rating (5-star picker), text textarea, photo upload (optional), featured toggle, status select.

States:
- Editable / Saving / Error (consistent with PendaftaranModal pattern).

Key Interactions:
- Save → upsert testimonial.
- Rating: click stars to set 1-5.
- Photo upload optional → uploadTestimonialPhoto.

Components Used: shadcn Dialog, Input, Label, Textarea, Switch, Select, Button.

---

## 9. Design System

### Color Tokens

Configured in `src/app/globals.css` via Tailwind v4 `@theme` block. CSS custom properties; **no `tailwind.config.ts` file** (Tailwind v4 is CSS-first).

```css
/* src/app/globals.css */
@import "tailwindcss";

@theme {
  /* Brand colors (OKLCH per Tailwind v4 best practice) */
  --color-primary: oklch(0.71 0.14 230);          /* ~#0EA5E9 sky-500 */
  --color-primary-hover: oklch(0.62 0.15 230);    /* ~#0284C7 sky-600 */
  --color-secondary: oklch(0.73 0.13 184);        /* ~#14B8A6 teal-500 */
  --color-accent: oklch(0.72 0.16 15);            /* ~#FB7185 rose-400 */

  /* Neutrals */
  --color-background: #FAF8F5;                     /* Warm sand */
  --color-surface: #FFFFFF;
  --color-surface-muted: #F5F1EC;
  --color-border: #E7E2DA;
  --color-foreground: #1A2332;
  --color-foreground-muted: #5C6573;
  --color-foreground-subtle: #8C95A3;

  /* Semantic */
  --color-success: #10B981;
  --color-warning: #F59E0B;
  --color-error: #EF4444;
  --color-info: #3B82F6;

  /* Typography */
  --font-heading: "General Sans", sans-serif;
  --font-body: "Nunito", sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  /* Type scale */
  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.25rem;
  --text-xl: 1.563rem;
  --text-2xl: 1.953rem;
  --text-3xl: 2.441rem;
  --text-4xl: 3.052rem;
  --text-display: 3.815rem;

  /* Spacing scale (Tailwind v4 generates from base) */
  --spacing: 0.25rem;                              /* 4px base; multipliers via Tailwind classes */

  /* Border radius */
  --radius-sm: 8px;
  --radius: 12px;
  --radius-lg: 16px;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 1px rgba(15, 23, 42, 0.04);
  --shadow-md: 0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04);
  --shadow-lg: 0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.06);

  /* Easing */
  --ease-fluid: cubic-bezier(0.4, 0, 0.2, 1);
  --ease-snappy: cubic-bezier(0.2, 0, 0, 1);
}

/* Body defaults */
html { font-family: var(--font-body); color: var(--color-foreground); background: var(--color-background); }
h1, h2, h3, h4, h5, h6 { font-family: var(--font-heading); }
code, pre { font-family: var(--font-mono); }
```

Tailwind class usage examples:
- `bg-primary text-white` → primary button background
- `text-foreground-muted` → secondary text
- `border border-border rounded` → standard card border
- `shadow-sm` → default card elevation

### Typography Tokens

**Heading: General Sans (Fontshare).** Geometric humanist sans-serif with personality. Not in any AI-monoculture banned list. Weights: 500, 600, 700.

**Body: Nunito (Google Fonts).** Rounded humanist sans-serif, very readable on mobile, friendly tone. Weights: 400, 500, 600, 700.

**Mono: JetBrains Mono (Google Fonts).** For code snippets in articles, display_id rendering, technical labels. Weights: 400, 500.

Type scale uses a 1.25 modular ratio. Headings use General Sans; body and small text use Nunito. Line-height: headings 1.2, body 1.6, article paragraphs 1.7.

On mobile (under 768px), display and h1 each step down one size for readability.

### Spacing Tokens

Tailwind v4 uses a single `--spacing` base unit (4px). Use Tailwind utility classes for multiples: `p-1` (4px), `p-2` (8px), `p-4` (16px), `p-6` (24px), `p-8` (32px), `p-12` (48px), `p-16` (64px), `p-24` (96px).

Section spacing standard:
- Inter-section vertical: `py-16 md:py-24` (64px mobile, 96px desktop)
- Intra-section block: `gap-6 md:gap-8`
- Related items: `gap-3 md:gap-4`

Max content width: article body 65ch (~720px), landing-page sections 1280px, admin tables full width.

### Component Specifications

**Button.** Three variants:
- `primary` (default): `bg-primary text-white hover:bg-primary-hover focus:ring-primary/30 rounded-sm px-6 py-3 font-medium`
- `secondary`: `bg-surface text-foreground border border-border hover:bg-surface-muted rounded-sm`
- `ghost`: `bg-transparent text-primary hover:bg-primary/8`
- Sizes: `sm` (h-9), `default` (h-11), `lg` (h-12)

**Input.** Default style: `border border-border rounded-sm px-3 py-3 text-base bg-surface focus:ring-2 focus:ring-primary/30 focus:border-primary`. Label sits above input; helper text or error below in `text-sm`.

**Card.** `bg-surface rounded-lg shadow-sm p-6 md:p-8`. Optional hover variant: `hover:shadow-md transition-shadow duration-200`. Avoid nested cards.

**Dialog (Modal).** Backdrop: `bg-foreground/40 backdrop-blur-sm` (subtle blur, not glassmorphism). Content: `bg-surface rounded-lg shadow-lg max-w-lg p-6 md:p-8`.

**Badge.** `inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium`. Variants by status color (success, warning, error, info, neutral).

**Skeleton.** `bg-surface-muted rounded animate-pulse`.

### Iconography & Imagery

- **Icons:** Lucide React, outline style, 1.5px stroke. Sizes 16, 20, 24px. Icon color follows text color unless emphasized.
- **Illustrations:** Minimal. Optional subtle bubble/water motifs at ~5% opacity as background only. No mascot, no comic-style.
- **Photography:** Always Fellaswimming's own photos (coaches, gallery). No stock photography ever. Natural color, slight warmth, no heavy filters.

### Accessibility Commitments

- WCAG 2.1 AA on all public pages (target Lighthouse a11y ≥ 95)
- Body text contrast ≥ 4.5:1; interactive elements ≥ 3:1
- Focus indicators visible: 2px ring at `--color-primary` 30% opacity
- Minimum touch targets 44x44px on mobile
- All images have meaningful alt text
- Form labels associated; errors announced via `aria-describedby`
- Reduced motion respected (`prefers-reduced-motion: reduce`)
- `<html lang="id">`

### Motion & Interaction

- Default transition: 200ms `cubic-bezier(0.4, 0, 0.2, 1)` (ease-out)
- Modal/drawer reveals: 300ms
- Page-level transitions: 400ms
- Hover: subtle (≤8% lightness shift), no scaling, no rotation
- Active button press: scale to 0.98 on touch only
- Loading: skeleton screens for content; spinner only for transient sub-1s actions
- Animation serves comprehension — never animate for decoration alone

### Hard Bans (do not produce these in hi-fi)

- No `border-left` or `border-right` greater than 1px as a colored accent stripe on cards, lists, callouts, or alerts
- No gradient text (`background-clip: text` + gradient background)
- No glassmorphism (decorative blur + glow borders)
- No cartoon mascots, comic illustrations, neon/rainbow gradients
- No countdown timers, fake urgency, or hard-sell exclamations
- No pure white (`#fff`) or pure black (`#000`) — always tinted
- No center-everything layouts (left-aligned is the brand default)
- No stock photography
- No banned fonts: Plus Jakarta Sans, Inter, Fraunces, Newsreader, Lora, Crimson, Playfair, Cormorant, Syne, IBM Plex (any), Space Mono/Grotesk, DM Sans/Serif, Outfit, Instrument Sans/Serif
