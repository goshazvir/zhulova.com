# Quiz «Опора» — UI Design Spec (all states)

**Issue:** GEO-14 (parent GEO-7) · **Author:** Designer · **Date:** 2026-08-11 · **Status:** Approved for implementation
**Authoritative architecture:** `docs/architecture/quiz-opora.md` + `docs/decisions/0001-quiz-opora-architecture.md`
**Copy source (verbatim Ukrainian):** `docs/reference/test_opora.html` — content only, never embed/iframe.

This spec adapts the reference quiz to the zhulova design system (navy/gold/sage, Playfair
Display + Inter). The reference palette (paper/orange/olive) and Manrope are NOT used.
A Frontend Dev should be able to implement every state from this document without questions.

---

## 1. Design decisions (summary)

| # | Decision | Rationale |
|---|---|---|
| D1 | **Page chrome: minimal logo-only header** (inline in `opora.astro`, NOT the shared `Header`), **Footer `variant="legal"`** | Campaign funnel from Instagram: minimize exit paths and cognitive load. Also avoids the fixed-header `pt-20` offset. Mirrors the reference's minimal top bar. Recorded per AC-3. |
| D2 | **Page background: solid `bg-white`** | Keeps every text/background pair AA-compliant with one background (see §8); luxury feel comes from serif type, whitespace and gold hairlines, not tinted surfaces. |
| D3 | **Gold usage is contrast-driven:** `gold-500` decorative only; `gold-700` for large text (≥24px) and meaningful UI graphics on white; `gold-800` for small gold labels on white; `gold-300` for accent text on navy-900 | `gold-600` on white is 2.88:1 and FAILS AA for text — never use it for text on light backgrounds in this page. |
| D4 | **Result CTA panel = dark `navy-900` panel** replacing the reference olive panel; course-bot CTA styled as DS Button `secondary` (gold), diagnostic booking as DS Button `outline` below the panel | Preserves the reference two-CTA hierarchy (primary = course bot, secondary = diagnostic) with zhulova tokens. |
| D5 | **No error banner on the result screen** when submission silently fails (after 1 auto-retry the result is still shown, per shaping §3) | The user never asked to "save" anything; surfacing a persistence error adds confusion with zero user value. A standalone error screen exists only for unrecoverable failures (§7.6). |
| D6 | Between questions there is **no transition animation** (instant content swap + focus move); animation exists only on screen-level changes (intro → quiz → result), the progress fill, and the result bar/count-up | Matches reference behavior; keeps the funnel fast. |

### Reference → zhulova token mapping

| Reference token | Used for | zhulova replacement |
|---|---|---|
| `--paper` gradient bg | page background | `bg-white` (D2) |
| `--ink` `#22293A` | headings/body | `text-navy-900` / `text-navy-800` |
| `--ink-soft` | secondary text | `text-navy-600` (NOT `navy-500` — 4.28:1 fails AA) |
| `--accent` orange | CTA, h1 accent, progress fill | `gold-500` (decorative/dark-bg CTA), `gold-700` (large text + UI graphics on white) |
| `--olive` | labels, eyebrows, secondary accent | `gold-800` (small labels), `navy-800` (numbers) |
| olive CTA panel | result CTA panel | `bg-navy-900` panel |
| `--card` translucent white | option cards | `bg-white border border-navy-200` |
| Manrope | body font | `font-sans` (Inter) |
| Playfair Display | display font | `font-serif` (Playfair Display) — unchanged |

---

## 2. Page chrome & layout

### 2.1 Minimal header (inline in `src/pages/quiz/opora.astro`)

Static (not fixed), one row:

```html
<header class="border-b border-navy-100 bg-white">
  <div class="mx-auto flex h-16 max-w-2xl items-center justify-between px-5 sm:px-6">
    <a href="/" aria-label="На головну" class="transition-opacity hover:opacity-80">
      <img src="/logo.svg" alt="Viktoria Zhulova" width="90" height="50" class="h-10" />
    </a>
    <span class="font-sans text-xs font-semibold uppercase tracking-[0.16em] text-navy-600">Коуч</span>
  </div>
</header>
```

- Logo links to `/` — the single intentional exit path.
- Do NOT import `@components/layout/Header.astro` (no nav, no socials on this page).

### 2.2 Footer

