# Course Landing "Опора на себе" Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static course landing page for the 3-day mini-course "Опора на себе" at `/courses/opora`, in the project's light design system with dramatic navy accent sections, Ukrainian copy.

**Architecture:** A single static Astro page (`src/pages/courses/opora.astro`) composed from `@design-system` React primitives (rendered statically — 0KB JS) plus small local presentational `.astro` sub-components in `src/components/sections/opora/`. CTAs are `<a>` links (CtaButton.astro) to an external checkout URL. The `/courses` catalog is reduced to one real card; three dummy detail pages are removed.

**Tech Stack:** Astro 4.x (static), React 18 (static render via `@astrojs/react`), Tailwind CSS 3.x, TypeScript strict, Playwright (e2e smoke).

## Global Constraints

- Language: page copy in Ukrainian (verbatim from spec); code/comments/commits in English.
- 0KB JS for the page: static only. FAQ = native `<details>`; sticky bar, accordion marker, timeline = CSS only. No new npm dependencies.
- Tailwind utility classes only; tokens navy/gold/sage, fonts `font-serif`/`font-sans`. No CSS-in-JS, no inline styles except documented decorative positioning.
- Every "ЗАБРАТИ ЗА 9 €" CTA links to `import.meta.env.PUBLIC_OPORA_CHECKOUT_URL || '#'`.
- Design system imported via `@design-system`; CTA links use `CtaButton.astro` (anchor styled as button) — never a `<button>` inside `<a>`.
- Accessibility: single `<h1>`, semantic landmarks, `alt` on images, `<details>` keyboard-accessible, contrast ≥4.5:1 (gold text uses `gold-600`/`gold-700`).
- Images via Astro `<Image>` (hero eager + `fetchpriority="high"`; rest lazy).
- Do NOT `git push` without explicit user approval.

---

### Task 1: Routing scaffold, catalog update, remove dummy pages, env

**Files:**
- Create: `src/pages/courses/opora.astro`
- Modify: `src/pages/courses.astro` (replace 3 dummy cards with 1 real card)
- Modify: `.env.example` (add `PUBLIC_OPORA_CHECKOUT_URL`)
- Delete: `src/pages/courses/my-course.astro`, `src/pages/courses/mindset-mastery.astro`, `src/pages/courses/goals-achievement.astro`

**Interfaces:**
- Consumes: `@layouts/BaseLayout.astro` (props `title`, `description`), `@components/layout/Header.astro` (`variant`), `@components/layout/Footer.astro` (`variant`).
- Produces: page route `/courses/opora`; a top-of-frontmatter `const checkoutUrl = import.meta.env.PUBLIC_OPORA_CHECKOUT_URL || '#';` that every later section reads. The `<main>` contains numbered HTML comment slots (`<!-- SECTION: hero -->` … `<!-- SECTION: journey -->`) that later tasks replace.

- [ ] **Step 1: Create the page skeleton**

`src/pages/courses/opora.astro`:

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
import Header from '@components/layout/Header.astro';
import Footer from '@components/layout/Footer.astro';

const checkoutUrl = import.meta.env.PUBLIC_OPORA_CHECKOUT_URL || '#';
---

<BaseLayout
  title="Опора на себе — 3-денний міні-курс · Вікторія Жульова"
  description="За три дні розберемось, чому тебе виснажує й тривожить. Практики спокою, зменшення внутрішнього критика і дорослий план. Один платіж 9 €, усе в Телеграмі."
>
  <Header variant="main" />

  <main class="overflow-x-hidden">
    <!-- SECTION: hero -->
    <!-- SECTION: where -->
    <!-- SECTION: bridge -->
    <!-- SECTION: changes -->
    <!-- SECTION: bonuses -->
    <!-- SECTION: about -->
    <!-- SECTION: testimonials -->
    <!-- SECTION: buy -->
    <!-- SECTION: faq -->
    <!-- SECTION: journey -->
  </main>

  <Footer variant="legal" />
  <!-- SECTION: sticky -->
</BaseLayout>
```

- [ ] **Step 2: Replace the catalog cards in `src/pages/courses.astro`**

Replace the entire `<!-- Courses Grid -->` `<section>` (lines ~24-96, the three `<article>` cards) with a single card:

```astro
    <!-- Courses Grid -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <article class="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow border border-navy-100">
          <div class="bg-gradient-to-br from-navy-800 to-navy-900 h-48 flex items-center justify-center">
            <span class="font-serif text-3xl font-bold text-gold-400">Опора на себе</span>
          </div>
          <div class="p-6">
            <h2 class="text-2xl font-serif font-bold text-navy-900 mb-3">
              Опора на себе
            </h2>
            <p class="text-navy-700 mb-6 leading-relaxed">
              3-денний міні-курс: практики спокою, зменшення внутрішнього критика і дорослий план, від якого голова не болить.
            </p>
            <a
              href="/courses/opora"
              class="inline-block bg-navy-900 text-white px-6 py-3 rounded-lg font-medium hover:bg-navy-800 transition-colors"
            >
              Дізнатись більше
            </a>
          </div>
        </article>
      </div>
    </section>
