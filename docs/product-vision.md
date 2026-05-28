# Product Vision — Fellaswimming

## 1. Vision & Mission

### Vision Statement

A Sidoarjo where every parent who cares about their child learning to swim safely can make that decision in an afternoon instead of a month, because one local school has made the entire process honest, transparent, and educational.

### Mission Statement

Fellaswimming runs a content-led website that teaches parents what actually matters in swim education and surfaces every detail of our program up front, so the act of choosing a class becomes a confident decision rather than a guessing game.

### Founder's Why

Fellaswimming is run by a software engineer who is also its owner. Five years of operating the school taught one painful lesson: as long as discovery, comparison, and registration happen in WhatsApp DMs and Excel spreadsheets, every growing month is also a growing operational mess. Leads stall, follow-ups slip, the same questions get asked dozens of times, and parents who are doing their research properly end up frustrated with everyone in the market, including us.

The decision to build the website in-house instead of outsourcing or buying a template is deliberate. A template would force Fellaswimming's voice into a generic mold; an agency would ship something that looks polished but cannot be iterated when the business learns something new about its parents. The founder has 3+ years of professional Next.js and React work, so the cost of building it personally is real time but no learning tax. The cost of NOT building it is another year of WhatsApp-only operations during a period when the business genuinely wants to scale.

The deeper motivation is positioning. Swim schools in Sidoarjo all look interchangeable when their entire online presence is three Instagram slides. The owner has seen, from the inside, how much better the conversation goes when a parent has already read about curriculum, age-readiness, and the difference between class types before they even DM. The website is the medium that turns this conversation from a sales pitch into a partnership.

### Core Values

1. **Show the work, then ask for the click.** Every page should give parents real information before any CTA. If a section cannot be defended as "this helps the parent make a better decision," it gets cut. Marketing copy that exists only to fill space is a value violation.
2. **Write the way Mama Risa talks.** No corporate jargon, no school-marketing buzzwords, no hard-sell exclamations. Bahasa Indonesia that sounds like a friend who has done the research already — warm, specific, and honest about trade-offs.
3. **Ship weekly, even if it is small.** Solo founder, part-time, real business depending on this. Tiny shippable increments beat large unshipped ones. A new artikel published is worth more than a half-done admin feature on a branch.
4. **The admin UI is part of the product.** Staff are not technical. If the admin dashboard is confusing, lead-handling quality drops, and the funnel breaks. Treat operator UX with the same care as visitor UX.
5. **Mobile is the only assumption.** Desktop is a bonus surface for public pages. Every screen, copy length, tap target, and image must be designed for a one-handed Sidoarjo parent scrolling at 22:30 after the kids are asleep.

### Strategic Pillars

1. **Content beats marketing.** Every strategic resource (time, budget, attention) goes to articles, landing-page information depth, and trust-building visuals before paid acquisition. The growth story is "search and share," not "buy attention."
2. **Information transparency is the product.** Class types, pricing per class, coach credentials, schedules, and location must be visible without a DM. If a parent has to ask us a basic question, the website failed.
3. **Mobile-first, always.** When mobile and desktop conflict in design, mobile wins. Desktop is the easier surface and gets the same components scaled up; mobile gets the design budget.
4. **Lead-gen, not e-commerce.** No online payment, no DP, no booking flow. The form's only job is to capture enough context for a confident WhatsApp follow-up. Stay disciplined on this until offline conversion is fully understood.

### Success Looks Like

Twelve months from launch, Fellaswimming is the swim school people in Sidoarjo Google first. Organic search delivers more website traffic than Instagram, and three of the top five Google results for "les renang Sidoarjo" point to either the homepage or a Fellaswimming article. The lead form is the default entry point for new families, with WhatsApp reduced to follow-up rather than discovery. Staff handle 30+ leads per week in the admin dashboard without spreadsheet anxiety. The owner spends weekends writing the next pillar article instead of answering the same five questions in DMs. Fellaswimming's market position is no longer "one of several local schools" but "the one that actually explains things."

---

## 2. User Research

### Primary Persona

**Mama Risa, 38, Sidoarjo.** Married, two children aged 5 and 8, lives in an upper-middle residential cluster. Native Indonesian speaker, conversational English, daily Instagram and WhatsApp user, occasional TikTok scroller. She is not formally employed but runs the household with full ownership of decisions about education, healthcare, and extracurriculars. Her husband approves the budget but defers to her research.

Risa's day starts at 5:30. School drop-off by 7:00, then errands, then an afternoon block when both kids are at school where she answers messages, plans the week, and researches things. The kids come home, there's lunch, homework, and dinner, and only after 21:00 does she have phone time for herself. That is when she opens Instagram, scrolls @keluargakita and a handful of other parenting accounts, and reads anything that looks substantive. She does not respond to ads. She follows brands that consistently teach her something.

She is comfortable with technology in the way most modern parents are — she navigates Tokopedia, Halodoc, Jago, and a dozen school portals without trouble. She is not patient with clunky interfaces. She abandons WhatsApp chats that take more than half a day to get a useful answer. She trusts businesses that show their work; she is suspicious of businesses that hide their pricing or push too hard.

She has been thinking about swim lessons for her 5-year-old for two months. She is stuck because every option looks the same on Instagram and asking around in WhatsApp groups produces five opinions and no actionable comparison. She would switch to the first option that respects her time and answers her real questions.

### Secondary Personas

**Pak Andi, 40, husband and budget approver.** Risa hands him the website link and asks him to look at it before they decide. He spends 8 minutes. He scans the coach section, checks the price page, and looks at the testimonials. If anything looks unprofessional or vague, he asks Risa to keep looking. If everything checks out, he says yes. He needs to feel confident in 8 minutes, on his phone, between meetings.

**Anak Risa, 5 and 8.** They will sit next to mom while she scrolls. They look at the gallery, the coach photos, and whatever video clips exist. Their reaction matters: a kid who says "wah kerennn" makes the decision feel right to Risa. A kid who is bored or scared by the photos undermines the parent-side confidence.

**Bu Sari, Fellaswimming admin staff, 32.** Operates the dashboard daily. Not technical. Comfortable with WhatsApp, basic Excel, and Tokopedia. Needs to see today's incoming leads, mark which ones she has contacted, and write quick notes. If the interface has more than 3 clicks to do any of these things, she will go back to copying lead names into a spreadsheet, and the admin becomes shelfware.

### Jobs To Be Done

**Functional.** When Risa is researching swim lessons, she needs to find a single source of truth for class types, prices, schedules, and coach credentials, so she can compare options without doing comparative spreadsheet work herself. When Andi is approving the decision, he needs to validate the school's credibility in under 10 minutes, so he can trust Risa's recommendation without becoming an expert. When Bu Sari is working the dashboard, she needs to triage incoming leads by status in under 30 seconds per lead, so she can move all leads to "contacted" before lunch.