`<Footer variant="legal" />` from `@components/layout/Footer.astro`, unchanged.

### 2.3 Content container (the island root)

```
<main> → <div class="mx-auto w-full max-w-2xl px-5 sm:px-6 pt-10 sm:pt-14 pb-20">
```

- `max-w-2xl` (672px) ≈ reference 640px column. Single column at every breakpoint (mobile-first; desktop is the same layout with more whitespace).
- `min-h-[60vh]` on the wrapper so the footer doesn't jump up on short screens (submitting/error states).

---

## 3. Shared visual language

### 3.1 Typography

| Role | Classes |
|---|---|
| Eyebrow / small label | `font-sans text-[13px] font-bold uppercase tracking-[0.22em] text-gold-800` |
| H1 (intro) | `font-serif text-[2.5rem] leading-[1.05] sm:text-5xl md:text-6xl font-bold tracking-tight text-navy-900` |
| H1 accent word | `<em class="italic text-gold-700">` (large text — 4.06:1 ≥ 3:1 ✓) |
| Question title (h2) | `font-serif text-3xl md:text-4xl font-bold leading-tight text-navy-900` |
| Lead / body | `font-sans text-lg leading-relaxed text-navy-600 max-w-[44ch]` |
| Body emphasis | `font-bold text-navy-900` |
| Micro / disclaimer | `font-sans text-xs leading-relaxed text-navy-600` |

### 3.2 Buttons (reuse `@design-system/Button` styles)

| Use | Spec |
|---|---|
| Start test, error retry | DS `Button variant="primary" size="lg"` (navy-900 bg, white text) |
| Back (question screen) | DS `Button variant="outline" size="md"` |
| Course bot CTA (link) | `<a>` styled with DS secondary+lg classes: `inline-flex items-center justify-center rounded-lg bg-gold-500 px-8 py-4 text-lg font-medium text-navy-900 transition-colors hover:bg-gold-400 focus:ring-2 focus:ring-offset-2 focus:ring-gold-600` (same pattern as `sections/opora/CtaButton.astro`; `target="_blank" rel="noopener noreferrer"`) |
| Diagnostic booking CTA (link) | `<a>` styled with DS outline+md classes: `bg-white text-navy-900 border-2 border-navy-900 hover:bg-navy-50 rounded-lg px-6 py-3 font-medium` |

CTA hrefs: course bot → `PUBLIC_OPORA_BOT_URL` (fallback `/contacts`); booking → `PUBLIC_DIAGNOSTIC_BOOKING_URL` (fallback `https://calendly.com/`). See shaping §8.

### 3.3 Focus

Global `*:focus-visible` (gold-500 outline) applies, but gold-500 on white is 2.10:1. Inside
the quiz island override interactive elements with `focus-visible:outline-gold-700`
(4.06:1 ≥ 3:1 ✓). Keep `outline-offset-2`.

### 3.4 Tap targets

Every interactive element ≥ 44px tall (option cards are ~60px+, buttons `py-3`/`py-4` qualify).

---

## 4. State: Intro (with Instagram gate)

Vertical stack, top to bottom (margins between blocks given as `mb-*` of the upper block):

1. **Decorative accent bar** — absolutely positioned to the left of the h1 block on `sm+`:
   `hidden sm:block absolute -left-6 top-2 bottom-2 w-1.5 rounded-r bg-gold-500` (decorative,
   `aria-hidden`, no contrast requirement). Parent block gets `relative`.
2. **Eyebrow** `mb-5`: `Тест · 2 хвилини` (§3.1 eyebrow style).
3. **H1** `mb-6`: `На що ти зараз <em>опираєшся?</em>` — em styled per §3.1.
4. **Lead paragraphs** (two `<p>`, `mb-4` each, §3.1 lead style) — copy verbatim from reference intro.
5. **Meta row** `mt-2 mb-9`: `flex flex-wrap gap-x-6 gap-y-2 font-sans text-sm text-navy-600`;
   numbers wrapped in `<b class="font-bold text-navy-900">`:
   `**12** запитань · **2** хвилини · чесно тільки з собою`.