```

- [ ] **Step 3: Add the env var to `.env.example`**

Append to `.env.example`:

```bash
# Опора на себе course checkout (external payment link)
PUBLIC_OPORA_CHECKOUT_URL=
```

- [ ] **Step 4: Delete the three dummy detail pages**

```bash
git rm src/pages/courses/my-course.astro src/pages/courses/mindset-mastery.astro src/pages/courses/goals-achievement.astro
```

- [ ] **Step 5: Verify build and no dangling links**

```bash
npm run build
grep -rn "my-course\|mindset-mastery\|goals-achievement" src || echo "no dangling links"
```
Expected: build succeeds; the grep prints "no dangling links" (no references remain). `dist/courses/opora/index.html` exists.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: scaffold opora landing route, reduce courses catalog to one card"
```

---

### Task 2: Shared sub-components (eyebrow, check item, CTA, sticky bar)

**Files:**
- Create: `src/components/sections/opora/SectionEyebrow.astro`
- Create: `src/components/sections/opora/CheckItem.astro`
- Create: `src/components/sections/opora/CtaButton.astro`
- Create: `src/components/sections/opora/StickyCta.astro`
- Modify: `src/pages/courses/opora.astro` (mount StickyCta)

**Interfaces:**
- Produces:
  - `SectionEyebrow` — props `num: string`, `label: string`.
  - `CheckItem` — prop `tone?: 'light' | 'dark'` (default `'light'`); content via `<slot/>`; renders an `<li>`.
  - `CtaButton` — props `href: string`, `size?: 'md' | 'lg'` (default `'lg'`), `class?: string`; content via `<slot/>`; renders a gold `<a>`.
  - `StickyCta` — prop `href: string`; fixed bottom bar.

- [ ] **Step 1: Create `SectionEyebrow.astro`**

```astro
---
interface Props {
  num: string;
  label: string;
}
const { num, label } = Astro.props;
---
<p class="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-gold-600">
  <span class="text-gold-500">{num}</span> / {label}
</p>
```

- [ ] **Step 2: Create `CheckItem.astro`**

```astro
---
interface Props {
  tone?: 'light' | 'dark';
}
const { tone = 'light' } = Astro.props;
const textClass = tone === 'dark' ? 'text-white/90' : 'text-navy-800';
---
<li class="flex items-start gap-3">
  <svg class="mt-0.5 h-5 w-5 flex-shrink-0 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
  </svg>
  <span class={`font-sans ${textClass}`}><slot /></span>
</li>
```

- [ ] **Step 3: Create `CtaButton.astro`**

```astro
---
interface Props {
  href: string;
  size?: 'md' | 'lg';
  class?: string;
}
const { href, size = 'lg', class: className = '' } = Astro.props;
const sizeClasses = size === 'lg' ? 'px-8 py-4 text-lg' : 'px-6 py-3 text-base';
---
<a
  href={href}
  class={`inline-flex items-center justify-center gap-2 rounded-lg font-medium bg-gold-500 text-navy-900 transition-colors hover:bg-gold-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gold-600 ${sizeClasses} ${className}`}
>
  <slot />
</a>
```

- [ ] **Step 4: Create `StickyCta.astro`**

```astro
---
import CtaButton from './CtaButton.astro';
interface Props {
  href: string;
}
const { href } = Astro.props;
---
<div class="fixed inset-x-0 bottom-0 z-40 border-t border-navy-100 bg-white/95 backdrop-blur print:hidden">
  <div class="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
    <p class="text-sm font-medium text-navy-900">
      <span class="font-serif">Опора на себе</span> · 9 €
    </p>
    <CtaButton href={href} size="md">Забрати</CtaButton>
  </div>
</div>
```

- [ ] **Step 5: Mount StickyCta in the page**

In `src/pages/courses/opora.astro`, add the import to frontmatter:

```astro
import StickyCta from '@components/sections/opora/StickyCta.astro';
```

Replace `<!-- SECTION: sticky -->` with:

```astro
  <StickyCta href={checkoutUrl} />
```

- [ ] **Step 6: Verify build**

```bash
npm run build
grep -c "Опора на себе" dist/courses/opora/index.html
```
Expected: build succeeds; grep count ≥ 1 (sticky bar text present).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add opora shared sub-components (eyebrow, check, cta, sticky)"
```

---

### Task 3: Hero section

**Files:**
- Create: `src/components/sections/opora/HeroOpora.astro`
- Modify: `src/pages/courses/opora.astro`

**Interfaces:**
- Consumes: `CtaButton` (Task 2); `@design-system` `Badge`; Astro `<Image>`; `@assets/hero-viktoria-luxury.webp`.
- Produces: `HeroOpora` — prop `href: string`.

- [ ] **Step 1: Create `HeroOpora.astro`**

```astro
---
import { Image } from 'astro:assets';
import { Badge } from '@design-system';
import CtaButton from './CtaButton.astro';
import heroImage from '@assets/hero-viktoria-luxury.webp';

