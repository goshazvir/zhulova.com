# EN Reiki Section — Full Specification

## 1. Project Overview

**Goal:** Add a complete English-language section to zhulova.com dedicated to Reiki services on the French Riviera. Two independent audiences on one domain — no language switcher, fully separate navigation flows.

**Domain:** zhulova.com (existing Astro v5 + React + TypeScript + Tailwind CSS v3 project)

**Audiences:**
| | Ukrainian audience | English audience |
|---|---|---|
| Language | UK (primary), RU (secondary) | EN |
| Product | Coaching, mentoring, courses | Reiki energy healing |
| Geo | Ukraine, CIS | French Riviera (Cannes, Nice, Antibes, Monaco, Saint-Tropez) |
| Existing | Current zhulova.com | Prototype: `Desktop/reiki-riviera-site-v5.html` |

---

## 2. URL Architecture

```
zhulova.com/                    → UK landing (coaching) — existing, no changes
zhulova.com/courses/            → UK courses — existing
zhulova.com/contacts/           → UK contacts — existing
zhulova.com/privacy-policy/     → UK legal — existing
zhulova.com/terms/              → UK legal — existing

zhulova.com/en/                 → EN landing (Reiki Riviera) — NEW
zhulova.com/en/about/           → EN about Viktoria — NEW
zhulova.com/en/packages/        → EN packages & pricing — NEW
zhulova.com/en/distance/        → EN distance Reiki — NEW
zhulova.com/en/faq/             → EN FAQ — NEW
zhulova.com/en/book/            → EN booking form — NEW
zhulova.com/en/journal/         → EN blog index — NEW
zhulova.com/en/journal/[slug]/  → EN individual articles — NEW (10 at launch, 50+ planned)
zhulova.com/en/privacy/         → EN privacy/mentions légales — NEW
```

**Important:** UK pages stay exactly as they are. No changes to existing routes.

---

## 3. i18n Strategy (Astro-native)

Astro v5 does NOT use next-intl. Instead, use Astro's file-based routing:

```
src/pages/
├── index.astro              → / (UK, existing)
├── courses.astro            → /courses (existing)
├── contacts.astro           → /contacts (existing)
├── en/
│   ├── index.astro          → /en/ (EN landing)
│   ├── about.astro          → /en/about/
│   ├── packages.astro       → /en/packages/
│   ├── distance.astro       → /en/distance/
│   ├── faq.astro            → /en/faq/
│   ├── book.astro           → /en/book/
│   ├── privacy.astro        → /en/privacy/
│   └── journal/
│       ├── index.astro      → /en/journal/
│       └── [...slug].astro  → /en/journal/[slug]/
```

**No language switcher in nav.** Only a small footer link:
- UK footer: tiny "Reiki in English →" link
- EN footer: tiny "Коучинг українською →" link

**hreflang tags** in `<head>` of every page:
```html
<!-- On UK pages -->
<link rel="alternate" hreflang="uk" href="https://zhulova.com/" />
<link rel="alternate" hreflang="en" href="https://zhulova.com/en/" />
<link rel="alternate" hreflang="x-default" href="https://zhulova.com/" />

<!-- On EN pages -->
<link rel="alternate" hreflang="en" href="https://zhulova.com/en/" />
<link rel="alternate" hreflang="uk" href="https://zhulova.com/" />
<link rel="alternate" hreflang="x-default" href="https://zhulova.com/" />
```

---

## 4. Design System — Two Themes

### Shared foundation
- **Serif font:** Playfair Display (both themes)
- **Layout patterns:** same component architecture, spacing scale, border-radius
- **Performance:** same optimization approach (Astro islands, lazy loading, WebP images)

### UK Theme (existing — no changes)
```css
--bg: #0a0e1a (navy dark)
--surface: white
--accent: gold (#B9952B equivalent in Tailwind config)
--text: white on dark, navy on light
--sans: Inter
```

### EN Reiki Theme (new)
```css
--bg: #FBF9F4 (warm cream)
--surface: #FFFFFF
--ink: #1B1F2A (dark navy-charcoal)
--muted: rgba(27,31,42,0.62)
--gold: #B9952B
--gold-deep: #9C7C1F
--gold-soft: #F5EDD6
--olive: #6F8464
--olive-deep: #55684C
--olive-soft: #E8EDE2
--serif: 'Playfair Display', serif
--sans: 'Manrope', sans-serif
--radius: 22px
```

**Implementation:** Create a separate Astro layout `EnBaseLayout.astro` that loads the Reiki theme CSS variables. EN pages use this layout; UK pages continue using existing `BaseLayout.astro`.

---

## 5. EN Pages — Content Mapping from Prototype

All content comes from `Desktop/reiki-riviera-site-v5.html`. Structure by section:

### 5.1 EN Landing (`/en/`)
Sections from prototype (in order):
1. **Header** — sticky nav with VZ brand, links: About, Results, What is Reiki, Distance, Packages, FAQ, Journal + "Book a session" CTA
2. **Cities strip** — horizontal list of 28 Riviera cities
3. **Hero** — name, title, offer text, stats grid (4 items), CTA buttons, photo placeholder
4. **Recognition** — "If this is familiar" — 4 pain-point cards
5. **Outcomes** — "What shifted after sessions" — 7 outcome cards + disclaimer
6. **What tends to shift** — 3-column grid (Physical, Mental, Inner life)
7. **About** — bio text, credentials grid, photo placeholder
8. **Certifications** — 2 diploma cards (images provided as base64 in prototype)
9. **What is Reiki** — kanji animation (Three.js), explanatory text
10. **Session flow** — 4 steps (conversation, 45min session, closing, location)
11. **Distance Reiki** — 4 explanation cards + "why it works" card
12. **Quote band** — blockquote
13. **Packages** — 2 groups (visitors: 2 packages, residents: 3 packages) with prices in EUR
14. **Testimonials** — 2 cards with screenshot images + quotes
15. **Medical conditions** — expandable accordion with 9 condition cards
16. **FAQ** — 9 expandable questions
17. **Booking form** — phone, message, email, package select, consent checkbox, WhatsApp alternative
18. **Journal preview** — 10 article cards (6 min read each) + "All notes" link
19. **Footer** — copyright, email, Instagram, legal disclaimer

### 5.2 Individual Pages
- `/en/about/` — expanded version of About section
- `/en/packages/` — full pricing page with all packages
- `/en/distance/` — full distance Reiki explanation
- `/en/faq/` — all FAQ items
- `/en/book/` — standalone booking form
- `/en/privacy/` — mentions légales (French legal requirement)

### 5.3 Journal Articles (`/en/journal/[slug]/`)
10 articles at launch (titles from prototype):
1. how-to-deal-with-jet-lag-after-travel
2. signs-of-burnout
3. burnout-symptoms-in-women
4. wired-and-tired-nervous-system
5. distance-reiki-how-it-works
6. is-reiki-dangerous
7. how-to-manage-emotional-burnout
8. what-does-a-reiki-session-feel-like
9. reiki-hotel-villa-french-riviera
10. parental-burnout-abroad

**Article content** needs to be written — AI-assisted, then human-reviewed. Each ~1500-2000 words, SEO-optimized for target keywords.

---

## 6. SEO Strategy

### 6.1 Target Keywords (EN)
**Primary:**
- "reiki cannes"
- "reiki french riviera"
- "reiki nice france"
- "energy healing cannes"
- "private reiki session riviera"

**Long-tail (journal articles):**
- "how to deal with jet lag after travel"
- "signs of burnout that don't look like burnout"
- "burnout symptoms in women"
- "distance reiki how it works"
- "is reiki dangerous what doctors say"
- "reiki hotel villa french riviera"
- "wired and tired nervous system"
- "parental burnout abroad"

### 6.2 Structured Data (JSON-LD)

**EN pages — LocalBusiness + Person:**
```json
{
  "@context": "https://schema.org",
  "@type": "HealthAndBeautyBusiness",
  "name": "Reiki Riviera — Viktoria Zhulova",
  "description": "Private Reiki sessions for internationals on the French Riviera",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Cannes",
    "addressRegion": "Alpes-Maritimes",
    "addressCountry": "FR"
  },
  "areaServed": ["Nice", "Cannes", "Antibes", "Monaco", "Saint-Tropez"],
  "priceRange": "€€",
  "founder": {
    "@type": "Person",
    "name": "Viktoria Zhulova",
    "jobTitle": "Reiki Master & Intuitive Energy Healer",
    "knowsLanguage": ["en", "ru", "uk"]
  }
}
```

**FAQ page — FAQPage schema** for rich snippets
**Journal articles — Article schema** with author, datePublished, etc.
**Review/Testimonial schema** for social proof

### 6.3 Technical SEO
- Sitemap: add all EN pages to existing sitemap
- robots.txt: no changes needed
- Page speed: same Lighthouse 85+ targets
- Core Web Vitals: LCP < 2.5s, CLS < 0.1
- Image optimization: WebP, lazy loading, proper alt text
- Meta tags: unique title + description for every EN page
- Canonical URLs for all pages
- Open Graph tags for social sharing

### 6.4 Journal Growth Plan
- Launch with 10 articles
- Add 2-3 articles per week
- Target: 50 articles within 3 months
- Each article targets specific long-tail keyword
- Internal linking between articles and service pages
- Articles drive organic traffic → booking form conversion

---

## 7. Three.js Kanji Animation

The prototype includes a Three.js particle animation showing Reiki symbols (Cho Ku Rei, Sei He Ki, Hon Sha Ze Sho Nen). This is a significant interactive element.

