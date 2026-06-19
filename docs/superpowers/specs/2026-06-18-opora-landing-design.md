# Course Landing "Опора на себе" — Design

**Date:** 2026-06-18
**Status:** Approved
**Goal:** Build a single high-converting course landing page for the 3-day mini-course "Опора на себе" at `/courses/opora`, in the project's light "minimal luxury" design system with dramatic navy accent sections, copy in Ukrainian.

## Context

- Astro + React islands + Tailwind static site; design system in `src/design-system/` (Button, Card, Section, Container, Heading, Text, Badge, Stat, Input, Modal), consumed via `@design-system`.
- Tokens: navy (primary), gold (accent/CTA), sage (secondary); fonts Playfair Display (`font-serif`) + Inter (`font-sans`).
- Current `/courses` is a catalog with 3 dummy detail pages (`my-course`, `mindset-mastery`, `goals-achievement`) holding lorem-ipsum; the content collection is empty.
- Reference structure: https://sviridov-pro.com/advert-tb/land-1/ (dark/dramatic, numbered sections, sticky CTA). We adapt its *structure and rhythm* into our *light brand*.

## Decisions

- **Visual:** light DS base, with dramatic `Section background="navy"` sections at the two conversion moments (bridge + buy) and gold accents throughout. Not a full dark theme.
- **Routing:** new page `src/pages/courses/opora.astro`. Keep the `/courses` catalog but update it to a single real course card → `/courses/opora`. Remove the 3 dummy detail pages.
- **Payment CTA:** every "ЗАБРАТИ ЗА 9 €" button links to `import.meta.env.PUBLIC_OPORA_CHECKOUT_URL` (external checkout), falling back to `#` placeholder until the real link exists.
- **Language:** Ukrainian, copy verbatim from the brief.
- **0KB JS:** entire page is static Astro. FAQ uses native `<details>/<summary>`; sticky CTA bar is CSS-only. No chart library — block 10 is a CSS/SVG timeline.

## Architecture

```
src/pages/courses/opora.astro      # the landing (new)
src/pages/courses.astro            # catalog — updated to one course card
src/pages/courses/my-course.astro          # DELETE
src/pages/courses/mindset-mastery.astro     # DELETE
src/pages/courses/goals-achievement.astro   # DELETE
```

The landing is composed inline in `opora.astro` from `@design-system` primitives plus a small number of local presentational `.astro` sub-components where a block repeats (see Components). All copy lives in the page (no content collection — single page).

### Cross-cutting elements

- **Section eyebrow:** gold uppercase `text-sm tracking-wider`, format `01 / Де це сидить у житті`.
- **Container/rhythm:** `Container` (max-w-6xl) inside `Section spacing="lg"`.
- **Primary CTA:** `Button variant="primary"` wrapped in `<a href={checkoutUrl}>` — reused at hero, buy, journey, and sticky bar.
- **Sticky CTA bar:** fixed bottom bar (appears after hero via CSS), left = "Опора на себе · 9 €", right = CTA button. CSS-only, hidden on print.

## Components

Local presentational sub-components (new, in `src/components/sections/opora/`), each one clear responsibility:

- `SectionEyebrow.astro` — `NN / label` gold eyebrow.
- `CompareRow.astro` — one Вечір/Ранок/Голова row: label Badge + "Зараз" column + "З опорою" column (sage-50, gold accent).
- `LessonCard.astro` — `Badge` (Урок N / Практика N) + `Heading lvl4` + `Text`; optional `highlight` flag for the Reiki practice (gold border).
- `BonusCard.astro` — gold check icon + title + text.
- `FaqItem.astro` — native `<details>` with gold +/− marker.
- `TimelineStep.astro` — period `Badge` + `Text`, plus the gold dot/line styling.
- `StickyCta.astro` — the bottom bar.
- `CheckItem.astro` — gold ✓ + text (used in buy checklist and Хто-я regalia).

Existing DS primitives used directly: `Section`, `Container`, `Heading`, `Text`, `Card`, `Badge`, `Button`. Existing `Footer` (legal variant). Astro `<Image>` for portraits (`hero-viktoria-luxury.webp` hero eager/fetchpriority-high; `footer-viktoria.webp` in Хто-я, lazy).

## Section-by-section