interface Props {
  href: string;
}
const { href } = Astro.props;
---
<section class="bg-gradient-to-b from-white to-sage-50 pt-32 pb-16">
  <div class="mx-auto grid max-w-6xl items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
    <div class="order-2 lg:order-1">
      <Badge variant="gold">3-денний міні-курс · «Опора на себе»</Badge>
      <h1 class="mt-6 font-serif text-4xl font-bold leading-tight text-navy-900 md:text-5xl">
        «Просто візьми себе в руки» сто разів чула, і все ще не працює.
      </h1>
      <p class="mt-6 text-lg leading-relaxed text-navy-700">
        Бо сила волі тут ні до чого. За три дні розберемось, чому тебе так виснажує й тривожить, і ти забереш собі практики спокою, зменшення внутрішнього критика і вибудуєш дорослий план, від якого голова не болить.
      </p>
      <div class="mt-8">
        <CtaButton href={href}>ЗАБРАТИ ЗА 9 €</CtaButton>
        <p class="mt-3 text-sm text-navy-500">
          Один платіж. Доступ одразу після оплати й лишається назавжди.
        </p>
      </div>
      <p class="mt-8 text-sm text-navy-600">
        3 уроки + 2 медитації-практики (одна з РЕЙКІ)
        <span class="mx-2 text-gold-500">·</span> усе в Телеграмі
        <span class="mx-2 text-gold-500">·</span> проходиш сама у своєму темпі
      </p>
    </div>
    <div class="order-1 lg:order-2">
      <Image
        src={heroImage}
        alt="Вікторія Жульова — коуч курсу «Опора на себе»"
        widths={[400, 600, 800]}
        sizes="(max-width: 1024px) 100vw, 50vw"
        loading="eager"
        fetchpriority="high"
        class="mx-auto w-full max-w-md rounded-2xl shadow-xl"
      />
    </div>
  </div>
</section>
```

- [ ] **Step 2: Wire into the page**

In `opora.astro` frontmatter add:

```astro
import HeroOpora from '@components/sections/opora/HeroOpora.astro';
```

Replace `<!-- SECTION: hero -->` with:

```astro
    <HeroOpora href={checkoutUrl} />
```

- [ ] **Step 3: Verify build**

```bash
npm run build
grep -c "сто разів чула" dist/courses/opora/index.html
```
Expected: build succeeds; grep count = 1 (single `<h1>`).

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add opora hero section"
```

---

### Task 4: Block 2 — "Де це сидить у житті" (compare rows)

**Files:**
- Create: `src/components/sections/opora/CompareRow.astro`
- Create: `src/components/sections/opora/WhereSection.astro`
- Modify: `src/pages/courses/opora.astro`

**Interfaces:**
- Consumes: `SectionEyebrow` (Task 2); `@design-system` `Badge`, `Heading`.
- Produces: `CompareRow` — props `label: string`, `now: string`, `support: string`. `WhereSection` — no props.

- [ ] **Step 1: Create `CompareRow.astro`**

```astro
---
import { Badge } from '@design-system';
interface Props {
  label: string;
  now: string;
  support: string;
}
const { label, now, support } = Astro.props;
---
<div class="rounded-xl border border-navy-200 p-6">
  <Badge variant="navy">{label}</Badge>
  <div class="mt-4 grid gap-4 md:grid-cols-2">
    <div class="rounded-lg bg-navy-50 p-4">
      <p class="text-xs font-semibold uppercase tracking-wider text-navy-500">Зараз</p>
      <p class="mt-2 leading-relaxed text-navy-800">{now}</p>
    </div>
    <div class="rounded-lg bg-sage-50 p-4">
      <p class="text-xs font-semibold uppercase tracking-wider text-gold-600">З опорою</p>
      <p class="mt-2 leading-relaxed text-navy-800">{support}</p>
    </div>
  </div>
</div>
```

- [ ] **Step 2: Create `WhereSection.astro`**

```astro
---
import SectionEyebrow from './SectionEyebrow.astro';
import CompareRow from './CompareRow.astro';
---
<section class="bg-white py-20">
  <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
    <SectionEyebrow num="01" label="Де це сидить у житті" />
    <h2 class="font-serif text-3xl font-bold text-navy-900 md:text-4xl">
      Тривога забирає не тільки настрій
    </h2>
    <div class="mt-10 space-y-6">
      <CompareRow
        label="Вечір"
        now="Лягаєш без сил, а голова крутить ту саму думку по колу, і привіт безсоння."
        support="Кілька вправ — і всередині спокій, щоб можна було заснути."
      />
      <CompareRow
        label="Ранок"
        now="Прокидаєшся втомленою, ще нічого не зробила, а вже немає енергії та сили."
        support="Робиш одну маленьку справу для себе зранку — і день з новими фарбами."
      />
      <CompareRow
        label="Голова"
        now="«Я не справляюся», «в інших вийшло, а в мене ні» — думки крутяться по колу."
        support="Вчишся ловити цю думку й відповідати їй по-дорослому, і голова тихішає."
      />
    </div>
  </div>
</section>
```

> Content note: the brief truncated the "Голова" line and gave no "З опорою" for it. The copy above completes it on-brand (aligned with Lesson 2). The user may adjust.

- [ ] **Step 3: Wire into the page**

In `opora.astro` frontmatter add:

```astro
import WhereSection from '@components/sections/opora/WhereSection.astro';
```

Replace `<!-- SECTION: where -->` with:

```astro
    <WhereSection />
```

- [ ] **Step 4: Verify build**