**Emotional.** Risa wants to feel like a smart parent who made a careful choice, not a tired parent who picked the closest option. Andi wants to feel competent at his approval role without spending hours. Bu Sari wants to feel professional and effective at her job rather than buried in WhatsApp tabs.

**Social.** Risa wants to be the parent in her WhatsApp group who can confidently recommend the school she picked, with a reasoned explanation. Fellaswimming's website becomes the link she shares, and the school's content becomes proof of why her recommendation is credible.

### Pain Points

Ranked by severity for the primary persona:

1. **Information opacity (high severity, every search session).** No school publishes complete class type, pricing, and schedule information up front. Every comparison requires DMing every school, which Risa avoids because the previous five DMs took two days each to resolve. She currently copes by extending her decision timeline indefinitely. Consequence: her child is not enrolled.
2. **Feeling treated as a marketing target (high severity, almost every visit).** Caption tone on swim school Instagram accounts is hard-sell. There is no educational content. Risa, who treats this decision like a healthcare decision, feels disrespected. She currently copes by becoming defensive and skeptical of all options. Consequence: lower trust in everyone, longer decision cycle.
3. **No framework for comparison (medium-high severity, ongoing).** Risa does not know what to look for when comparing schools. She intuits that coach certification matters and class size matters, but she cannot weigh these against each other. She currently copes by asking other parents, which produces conflicting opinions. Consequence: decision paralysis.
4. **Husband-validation friction (medium severity, late in cycle).** When Risa has narrowed down to a candidate, she needs Andi to validate. If the candidate's website is weak or non-existent, Andi cannot do his check, and Risa has to do the explaining herself. She currently copes by re-explaining everything verbally. Consequence: friction in the household-decision step.
5. **Scheduling guesswork (medium severity, per option).** Even after Risa picks a school, she does not know if her preferred slot is available without another DM round. She currently copes by tolerating the back-and-forth. Consequence: she sometimes commits to a school based on info that turns out to be wrong about availability.

### Current Alternatives & Competitive Landscape

**Direct competitors: other swim schools in Sidoarjo with Instagram-only presence.** They show training video clips, post promo announcements, and respond to DMs at unpredictable times. They do well at showing a coach in action and producing social proof through reposts of student videos. They fall short at giving a parent the structured info needed to make a comparison without an opening DM. Switching from them to Fellaswimming requires Fellaswimming to be present where parents already are (Google search and parenting communities) and to be obviously more informative once a parent lands.

**Adjacent tools misused: Google Maps and Instagram explore.** Parents search "les renang Sidoarjo" on Google Maps and get a list of pools and schools with star ratings and photos. The information they want (kurikulum, harga, jadwal) is almost never there. They search the same query on Instagram and get a feed of promo posts. Both tools are doing what they are designed to do; neither was designed to help a parent compare swim schools. Switching requires Fellaswimming to rank in Google and to make its own content sticky enough to share.

**Adjacent tools misused: WhatsApp parenting groups.** Risa asks her circle and gets recommendations colored by personal experience, neighborhood loyalty, and old information. The information is warm but unreliable. Switching requires Fellaswimming to be the link people in those groups share when the question gets asked, which depends on the website being genuinely better to point to than another school's Instagram.

**Manual workaround: hiring a freelance coach at a public pool.** A real fallback for families who give up on swim schools entirely. Cheap, flexible, and personal, but unstructured and dependent on a single coach's competence and availability. Fellaswimming's response is not to compete on price but to show the value of structure and curriculum convincingly enough that the trade-off is clear.

**Do-nothing alternative.** Many families simply wait. The child gets older without lessons. This is the most common outcome of decision paralysis. Fellaswimming's biggest hidden competitor is "next semester."

### Key Assumptions to Validate

1. **We assume Mama Risa is willing to read 2+ articles before deciding to register, because she follows parenting accounts and signals research behavior.** To validate: track session time, scroll depth, and article-to-registration conversion rate in the first 90 days. If most form submissions come from sessions that did not visit any article, the content-led thesis is partially wrong and the landing page may be carrying the entire weight.
2. **We assume "education-led trust" translates into higher conversion than transactional swim school marketing.** To validate: compare conversion rate from organic search and direct visits (where articles are accessible) to conversion from Instagram referral (where the user lands cold). If both convert similarly, education is not pulling its weight.
3. **We assume Sidoarjo parents Google for swim lessons rather than only searching on Instagram.** To validate: track the share of traffic from organic search vs Instagram referral. If Instagram remains 80%+ after six months, the SEO investment needs to be reconsidered or doubled down on.
4. **We assume staff will actually use the admin dashboard instead of reverting to WhatsApp + Excel.** To validate: measure the gap between leads submitted via the form and leads marked "contacted" in the dashboard within the first month. If the gap grows, the admin UX is failing in practice, regardless of how good it looks.
5. **We assume the existing IG/TikTok audience is large enough to seed launch traffic.** To validate: measure the click-through rate when an existing follower sees a cross-post linking to the website. If CTR is very low, the audience overlap with website-readiness is weaker than expected.
6. **We assume parents will share article links in WhatsApp parenting groups.** To validate: track WhatsApp as a referrer in analytics and look at which articles drive shared traffic. If no article gets organic shares in the first 60 days, the content-to-share thesis needs rethinking — possibly the topics or format need adjustment.
7. **We assume Bahasa Indonesia personalized address ("Bunda/Ayah/kamu") feels warm rather than presumptuous to the primary persona.** To validate: gather informal feedback from 5 parents post-trial; watch bounce rates on copy-heavy sections.
8. **We assume the no-payment registration form will not create a perception of "this is not serious" — that a parent will trust a school that does not ask for money up front.** To validate: ask 5 newly registered parents whether the lack of DP felt reassuring or suspicious.

### User Journey Map

**Awareness.** Risa is scrolling Instagram at 21:30 and sees a TikTok or IG reel from Fellaswimming with a hook like "Anak umur berapa idealnya mulai les renang?" The content is interesting, she pauses, and there is a link in bio. Or, separately, she Googles "les renang Sidoarjo" because a friend mentioned needing to find one, and Fellaswimming appears in the top results because of an SEO-optimized article on the same topic. Either way, she clicks.

**Consideration.** She lands on either an article or the homepage. If article, she reads it through (this is the magic moment in the making), then clicks a contextual CTA at the end like "Lihat kelas yang fit untuk anak Anda." If homepage, she sees the tagline, scrolls past hero, lands on the class types section, then the coach section, then sees a soft prompt to learn more in the articles. Either path converges on her having both context (from articles) and concrete information (from homepage) within a single session.