1. **Hero** — light (white→sage-50). Left: `Badge gold` мітка → `Heading lvl1` → `Text lg muted` підзаголовок → CTA → `Text sm muted` under-button → proof row (3 уроки + 2 практики (рейкі) · Телеграм · свій темп) with gold `·` separators. Right: hero portrait. Mobile: portrait above text.
2. **01 / Де це сидить у житті** — white. Eyebrow + `Heading lvl2` "Тривога забирає не тільки настрій" + three `CompareRow` (Вечір/Ранок/Голова). Mobile: columns stack.
3. **Bridge / approach** — **navy-900 Section**. `Heading lvl3` white + `Text` white/80 (body-first paragraph from brief) + three mini-steps Тіло → Критик → Опора with gold numerals.
4. **03 / Що почне мінятися** — white. Eyebrow + `Heading lvl2` + `Text muted` підзаголовок + five `LessonCard` stacked (Урок 1–3, Практика 1–2; Reiki highlighted) + `Text sm muted` PDF note.
5. **04 / Що ще забираєш (бонуси)** — sage-50. Eyebrow + `Heading lvl2` "Конспекти й інструкції…" + three `BonusCard` in a row + `Text sm muted` "Усе вже всередині…".
6. **05 / Хто я** — white. Two columns: portrait (rounded, gold ring) | `Heading lvl2` "Вікторія Жульова" + four regalia `CheckItem` + story `Text` + `Button outline` linking to Instagram (`target="_blank" rel="noopener"`).
7. **06 / Відгуки** — white, placeholder. Eyebrow + `Heading lvl2` + `Text muted` "Скоро тут зʼявляться скріни" + grid of 6 placeholder `Card bordered` with `<!-- TODO: insert testimonial screenshots -->`.
8. **07 / Забрати за 9 €** — **navy-900 Section** (primary conversion). Eyebrow gold + `Heading lvl2` white + 5 `CheckItem` (gold ✓ on navy) + large CTA + `Text sm` white/70 under-text + anchor line "9 євро — менше за каву з десертом удвох…" gold accent.
9. **08 / Часті питання** — sage-50. Eyebrow + `Heading lvl2` + six `FaqItem` (`<details>`), copy verbatim from brief, gold +/− marker, divider rows.
10. **09 / Куди ти прийдеш** — white. Eyebrow + `Heading lvl2` "Що міняється, коли почнеш" + `Text muted` intro + timeline of four `TimelineStep` (День 1 / Кінець 3 днів / Тиждень / Місяць) on a gold line (horizontal desktop, vertical mobile) + final CTA + `Text sm muted` "Один платіж 9 €, доступ…".
- **Sticky CTA bar** below the fold.
- **Footer** (existing, legal variant).

## SEO & Accessibility

- `BaseLayout` with Ukrainian `title` / `description`; `Course` JSON-LD (name, description, provider Вікторія Жульова, offer 9 EUR).
- Semantic landmarks, single `<h1>`, logical heading order; `<details>` keyboard-accessible; `alt` on images; gold-on-navy and gold-on-white contrast verified ≥4.5:1 (use `gold-600`/`gold-700` for text where needed).
- Respect `prefers-reduced-motion` for any transitions.

## Performance

- 0KB JS: all static; FAQ `<details>`, sticky bar, accordion marker, timeline — CSS only.
- Images via Astro `<Image>` (hero eager + `fetchpriority="high"`; rest lazy, WebP).
- No new npm dependencies.

## Out of Scope (YAGNI)

- Backend payment processing (external link only).
- Real testimonial content (placeholder block; screenshots added later).
- Chart library for block 10.
- Full dark theme.
- Multi-language (Ukrainian only).

## Catalog update

`src/pages/courses.astro`: replace the three dummy course cards with a single card for "Опора на себе" linking to `/courses/opora`. Remove the three dummy detail pages. Verify no remaining internal links point to the deleted pages.

## Success Criteria

- `/courses/opora` renders all 10 blocks + sticky bar + footer, copy matches the brief (Ukrainian).
- All CTAs link to `PUBLIC_OPORA_CHECKOUT_URL` (or `#` when unset).
- `/courses` catalog shows one card → `/courses/opora`; the three dummy pages are gone with no dangling links.
- `npm run build` passes (type-check + static build); 0KB JS for the page.
- Lighthouse/contrast: WCAG AA, no critical a11y violations.