```bash
npm run build
grep -c "Тривога забирає не тільки настрій" dist/courses/opora/index.html
```
Expected: build succeeds; grep count = 1.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add opora 'where it sits' compare section"
```

---

### Task 5: Block 3 — bridge (navy)

**Files:**
- Create: `src/components/sections/opora/BridgeSection.astro`
- Modify: `src/pages/courses/opora.astro`

**Interfaces:**
- Produces: `BridgeSection` — no props.

- [ ] **Step 1: Create `BridgeSection.astro`**

```astro
---
const steps = [
  { num: '1', title: 'Тіло', text: 'Починаємо з практик для тіла, щоб збити тривогу.' },
  { num: '2', title: 'Критик', text: 'Зменшуємо внутрішнього критика, який краде сили.' },
  { num: '3', title: 'Опора', text: 'Будуємо опору через маленькі кроки.' },
];
---
<section class="bg-navy-900 py-20">
  <div class="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
    <h2 class="font-serif text-2xl font-bold text-white md:text-3xl">
      По троху і без чарівної пігулки
    </h2>
    <p class="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/80">
      Ці три дні починаються з практик для тіла, далі зменшуємо критика, який краде сили, і аж тоді будуємо опору через маленькі кроки.
    </p>
    <div class="mt-12 grid gap-8 sm:grid-cols-3">
      {steps.map((s) => (
        <div>
          <span class="font-serif text-4xl font-bold text-gold-500">{s.num}</span>
          <h3 class="mt-3 font-serif text-xl font-semibold text-white">{s.title}</h3>
          <p class="mt-2 text-sm text-white/70">{s.text}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Wire into the page**

In `opora.astro` frontmatter add:

```astro
import BridgeSection from '@components/sections/opora/BridgeSection.astro';
```

Replace `<!-- SECTION: bridge -->` with:

```astro
    <BridgeSection />
```

- [ ] **Step 3: Verify build**

```bash
npm run build
grep -c "без чарівної пігулки" dist/courses/opora/index.html
```
Expected: build succeeds; grep count = 1.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add opora bridge (navy) section"
```

---

### Task 6: Block 4 — "Що почне мінятися" (lessons)

**Files:**
- Create: `src/components/sections/opora/LessonCard.astro`
- Create: `src/components/sections/opora/ChangesSection.astro`
- Modify: `src/pages/courses/opora.astro`

**Interfaces:**
- Consumes: `SectionEyebrow`; `@design-system` `Badge`.
- Produces: `LessonCard` — props `tag: string`, `title: string`, `text: string`, `highlight?: boolean`. `ChangesSection` — no props.

- [ ] **Step 1: Create `LessonCard.astro`**

```astro
---
import { Badge } from '@design-system';
interface Props {
  tag: string;
  title: string;
  text: string;
  highlight?: boolean;
}
const { tag, title, text, highlight = false } = Astro.props;
const ring = highlight ? 'border-gold-300 ring-1 ring-gold-200' : 'border-navy-100';
---
<div class={`rounded-xl border bg-white p-6 shadow-sm ${ring}`}>
  <Badge variant="gold">{tag}</Badge>
  <h3 class="mt-4 font-serif text-xl font-semibold text-navy-900">{title}</h3>
  <p class="mt-2 leading-relaxed text-navy-700">{text}</p>
</div>
```

- [ ] **Step 2: Create `ChangesSection.astro`**

```astro
---
import SectionEyebrow from './SectionEyebrow.astro';
import LessonCard from './LessonCard.astro';

const items = [
  {
    tag: 'Урок 1',
    title: 'Чому тебе постійно в тривозі і не встигаєш насолоджуватись життям',
    text: 'Розумієш нарешті, чому валишся з ніг і чому тягне в телефон, коли це зовсім не про лінь. Забираєш заземлення в три рухи й збиваєш тривогу за дві хвилини в ситуації, де вона наростає.',
  },
  {
    tag: 'Урок 2',
    title: 'Перестань себе жерти',
    text: 'Той голос, що шепоче «яка з тебе мати» і «куди ти лізеш», затикається. Вчишся ловити свого критика, показувати йому його місце і відрізняти, де твоя доросла частина, а де той жук-критикан.',
  },
  {
    tag: 'Урок 3',
    title: 'Опора — це не настрій, це маленькі дії до себе',
    text: 'Складаєш свій дорослий план із чотирьох питань, від якого вночі відпускає. І впізнаєш три пастки, в які провалюється майже кожна, хто переїхала за кордон.',
  },
  {
    tag: 'Практика 1',
    title: 'Медитація рейкі: верхній і нижній потік',
    text: '13 хвилин увечері, після яких опору відчуваєш тілом. Практика рейкі знімає напругу, вивільняє негативну енергію, налагоджує твій баланс.',
    highlight: true,
  },
  {
    tag: 'Практика 2',
    title: 'Зустріч із внутрішнім критиком',
    text: 'Навчишся свого внутрішнього критика виділяти серед тисячі голосів, щоб він більше не заважав тобі жити і бити по самооцінці, а навпаки — подружитись з цією частиною.',
  },
];
---
<section class="bg-white py-20">
  <div class="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
    <SectionEyebrow num="03" label="Що всередині" />
    <h2 class="font-serif text-3xl font-bold text-navy-900 md:text-4xl">
      Що почне мінятися вже за три дні
    </h2>
    <p class="mt-4 text-lg text-navy-600">
      Кожен день — один урок, який слухаєш за 20 хвилин з чашкою чаю.
    </p>
    <div class="mt-10 space-y-5">
      {items.map((it) => (
        <LessonCard tag={it.tag} title={it.title} text={it.text} highlight={it.highlight} />
      ))}
    </div>
    <p class="mt-6 text-sm text-navy-500">
      До кожного уроку — короткий конспект у PDF, до кожної практики — коротка інструкція. Щоб повертатися до головного, коли немає часу переслуховувати.
    </p>
  </div>
</section>
```

- [ ] **Step 3: Wire into the page**

In `opora.astro` frontmatter add:

```astro
import ChangesSection from '@components/sections/opora/ChangesSection.astro';
```

Replace `<!-- SECTION: changes -->` with:

```astro
    <ChangesSection />
```

- [ ] **Step 4: Verify build**

```bash
npm run build
grep -c "Що почне мінятися вже за три дні" dist/courses/opora/index.html
```
Expected: build succeeds; grep count = 1.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add opora 'what changes' lessons section"
```

---

### Task 7: Block 5 — bonuses

**Files:**
- Create: `src/components/sections/opora/BonusesSection.astro`
- Modify: `src/pages/courses/opora.astro`

**Interfaces:**
- Consumes: `SectionEyebrow`.
- Produces: `BonusesSection` — no props.

- [ ] **Step 1: Create `BonusesSection.astro`**

```astro
---
import SectionEyebrow from './SectionEyebrow.astro';

const bonuses = [
  {
    title: 'Конспект кожного уроку',
    text: 'Суть кожного дня на одній сторінці. Відкриваєш, коли треба швидко згадати, без переслуховування всього наново.',
  },
  {
    title: 'Інструкція до медитації рейкі',
    text: 'На що вона впливає, як часто й коли робити, щоб ефект тримався. Щоб ти не питала себе «а я правильно роблю».',
  },
  {
    title: 'Інструкція до практики з критиком',
    text: 'Що змінюється, коли робиш її не один раз, і як кликати критика на імʼя просто в моменті, коли він вмикається.',
  },
];
---
<section class="bg-sage-50 py-20">
  <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
    <SectionEyebrow num="04" label="Що ще забираєш" />
    <h2 class="font-serif text-3xl font-bold text-navy-900 md:text-4xl">
      Конспекти й інструкції, щоб не загубити головне
    </h2>
    <div class="mt-10 grid gap-6 md:grid-cols-3">
      {bonuses.map((b) => (
        <div class="rounded-xl border border-navy-100 bg-white p-6">
          <svg class="h-8 w-8 text-gold-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 class="mt-4 font-serif text-lg font-semibold text-navy-900">{b.title}</h3>
          <p class="mt-2 text-sm leading-relaxed text-navy-700">{b.text}</p>
        </div>
      ))}
    </div>
    <p class="mt-6 text-sm text-navy-500">
      Усе це вже всередині, доплачувати нічого не треба.
    </p>
  </div>
</section>
```

- [ ] **Step 2: Wire into the page**

In `opora.astro` frontmatter add:

```astro
import BonusesSection from '@components/sections/opora/BonusesSection.astro';
```

Replace `<!-- SECTION: bonuses -->` with:

```astro
    <BonusesSection />
```

- [ ] **Step 3: Verify build**

```bash
npm run build
grep -c "щоб не загубити головне" dist/courses/opora/index.html
```
Expected: build succeeds; grep count = 1.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add opora bonuses section"
```

---

### Task 8: Block 6 — "Хто я" (about)

**Files:**
- Create: `src/components/sections/opora/AboutSection.astro`
- Modify: `src/pages/courses/opora.astro`

**Interfaces:**
- Consumes: `SectionEyebrow`, `CheckItem` (Task 2); Astro `<Image>`; `@assets/footer-viktoria.webp`.
- Produces: `AboutSection` — no props.

- [ ] **Step 1: Create `AboutSection.astro`**

```astro
---
import { Image } from 'astro:assets';
import SectionEyebrow from './SectionEyebrow.astro';
import CheckItem from './CheckItem.astro';
import portrait from '@assets/footer-viktoria.webp';

const regalia = [
  'Сертифікований коуч, 10+ років практики',
  '200+ клієнтів, які дійшли до своїх цілей',
  'Майстер рейкі 2 ступені, працюю зі станами та хворобами енергетично',
  'НЛП, медитації, перепрограмування старих патернів',
];
---
<section class="bg-white py-20">
  <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
    <SectionEyebrow num="05" label="Хто я" />
    <div class="grid items-start gap-12 lg:grid-cols-2">
      <Image
        src={portrait}
        alt="Вікторія Жульова"
        widths={[400, 600]}
        sizes="(max-width: 1024px) 100vw, 50vw"
        loading="lazy"
        class="mx-auto w-full max-w-sm rounded-2xl ring-2 ring-gold-300"
      />
      <div>
        <h2 class="font-serif text-3xl font-bold text-navy-900 md:text-4xl">
          Вікторія Жульова
        </h2>
        <ul class="mt-6 space-y-3">
          {regalia.map((r) => <CheckItem>{r}</CheckItem>)}
        </ul>
        <p class="mt-6 leading-relaxed text-navy-700">
          Я не вчу з книжки. Сама тривожниця й гіперконтролерка з тих, що мусять тримати все під контролем, бо інакше всередині паніка. Свого часу лежала на дивані вигоріла дотла й дивилась серіали про любов, аби не дивитись у реальність. І зібрала себе з нуля, по цеглинці. Тому цю дорогу я знаю зсередини й проведу тебе нею швидше, ніж ти пройшла б сама.
        </p>
        <a
          href="https://instagram.com/viktoria_revolution"
          target="_blank"
          rel="noopener noreferrer"
          class="mt-8 inline-flex items-center gap-2 rounded-lg border-2 border-navy-900 px-6 py-3 font-medium text-navy-900 transition-colors hover:bg-navy-50"
        >
          instagram @viktoria_revolution
        </a>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Wire into the page**

In `opora.astro` frontmatter add:

```astro
import AboutSection from '@components/sections/opora/AboutSection.astro';
```

Replace `<!-- SECTION: about -->` with:

```astro
    <AboutSection />
```

- [ ] **Step 3: Verify build**

```bash
npm run build
grep -c "viktoria_revolution" dist/courses/opora/index.html
```
Expected: build succeeds; grep count ≥ 1.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add opora about (who am I) section"
```

---

### Task 9: Block 7 — testimonials placeholder

**Files:**
- Create: `src/components/sections/opora/TestimonialsSection.astro`
- Modify: `src/pages/courses/opora.astro`

**Interfaces:**
- Consumes: `SectionEyebrow`.
- Produces: `TestimonialsSection` — no props.

- [ ] **Step 1: Create `TestimonialsSection.astro`**

```astro
---
import SectionEyebrow from './SectionEyebrow.astro';
// TODO: insert testimonial screenshots from Instagram direct here.
const placeholders = [1, 2, 3, 4, 5, 6];
---
<section class="bg-white py-20">
  <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
    <SectionEyebrow num="06" label="Що кажуть" />
    <h2 class="font-serif text-3xl font-bold text-navy-900 md:text-4xl">
      Відгуки тих, хто вже пройшов
    </h2>
    <p class="mt-4 text-navy-600">Скоро тут зʼявляться скріни відгуків із директу.</p>
    <div class="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {placeholders.map((n) => (
        <div class="flex aspect-[4/3] items-center justify-center rounded-xl border border-dashed border-navy-200 bg-navy-50 text-sm text-navy-400">
          Відгук {n}
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Wire into the page**

In `opora.astro` frontmatter add:

```astro
import TestimonialsSection from '@components/sections/opora/TestimonialsSection.astro';
```

Replace `<!-- SECTION: testimonials -->` with:

```astro
    <TestimonialsSection />
```

- [ ] **Step 3: Verify build**

```bash
npm run build
grep -c "Відгуки тих, хто вже пройшов" dist/courses/opora/index.html
```
Expected: build succeeds; grep count = 1.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add opora testimonials placeholder section"
```

---

### Task 10: Block 8 — "Забрати за 9 €" (buy, navy)

**Files:**
- Create: `src/components/sections/opora/BuySection.astro`
- Modify: `src/pages/courses/opora.astro`

**Interfaces:**
- Consumes: `SectionEyebrow`, `CheckItem`, `CtaButton`.
- Produces: `BuySection` — prop `href: string`.

- [ ] **Step 1: Create `BuySection.astro`**

```astro
---
import SectionEyebrow from './SectionEyebrow.astro';
import CheckItem from './CheckItem.astro';
import CtaButton from './CtaButton.astro';

interface Props {
  href: string;
}
const { href } = Astro.props;

const includes = [
  '3 уроки по 20 хвилин, які слухаєш з чашкою чаю',
  '2 практики-медитації: рейкі й робота з критиком',
  'Конспекти й інструкції в PDF, щоб усе лишилось під рукою',
  'Усе в Телеграмі, проходиш сама у своєму темпі',
  'Один платіж 9 €, доступ одразу й назавжди',
];
---
<section class="bg-navy-900 py-20">
  <div class="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
    <SectionEyebrow num="07" label="Забрати курс" />
    <h2 class="font-serif text-3xl font-bold text-white md:text-4xl">
      Спробуй «Опору на себе» за 9 €
    </h2>
    <ul class="mx-auto mt-8 max-w-xl space-y-3 text-left">
      {includes.map((i) => <CheckItem tone="dark">{i}</CheckItem>)}
    </ul>
    <div class="mt-10">
      <CtaButton href={href}>ЗАБРАТИ ЗА 9 €</CtaButton>
      <p class="mt-3 text-sm text-white/70">
        Оплата онлайн, одразу після неї бот відкриває перший урок.
      </p>
    </div>
    <p class="mx-auto mt-8 max-w-xl text-navy-200">
      9 євро — це менше за каву з десертом удвох. А з цих трьох днів ти забираєш те,
      <span class="text-gold-400"> що лишається з тобою назавжди.</span>
    </p>
  </div>
</section>
```

- [ ] **Step 2: Wire into the page**

In `opora.astro` frontmatter add:

```astro
import BuySection from '@components/sections/opora/BuySection.astro';
```

Replace `<!-- SECTION: buy -->` with:

```astro
    <BuySection href={checkoutUrl} />
```

- [ ] **Step 3: Verify build**

```bash
npm run build
grep -c "Спробуй «Опору на себе» за 9" dist/courses/opora/index.html
```
Expected: build succeeds; grep count = 1.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add opora buy (navy) section"
```

---

### Task 11: Block 9 — FAQ (native details)

**Files:**
- Create: `src/components/sections/opora/FaqItem.astro`
- Create: `src/components/sections/opora/FaqSection.astro`
- Modify: `src/pages/courses/opora.astro`

**Interfaces:**
- Consumes: `SectionEyebrow`.
- Produces: `FaqItem` — prop `question: string`; answer via `<slot/>`. `FaqSection` — no props.

- [ ] **Step 1: Create `FaqItem.astro`**

```astro
---
interface Props {
  question: string;
}
const { question } = Astro.props;
---
<details class="faq-item border-b border-navy-200 py-5">
  <summary class="flex cursor-pointer items-center justify-between gap-4 text-lg font-medium text-navy-900">
    <span>{question}</span>
    <span class="faq-marker text-2xl leading-none text-gold-600" aria-hidden="true"></span>
  </summary>
  <div class="mt-3 leading-relaxed text-navy-700">
    <slot />
  </div>
</details>

<style>
  .faq-item > summary { list-style: none; }
  .faq-item > summary::-webkit-details-marker { display: none; }
  .faq-marker::after { content: '+'; }
  .faq-item[open] .faq-marker::after { content: '−'; }
</style>
```

- [ ] **Step 2: Create `FaqSection.astro`**

```astro
---
import SectionEyebrow from './SectionEyebrow.astro';
import FaqItem from './FaqItem.astro';

const faqs = [
  {
    q: 'У мене немає часу на курси.',
    a: 'Урок — 20–30 хвилин, слухаєш поки готуєш вечерю чи їдеш в транспорті. Практику можна ставити на вечір замість чергового Інстаграму. Усе вбудовується в день, коли не залипаєш на швидкий дофамін.',
  },
  {
    q: 'Я ніколи не медитувала, в мене не вийде.',
    a: 'Тут нічого не треба робити «правильно». Ти просто слухаєш мій голос і дихаєш. Якщо думки тікають, це нормально, я веду тебе крок за кроком.',
  },
  {
    q: 'А якщо в мене все зовсім запущено?',
    a: 'Саме для цього стану воно й зроблено. Починаємо з тіла, з найпростішого, без вимог бути молодцем. Перше полегшення часто приходить уже після першого заземлення.',
  },
  {
    q: 'Це замінить психолога?',
    a: 'Ні. Це самопідтримка, реальні кроки, які можна робити самій. Якщо тебе крутить тижнями й само не відпускає, варто дійти до фахівця, і це доросле рішення про себе.',
  },
  {
    q: 'Як приходить доступ?',
    a: 'Одразу після оплати бот відкриває курс. Далі йдеш у своєму темпі, доступ лишається назавжди, можна вертатись скільки треба.',
  },
  {
    q: 'Точно без підписки?',
    a: 'Так, один платіж 9 €, ніяких автосписань. Нічого само не продовжується.',
  },
];
---
<section class="bg-sage-50 py-20">
  <div class="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
    <SectionEyebrow num="08" label="Часті питання" />
    <h2 class="font-serif text-3xl font-bold text-navy-900 md:text-4xl">
      Часті питання
    </h2>
    <div class="mt-8">
      {faqs.map((f) => <FaqItem question={f.q}>{f.a}</FaqItem>)}
    </div>
  </div>
</section>
```

- [ ] **Step 3: Wire into the page**

In `opora.astro` frontmatter add:

```astro
import FaqSection from '@components/sections/opora/FaqSection.astro';
```

Replace `<!-- SECTION: faq -->` with:

```astro
    <FaqSection />
```

- [ ] **Step 4: Verify build**

```bash
npm run build
grep -c "Точно без підписки" dist/courses/opora/index.html
```
Expected: build succeeds; grep count = 1.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add opora FAQ section (native details)"
```

---

### Task 12: Block 10 — "Куди ти прийдеш" (timeline)

**Files:**
- Create: `src/components/sections/opora/JourneySection.astro`
- Modify: `src/pages/courses/opora.astro`

**Interfaces:**
- Consumes: `SectionEyebrow`, `CtaButton`.
- Produces: `JourneySection` — prop `href: string`.

- [ ] **Step 1: Create `JourneySection.astro`**

```astro
---
import SectionEyebrow from './SectionEyebrow.astro';
import CtaButton from './CtaButton.astro';

interface Props {
  href: string;
}
const { href } = Astro.props;

const steps = [
  { when: 'День 1', text: 'Робиш перше заземлення, і вперше за довгий час голова на пару хвилин замовкає.' },
  { when: 'Кінець 3 днів', text: 'У тебе є план від нічної тривоги, тихіший критик і дві практики, до яких можна вертатись.' },
  { when: 'Через тиждень', text: 'Помічаєш, що рідше зриваєшся в самобичування й частіше ловиш себе раніше.' },
  { when: 'Через місяць', text: 'Опора збирається з дрібних дотриманих обіцянок собі, і ти потроху відчуваєш під ногами тверду землю.' },
];
---
<section class="bg-white py-20">
  <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
    <SectionEyebrow num="09" label="Куди ти прийдеш" />
    <h2 class="font-serif text-3xl font-bold text-navy-900 md:text-4xl">
      Що міняється, коли почнеш
    </h2>
    <p class="mt-4 max-w-2xl text-lg text-navy-600">
      Заходиш за 9 € і йдеш по днях. Далі все вирішує те, чи робиш ти ці дрібні кроки. Орієнтовно дорога складається так:
    </p>
    <ol class="mt-10 grid gap-6 md:grid-cols-4">
      {steps.map((s) => (
        <li class="relative rounded-xl border-t-4 border-gold-400 bg-navy-50 p-5">
          <span class="font-serif text-sm font-bold uppercase tracking-wider text-gold-600">{s.when}</span>
          <p class="mt-2 text-sm leading-relaxed text-navy-800">{s.text}</p>
        </li>
      ))}
    </ol>
    <div class="mt-12 text-center">
      <CtaButton href={href}>ЗАБРАТИ ЗА 9 €</CtaButton>
      <p class="mt-3 text-sm text-navy-500">Один платіж 9 €, доступ одразу й назавжди.</p>
    </div>
  </div>
</section>
```

> Note: the spec's "доступ на три місяці" line conflicts with the brief's other blocks ("назавжди"). This plan uses "назавжди" consistently (matches blocks 1 and 8). The user may change the access duration globally if needed.

- [ ] **Step 2: Wire into the page**

In `opora.astro` frontmatter add:

```astro
import JourneySection from '@components/sections/opora/JourneySection.astro';
```

Replace `<!-- SECTION: journey -->` with:

```astro
    <JourneySection href={checkoutUrl} />
```

- [ ] **Step 3: Verify build**

```bash
npm run build
grep -c "Що міняється, коли почнеш" dist/courses/opora/index.html
```
Expected: build succeeds; grep count = 1.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: add opora journey (timeline) section"
```

---

### Task 13: SEO JSON-LD + e2e smoke test + final verification

**Files:**
- Modify: `src/pages/courses/opora.astro` (add `Course` JSON-LD)
- Create: `tests/e2e/opora.spec.ts`

**Interfaces:**
- Consumes: the full page from Tasks 1-12.
- Produces: `Course` structured data; an e2e smoke test.

- [ ] **Step 1: Add `Course` JSON-LD to the page**

In `src/pages/courses/opora.astro` frontmatter, after the `checkoutUrl` line, add:

```astro
const courseSchema = {
  '@context': 'https://schema.org',
  '@type': 'Course',
  name: 'Опора на себе',
  description: '3-денний міні-курс: практики спокою, зменшення внутрішнього критика і дорослий план.',
  provider: {
    '@type': 'Person',
    name: 'Вікторія Жульова',
    url: 'https://zhulova.com',
  },
  offers: {
    '@type': 'Offer',
    price: '9',
    priceCurrency: 'EUR',
    category: 'mini-course',
  },
};
```

Then add, immediately after the opening `<BaseLayout ...>` tag's `>` (as the first child), a script tag:

```astro
  <script type="application/ld+json" set:html={JSON.stringify(courseSchema)} is:inline />
```

- [ ] **Step 2: Write the e2e smoke test**

`tests/e2e/opora.spec.ts`:

```typescript
import { test, expect } from '@playwright/test';

test.describe('Opora landing', () => {
  test('renders all sections and CTA links', async ({ page }) => {
    await page.goto('/courses/opora');

    // Single H1
    await expect(page.locator('h1')).toHaveCount(1);
    await expect(page.locator('h1')).toContainText('сто разів чула');

    // Key section headings present
    await expect(page.getByRole('heading', { name: 'Тривога забирає не тільки настрій' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Що почне мінятися вже за три дні' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Спробуй «Опору на себе» за 9 €' })).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Що міняється, коли почнеш' })).toBeVisible();

    // FAQ is interactive (native details)
    const firstFaq = page.locator('details.faq-item').first();
    await expect(firstFaq).not.toHaveAttribute('open', '');
    await firstFaq.locator('summary').click();
    await expect(firstFaq).toHaveAttribute('open', '');

    // At least one CTA present
    await expect(page.getByText('ЗАБРАТИ ЗА 9 €').first()).toBeVisible();
  });

  test('catalog links to the course and dummy pages are gone', async ({ page }) => {
    await page.goto('/courses');
    await expect(page.getByRole('link', { name: 'Дізнатись більше' })).toHaveAttribute('href', '/courses/opora');

    const dummy = await page.goto('/courses/my-course');
    expect(dummy?.status()).toBe(404);
  });
});
```

- [ ] **Step 3: Run the e2e smoke test (Chromium)**

```bash
npm run build
npx playwright test opora --project=chromium
```
Expected: both tests PASS. (If the runner needs a server, the project's Playwright config handles preview; if a 404 assertion fails because static 404 returns 200 in preview, relax that single assertion to check the catalog no longer references the dummy path instead.)

- [ ] **Step 4: Full verification**

```bash
npm run build
grep -rn "my-course\|mindset-mastery\|goals-achievement" src dist/courses 2>/dev/null || echo "no dummy refs"
```
Expected: build clean; no dummy references in `src`.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add opora Course JSON-LD and e2e smoke test"
```

---

## Notes

- Hybrid component strategy: layout/markup is plain Astro + Tailwind (matching existing `.astro` sections); `Badge` (and other DS primitives where they cleanly apply) are imported from `@design-system` and rendered statically (0KB JS). `CtaButton.astro` is an anchor styled like the DS gold button to keep link semantics valid.
- Access-duration copy is normalized to "назавжди" across the page (spec block 10 said "три місяці", which contradicts blocks 1/8 — flagged in Task 12).
- "Голова" compare row and the bridge heading complete copy the brief left truncated; trivially editable by the user.