**First Use (magic moment).** Risa finishes an article that explains a framework she did not have before — for example, the difference between private, semi-private, and group lessons and how to think about which fits her shy 5-year-old. She follows the contextual CTA and the homepage answers the questions she just learned to ask. This is the moment of "oh, this is a swim school that gets it." She is now no longer comparing Fellaswimming to other schools on equal footing; Fellaswimming has set the comparison terms.

**Registration.** She decides to register. The 3-step form takes 2-3 minutes on mobile. She submits, gets a confirmation page with what happens next, and waits for the WhatsApp follow-up that the page promised within 24 hours.

**Habit Formation (not a habit in the traditional sense — this is a one-time decision, but a returning relationship).** Risa receives the WhatsApp follow-up from Bu Sari, schedules a trial, brings her child, and registers. Three weeks later, she comes back to the website to read a new article she saw shared in her WhatsApp group, because Fellaswimming has now established itself in her mental model as a source of swim education content, not just the school her kid attends.

**Advocacy.** Two months in, a parent in Risa's group asks for a swim school recommendation. Risa shares the Fellaswimming homepage link with a one-line endorsement. The recipient clicks, lands well, and the cycle repeats. Fellaswimming's growth loop is real.

---

## 3. Product Strategy

### Product Principles

1. **Information first, action second.** Every page leads with what the parent came to learn, then offers an action. Hero sections that pitch before educating violate this principle.
2. **One source of truth per question.** A parent should never have to look in two places to answer the same question. Class type detail lives on one page; coach bios live in one section; pricing lives next to the class it applies to.
3. **The story arc is article → landing → register.** Other paths exist, but the design budget goes to making this one feel inevitable.
4. **Admin is a serious product surface.** No "we'll polish it later." Bu Sari sees the admin every day; visitors see the landing once. Both deserve equal craft.
5. **No fake urgency.** No countdown timers, no "limited slots," no "promo berakhir hari ini." Trust beats urgency, and the brand cannot afford to fake either.
6. **Performance is a feature.** Slow pages on mobile are anti-content. Time-to-first-byte and image weight are reviewed every release.

### Market Differentiation

Other Sidoarjo swim schools win on photogenic Instagram presence and word-of-mouth in immediate neighborhoods. Their content strategy is implicit promotion: post a clip of a kid doing freestyle, caption it with urgency, hope someone DMs. They are not bad at this; some are quite good. But the ceiling of that strategy is shared across the entire market — every school looks more or less like every other school, and the parent's job of comparison is shifted entirely onto the parent.

Fellaswimming's differentiation is not "better marketing." It is a different posture entirely: a school that has decided to be the educator about swim education, not just the provider of it. The articles do the explaining the market is not doing. The landing page provides the structured information that DMs currently extract one painful round-trip at a time. The brand voice treats parents as researchers, not as targets. This posture is defensible because it requires sustained content investment and an internal culture of transparency that is hard to copy on a quarter's notice. A competitor that wants to match the content strategy needs to start writing, and they will be 12 months behind by the time they do.

The risk in this positioning is that it depends on parents actually valuing the content. If the average Sidoarjo parent only ever wanted a video clip and a price, the content investment is wasted. Validation through metrics in the first 90 days is non-negotiable.

### Magic Moment Design

The magic moment is a parent finishing an article and arriving at a landing-page section that directly addresses what they just learned. For this to happen reliably, three conditions must be true.

First, articles must end with a contextual CTA that goes to a specific landing-page anchor, not to the homepage top. An article about "private vs semi vs group" ends with "Lihat kelas yang cocok untuk anak Anda" linking to the Jenis Kelas section. An article about "usia ideal mulai les renang" ends with a CTA to the same section with a relevant filter or note.

Second, the landing-page sections must be discoverable by anchor and visually self-contained. A reader arriving from an article should land in a section that makes sense on its own, with the broader context available by scrolling either direction.

Third, the article-to-landing arrival should be perceptibly fast. If the click takes more than 2 seconds, the moment dissolves. ISR caching on both article and landing-page renders is critical.

The magic moment is achievable in MVP. The article CMS and landing-page section anchors are both in scope. The contextual CTAs are an editorial discipline, not a feature — they need to be in the editorial checklist for every article published.

### MVP Definition — In Scope

**Public surfaces.**

- **Landing page** (`/`): hero section with tagline and primary CTA to register, class types section with pricing per type, coach highlights section (hardcoded), gallery section (hardcoded photos), testimonials carousel (from CMS, featured-only), location section (Google Maps iframe embed), about-us section short, primary CTA repeated near footer. Mobile-first, responsive to desktop.
- **Registration page** (`/daftar`): 3-step wizard form. Step 1: student info (nama, umur, jenis kelamin, level pengalaman). Step 2: class selection (tipe kelas, preferensi jadwal, lokasi). Step 3: parent contact (nama, nomor WhatsApp, optional email, catatan tambahan). Form submission writes to DB and shows confirmation page with display_id and "what happens next" copy.
- **Articles index** (`/artikel`): list of published articles with cover image, title, excerpt, publish date, and reading-time estimate. Paginated or "load more" pattern. SEO meta on the listing page.
- **Article detail** (`/artikel/[slug]`): full article render with Tiptap-produced HTML, cover image, title, author (Fellaswimming Team default), publish date, reading time, and a contextual CTA block at the end. SEO meta with og:image from cover.

**Admin surfaces** (desktop-only, all behind authentication).

- **Login page** (`/login`): email + password, error states, forgot-password link.
- **Forgot password flow** (`/lupa-password`, `/reset-password`): request reset, email link, set new password.
- **Admin home** (`/admin`): overview counters (total leads this month, new leads today, leads pending follow-up), 5 most recent leads with quick-action link, quick links to article CMS and testimoni CMS.
- **Pendaftaran list** (`/admin/pendaftaran`): table of all leads with filter by status (Baru, Dihubungi, Trial, Daftar, Tidak Lanjut), sort by date, search by name or phone. Each row has a button to open a modal.
- **Pendaftaran modal** (component, opens from list): full lead detail in modal, edit status dropdown, internal notes textarea, WhatsApp deep link button (`wa.me/<phone>?text=<template>`), save button.
- **Artikel list** (`/admin/artikel`): table of all articles with status (Draft, Published), sort by date, search by title. Buttons: new article, edit, delete (with confirmation), toggle publish.
- **Artikel editor** (`/admin/artikel/new`, `/admin/artikel/[id]/edit`): title, slug (auto-generated, editable), excerpt, cover image upload, Tiptap rich-text editor with image insertion (uploads to Supabase Storage), category (optional), SEO meta fields, save draft / publish.
- **Testimoni list** (`/admin/testimoni`): table of all testimonials with featured toggle, name, role/relationship, rating, text excerpt, status. Buttons: new, edit, delete.
- **Testimoni editor** (modal or page): name, role, rating, text, optional photo, featured toggle.