6. **Gate block** `mb-8`, `flex flex-col items-start gap-4 max-w-[420px]`:
   - **Input**: reuse `@design-system/Input` with
     `label="Підтверди, що ти не бот"`, `placeholder="@твій нік в інстаграмі"` (exact string),
     `type="text"`, `autoComplete="off"`, `spellCheck={false}`, `maxLength={31}`, `required`.
   - **Gate error**: pass `error="Впиши свій нік, щоб почати"` (exact string) to Input when
     validation fails (`^@?[a-zA-Z0-9._]{2,30}$` after trim — shaping §5). DS Input renders it
     as `text-red-600` with `role="alert"` (4.83:1 on white ✓). On failed submit also
     `focus()` the input. Error clears on next input (reference behavior).
   - **Start button** below the input: DS `Button variant="primary" size="lg"`, label `Почати тест`.
     `Enter` inside the input triggers the same handler.
7. **Disclaimer** `mt-2`: micro style (§3.1), copy verbatim:
   `Це не діагноз і не заміна допомоги фахівця. Просто дзеркало, щоб побачити себе трохи ясніше.`

Intro screen (like all screen-level changes) enters with the `fade-rise` animation (§9).

---

## 5. State: Question + progress

### 5.1 Progress row (`mb-9`)

`flex items-center gap-4`:

- **Counter**: `font-sans text-xl font-bold tabular-nums tracking-wide text-navy-800`,
  format `01 / 12` (zero-padded current, live region: `aria-live="polite"` on the counter
  element — announces progress on each advance, per shaping §10).
- **Bar**: `flex-1 h-1.5 rounded-full bg-navy-100 overflow-hidden`, with
  `role="progressbar"`, `aria-label="Прогрес тесту"`, `aria-valuemin={1}`,
  `aria-valuemax={12}`, `aria-valuenow={n}`.
  - **Fill**: `h-full rounded-full bg-gold-700` (3.10:1 vs `navy-100` track ✓, 4.06:1 vs
    white ✓), `width: (index / 12) * 100%` (question 1 = 0%, as in reference),
    `transition-[width] duration-500 ease-out`.

### 5.2 Question block

- **Question title**: `<h2>` per §3.1 question style, `mb-8`, `tabIndex={-1}` — **focus moves
  to this heading on every advance/back** (shaping §10). Suppress the default focus outline
  on it (`focus:outline-none`) — focus is programmatic, not interactive.
- **Options list** (`flex flex-col gap-3`): 4 option cards, each a real `<button type="button">`:

```
w-full text-left flex items-start gap-3.5 rounded-xl border border-navy-200 bg-white
p-5 font-sans text-base leading-snug font-medium text-navy-900
transition-colors hover:border-gold-700 hover:bg-gold-50
focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-700
```

  - **Radio-style marker** inside each card (first flex child, `aria-hidden="true"`):
    `mt-0.5 h-[22px] w-[22px] flex-none rounded-full border-2 border-navy-500 transition-all`
    → on card hover/focus: `border-gold-700` + inner dot (`shadow-[inset_0_0_0_5px]` in
    gold-700, following the reference's inset trick). Marker is the component-identification
    affordance: navy-500 on white = 4.28:1 ≥ 3:1 ✓; hover gold-700 = 4.06:1 ✓. The
    `navy-200` card border itself is decorative (identification is carried by marker + text +
    list layout).
  - Desktop hover may add `sm:hover:translate-x-0.5` (motion-safe only, §9).
  - Selecting an option immediately advances (no confirm step). When returning via Back,
    the previously chosen option shows the selected marker state
    (`border-gold-700` + inset dot + `aria-pressed="true"`).
- **Back button** `mt-7`: DS `Button variant="outline" size="md"`, label `Назад`. Hidden on
  question 1 (render nothing — do not reserve space, reference behavior). Back restores the
  previous question with its saved answer.

No animation between questions (D6): content swaps instantly, progress fill + counter animate,
focus lands on the new question title.

---

## 6. State: Submitting (loading)

Shown after answering question 12 while `POST /api/submit-quiz` runs (incl. the one auto-retry).
Typically < 2s.

Centered block, `py-24 flex flex-col items-center gap-6 text-center`:

- **Spinner**: `h-10 w-10 rounded-full border-4 border-navy-100 border-t-gold-700 animate-spin`
  with `role="status"` on the wrapper (gold-700 vs navy-100 = 3.10:1 ✓).
- **Label**: `font-serif text-xl text-navy-800`: `Рахуємо твій результат…`
- Wrapper is `aria-live="polite"` so the label is announced once.

Progress row is hidden in this state. No interactive elements.

**Reduced motion:** spinner must not spin — render the same circle static (global CSS already
freezes the animation; that static ring + label is the designed fallback, acceptable as-is).

---

## 7. State: Result

Rendered after submit resolves (result shows even if persistence failed twice — D5, shaping §3).
Screen enters with `fade-rise` (§9). Vertical stack:

### 7.1 Level block

1. **Eyebrow** `mb-4`: `Рівень твоєї опори` (§3.1 eyebrow).
2. **Level row** `mb-4`, `flex items-baseline gap-4`:
   - **Percentage**: `font-serif text-6xl font-bold leading-none text-navy-900`, e.g. `62%`.
     Count-up animation §9.
   - **Band title**: `font-serif text-2xl font-bold leading-tight text-navy-900`
     (band copy from `BANDS` in `questions.ts`).
3. **Level bar** `mb-4`: `h-2.5 rounded-full bg-navy-100 overflow-hidden` with
   `role="img"` + `aria-label="Рівень опори: {pct}%"`:
   - **Fill**: `h-full rounded-full bg-gold-700`, animated `width: 0 → pct%`,
     `transition-[width] duration-[1100ms] ease-out`, started ~120ms after mount (reference
     timing). Same contrast pair as §5.1 ✓.
4. **Band description**: `font-sans text-[15px] leading-relaxed text-navy-600 max-w-[52ch]`.

### 7.2 Type block (`mt-10`)

1. **Kicker** `mb-2`: `Твій тип опори` (§3.1 eyebrow style).
2. **Type title**: `font-serif text-4xl sm:text-5xl font-bold leading-[1.08] tracking-tight text-navy-900 mb-7`
   (from `ARCH[type].title`).

### 7.3 Content blocks (each `mb-6`)

Label style = §3.1 eyebrow but `text-[12px] tracking-[0.16em] mb-2`.

| Block | Label (verbatim) | Body |
|---|---|---|
| Lean | `На що ти зараз спираєшся` | `font-sans text-[17px] leading-relaxed text-navy-800` |
| Gap | `Де в тебе дефіцит` | same but `text-navy-600` (softer, as reference `.soft`) |
| Step | `Перший крок уже сьогодні` | body `text-navy-800` inside a highlight: `border-l-2 border-gold-500 bg-gold-50 rounded-r-lg py-3 pl-5 pr-4` (navy-800 on gold-50 = 11.04:1 ✓; the gold border is decorative) |

Body copy from `ARCH[type]` in `questions.ts` (verbatim from reference).

### 7.4 CTA panel (`mt-9`) — primary CTA

`relative overflow-hidden rounded-2xl bg-navy-900 p-7 sm:p-9 text-white`:

- **Decorative circle**: `absolute -right-10 -bottom-10 h-40 w-40 rounded-full bg-gold-500/15`
  (`aria-hidden`).
- **Title** `mb-4`: `font-serif text-2xl sm:text-[28px] font-bold leading-tight text-white`:
  `Ще одна важлива дія, яку можна зробити вже зараз` (16.32:1 ✓).
- **Body** `mb-6`: `font-sans text-[15px] leading-relaxed text-navy-100 max-w-[44ch]`
  (12.46:1 ✓) — long course paragraph verbatim from reference.
- **Gift sub-panel** `mb-6`: `rounded-xl border border-gold-500/40 bg-white/10 p-5`:
  - Heading `mb-2`: `font-serif italic text-[22px] text-gold-300`: `Мій подарунок тобі`
    (11.92:1 on navy-900 ✓; the translucent overlay only lightens the bg, ratio stays above this).
  - Body: `font-sans text-[15px] leading-relaxed text-white`.
- **Primary CTA link**: `Забираю курс собі` — gold link-button per §3.2
  (navy-900 on gold-500 = 7.76:1 ✓), full-width on mobile: `w-full sm:w-auto`.
- **Bonus box** `mt-5`: `rounded-lg border border-gold-500/45 bg-gold-500/15 p-4 font-sans text-sm font-semibold leading-relaxed text-gold-100`
  with `<b class="text-gold-300">Ще один подарунок:</b>` (gold-100 ≈ 13.9:1, gold-300 11.92:1 ✓;
  the 15% gold overlay on navy-900 keeps the effective bg dark — ratios remain ≥ 9:1).
- **Price microcopy** `mt-4`: `font-sans text-[13px] text-navy-200`:
  `Доступ відкритий 48 годин · зазвичай 29 €` (9.95:1 ✓).

### 7.5 After the panel

1. **Share paragraph** `mt-6`: `font-sans text-sm leading-relaxed text-navy-600` with
   `<b class="font-bold text-gold-800">@viktoria_revolution</b>` (5.94:1 ✓). Copy verbatim.
2. **Secondary CTA** `mt-6`: `Записатись на діагностику вже зараз` — outline link-button per
   §3.2. Visually subordinate to the gold panel CTA (two-CTA hierarchy preserved).
3. **Disclaimer** `mt-10`: micro style, verbatim:
   `Результат — це відображення сьогодення, а не вирок. Опора збирається. Крок за кроком.`

On entering the result screen, scroll to top (`window.scrollTo({ top: 0 })` — instant under
reduced motion, smooth otherwise) and move focus to the level-block eyebrow's heading container
(`tabIndex={-1}` on the section wrapper) so screen readers start from «Рівень твоєї опори».

### 7.6 State: Error (unrecoverable)

Only for unrecoverable failures where the result cannot be rendered at all (unexpected
exception). NOT shown for persistence failures (D5). Centered, `py-24 max-w-md mx-auto text-center flex flex-col items-center gap-5`:

- **Icon**: `flex h-14 w-14 items-center justify-center rounded-full bg-gold-100`
  containing a `!` glyph or warning SVG in `text-gold-800` (5.41:1 on gold-100 ✓), `aria-hidden`.
- **Heading**: `<h2>` `font-serif text-3xl font-bold text-navy-900`: `Щось пішло не так`
- **Text**: `font-sans text-base text-navy-600`:
  `Не вдалося показати результат. Спробуй ще раз — твої відповіді збережені на цьому екрані.`
- **Retry button**: DS `Button variant="primary" size="lg"`, label `Спробувати ще раз` —
  re-runs the failed step (answers stay in state; the user never re-answers).
- Wrapper `role="alert"`.

---

## 8. Contrast table (AC-4 — all text/background pairs)

Ratios computed from `tailwind.config.mjs` hex values (WCAG 2.1 relative luminance).
Requirement: ≥ 4.5:1 normal text, ≥ 3:1 large text (≥24px / ≥18.66px bold) and UI graphics.

| Pair | Ratio | Req | Verdict |
|---|---|---|---|
| navy-900 `#1a202c` on white (headings, %, option text) | 16.32 | 4.5 | ✅ |
| navy-800 `#243b53` on white (counter, block bodies) | 11.50 | 4.5 | ✅ |
| navy-600 `#486581` on white (lead, muted, disclaimers) | 6.08 | 4.5 | ✅ |
| gold-800 `#7c600f` on white (eyebrows, labels, @handle) | 5.94 | 4.5 | ✅ |
| gold-700 `#9a7a16` italic on white (H1 accent, large text) | 4.06 | 3 | ✅ |
| red-600 `#dc2626` on white (gate error, DS Input default) | 4.83 | 4.5 | ✅ |
| white on navy-900 (buttons, CTA panel title/body base) | 16.32 | 4.5 | ✅ |
| navy-100 `#d9e2ec` on navy-900 (CTA panel body) | 12.46 | 4.5 | ✅ |
| navy-200 `#bcccdc` on navy-900 (price microcopy) | 9.95 | 4.5 | ✅ |
| gold-300 `#eedc9a` on navy-900 (gift heading, bonus `<b>`) | 11.92 | 4.5 | ✅ |
| gold-100 `#faf4e6` on navy-900 (bonus body) | 14.88 | 4.5 | ✅ |
| navy-900 on gold-500 `#d4af37` (primary CTA link) | 7.76 | 4.5 | ✅ |
| navy-800 on gold-50/gold-100 (step highlight, error icon area) | 11.04 / 10.49 | 4.5 | ✅ |
| gold-800 on gold-100 (error icon glyph) | 5.41 | 3 (graphic) | ✅ |
| **UI graphics:** progress/result fill gold-700 vs navy-100 track | 3.10 | 3 | ✅ |
| Progress fill gold-700 vs white page | 4.06 | 3 | ✅ |
| Option marker border navy-500 on white | 4.28 | 3 | ✅ |
| Marker/border hover + focus outline gold-700 on white | 4.06 | 3 | ✅ |
| Spinner arc gold-700 vs navy-100 ring | 3.10 | 3 | ✅ |

**Prohibited on this page:** `text-gold-500`/`text-gold-600` on white or navy-50 (2.10/2.88 —
fail); `text-navy-500` for body text on white (4.28 — fails 4.5). `gold-500` may appear only
as decoration (accent bar, step border, decorative circle) or as a button BACKGROUND under
navy-900 text.

---

## 9. Motion & `prefers-reduced-motion` (AC-2)

Implement gating in JS via `window.matchMedia('(prefers-reduced-motion: reduce)')` for
JS-driven animations; CSS transitions are already globally frozen by `global.css`.

| Animation | Default | Reduced-motion fallback |
|---|---|---|
| Screen enter (intro/quiz/result/error) | `fade-rise`: opacity 0→1 + translateY 10px→0, 500ms ease, once (Tailwind arbitrary: `motion-safe:animate-[quiz-fade_0.5s_ease_both]` + `@keyframes quiz-fade` in island `<style>` or tailwind config) | No animation — screen appears instantly (use `motion-safe:` prefix) |
| Progress bar fill | `transition-[width] duration-500 ease-out` | Width jumps instantly (global CSS handles it) |
| Result level bar | width 0 → pct%, 1100ms ease-out, 120ms delay | Render at final `width: pct%` immediately, no delay (static bar) |
| Result % count-up | 0 → pct over ~700ms (rAF ticks, as reference) | **Skip entirely** — render final `{pct}%` as static text (JS matchMedia gate; CSS cannot stop this) |
| Spinner | `animate-spin` | Static ring (global CSS freezes it) |
| Option hover translate / button hover colors | `motion-safe:` micro-transitions | None / instant color change |
| Result scroll-to-top | smooth | `behavior: 'auto'` via matchMedia gate |

---

## 10. Component reuse map (for Frontend Dev)

| Piece | Reuse |
|---|---|
| Gate input + error | `@design-system/Input` (label, error, a11y wiring built in) |
| Start / Back / Retry buttons | `@design-system/Button` (primary lg / outline md / primary lg) |
| CTA links | Anchor tags with DS Button class recipes (§3.2) — same approach as `sections/opora/CtaButton.astro` |
| Headings / body inside island | `@design-system` `Heading` / `Text` where the required classes match; otherwise plain elements with §3.1 classes (don't force primitives where custom clamp sizes are needed) |
| Option card | New island subcomponent `QuizOptionCard` — props: `{ text: string; selected: boolean; onSelect: () => void }`, renders per §5.2. Keep it quiz-local (not a DS primitive) until a second consumer appears. |
| Progress | New island subcomponent `QuizProgress` — props: `{ current: number; total: number }` per §5.1 |
| Page chrome | Inline minimal header (§2.1) + `Footer variant="legal"` |

All Ukrainian copy (12 questions, ARCH, BANDS, static strings) comes verbatim from
`docs/reference/test_opora.html` via `src/utils/quiz/questions.ts` — no copy lives in
components except the static strings quoted in this spec (gate label/error/placeholder,
submitting label, error-screen copy, section labels, CTA labels).

---

## 11. Acceptance criteria check

1. ✅ Every state (intro, gate error, question+progress, submitting, result, error) has layout, spacing, tokens, typography and motion defined (§4–§7).
2. ✅ Reduced-motion fallbacks defined for progress bar, result bar and count-up (§9).
3. ✅ Page chrome recorded: minimal logo-only header + Footer `legal` (D1, §2).
4. ✅ Contrast pairs and ratios stated (§8), all ≥ 4.5:1 text / ≥ 3:1 UI.
5. ✅ Gate error copy exactly «Впиши свій нік, щоб почати»; placeholder exactly `@твій нік в інстаграмі` (§4.6).

**Handoff:** Frontend Dev — subtask «Frontend: QuizApp island». After implementation, request
Playwright screenshots from QA for visual verification against this spec (Designer will file
polish tasks if needed).
