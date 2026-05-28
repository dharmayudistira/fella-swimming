# Fellaswimming — Agent Brief

One-page navigator for coding agents. Detailed specs live in linked docs. Load only the sections relevant to the current task.

## Project

Lead-generation website + admin dashboard for **Fellaswimming**, a swim school in Sidoarjo, Indonesia. Public surfaces serve parents researching swim lessons; admin surfaces serve non-IT staff triaging leads and managing content.

- **Status:** Planning complete via PLAID (2026-05-28). Phase 0 setup next. No production code yet.
- **UI language:** Bahasa Indonesia only (MVP).
- **Primary device:** mobile 360–390px, one-handed, late-evening usage.

## Stack (committed)

- Next.js 16 (App Router) + React 19 + TypeScript (strict)
- Tailwind CSS v4 (CSS-first `@theme`, OKLCH tokens)
- shadcn-ui v4
- Supabase (Postgres + Auth + Storage + RLS) — RLS **on by default**
- TanStack Query v5
- Tiptap 3 (article CMS, admin only)
- Deploy: Vercel (ISR for public surfaces)
- Package manager: **pnpm**

## Read before working

| If you touch... | Open... |
|---|---|
| UI, CSS, component visuals | `.impeccable.md` (rules) + `docs/design/project/<surface>.html` (visual source of truth) |
| Data model, schema, RLS, API | `docs/prd.md` |
| Copy, brand voice, user flows | `docs/product-vision.md` + `.impeccable.md` § Brand Personality |
| What to build next | `docs/product-roadmap.md` (82 tasks across 6 phases) |
| Why a decision was made | `vision.json` (PLAID intake) |

The `docs/design/project/*.html` files are the **visual source of truth**. Recreate them in React/Tailwind; do not copy their internal markup verbatim. `docs/design/project/index.html` is the canvas overview.

## Conventions

### Next.js 16
- Default to **Server Components**. Mark `"use client"` only when state, effects, or browser APIs are required.
- Route Handlers for write endpoints. Server Actions OK for form submissions.
- ISR for public surfaces (landing, artikel). `dynamic = 'force-dynamic'` only for admin.

### Tailwind v4
- Tokens in `@theme { ... }` (CSS), not `tailwind.config.ts`.
- OKLCH per `.impeccable.md` § Color palette.
- Custom utilities via `@utility`. No legacy plugin config.

### Supabase
- **Every table has RLS enabled** in the same migration that creates it.
- Policies tested with anon + authenticated roles before merge.
- Service-role key is **server-only**. Never imported into client bundles.
- Schema changes via migrations (`supabase/migrations/*.sql`). Regenerate types after every migration.

### TanStack Query
- Query keys are arrays of stable serializable values, namespaced by entity (e.g. `['leads', filters]`).
- Mutations invalidate the specific relevant query, not blanket `invalidateQueries()`.
- SSR'd routes hydrate via `dehydrate` + `HydrationBoundary`.

### TypeScript
- Strict mode. No `any`, no `as unknown as X`.
- Supabase types regenerated via `pnpm supabase gen types typescript ...` after every schema change.

## Hard rules (excerpt — full list in `.impeccable.md` § Hard Bans)

- ❌ No `border-left` / `border-right` colored stripe. Sanctioned: **bottom-color border** 4–6px.
- ❌ No gradient text (`background-clip: text`).
- ❌ No decorative glassmorphism. Functional backdrop-blur on sticky chrome only.
- ❌ Banned fonts: Plus Jakarta, Inter, DM Sans, Outfit, IBM Plex, Space Grotesk, Fraunces, Lora, Playfair, etc.
- ✅ Use **General Sans** (heading) + **Nunito** (body) + **JetBrains Mono** (mono).
- ❌ No hard-sell copy ("Buruan!", "Sisa 2 slot", countdown). No fake urgency.
- ❌ No cartoon mascots, neon palettes, rainbow gradients.
- ❌ No center-everything layouts. Left-aligned default. Centering only for daftar wizard, login card, confirmation.
- ❌ No stock photography. Use Fellaswimming photos or placeholder block with mono caption.

## Copy voice (Friendly Guide)

- **Address mix:**
  - Headlines, greetings → "Bunda" / "Ayah"
  - Body, instructions → "kamu"
  - Form labels → neutral ("Masukkan nomor WhatsApp")
- **Forbidden:** "Buruan!", fire emojis, "Kami sangat senang melayani Anda" jargon, mixed "Anda" + "kamu" in same paragraph.
- Full guidance: `.impeccable.md` § Brand Personality.

## Workflow

1. Pick a task from `docs/product-roadmap.md` (checkbox `[ ]`).
2. Read the relevant doc sections per the table above.
3. Implement (small, single-responsibility commits).
4. Update the roadmap checkbox `[ ] → [x]`. The `roadmap-tracker` agent fires automatically; do not skip the update.
5. Commit format: `prefix(scope): message` — see global rules.

## Sub-agents (auto-fire on matching context)

| Agent | Fires when |
|---|---|
| `design-guardian` | UI / CSS / component visual changes — enforces `.impeccable.md` + `docs/design/project/` |
| `supabase-reviewer` | Migration, RLS policy, or schema change — audits security & naming |
| `copy-reviewer` | Bahasa Indonesia copy added or edited — enforces voice & ban list |
| `roadmap-tracker` | Task completed — updates `docs/product-roadmap.md` checkbox |

Agents are proactive: they trigger from matching context, not from explicit invocation. Push back if a finding is wrong — they are not infallible.

## Things NOT in this repo yet

- `package.json`, `app/`, `supabase/`, `pnpm-lock.yaml` — created in Phase 0.
- `docs/prd-design-sections.md` (mentioned in README but file is missing).

## Open questions

- Hosting region for Supabase project (latency from Indonesia).
- Fontshare licensing path for General Sans (`next/font/local` self-host vs Fontshare CDN).