**Infrastructure.**

- **Database**: schema for `registrations`, `articles`, `categories`, `testimonials`, `auth.users` (managed by Supabase).
- **Storage**: buckets for `article-images`, `article-covers`, `testimonial-photos`.
- **Auth**: Supabase email+password for admin users, no public auth.
- **RLS**: published articles publicly readable, registrations write-only for anon via service-role server action.
- **Analytics**: Vercel Analytics for basic traffic insight, Plausible considered as alternative.
- **Deploy**: Vercel production + preview, GitHub-connected.

### Explicitly Out of Scope

- **Online payment (DP, registration fee, monthly billing).** Fellaswimming is offline-first. Adding payment is a 3-week scope on its own. Reconsider after launch if cancellation rate or no-show rate justifies a deposit step.
- **Coach CMS with per-coach profile management.** Coaches change rarely; hardcoded in code is acceptable for MVP. Reconsider when there is a planned coach hire pipeline or when coach bios start needing per-class assignment.
- **Class schedule CMS with dynamic availability.** Schedule is stable. Hardcoded is fine. Reconsider when there are 10+ class slots with frequent changes.
- **Email or WhatsApp follow-up automation.** Manual follow-up is the current baseline and is fine to preserve. Reconsider when lead volume passes 50/week and the admin cannot keep up manually.
- **Multi-template WhatsApp picker in the admin modal.** Single template (greeting + intro + ask for trial schedule preference) is enough. Reconsider when multi-stage funnel requires distinct messages per status.
- **Article view-count tracking, content-performance analytics in admin.** Vercel Analytics covers this externally. Reconsider when there is a real content-strategy meeting that needs in-app data.
- **Mobile admin.** Admin staff work from the school's desktop. Mobile admin is a "feels modern" but unused feature. Reconsider only if staff start working remotely.
- **Auto-save in article editor.** Manual save button is enough at MVP. Reconsider after the first time an article is lost.
- **Tag system or category taxonomy beyond a flat category list.** Articles are few. Flat list works. Reconsider at 30+ articles.
- **Public testimoni submission.** Risk of spam, low signal. Manual entry by admin is fine. Reconsider when there is sustained demand from happy parents.
- **Search across articles and pages.** Article count is small. Browse-based discovery is fine. Reconsider at 30+ articles.

### Feature Priority (MoSCoW)

**Must Have (MVP):**
- Landing page with all sections listed above
- 3-step registration page
- Articles index and detail
- Admin auth with email+password and forgot-password
- Admin home overview
- Pendaftaran list with modal actions (status, notes, WhatsApp link)
- Article CMS with Tiptap editor and Supabase Storage uploads
- Testimoni CMS with featured toggle
- RLS for public read / admin write
- Vercel deploy

**Should Have (Phase 2, post-MVP):**
- Email or WhatsApp automated follow-up
- Multi-template WhatsApp picker in admin
- Coach CMS
- Mobile admin views for read-only triage
- In-app article performance analytics

**Could Have (Phase 3+):**
- Online payment (DP)
- Class schedule CMS
- Public testimoni submission with moderation
- Article search
- Article tagging beyond category

**Won't Have (this time):**
- Anything in the "Explicitly Out of Scope" list above
- Native mobile app
- Multi-language support
- Multi-branch / multi-location management

### Core User Flows

**Flow 1: Research-led registration (primary, the magic-moment flow).**

Trigger: Mama Risa Googles or sees an article shared. Steps: clicks link → lands on article → reads through → clicks contextual CTA → arrives at landing-page section → scrolls to confirm fit → clicks "Daftar Sekarang" → completes 3-step form → submits → sees confirmation page. Outcome: lead is in admin queue, parent is in WhatsApp follow-up window. Success criteria: completes in under 8 minutes on mobile end-to-end.

**Flow 2: Direct funnel from Instagram (secondary, high-volume).**

Trigger: Risa sees Fellaswimming post on IG/TikTok with link in bio. Steps: clicks link → lands on landing-page hero → scrolls quickly through key sections → decides → clicks CTA → completes form → submits. Outcome: same as Flow 1 but without the article-mediated trust. Success criteria: completes in under 5 minutes; landing page provides enough information that the lead is not "just curious."

**Flow 3: Admin lead handling (operator).**

Trigger: Bu Sari opens `/admin` in the morning. Steps: sees today's new leads on overview → clicks through to pendaftaran list → opens first lead modal → clicks WhatsApp button (opens WA with template pre-filled) → sends message → returns to modal → updates status to "Dihubungi" → adds note → saves → repeats for next lead. Outcome: all morning leads contacted by lunch. Success criteria: average per-lead handling time under 90 seconds in the dashboard.

### Success Metrics

**Primary metric: Qualified leads submitted per week via the form.** Good: 35/week by month 3. Great: 50/week by month 3. This is the single metric that captures whether the product is doing its job.

**Secondary metrics:**

- **Article-to-form conversion rate.** Good: 4% of article-readers submit the form within the same session or returning session. Great: 8%.
- **Organic search share of traffic.** Good: 25% by month 3. Great: 40% by month 3.
- **Lead-to-trial conversion (offline, tracked in admin).** Good: 40%. Great: 55%.
- **Admin dashboard adoption.** Good: 90% of leads moved to "Dihubungi" within 24 hours. Great: 98% within 12 hours.

**Leading indicators:**

- **Article scroll depth.** Good: median article session reaches 75% depth. Great: 90%.
- **Pages per session.** Good: 2.3. Great: 3.5.
- **Bounce rate on landing.** Good: under 55%. Great: under 40%.

### Risks