**Decision needed:** Keep this animation or replace with simpler alternative?

**If keeping:**
- Extract `SYMBOL_POINTS` data and Three.js shader code from prototype
- Create a React island component (`client:visible` directive)
- Ensure mobile performance (prototype already has mobile optimization with reduced particles)
- Fallback for users with reduced-motion preference

**If simplifying:**
- Static SVG kanji characters with CSS animation
- Much lighter weight, better Core Web Vitals

**Recommendation:** Keep the Three.js animation — it's a strong differentiator and already optimized in the prototype.

---

## 8. Form Integration

**Current UK site:** Uses Supabase + Resend for form submissions (`/api/submit-lead`)

**EN booking form options:**
1. **Same Supabase backend** — add a field to distinguish EN vs UK leads
2. **Formspree** (referenced in prototype as `YOUR_FORM_ID`) — simpler, no backend changes
3. **WhatsApp direct** — `wa.me/33XXXXXXXXX` link (prototype includes this)

**Recommendation:** Use existing Supabase + Resend backend, add `source: 'reiki-en'` field. Keeps all leads in one system.

---

## 9. Images Needed

From prototype, these images need real photos:
1. **Hero portrait** — Viktoria, 4:5 ratio, professional
2. **About photo** — session setting or candid portrait
3. **Diploma 1** — Usui Reiki Ryoho Level I (provided as base64 in prototype)
4. **Diploma 2** — Usui Reiki Ryoho Level II (provided as base64 in prototype)
5. **Testimonial screenshots** — client message screenshots (provided as base64)

Diplomas and testimonial screenshots are embedded in the prototype as base64 JPEGs — these can be extracted and converted to optimized WebP.

---

## 10. Development Workflow

### Phase 1: Design (claude-design prototype)
1. Create HTML prototype of EN landing page using the Reiki theme
2. Adapt prototype content/structure from reiki-riviera-site-v5.html
3. Use zhulova.com design system patterns (spacing, components)
4. **Review in browser** — visual verification before coding
5. Iterate with feedback

### Phase 2: Architecture
1. Create `EnBaseLayout.astro` with Reiki theme
2. Create EN header/footer components
3. Set up `/en/` routing structure
4. Add hreflang tags to all layouts
5. Configure sitemap for EN pages

### Phase 3: Page Development
1. EN landing page (largest — all sections)
2. EN about page
3. EN packages page
4. EN distance page
5. EN FAQ page
6. EN booking page
7. EN privacy page
8. EN journal index
9. EN journal article template
10. Write/generate 10 launch articles

### Phase 4: SEO & Integration
1. JSON-LD structured data for all page types
2. Meta tags (title, description, OG) for every page
3. Form integration with Supabase
4. Image optimization (extract from prototype, convert to WebP)
5. Performance audit (Lighthouse)

### Phase 5: Testing & Launch
1. **Browser testing** — desktop + mobile + tablet
2. **Visual verification** — compare with design prototype
3. **SEO audit** — validate structured data, hreflang, sitemap
4. **Performance** — Lighthouse 85+ on all pages
5. **Forms** — test lead submission flow
6. Deploy to Vercel (auto-deploy on push to main)

---

## 11. Answers to Open Questions (RESOLVED)

| # | Question | Answer |
|---|----------|--------|
| 1 | WhatsApp number | +380634543338 |
| 2 | Email for EN pages | viktoriazhulova@gmail.com |
| 3 | Instagram | Will be created later — leave placeholder for now |
| 4 | Google Business Profile | Does not exist yet — to be created after launch |
| 5 | Calendly / booking | NO Calendly. Form only → sends notification → Viktoria contacts via WhatsApp |
| 6 | Hero photo | **Photos not ready yet — use placeholders, replace later** |
| 7 | About photo | **Photos not ready yet — use placeholders, replace later** |
| 8 | Diplomas | Use base64 images from prototype (extract + convert to WebP) |
| 9 | Form backend | Supabase (existing) — add `source: 'reiki-en'` field |
| 10 | Three.js animation | **KEEP** — use Three.js kanji particle animation |
| 11 | Journal articles | Viktoria writes articles herself — dev team only implements |
| 12 | EN landing text | **Use exactly as-is from prototype. Do NOT change or rewrite texts.** |
| 13 | Separate /en/about/ page | YES — create separate page, optimize for SEO/geo |
| 14 | Prices | FINAL: €180, €480, €640, €1120 |
| 15 | Testimonial names | OK to publish (Mandana D., Elena) |

---

## 12. Success Metrics

- EN pages indexed by Google within 2 weeks of launch
- "reiki cannes" → first page of Google within 3 months
- 10+ organic visits/day to EN section within 1 month
- Journal articles ranking for long-tail keywords within 2 months
- Booking form submissions from EN section
- Lighthouse 85+ on all EN pages
