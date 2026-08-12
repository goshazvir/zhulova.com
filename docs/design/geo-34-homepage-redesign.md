# GEO-34 — Homepage redesign: courses, testimonials carousel, case cards

**Status:** Implemented on `feat/geo-34-homepage-redesign` · pending founder review
**Owner:** Team Lead · **Design system:** Soft Luxury (navy / gold / sage · Playfair Display + Inter)

This doc is the combined design spec + implementation record for the three
interconnected homepage components in GEO-34. It captures the *why* and the
*decisions*; the code is the source of truth for the *how*.

---

## 1. Courses section — accuracy fix

**Problem:** The homepage advertised a course that no longer exists —
«МІНІ КУРС — ГРОШІ КОЖЕН ДЕНЬ», CTA pointing at the generic `/courses` index.
The real, live offering is **«Опора на себе»** — a 3-day mini-course (€9,
delivered in Telegram) with a full landing page already at `/courses/opora`.
Showing a phantom course on the primary engagement surface is a credibility bug.

**Decision:**
- Rewrote `featuredCourse` in `src/data/homePageContent.ts` to the real offering:
  eyebrow (`3-денний міні-курс`), title (`Опора на себе`), a benefit-led subtitle,
  the real course promise (voice matched to `HeroOpora.astro`), `price` (`9 €`),
  a `priceNote`, a structured `benefits[]` array, and `link: /courses/opora`.
- `CoursesPreview.astro` now renders those fields instead of hardcoded copy, so
  content lives in one place. Visual refresh: a **price pill** on the gold panel,
  an **anchor icon** (опора = steady support) replacing the generic dollar glyph,
  the eyebrow above the serif title, and data-driven benefit list.
- Section heading `Мої курси` → `Мій курс` (there is one featured course).

**Guardrail:** `src/data/homePageContent.test.ts` asserts the block reflects Опора,
links to `/courses/opora`, and can *never* resurrect the «ГРОШІ КОЖЕН ДЕНЬ» copy.

## 2. Testimonials — auto-scrolling carousel

**Requirement:** slow continuous rotation, keyboard navigation, mobile-responsive,
smooth (no jarring jumps), manual control.

**Decision — continuous marquee over a native scroll container:**
- `TestimonialsSection.astro` renders the testimonials **twice** into one flex
  track. A `requestAnimationFrame` loop advances `scrollLeft` at **32 px/s**;
  when it passes the halfway point we subtract half the track width — the content
  there is byte-identical, so the loop is seamless with **no visible jump**.
- The second (cloned) pass is `aria-hidden` so screen readers read each
  testimonial once.
- Auto-scroll logic lives in `testimonialsCarousel.ts` (unit-tested in
  `testimonialsCarousel.test.ts`) and is imported by the `.astro` component's
  client script, rather than living inline.
- **Pause** on: hover, `focusin` (keyboard users), active pointer/wheel
  interaction (1.2 s cooldown), and `document.hidden`.
- **Manual control:** prev/next buttons (44×44 targets) scroll one card;
  the viewport is a focusable (`tabindex=0`) `role="group"` region so arrow
  keys scroll it natively.
- **`prefers-reduced-motion`:** no rAF is started; the carousel becomes a static,
  natively-scrollable strip.
- Edge gradient fades signal more content; slim on-brand scrollbar on mobile.
  The fade wrapper is scoped to the viewport only (not the controls row above
  it), so it never visually overlaps the prev/next arrows.

**GEO-35 update — pause/play toggle removed:** the explicit **Пауза/Відтворити**
button (added for WCAG 2.2.2, a keyboard-reachable stop mechanism distinct from
hover) was removed per founder request to simplify the controls to prev/next
only. The remaining pause triggers — hover, focus-within, pointer/wheel
interaction, and `prefers-reduced-motion` — still let every input method halt
the motion, and the prev/next arrows give full manual control regardless of
auto-scroll state, but there is no longer a persistent, explicit stop toggle.
Automated tooling (axe, Lighthouse) does not flag this — SC 2.2.2 for
non-essential moving content is a manual-review criterion — so if it resurfaces
in a future audit, this is the known, accepted trade-off and rationale.

**Content note (founder-blocked):** the DoD asks for *2–4 new genuine
testimonials (founder to provide)*. The carousel ships working with the current
3; adding more is a one-line append to `testimonials[]` — no code change. The
real testimonials are requested from the founder before production.

## 3. Case study cards — premium redesign (critical)

**Problem:** cards read as generic/AI-made — a flat `+8x дохід` pill, an emoji
(✨) beside «Результати», weak hierarchy.

**Decision — elevate the metric, refine the iconography:**
- **Result metric:** replaced the pill with a **serif multiplier** (`×8`) in the
  card header, hairline-framed with a small-caps `зростання доходу` label and a
  `time · sessions` sub-line. Feels like an editorial stat, not a badge.
- **«Результати» icon:** the emoji → a **gold gradient rounded chip** with a
  crisp star glyph, vertically centered with the heading.
- **Hierarchy & finish:** `rounded-2xl`, soft shadow that lifts on hover, gold
  hairline border, gold check marks (replacing bullets) on a subtle gold-tinted
  accent rail. Identity (name/profession) balanced left against the metric right.
- Kept the existing carousel JS, mobile indicators, and 2-on-mobile/3-on-desktop
  result truncation. Added keyboard access (`tabindex`, `role`, label) to the
  case-studies scroll region.

---

## Verification (this branch)

| Gate | Result |
|------|--------|
| `astro check` (typecheck) | **0 errors, 0 warnings** |
| `astro build` | ✅ clean production build |
| Unit tests (`vitest run`) | **359 passed** (incl. 7 new course-data guards) |
| ESLint (changed files) | ✅ clean |
| **axe** (WCAG 2a/2aa/21a/21aa, homepage) | **0 violations** — 0 critical, 0 serious |
| Desktop + mobile screenshots | ✅ captured (390px & 1280px) — all three sections |

**Deferred to QA / CI:** Lighthouse ≥ 85 (`npm run perf:lighthouse` via
`lighthouserc.cjs` — the authoritative gate; changes add no new images/fonts/
heavy JS, so no regression expected). Cross-browser manual pass.

**Founder gates before production:** (a) provide 2–4 genuine testimonials;
(b) approve final result for deployment.