1. **Content thesis fails (likelihood: medium, impact: high).** Parents read the articles but do not convert. Mitigation: instrument article-to-form conversion from day one; if low by week 6, run an experiment with a more direct hero CTA bypassing articles.
2. **Solo founder burnout (likelihood: medium, impact: critical).** 10-15 hr/week is real, the school is also running. Mitigation: phase the roadmap so every 2 weeks ships something demoable; if behind schedule, cut Testimoni CMS or simplify the dashboard overview before cutting articles.
3. **Staff do not adopt admin (likelihood: medium, impact: high).** Bu Sari reverts to WhatsApp+Excel. Mitigation: explicit handover and training session at launch; metric to track within the first month; if reverting, simplify or pair-work with staff to understand friction.
4. **SEO investment slow to compound (likelihood: high, impact: medium).** Organic search results take 3-6 months. Mitigation: do not over-rely on SEO for the first 90 days; lean on existing IG/TikTok cross-posting for launch traffic.
5. **Supabase RLS misconfiguration causes data exposure or write failure (likelihood: medium, impact: critical).** Known gotcha with anon INSERT...RETURNING failing without SELECT policy. Mitigation: registration submission uses service-role server client; pre-launch security review of all RLS policies; document expected behavior per table.
6. **Hardcoded coach/gallery becomes a chore as content changes (likelihood: medium, impact: low).** Photos and coach bios are hardcoded for MVP. Mitigation: keep the hardcoded data in a clearly-named JSON file under `src/data/`; revisit after 6 months and graduate to CMS only if change frequency justifies it.
7. **Mobile-first design produces a desktop experience that feels sparse (likelihood: medium, impact: medium).** Designing for mobile and scaling up can produce empty desktop layouts. Mitigation: design desktop variants that use the extra space for parallel content (e.g. coach grid wider, article cards in multiple columns) rather than just stretching.
8. **Vercel + Supabase free tier limits hit at launch traffic spike (likelihood: low, impact: medium).** A viral article could spike traffic past the free tier. Mitigation: monitor; have credit card ready to upgrade Supabase to Pro ($25) if needed without panic; Vercel free generous for content sites.

---

## 4. Brand Strategy

### Positioning Statement

For research-minded parents in Sidoarjo and surrounding areas who want their child to learn to swim safely and structurally, Fellaswimming is the swim school that publishes the information they need to make a confident decision. Unlike Instagram-only swim schools that require a DM to learn anything substantive, Fellaswimming makes its curriculum, coach credentials, schedules, and pricing visible up front and supports the decision with educational content.

### Brand Personality

Fellaswimming is the friend who happens to know a lot about swim education for kids. Not the friend who lectures, not the friend who hard-sells, but the friend who, when you mention you are looking, sends you a thoughtful message that explains how she thought about it for her own kid. She speaks Bahasa Indonesia natively, comfortably mixes "Bunda/Ayah" with "kamu," and is allergic to both corporate jargon and over-the-top cuteness.

If she were giving a presentation, she would skip the title slide and go straight to the question the audience came in with. If she were writing an email, she would lead with the answer and then explain. If she were designing a flyer, she would print fewer words at a larger size. She would never use a fire emoji or "BURUAN!" She would never end a sentence with three exclamation marks. She would also never speak in passive-voice formal Indonesian that sounds like a school memo. She is warm, but she does not waste anyone's time.

### Voice & Tone Guide

The voice is constant across the site. Tone shifts based on context.

| Context | DO | DON'T |
|---|---|---|
| Onboarding the homepage hero | "Belajar berenang dengan tenang, terstruktur, dan dipandu pelatih berpengalaman." | "BURUAN DAFTAR KELAS RENANG TERBAIK DI SIDOARJO!!! 🔥🏊" |
| Error state on form | "Form belum lengkap. Cek bagian Kontak ya, Bunda/Ayah." | "Error: Field is required." |
| Empty state on admin list | "Belum ada pendaftaran baru hari ini. Cek lagi nanti sore." | "No data found." |
| Success message after form submit | "Pendaftaran terkirim! Tim Fellaswimming akan WhatsApp kamu dalam 1x24 jam." | "Submission successful. Thank you for your patience." |
| Marketing copy in article | "Pertanyaan paling sering kami dengar dari orang tua: kapan anak siap mulai les renang? Jawaban singkatnya: tergantung. Jawaban panjangnya, di bawah." | "Discover the optimal age for your child's aquatic journey with Fellaswimming's expert insights." |

### Messaging Framework

**Tagline:** Sekolah renang paling informatif di Sidoarjo — keluarga belajar dulu, baru daftar dengan yakin.

**Homepage headline (hero):** Belajar berenang dengan tenang, terstruktur, dan dipandu pelatih berpengalaman.

**Value propositions (3):**

1. **Informasi lengkap, tanpa harus DM.** Semua jenis kelas, harga, jadwal, dan profil pelatih ada di sini.
2. **Konten yang bantu Bunda/Ayah riset matang.** Artikel praktis tentang umur, jenis kelas, dan apa yang harus dicari di sekolah renang.
3. **Pendaftaran 3 menit, tindak lanjut via WhatsApp.** Tanpa form panjang, tanpa bayar di muka.

**Feature descriptions (sample):**

- *Jenis Kelas:* "Tiga tipe kelas: Privat (1 anak, 1 pelatih), Semi-Privat (2-3 anak, 1 pelatih), dan Grup (4-6 anak, 1-2 pelatih). Tiap tipe punya tujuan dan pace yang berbeda. Kelas mana yang paling cocok untuk anak kamu, jelas dibedah di artikel."
- *Profil Pelatih:* "Pelatih kami punya sertifikasi resmi dan rata-rata 3+ tahun ngajar anak. Lihat siapa yang akan ajak anak kamu belajar."
- *Lokasi:* "Kolam di [lokasi], 5 menit dari [landmark]. Parkir luas, ruang tunggu nyaman untuk orang tua."

**Objection handlers:**

- "Kenapa harus daftar di website, bukan langsung WA?" → "Karena di website kamu bisa lihat semua opsi dan pilih yang paling fit dulu — biar pas WA, kita langsung bahas detail yang relevan, bukan tanya dari nol."
- "Apa bedanya Fellaswimming dengan les renang lain?" → "Selain pelatih dan kurikulum, kami terbuka soal semua info. Coba bandingin, deh."
- "Anak saya takut air, masih bisa ikut?" → "Bisa. Kelas Privat kami khusus dirancang untuk anak yang butuh adaptasi dulu. Pelatih sabar, satu-satu."

### Elevator Pitches

**5-second:** Sekolah renang Sidoarjo yang publish info lengkap dan artikel edukasi, biar orang tua bisa pilih kelas dengan yakin.

**30-second:** Di Sidoarjo, hampir semua les renang cuma pasif di Instagram dengan info berserakan. Orang tua harus DM tiap sekolah satu-satu cuma untuk tau harga, jadwal, atau profil pelatih. Fellaswimming beda: kami buka semua info di website, plus tulis artikel praktis soal bagaimana memilih les renang yang tepat. Orang tua bisa riset dengan tenang sebelum daftar, dan begitu daftar, tindak lanjut via WhatsApp jadi singkat dan jelas.

