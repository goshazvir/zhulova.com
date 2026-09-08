# EN Reiki Riviera — Implementation Task Plan

> **Prototype (SINGLE SOURCE OF TRUTH):** `/Users/george_pc2/Desktop/reiki-riviera-prototype-v2.html`
> **Articles data:** `/Users/george_pc2/Desktop/reiki-riviera-journal/articles.json` (54 articles)
> **Branch:** `feature/en-reiki-section` off `master`
> **Critical:** ALL texts are finalized — take as-is from prototype. No 🇺🇦 link in footer. No language switcher.

---

## Group 1 — Architecture (Layouts, Routing, Theme)

### T1.1 · Create EN Base Layout
**Files:** `src/layouts/EnBaseLayout.astro`
**Depends on:** nothing
**Details:**
- New layout for all EN pages. Do NOT modify existing `BaseLayout.astro`.
- `<html lang="en">` (existing UK layout uses `lang="uk"`)
- Load EN-specific fonts: Cormorant Garamond (300,400,500,600 + italic), Inter (300,400,500,600), Noto Serif JP (700) — from prototype `<link>` tags
- CSS custom properties from prototype `:root` block (--midnight, --deep, --surface, --gold, --sage, --text, --serif, --sans, --jp, --wrap, --section-pad — full set from lines 17-52 of prototype)
- Dark theme: `body { background: var(--midnight); color: var(--text); }` — the EN site is DARK (not cream), matching prototype exactly
- Include hreflang tags (see T5.1)
- Include JSON-LD slot for per-page structured data (see T5.2)
- Include Vercel Analytics + SpeedInsights (same as UK layout)
- Include `<AnalyticsScripts />` for GA4/Meta Pixel
- OG tags with `og:locale` set to `en_US`
- NO promo modal (EN pages don't need the gift bot)
- Props: `title`, `description`, `image?`, `canonical?`, `noindex?`, `jsonLd?`
**Verify:** Renders blank dark page at correct color; view-source shows `lang="en"`, correct fonts preloaded

### T1.2 · Create EN CSS theme file
**Files:** `src/styles/en-reiki.css`
**Depends on:** nothing
**Details:**
- Extract ALL CSS from prototype (lines 11-1194) into a dedicated stylesheet
- Organize by section: base → header → hero → cities → sections → recognition → outcomes → reiki-stage → about → session-flow → packages → testimonials → quote → faq → booking → journal → footer → animations
- Convert to work with Astro's scoped styles OR as a global import in EnBaseLayout
- Keep all media queries, hover states, transitions exactly as prototype
- Include `@keyframes marquee` for cities band
- Include `.fade-up` / `.visible` animation classes
- Include `prefers-reduced-motion` respect
- DO NOT use Tailwind for EN pages — prototype uses custom CSS with CSS variables; mixing would create maintenance hell. Use the prototype CSS as-is.
**Verify:** All prototype CSS classes available when imported

### T1.3 · Create EN routing structure (empty pages)
**Files:**
- `src/pages/en/index.astro` → `/en/`
- `src/pages/en/about.astro` → `/en/about/`
- `src/pages/en/journal/index.astro` → `/en/journal/`
- `src/pages/en/journal/[slug].astro` → `/en/journal/[slug]/`
- `src/pages/en/privacy-policy.astro` → `/en/privacy-policy/`
- `src/pages/en/reiki-cannes.astro` → `/en/reiki-cannes/`
- `src/pages/en/reiki-nice.astro` → `/en/reiki-nice/`
- `src/pages/en/reiki-antibes.astro` → `/en/reiki-antibes/`
- `src/pages/en/reiki-monaco.astro` → `/en/reiki-monaco/`
- `src/pages/en/reiki-saint-tropez.astro` → `/en/reiki-saint-tropez/`
- `src/pages/en/reiki-french-riviera.astro` → `/en/reiki-french-riviera/`
**Depends on:** T1.1
**Details:**
- Each page uses `EnBaseLayout` with placeholder content
- Confirm Astro file-based routing generates correct URLs
- No `en/` prefix in nav links — all internal EN links use `/en/...` absolute paths
- 6 geo pages are thin SEO pages (content reworded per city, linking back to main landing)
**Verify:** `npm run build` succeeds; all routes appear in build output

### T1.4 · Add articles.json to project data
**Files:** `src/data/en-journal-articles.json`
**Depends on:** nothing
**Details:**
- Copy `/Users/george_pc2/Desktop/reiki-riviera-journal/articles.json` into project
- 54 articles total; each has: `slug`, `title`, `meta_title`, `meta_description`, `keyword`, `tag`, `cta`, `read`, `body` (markdown)
- Add `publishDate` field to each article:
  - First 8 articles: publishDate = launch date (immediate)
  - Remaining 46: 1 per weekday starting day after launch (skip weekends)
- Create TypeScript type: `src/types/article.ts`
  ```typescript
  export interface Article {
    slug: string;
    title: string;
    meta_title: string;
    meta_description: string;
    keyword: string;
    tag: string;
    cta: string;
    read: string;
    body: string;
    publishDate: string; // ISO date
  }
  ```
- Create helper `src/lib/articles.ts`:
  - `getPublishedArticles()` — filters by `publishDate <= today`
  - `getArticleBySlug(slug)` — single article lookup
  - `getAllSlugs()` — for static path generation (only published)
**Verify:** TypeScript compiles; helper functions return correct counts

### T1.5 · Configure sitemap for EN pages
**Files:** `astro.config.mjs`
**Depends on:** T1.3
**Details:**
- Astro sitemap integration already installed
- Verify EN pages appear in generated sitemap.xml
- If customization needed, add `customPages` or filter config
- Ensure journal articles with future publishDate are NOT in sitemap
**Verify:** Build → check `dist/sitemap-*.xml` includes `/en/`, `/en/about/`, `/en/journal/`, published article URLs

---

## Group 2 — Components

### T2.1 · EN Header component
**Files:** `src/components/en/EnHeader.astro`
**Depends on:** T1.2
**Details:**
- Sticky header, transparent → blur on scroll (from prototype lines 77-178)
- Brand: `Viktoria <em>Zhulova</em>` (gold "Zhulova") linking to `/en/`
- Nav links (desktop ≥1024px): About, Results, Reiki, Packages, FAQ, Journal — anchor links `#about`, `#outcomes`, `#reiki`, `#packages`, `#faq`, `#journal`
- Gold CTA button: "Book" → `#book`
- Hamburger menu (mobile <1024px) → opens mobile nav overlay
- NO language switcher anywhere in header
- Scroll behavior: `header.classList.toggle('scrolled', window.scrollY > 40)` — use inline `<script>` tag
**Verify against prototype:** Font sizes, letter-spacing, colors, hover effects match exactly

### T2.2 · EN Mobile Nav component
**Files:** `src/components/en/EnMobileNav.astro`
**Depends on:** T1.2
**Details:**
- Full-screen overlay (fixed, inset 0, z-200, midnight background)
- Links: About, Results, What is Reiki, Packages, FAQ, Journal, "Book a session" (gold)
- Close button (×) top-right
- Each link closes menu on click
- Serif font, 28px, weight 300
**Verify against prototype:** Visual match on mobile viewport

### T2.3 · Cities Marquee component
**Files:** `src/components/en/CitiesMarquee.astro`
**Depends on:** T1.2
**Details:**
- Infinite horizontal scroll animation (CSS `@keyframes marquee`, 60s linear)
- Cities: Saint-Tropez · Cannes · Mougins · Antibes · Cap d'Antibes · Juan-les-Pins · Nice · Villefranche-sur-Mer · Beaulieu-sur-Mer · Saint-Jean-Cap-Ferrat · Èze · Monaco · Menton · Saint-Paul-de-Vence · Côte d'Azur
- Duplicated track for seamless loop
- Fade gradients on left/right edges
- Gold dots as separators
- `prefers-reduced-motion: reduce` → static display
**Verify against prototype:** Animation speed, font size, colors match

### T2.4 · Hero section component
**Files:** `src/components/en/EnHero.astro`
**Depends on:** T1.2
**Details:**
- Full viewport height, flex centered
- 2-column grid on ≥960px (1.1fr / 0.9fr)
- Left column: eyebrow ("Reiki on the French Riviera" with gold line), name (Cormorant Garamond, clamp 42-80px), role, offer text (with `<strong>` gold highlights), subtitle, CTA buttons
- Right column: photo placeholder (3:4 aspect, surface bg, border), gold accent line at bottom
- Stats grid: 2×2 under photo — "Usui Reiki Level I & II", "10+ years", "Cannes", "English"
- Ambient gradient overlay (gold radial, top-right)
- CTAs: "Book a private session →" (gold filled) + "See packages" (outline with underline)
- ALL TEXT exactly from prototype lines 1232-1254
**Verify against prototype:** Layout, typography scale, stats grid appearance

### T2.5 · Recognition section component
**Files:** `src/components/en/RecognitionSection.astro`
**Depends on:** T1.2
**Details:**
- Section label: "If this is familiar"
- Title: "You have built a life here. Some part of you hasn't quite arrived yet."
- Lead text about nervous system
- 4 pain-point cards in 2-col grid (≥768px), gold left border, hover effect
- Numbered 01-04
- Text exactly from prototype lines 1266-1279
**Verify against prototype:** Card spacing, border color, hover state

### T2.6 · Outcomes section component
**Files:** `src/components/en/OutcomesSection.astro`
**Depends on:** T1.2
**Details:**
- Section label: "What clients came with"
- Title: "And what shifted after the sessions"
- Lead text
- 7 outcome cards in 3-col grid (≥1024px), 2-col (≥640px)
- Each card: h4 title + p description, gold top-line on hover
- Disclaimer note (italic, muted)
- Text exactly from prototype lines 1281-1298
**Verify against prototype:** Grid layout, card hover animation

### T2.7 · About section component
**Files:** `src/components/en/EnAboutSection.astro`
**Depends on:** T1.2
**Details:**
- 2-column grid (≥900px): photo (0.8fr) + text (1.2fr)
- Photo placeholder (4:5 aspect)
- 5 paragraphs of bio text — first paragraph uses serif, larger font
- Credentials grid: 2×2 with gold labels (Training, Background, Languages, Location)
- Text exactly from prototype lines 1300-1321
**Verify against prototype:** Typography hierarchy, credentials grid layout

### T2.8 · Reiki Three.js stage component
**Files:** `src/components/en/ReikiStage.tsx` (React island)
**Depends on:** T1.2
**Details:**
- React component with `client:visible` directive
- Three.js particle animation showing Reiki symbols (Cho Ku Rei, Sei He Ki, Hon Sha Ze Sho Nen)
- Extract SYMBOL_POINTS data and shader code from prototype (lines 1558-1699)
- Canvas with WebGL renderer, 300 particles, custom vertex/fragment shaders
- Symbol morphing cycle: form (3.2s) → hold (4.6s) → dissolve (2.6s) × 3 symbols
- Kanji block overlay: 霊気 with "Rei · Ki" label
- Explanatory text alongside (5 paragraphs about Reiki)
- Mobile optimization: reduced particles, responsive camera
- Fallback for WebGL failure: static display without canvas
- `prefers-reduced-motion`: skip animation, show static
- THREE.js loaded as npm dependency (not CDN): `npm install three`
- Symbol name label: bottom-right, fades in/out
**Verify against prototype:** Animation timing, particle colors (gold/sage mix), symbol transitions

### T2.9 · Session Flow component
**Files:** `src/components/en/SessionFlow.astro`
**Depends on:** T1.2
**Details:**
- Section label: "What actually happens"
- Title: "A session, plainly described"
- 4 flow cards in 2-col grid (≥768px)
- Each card: Roman numeral (I-IV, serif, gold) + h3 title + description
- Text exactly from prototype lines 1341-1354
**Verify against prototype:** Card layout, numeral styling

### T2.10 · Quote Band component
**Files:** `src/components/en/QuoteBand.astro`
**Depends on:** T1.2
**Details:**
- Full-width surface band with borders
- Gold mark line (40px × 2px)
- Blockquote: "Whatever you are living with, Reiki supports recovery..."
- Serif italic, clamp 22-36px
- Text exactly from prototype line 1360
**Verify against prototype:** Typography, spacing

### T2.11 · Packages section component
**Files:** `src/components/en/PackagesSection.astro`
**Depends on:** T1.2
**Details:**
- Section label: "Working together"
- Title: "Choose the shape that fits your stay"
- Lead text about session format
- Group 1 "If you're visiting": 2-col grid
  - Arrival Reset (featured): €180, one session
  - Your Week Here: €480, 3 sessions
- Group 2 "If you live here": 3-col grid (≥900px)
  - Single Session: €180
  - The Renewal (featured): €640, 4 sessions
  - The Immersion: €1,120, 8 sessions
- Each package: kicker, name, description, price, "Book this" button
- "Book this" buttons set form select value via `data-pkg` attribute
- Package note at bottom about children, payment, rescheduling
- Prices are FINAL — do not change
- Text exactly from prototype lines 1364-1414
**Verify against prototype:** Grid layout, featured card styling, price formatting

### T2.12 · Testimonials section component
**Files:** `src/components/en/TestimonialsSection.astro`
**Depends on:** T1.2
**Details:**
- Section label: "In their words"
- Title: "What clients wrote the same day"
- Lead: "Unedited messages, shared with permission."
- 2 cards in 2-col grid (≥768px)
- Each: 5 gold stars, quote (serif italic), cite name
- Card 1: Mandana D. — "Feels like you really did restore my energy..."
- Card 2: Elena — "I felt an immediate boost of energy..."
- Text exactly from prototype lines 1417-1436
**Verify against prototype:** Star styling, quote typography

### T2.13 · FAQ section component
**Files:** `src/components/en/FaqSection.astro`
**Depends on:** T1.2
**Details:**
- Section label: "Before you book"
- Title: "Questions people usually ask first"
- 9 `<details>` accordion items, max-width 720px
- Each: summary (17px, weight 500) + gold "+" icon that rotates 45° on open
- No JavaScript needed — native `<details>`/`<summary>` elements
- Text exactly from prototype lines 1438-1455
**Verify against prototype:** Accordion behavior, icon animation

### T2.14 · Booking Form component
**Files:** `src/components/en/BookingForm.tsx` (React island)
**Depends on:** T1.2
**Details:**
- React island with `client:idle` directive
- 2-column grid (≥900px): form + sidebar text
- Form fields: phone (tel, required), message (textarea, required), email (required), package (select with 7 options), consent checkbox (required)
- Submit → POST to `/api/submit-lead` with `source: 'reiki-en'`
- Success message: "Thank you — I'll get back to you on WhatsApp within 24 hours."
- WhatsApp alternative button: `wa.me/380634543338`
- Sidebar: 2 paragraphs + cities note
- Form validation with Zod (reuse existing pattern)
- Package select pre-fill when clicking "Book this" from packages section
- Text exactly from prototype lines 1457-1486
**Verify against prototype:** Form layout, field styling, button states

### T2.15 · Journal Preview section component
**Files:** `src/components/en/JournalPreview.astro`
**Depends on:** T1.2, T1.4
**Details:**
- Section label: "Journal"
- Title: "Notes on rest, energy and living between countries"
- Lead text
- 6 article cards in 3-col grid (≥1024px), 2-col (≥640px)
- Each card: tag, title (serif), excerpt, meta (read time + "Read →")
- Gold left border on hover
- Cards pull from first 6 published articles in articles.json
- Link to `/en/journal/[slug]/`
- Text from prototype lines 1489-1504 (card content from articles.json)
**Verify against prototype:** Card layout, hover effect, tag styling

### T2.16 · EN Footer component
**Files:** `src/components/en/EnFooter.astro`
**Depends on:** T1.2
**Details:**
- Border-top, 48px padding
- Left: "© 2026 Viktoria Zhulova — Reiki Riviera. Cannes, France." + email + Instagram + Privacy Policy link
- Right: disclaimer text about Reiki being complementary practice
- NO 🇺🇦 link (explicit requirement)
- NO language switcher
- Links: `viktoriazhulova@gmail.com`, Instagram (placeholder `#`), `/en/privacy-policy/`
- Text exactly from prototype lines 1506-1517
**Verify against prototype:** Layout, text styling, responsive behavior

### T2.17 · Scroll animations script
**Files:** `src/components/en/scroll-animations.ts`
**Depends on:** T1.2
**Details:**
- IntersectionObserver for `.fade-up` → `.visible` class toggle
- Threshold: 0.12
- Respects `prefers-reduced-motion: reduce`
- Unobserve after first intersection
- Load as inline `<script>` in EnBaseLayout or as module
**Verify:** Sections animate in on scroll, no animation with reduced motion

---

## Group 3 — Pages

### T3.1 · EN Landing Page (`/en/`)
**Files:** `src/pages/en/index.astro`
**Depends on:** T2.1 through T2.17
**Details:**
- Compose all section components in order:
  1. EnHeader
  2. CitiesMarquee (after hero, per prototype order)
  3. EnHero
  4. CitiesMarquee (positioned between hero and recognition per prototype)
  5. RecognitionSection
  6. OutcomesSection
  7. EnAboutSection
  8. ReikiStage (client:visible)
  9. SessionFlow
  10. QuoteBand
  11. PackagesSection
  12. TestimonialsSection
  13. FaqSection
  14. BookingForm (client:idle)
  15. JournalPreview
  16. EnFooter
- SEO: title "Reiki on the French Riviera — Viktoria Zhulova", description from prototype meta
- **Prototype order note:** In prototype, the order is: Header → Hero → Cities Marquee → Recognition → Outcomes → About → Reiki Stage → Session Flow → Quote → Packages → Testimonials → FAQ → Booking → Journal → Footer
**Verify against prototype:** Full page screenshot comparison; section order matches; all text verbatim

### T3.2 · EN About Page (`/en/about/`)
**Files:** `src/pages/en/about.astro`
**Depends on:** T2.7, T2.16, T2.1
**Details:**
- Standalone About page with expanded content
- Reuses EnAboutSection component content
- Additional SEO/geo-optimized content for standalone page
- Header + About content + Credentials + CTA to book + Footer
- Unique meta_title and meta_description targeting "reiki practitioner cannes" / "energy healer french riviera"
**Verify:** Page renders with full about content; meta tags unique

### T3.3 · EN Journal Index Page (`/en/journal/`)
**Files:** `src/pages/en/journal/index.astro`
**Depends on:** T1.4, T2.15, T2.1, T2.16
**Details:**
- List ALL published articles (publishDate ≤ today)
- Same card layout as JournalPreview but showing all articles
- Sorted by publishDate descending (newest first)
- Page title: "Journal — Reiki Riviera"
**Verify:** Shows only published articles; correct count; cards link to article pages

### T3.4 · EN Journal Article Pages (`/en/journal/[slug]/`)
**Files:** `src/pages/en/journal/[slug].astro`
**Depends on:** T1.4, T2.1, T2.16
**Details:**
- `getStaticPaths()` generates paths for published articles only
- Article body rendered from markdown (use a markdown renderer — `marked` or similar)
- SEO: uses article's `meta_title`, `meta_description`, `keyword` from articles.json
- Article schema JSON-LD (see T5.2)
- CTA at bottom linking to booking form or relevant package
- Article `cta` field determines which CTA variant to show
- Reading time from `read` field
- Tag displayed as label
- Back link to `/en/journal/`
- Responsive typography matching prototype journal card style
**Verify:** Article renders with correct content; meta tags from articles.json; unpublished articles 404

### T3.5 · Geo Pages (6 city-specific landing pages)
**Files:**
- `src/pages/en/reiki-cannes.astro`
- `src/pages/en/reiki-nice.astro`
- `src/pages/en/reiki-antibes.astro`
- `src/pages/en/reiki-monaco.astro`
- `src/pages/en/reiki-saint-tropez.astro`
- `src/pages/en/reiki-french-riviera.astro`
**Depends on:** T2.1, T2.16, T2.14
**Details:**
- Thin SEO pages targeting "reiki [city]" keywords
- Each page: unique H1 ("Reiki in Cannes", "Reiki in Nice", etc.)
- Brief city-specific intro text (2-3 paragraphs)
- Reuse: packages section, booking form, FAQ subset
- Internal links to main landing `/en/` and journal articles
- Unique meta_title, meta_description per city
- LocalBusiness JSON-LD with city-specific address
**Verify:** Each page has unique title/description; builds successfully; links to main landing work

### T3.6 · EN Privacy Policy Page (`/en/privacy-policy/`)
**Files:** `src/pages/en/privacy-policy.astro`
**Depends on:** T2.1, T2.16
**Details:**
- Privacy policy + mentions légales (French legal requirement)
- Standard data collection disclosure for form submissions
- Footer link from prototype: `/en/privacy-policy/`
**Verify:** Page renders; linked correctly from footer

---

## Group 4 — Content & Data

### T4.1 · Extract and optimize images from prototype
**Files:** `public/images/en/` directory
**Depends on:** nothing (can run in parallel)
**Details:**
- Prototype contains base64-encoded diploma images — extract and convert to WebP
- Create photo placeholder assets (will be replaced with real photos later)
- Directory structure: `public/images/en/diplomas/`, `public/images/en/testimonials/`
- Optimize all images: WebP format, quality 85, appropriate dimensions
- Hero photo: placeholder 3:4 aspect
- About photo: placeholder 4:5 aspect
**Verify:** Images load correctly; file sizes reasonable (<200KB each)

### T4.2 · Set up article publishDate schedule
**Files:** `src/data/en-journal-articles.json`
**Depends on:** T1.4
**Details:**
- Assign publishDate to all 54 articles:
  - Articles 1-8: launch date (e.g., "2026-09-15")
  - Articles 9-54: 1 per weekday starting day after launch
  - Skip Saturdays and Sundays
- Write a script to generate the schedule: `scripts/generate-publish-dates.ts`
- Validate: no duplicate dates, all weekdays, correct order
**Verify:** Script output matches expected schedule; `getPublishedArticles()` returns 8 on launch day

### T4.3 · Populate geo page content
**Files:** 6 geo page files from T3.5
**Depends on:** T3.5
**Details:**
- Write unique intro paragraphs for each city (2-3 paragraphs each)
- Content should be SEO-optimized for "reiki [city]" keyword
- Include local details (e.g., "sessions at your villa in Mougins" for Cannes page)
- Each page should feel complete but link to main landing for full details
**Verify:** Content is unique per page (no duplicate text); reads naturally

---

## Group 5 — SEO & Integration

### T5.1 · Add hreflang tags
**Files:** `src/layouts/EnBaseLayout.astro`, `src/layouts/BaseLayout.astro`
**Depends on:** T1.1
**Details:**
- On ALL UK pages (BaseLayout):
  ```html
  <link rel="alternate" hreflang="uk" href="https://zhulova.com/" />
  <link rel="alternate" hreflang="en" href="https://zhulova.com/en/" />
  <link rel="alternate" hreflang="x-default" href="https://zhulova.com/" />
  ```
- On ALL EN pages (EnBaseLayout):
  ```html
  <link rel="alternate" hreflang="en" href="https://zhulova.com/en/" />
  <link rel="alternate" hreflang="uk" href="https://zhulova.com/" />
  <link rel="alternate" hreflang="x-default" href="https://zhulova.com/" />
  ```
- hreflang URLs should be absolute and canonical
**Verify:** View source on built UK and EN pages; validate with hreflang checker tool

### T5.2 · JSON-LD structured data
**Files:** Per-page in Astro frontmatter or component
**Depends on:** T1.1, T3.1, T3.4, T3.5
**Details:**
- **EN landing + geo pages:** `HealthAndBeautyBusiness` schema (LocalBusiness subtype)
  - Name: "Reiki Riviera — Viktoria Zhulova"
  - Address: Cannes, Alpes-Maritimes, FR
  - areaServed: Nice, Cannes, Antibes, Monaco, Saint-Tropez
  - priceRange: "€€"
  - Founder Person schema with knowsLanguage
- **EN journal articles:** `Article` schema
  - headline, author (Person), datePublished, description, keywords
- **FAQ section:** `FAQPage` schema with all 9 Q&A pairs
  - Can be on landing page or standalone FAQ
- **UK pages:** Keep existing `Person` schema unchanged
- Validate all schemas with Google Rich Results Test
**Verify:** JSON-LD renders in page source; passes Google validation

### T5.3 · Meta tags for all EN pages
**Files:** All EN page files
**Depends on:** T3.1-T3.6
**Details:**
- Every EN page has unique `<title>` and `<meta name="description">`
- Open Graph tags: og:title, og:description, og:image, og:url, og:locale="en_US"
- Twitter card tags
- Canonical URL for each page
- Journal articles use `meta_title` and `meta_description` from articles.json
- Geo pages target city-specific keywords in title
**Verify:** Each page has unique title/description; no duplicates across EN pages

### T5.4 · API endpoint update for EN leads
**Files:** `src/pages/api/submit-lead.ts`
**Depends on:** nothing
**Details:**
- Add `source` field to Zod validation schema (optional string)
- EN booking form sends `source: 'reiki-en'`
- Store source in Supabase leads table (may need column migration)
- Email notification template indicates EN lead source
- Existing UK form continues working unchanged
**Verify:** Submit from EN form → Supabase row has `source: 'reiki-en'`; UK form still works

### T5.5 · Supabase schema update
**Files:** Supabase migration (SQL)
**Depends on:** T5.4
**Details:**
- Add `source` column to `leads` table (TEXT, nullable, default null)
- Add `package` column (TEXT, nullable) for EN form's package selection
- RLS policies remain the same (insert-only from anon key)
- Backfill: existing rows get `source: null` (implicitly UK)
**Verify:** Migration runs successfully; new columns visible in Supabase dashboard

---

## Group 6 — Testing

### T6.1 · Playwright visual regression test setup
**Files:** `tests/e2e/en-visual-regression.spec.ts`
**Depends on:** T3.1
**Details:**
- Screenshot the prototype HTML file as baseline:
  1. Open `/Users/george_pc2/Desktop/reiki-riviera-prototype-v2.html` in Playwright
  2. Screenshot each section (hero, recognition, outcomes, about, reiki, flow, quote, packages, testimonials, faq, booking, journal, footer)
  3. Save as baseline images in `tests/e2e/screenshots/baseline/`
- Screenshot the built Astro page at same viewport sizes
- Compare section-by-section using Playwright's `toHaveScreenshot()` with threshold
- Viewport sizes: 1440×900 (desktop), 768×1024 (tablet), 375×812 (mobile)
**Verify:** Test infrastructure runs; baseline screenshots captured

### T6.2 · E2E tests for EN pages
**Files:** `tests/e2e/en-pages.spec.ts`
**Depends on:** T3.1-T3.6
**Details:**
- Test all EN page routes return 200
- Test navigation links work (header, mobile menu, internal links)
- Test booking form submission flow (mock API)
- Test FAQ accordion open/close
- Test package "Book this" → form select pre-fill
- Test journal article pages render correct content
- Test unpublished articles return 404
- Test cities marquee animation runs (CSS animation detected)
- Test mobile menu open/close
- Test header scroll blur effect
**Verify:** All tests pass in Chromium

### T6.3 · Accessibility tests for EN pages
**Files:** `tests/e2e/en-accessibility.spec.ts`
**Depends on:** T3.1
**Details:**
- axe-core scan on all EN pages (0 critical violations)
- Keyboard navigation: tab through all interactive elements
- Focus indicators visible on all focusable elements
- ARIA labels on: hamburger button, form fields, accordion items
- Heading hierarchy: single h1, logical h2-h4 nesting
- Color contrast: verify gold-on-dark meets 4.5:1 ratio
- `prefers-reduced-motion` respected (no animations)
- Form labels properly associated with inputs
**Verify:** 0 critical a11y violations; keyboard-only navigation works end-to-end

### T6.4 · SEO validation tests
**Files:** `tests/e2e/en-seo.spec.ts`
**Depends on:** T5.1-T5.3
**Details:**
- Verify hreflang tags present on all pages (both UK and EN)
- Verify JSON-LD parses correctly on each page type
- Verify unique title + description on every EN page
- Verify canonical URLs are correct
- Verify OG tags present and correct
- Verify sitemap includes all EN pages
- Verify no duplicate meta descriptions across pages
**Verify:** All SEO checks pass

### T6.5 · Performance tests
**Files:** Lighthouse CI config update
**Depends on:** T3.1
**Details:**
- Add EN landing page to Lighthouse CI test URLs
- Targets: Performance 85+, Accessibility 90+, SEO 90+
- Core Web Vitals: LCP <2.5s, CLS <0.1
- Three.js bundle impact: measure JS size increase
- Ensure lazy loading on below-fold images
- Verify fonts don't block render (display=swap)
**Verify:** Lighthouse scores meet targets on EN landing page

### T6.6 · Unit tests for article helpers
**Files:** `src/lib/articles.test.ts`
**Depends on:** T1.4
**Details:**
- Test `getPublishedArticles()` with mocked dates
- Test `getArticleBySlug()` returns correct article
- Test `getAllSlugs()` excludes future articles
- Test edge cases: no published articles, all published, boundary dates
**Verify:** All unit tests pass

---

## Dependency Graph (Build Order)

```
Phase 1 (parallel):
  T1.1, T1.2, T1.4, T4.1

Phase 2 (after Phase 1):
  T1.3 (needs T1.1)
  T2.1-T2.17 (need T1.2; T2.14, T2.15 also need T1.4)
  T5.1 (needs T1.1)
  T5.4, T5.5 (independent)

Phase 3 (after Phase 2):
  T3.1-T3.6 (need components)
  T1.5 (needs T1.3)
  T4.2 (needs T1.4)
  T6.6 (needs T1.4)

Phase 4 (after Phase 3):
  T5.2, T5.3 (need pages)
  T4.3 (needs T3.5)
  T6.1-T6.5 (need built pages)
```

## Total Estimates

| Group | Tasks | Est. complexity |
|-------|-------|----------------|
| Architecture | 5 | Medium |
| Components | 17 | High (T2.8 Three.js is largest) |
| Pages | 6 | Medium |
| Content | 3 | Low-Medium |
| SEO | 5 | Medium |
| Testing | 6 | Medium |
| **Total** | **42 tasks** | |

## Key Risks

1. **Three.js bundle size** — may impact Lighthouse performance score. Mitigation: dynamic import, `client:visible`, tree-shaking
2. **54 articles build time** — static generation of 54+ pages. Mitigation: should be fine for Astro SSG
3. **Photo placeholders** — hero/about photos not ready. Mitigation: use styled placeholder divs matching prototype
4. **Prototype CSS vs Tailwind** — EN uses custom CSS, UK uses Tailwind. Mitigation: complete isolation via separate layout + scoped styles