**2-minute:** Saya pemilik Fellaswimming, sekolah renang di Sidoarjo yang sudah jalan 5 tahun. Tahun ini saya putuskan profesionalisasi semua operasional, dimulai dari website. Alasannya sederhana: setiap bulan bisnis ini tumbuh, tapi operasional masih manual via WhatsApp dan Excel. Lead nyangkut, follow-up keteteran, orang tua harus tanya hal yang sama berulang-ulang. Saya juga lihat pola yang lebih besar di pasar: hampir semua les renang Sidoarjo cuma pasif di sosmed, jadi orang tua yang serius riset pun frustrasi. Saya bangun Fellaswimming.com dengan filosofi yang beda: education-led trust. Landing page yang informatif, artikel edukatif yang bantu orang tua paham kerangka pengambilan keputusan, dan pendaftaran 3-langkah yang bisa selesai di HP dalam 3 menit. Untuk staff internal ada dashboard admin yang mudah dipakai, tanpa training. Kebetulan saya juga software engineer dengan 3+ tahun pengalaman frontend, jadi saya bangun ini sendiri — bukan template, bukan agency. Targetnya: 6 bulan, organic search jadi sumber traffic utama, dan Fellaswimming jadi referensi swim education di Sidoarjo. Yang saya butuhkan sekarang: feedback dari ortu yang mau coba, sebagai sample 10 pertama.

### Competitive Differentiation Narrative

The competitive landscape in Sidoarjo is structurally uniform: every swim school has chosen the same playbook — Instagram posts of student training clips, hard-sell captions, DMs as the booking channel. They differentiate on the surface (which pool, which coach, which posting frequency), but they compete on the same terms. The parent's job of comparison is unsolved across the entire market.

Fellaswimming opts out of competing on those terms. The strategy is to be the only school visible in a different surface (Google), through a different format (long-form articles), with a different posture (educator). This is not a feature competitors can copy with a new post; matching it requires a content strategy, an editorial cadence, a website that compounds over time, and a willingness to give value before asking for the click. By the time a competitor decides to build that, Fellaswimming has 12 months of compounded SEO and brand recall.

Defensibility is built into the strategy. The articles, once published, continue earning traffic. The website, once trusted, continues to be shared. The brand voice, once established, becomes the reference parents quote when asked. Fellaswimming wins by being early to a strategy that the market has not yet recognized as available.

### Brand Anti-Patterns

- **Never use generic stock photos of happy children swimming.** Use Fellaswimming's own photos — even if amateur, they signal authenticity. If photo quality is the concern, shoot fresh photos at the school; do not buy stock.
- **Never use hard-sell exclamations.** No "BURUAN!", no "Promo terbatas!", no "Jangan sampai kelewat!", no fire emojis, no countdown timers, no fake urgency of any kind.
- **Never use formal corporate Indonesian.** Phrases like "Kami sangat senang bisa melayani Anda" or "Dengan hormat" do not belong on this site. The voice is a friend, not a customer service form letter.
- **Never force a DM for basic information.** If a piece of information (price, schedule, location, coach name) is missing from the website, that is a website failure, not a feature.
- **Never use cartoon water mascots, comic-style illustrations, or rainbow gradients.** Soft Aquatic is a quiet visual language, not a children's TV show palette.
- **Never use jokey emojis in instructional copy.** Functional copy (form labels, error messages, instructions) is emoji-free. Emojis can appear in marketing copy sparingly and always serve a purpose.
- **Never use patronizing parent-targeted copy.** "Ayo Bunda, jangan ragu lagi!" is condescending. Parents are adults making a careful decision.
- **Never use clinical white-coat photography.** This is not a medical brand. Warm, candid photos of coaches with kids, in the pool environment, communicate the right professionalism.
- **Never use heavy academic serif body text.** Body text is sans-serif. Serifs, if used at all, are for editorial headings, never for paragraph content.
- **Never write dense paragraphs without breaks.** Mobile readability dies after 4 lines of unbroken text. Use shorter paragraphs, more whitespace, occasional pull quotes in articles.
- **Never use top-down educator tone.** No "Dalam kajian kami...", no "Berdasarkan penelitian...", no "Para ahli berpendapat...". The voice teaches by sharing experience, not by claiming authority.

---

## 5. Design Direction

### Design Philosophy

1. **Readability is the primary aesthetic.** This is a content site for parents reading on phones in low light. Type size, line height, contrast, and whitespace are tuned for sustained reading before they are tuned for visual flourish.
2. **The page is a guided scroll, not a dense dashboard.** Public surfaces have one purpose per section, generous vertical rhythm, and clear stopping points. Information density is the wrong metaphor; pace is the right one.
3. **Soft, not sterile.** The brand is warm, not minimalist-cold. Visual softness comes from rounded corners, gentle shadows, slightly off-white backgrounds, and small playful details. Avoid the visual coldness of pure white + sharp corners.
4. **Admin is data-first.** The admin philosophy inverts the public one: density is OK, table-first layouts are fine, fewer visual flourishes, faster scan. Bu Sari processes leads, she doesn't browse.

### Visual Mood

Soft Aquatic with editorial structure. Think of a parenting magazine that decided to be a website. Colors evoke water and sun: cool sky blues and soft turquoises against warm sandy beige, with a soft coral that signals "this is a friendly place, not a clinic." Typography is rounded and unintimidating but disciplined enough for long-form articles. Energy is calm and inviting — closer to Headspace and Notion than to Duolingo. Reference brands the audience recognizes: @keluargakita's warmth, Halodoc's clarity, Notion's spacing discipline. Avoid Disney-bright kids-brand visuals; avoid corporate-blue health-tech visuals.

### Color Palette

All colors specified as OKLCH per Tailwind v4 best practice, with hex fallback for reference. CSS variables follow Tailwind v4 `@theme` naming. Light mode primary; dark mode considered as Phase 2.

**Brand colors.**

| Token | Hex (approx) | OKLCH | CSS Variable | Use |
|---|---|---|---|---|
| Primary (Sky) | `#0EA5E9` | `oklch(0.71 0.14 230)` | `--color-primary` | Main brand color, primary buttons, key links, focus rings |
| Primary Hover | `#0284C7` | `oklch(0.62 0.15 230)` | `--color-primary-hover` | Button hover states |
| Secondary (Turquoise) | `#14B8A6` | `oklch(0.73 0.13 184)` | `--color-secondary` | Secondary accents, supporting elements, info badges |
| Accent (Coral) | `#FB7185` | `oklch(0.72 0.16 15)` | `--color-accent` | Warmth touches, featured testimonial highlight, soft callouts |

**Neutrals.**

| Token | Hex (approx) | CSS Variable | Use |
|---|---|---|---|
| Background (Sand) | `#FAF8F5` | `--color-background` | Body background |
| Surface | `#FFFFFF` | `--color-surface` | Cards, modals, elevated areas |
| Surface Muted | `#F5F1EC` | `--color-surface-muted` | Subtle section backgrounds |
| Border | `#E7E2DA` | `--color-border` | Default borders |
| Foreground (Text) | `#1A2332` | `--color-foreground` | Primary text |
| Foreground Muted | `#5C6573` | `--color-foreground-muted` | Secondary text, captions |
| Foreground Subtle | `#8C95A3` | `--color-foreground-subtle` | Placeholders, tertiary text |

**Semantic colors.**

| Token | Hex | CSS Variable | Use |
|---|---|---|---|
| Success | `#10B981` | `--color-success` | Successful registration, status badges |
| Warning | `#F59E0B` | `--color-warning` | Cautions, pending status |
| Error | `#EF4444` | `--color-error` | Form validation errors, destructive confirms |
| Info | `#3B82F6` | `--color-info` | Informational banners |

**Dark mode considerations (Phase 2).** Invert background and foreground; reduce saturation of primary and secondary by ~10%; keep accent at full saturation for moments of warmth. Not in MVP scope.

### Typography

**Heading: General Sans (Fontshare).** A geometric humanist sans-serif with character and personality, free via Fontshare. Picked specifically to avoid the AI-monoculture default of Plus Jakarta Sans / Inter / DM Sans — General Sans carries more individuality without sacrificing readability. Weights to load: 500, 600, 700.

**Body: Nunito (Google Fonts).** Rounded humanist sans-serif, very readable on mobile, friendly tone. Matches the Soft Aquatic + Friendly Guide brief (peer-parent warmth, not corporate stiffness). Weights to load: 400, 500, 600, 700.

**Mono: JetBrains Mono (Google Fonts).** For code samples in articles (if any), display_id rendering, technical labels. Weights: 400, 500.

**Font picks rationale (vs. initial reflex picks):** Plus Jakarta Sans and Inter were initially considered for their broad familiarity, but both are on the `/impeccable` reflex-fonts-to-reject list — they create monoculture across AI-generated projects. General Sans + Nunito provide stronger brand individuality while remaining freely available, readable, and well-supported.

**Type scale.** Base 16px, modular scale of 1.25.

| Token | Size (rem) | Px | Use | CSS Variable |
|---|---|---|---|---|
| Display | 3.815rem | 61px | Hero headlines (desktop) | `--font-size-display` |
| H1 | 3.052rem | 49px | Page titles | `--font-size-h1` |
| H2 | 2.441rem | 39px | Section headings | `--font-size-h2` |
| H3 | 1.953rem | 31px | Subsection headings | `--font-size-h3` |
| H4 | 1.563rem | 25px | Card titles | `--font-size-h4` |
| H5 | 1.25rem | 20px | Small headings | `--font-size-h5` |
| Body | 1rem | 16px | Default body | `--font-size-body` |
| Small | 0.875rem | 14px | Captions, helper text | `--font-size-small` |
| XS | 0.75rem | 12px | Micro labels | `--font-size-xs` |

**Line heights.** Headings: 1.2. Body: 1.6. Small: 1.5. Article paragraphs specifically: 1.7 for sustained reading.

**Mobile scale.** Reduce display and h1 by one step on viewports under 768px (display becomes 3.052rem, h1 becomes 2.441rem). All other sizes unchanged.

### Spacing & Layout

**Base unit: 4px.** All spacing is a multiple of 4. This gives a consistent rhythm and snaps cleanly to mobile pixel grids.

**Scale.**

| Token | Px | rem |
|---|---|---|
| 0 | 0 | 0 |
| 1 | 4 | 0.25 |
| 2 | 8 | 0.5 |
| 3 | 12 | 0.75 |
| 4 | 16 | 1 |
| 6 | 24 | 1.5 |
| 8 | 32 | 2 |
| 12 | 48 | 3 |
| 16 | 64 | 4 |
| 24 | 96 | 6 |
| 32 | 128 | 8 |
| 48 | 192 | 12 |

**Section spacing.** Minimum 64px between major sections on mobile, 96px on desktop. Inside sections, 24-32px between blocks, 12-16px between related items.

**Max content width.** Article body: 65ch (~720px) for readability. Landing-page sections: 1280px max with 24px horizontal padding on mobile, 48px on tablet, 64px on desktop. Admin tables: full width with padding.

**Grid.** 12-column on desktop with 24px gutters. Cards in galleries: 2-column on mobile, 3-column on tablet, 4-column on desktop.

**Breakpoints (Tailwind defaults).**

| Token | Min width |
|---|---|
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |
| 2xl | 1536px |

### Component Philosophy

**Border radius.** Default: 12px (`--radius`) for cards, modals, large surfaces. Small: 8px for buttons, inputs, badges. Large: 16px for hero callouts. Pill: 9999px for status badges and chips. Avoid sharp corners entirely; even input fields get a slight rounding.

**Shadows.** Three levels.

- `--shadow-sm`: `0 1px 2px rgba(15, 23, 42, 0.04), 0 1px 1px rgba(15, 23, 42, 0.04)` — subtle elevation on cards.
- `--shadow-md`: `0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.04)` — modals, dropdowns.
- `--shadow-lg`: `0 10px 15px -3px rgba(15, 23, 42, 0.08), 0 4px 6px -4px rgba(15, 23, 42, 0.06)` — popovers, hero callouts on hover.

**Borders.** Subtle. Default 1px solid `--color-border`. Avoid heavy borders; rely on shadows or background contrast to define edges.

**Buttons.** Three variants.

- **Primary**: `--color-primary` background, white text, 8px radius, 12px vertical / 24px horizontal padding, 500 weight, hover state shifts to `--color-primary-hover`, focus ring at `--color-primary` with 30% opacity.
- **Secondary**: `--color-surface` background, `--color-foreground` text, 1px border at `--color-border`, hover background `--color-surface-muted`.
- **Ghost**: transparent background, `--color-primary` text, no border, hover background `--color-primary` at 8% opacity.

**Inputs.** 1px border `--color-border`, 8px radius, 12px vertical padding, 16px font, focus ring matches primary with 30% opacity. Label above input, small helper text below.

**Cards.** Surface background, 12px radius, `--shadow-sm` default, optional hover state with `--shadow-md` lift on interactive cards.

### Iconography & Imagery

**Icons.** Lucide React icon set (open-source, consistent, paired with shadcn-ui). Outline style by default, 1.5px stroke. Sizes: 16, 20, 24px. Icon color follows text color unless emphasized (primary or accent).

**Illustrations.** Minimal. Subtle bubble or water motifs as background patterns at very low opacity (~5%), purely decorative. No character illustrations. No mascot. If a section needs visual support, prefer a real photo.

**Photography direction.** Always Fellaswimming's own photos. Coach photos shot in or near the pool, in coaching action when possible, candid rather than posed studio shots. Gallery photos show pool environment, kids in lessons (with consent), facilities. Avoid stock photography entirely. Photo treatment: natural color, slight warmth in white balance, no heavy filters.

**Avoid.** Stock-library happy-family photos. AI-generated illustrations of children. Heavy-handed Photoshop. Anything that signals "we bought this from Shutterstock."

### Accessibility Commitments

- **WCAG 2.1 Level AA minimum across all public pages.**
- **Text contrast ratio: 4.5:1 minimum for body text against background.** Primary text (`#1A2332` on `#FAF8F5`) far exceeds this.
- **Interactive contrast: 3:1 minimum for buttons, focus indicators, form borders.**
- **Focus indicators visible on all interactive elements.** 2px ring at `--color-primary` 30% opacity, offset 2px from the element.
- **Touch targets minimum 44x44px** on mobile (Apple HIG standard). Buttons, links in nav, form controls.
- **Skip-to-content link** at the top of every public page for keyboard users.
- **Semantic HTML.** `<main>`, `<nav>`, `<article>`, `<section>` used correctly. Landing page is one `<main>` with multiple `<section>` blocks.
- **Image alt text.** All meaningful images have descriptive alt text. Decorative images use `alt=""`.
- **Form labels.** Every input has an associated `<label>`. Errors are announced via `aria-live` regions and `aria-describedby`.
- **Reduced motion.** Respect `prefers-reduced-motion: reduce` — disable parallax, marquee, and non-essential transitions.
- **Language attribute.** `<html lang="id">` on all pages.

### Motion & Interaction

**Defaults.** Transition duration 200ms for hovers and small state changes; 300ms for modals, drawers, and larger reveals; 400ms for page-level transitions. Easing: cubic-bezier(0.4, 0, 0.2, 1) — the standard ease-out for forward motion.

**Hover.** Subtle. Buttons darken on hover by ~8% lightness. Cards optionally lift via shadow change. No scaling, no rotation, no dramatic shifts.

**Focus.** Always visible. 2px ring at `--color-primary` 30% opacity. Never `outline: none` without a replacement focus style.

**Active.** Slight scale down to 0.98 on button press for tactile feedback. Only on touch surfaces.

**Loading states.** Skeleton screens for content sections during initial load (articles list, admin tables). Spinner only for transient actions under 1 second (form submission button). Never an indeterminate spinner blocking the entire page.

**Animation philosophy.** Motion serves comprehension. Modals slide in from a direction, list items can stagger in on first load, but animations do not exist for their own sake. Reduced motion turns off all non-essential motion.

### Design Tokens

Consolidated single-source-of-truth for implementation. All tokens map to Tailwind v4 `@theme` block in `src/app/globals.css`.

| Category | Token | CSS Variable | Tailwind Class | Value |
|---|---|---|---|---|
| Color | Primary | `--color-primary` | `bg-primary`, `text-primary` | `oklch(0.71 0.14 230)` |
| Color | Primary Hover | `--color-primary-hover` | `bg-primary-hover` | `oklch(0.62 0.15 230)` |
| Color | Secondary | `--color-secondary` | `bg-secondary`, `text-secondary` | `oklch(0.73 0.13 184)` |
| Color | Accent | `--color-accent` | `bg-accent`, `text-accent` | `oklch(0.72 0.16 15)` |
| Color | Background | `--color-background` | `bg-background` | `#FAF8F5` |
| Color | Surface | `--color-surface` | `bg-surface` | `#FFFFFF` |
| Color | Surface Muted | `--color-surface-muted` | `bg-surface-muted` | `#F5F1EC` |
| Color | Border | `--color-border` | `border-border` | `#E7E2DA` |
| Color | Foreground | `--color-foreground` | `text-foreground` | `#1A2332` |
| Color | Foreground Muted | `--color-foreground-muted` | `text-foreground-muted` | `#5C6573` |
| Color | Foreground Subtle | `--color-foreground-subtle` | `text-foreground-subtle` | `#8C95A3` |
| Color | Success | `--color-success` | `text-success`, `bg-success` | `#10B981` |
| Color | Warning | `--color-warning` | `text-warning`, `bg-warning` | `#F59E0B` |
| Color | Error | `--color-error` | `text-error`, `bg-error` | `#EF4444` |
| Color | Info | `--color-info` | `text-info`, `bg-info` | `#3B82F6` |
| Typography | Heading font | `--font-heading` | `font-heading` | `"General Sans", sans-serif` |
| Typography | Body font | `--font-body` | `font-body` | `"Nunito", sans-serif` |
| Typography | Mono font | `--font-mono` | `font-mono` | `"JetBrains Mono", monospace` |
| Spacing | 1 | `--space-1` | `p-1`, `m-1`, `gap-1` | `0.25rem` |
| Spacing | 2 | `--space-2` | `p-2`, `m-2`, `gap-2` | `0.5rem` |
| Spacing | 4 | `--space-4` | `p-4`, `m-4`, `gap-4` | `1rem` |
| Spacing | 6 | `--space-6` | `p-6`, `m-6`, `gap-6` | `1.5rem` |
| Spacing | 8 | `--space-8` | `p-8`, `m-8`, `gap-8` | `2rem` |
| Spacing | 12 | `--space-12` | `p-12`, `m-12`, `gap-12` | `3rem` |
| Spacing | 16 | `--space-16` | `p-16`, `m-16`, `gap-16` | `4rem` |
| Spacing | 24 | `--space-24` | `p-24`, `m-24`, `gap-24` | `6rem` |
| Radius | Small | `--radius-sm` | `rounded-sm` | `8px` |
| Radius | Default | `--radius` | `rounded` | `12px` |
| Radius | Large | `--radius-lg` | `rounded-lg` | `16px` |
| Radius | Full | `--radius-full` | `rounded-full` | `9999px` |
| Shadow | Small | `--shadow-sm` | `shadow-sm` | `0 1px 2px rgba(15,23,42,0.04), 0 1px 1px rgba(15,23,42,0.04)` |
| Shadow | Medium | `--shadow-md` | `shadow-md` | `0 4px 6px -1px rgba(15,23,42,0.06), 0 2px 4px -2px rgba(15,23,42,0.04)` |
| Shadow | Large | `--shadow-lg` | `shadow-lg` | `0 10px 15px -3px rgba(15,23,42,0.08), 0 4px 6px -4px rgba(15,23,42,0.06)` |
| Transition | Fast | `--ease-fast` | `transition duration-200` | `200ms cubic-bezier(0.4,0,0.2,1)` |
| Transition | Default | `--ease-default` | `transition duration-300` | `300ms cubic-bezier(0.4,0,0.2,1)` |
| Transition | Slow | `--ease-slow` | `transition duration-400` | `400ms cubic-bezier(0.4,0,0.2,1)` |
