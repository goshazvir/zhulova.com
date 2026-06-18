# Zhulova Design System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a reusable, code-based design system in `src/design-system/` that owns the project's UI primitives and is readable by Claude Design's `/design-sync`.

**Architecture:** A new `src/design-system/` folder becomes the single source of truth for reusable primitives. Existing `Button`/`Input`/`Modal` move there (tests included); the app imports them via a new `@design-system` alias. Four new primitive modules (Typography, Card, Section, Badge) are added in the existing `Button` idiom. Design tokens are NOT duplicated — components reference Tailwind classes defined in `tailwind.config.mjs`.

**Tech Stack:** TypeScript 5.x (strict), React 18.x, Tailwind CSS 3.x, Vitest + React Testing Library, Astro 4.x (Vite).

## Global Constraints

- Language: code/comments/commits in English only.
- TypeScript strict, no `any`; props extend `ComponentProps<'element'>`.
- Tailwind utility classes only — no CSS-in-JS, no inline styles.
- 0KB JS: presentational components only, no hooks/state; never add `client:*` for these.
- Tokens live in `tailwind.config.mjs` — never duplicate token values.
- Component idiom (match existing `Button`): `variant`/`size` props, `baseClasses` + lookup-map objects, className merge, `ComponentProps<'...'>` extension.
- Do NOT `git push` without explicit user approval.

---

### Task 1: Establish `@design-system` and migrate Button/Input/Modal

**Files:**
- Move: `src/components/common/Button/` → `src/design-system/Button/` (index.tsx + Button.test.tsx)
- Move: `src/components/common/Input/` → `src/design-system/Input/` (index.tsx + Input.test.tsx)
- Move: `src/components/common/Modal/` → `src/design-system/Modal/` (index.tsx + Modal.test.tsx)
- Modify: `tsconfig.json` (add alias to `paths`)
- Modify: `astro.config.mjs:34` (add alias to `vite.resolve.alias`)
- Modify: `vitest.config.ts:33` (add alias to `resolve.alias`)
- Modify: `src/components/forms/ConsultationModal/index.tsx:3-5` (update imports)

**Interfaces:**
- Consumes: nothing (first task).
- Produces: `@design-system/Button` (default export), `@design-system/Input` (default export), `@design-system/Modal` (default export). Component tests use relative `./index` imports and travel with the folders unchanged.

- [ ] **Step 1: Move the three component folders with git (preserves history, keeps relative test imports valid)**

```bash
mkdir -p src/design-system
git mv src/components/common/Button src/design-system/Button
git mv src/components/common/Input src/design-system/Input
git mv src/components/common/Modal src/design-system/Modal
```

- [ ] **Step 2: Add the `@design-system` alias to `tsconfig.json`**

In `tsconfig.json`, inside `"paths"`, add this entry after the `"@components/*"` line:

```json
"@design-system/*": ["src/design-system/*"],
```

- [ ] **Step 3: Add the alias to `astro.config.mjs`**

In `astro.config.mjs`, inside `vite.resolve.alias` (after the `'@components'` line ~36), add:

```js
'@design-system': path.resolve(__dirname, './src/design-system'),
```

- [ ] **Step 4: Add the alias to `vitest.config.ts`**

In `vitest.config.ts`, inside `resolve.alias` (after the `'@components'` line ~35), add:

```js
'@design-system': resolve(__dirname, './src/design-system'),
```

- [ ] **Step 5: Update `ConsultationModal` imports**

In `src/components/forms/ConsultationModal/index.tsx`, replace lines 3-5:

```tsx
import Modal from '@design-system/Modal';
import Input from '@design-system/Input';
import Button from '@design-system/Button';
```

- [ ] **Step 6: Run the moved tests to verify the migration works**

Run: `npm run test:run -- src/design-system`
Expected: PASS — Button, Input, Modal test suites all green from the new location.

- [ ] **Step 7: Type-check + build to verify aliases resolve in Astro/Vite**

Run: `npm run build`
Expected: build succeeds, no TypeScript errors, no unresolved-import errors for `@design-system/*`.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "refactor: move Button/Input/Modal into design-system layer"
```

---

### Task 2: Typography (Heading, Text)

**Files:**
- Create: `src/design-system/Typography/index.tsx`
- Test: `src/design-system/Typography/Typography.test.tsx`

**Interfaces:**
- Consumes: Tailwind token classes only.
- Produces: named exports `Heading` (props: `level?: 1|2|3|4`) and `Text` (props: `size?: 'sm'|'md'|'lg'`, `tone?: 'default'|'muted'|'gold'`).

- [ ] **Step 1: Write the failing test**

`src/design-system/Typography/Typography.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Heading, Text } from './index';

describe('Typography', () => {
  it('renders Heading as h2 by default with serif font', () => {
    render(<Heading>Title</Heading>);
    const el = screen.getByRole('heading', { level: 2, name: 'Title' });
    expect(el).toHaveClass('font-serif');
  });

  it('renders Heading at the requested level', () => {
    render(<Heading level={1}>Big</Heading>);
    expect(screen.getByRole('heading', { level: 1, name: 'Big' })).toBeInTheDocument();
  });

  it('renders Text with sans font and gold tone', () => {
    render(<Text tone="gold">Body</Text>);
    const el = screen.getByText('Body');
    expect(el).toHaveClass('font-sans');
    expect(el).toHaveClass('text-gold-600');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- src/design-system/Typography`
Expected: FAIL — cannot resolve `./index`.

- [ ] **Step 3: Write the implementation**

`src/design-system/Typography/index.tsx`:

```tsx
import type { ComponentProps, ReactNode } from 'react';

type HeadingLevel = 1 | 2 | 3 | 4;

interface HeadingProps extends ComponentProps<'h2'> {
  level?: HeadingLevel;
  children: ReactNode;
}

const headingClasses: Record<HeadingLevel, string> = {
  1: 'text-4xl md:text-5xl font-bold',
  2: 'text-3xl md:text-4xl font-bold',
  3: 'text-2xl md:text-3xl font-semibold',
  4: 'text-xl md:text-2xl font-semibold',
};

export function Heading({ level = 2, className = '', children, ...props }: HeadingProps) {
  const Tag = `h${level}` as const;
  return (
    <Tag
      className={`font-serif text-navy-900 ${headingClasses[level]} ${className}`}
      {...props}
    >
      {children}
    </Tag>
  );
}

type TextSize = 'sm' | 'md' | 'lg';
type TextTone = 'default' | 'muted' | 'gold';

interface TextProps extends ComponentProps<'p'> {
  size?: TextSize;
  tone?: TextTone;
  children: ReactNode;
}

const textSizeClasses: Record<TextSize, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
};

const textToneClasses: Record<TextTone, string> = {
  default: 'text-navy-800',
  muted: 'text-navy-500',
  gold: 'text-gold-600',
};

export function Text({ size = 'md', tone = 'default', className = '', children, ...props }: TextProps) {
  return (
    <p
      className={`font-sans ${textSizeClasses[size]} ${textToneClasses[tone]} ${className}`}
      {...props}
    >
      {children}
    </p>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:run -- src/design-system/Typography`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/design-system/Typography
git commit -m "feat: add Typography (Heading, Text) to design-system"
```

---

### Task 3: Card

**Files:**
- Create: `src/design-system/Card/index.tsx`
- Test: `src/design-system/Card/Card.test.tsx`

**Interfaces:**
- Consumes: Tailwind token classes only.
- Produces: default export `Card` (props: `variant?: 'default'|'bordered'|'elevated'`, `padding?: 'sm'|'md'|'lg'`).

- [ ] **Step 1: Write the failing test**

`src/design-system/Card/Card.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Card from './index';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>Content</Card>);
    expect(screen.getByText('Content')).toBeInTheDocument();
  });

  it('applies default variant and md padding', () => {
    render(<Card data-testid="card">x</Card>);
    const el = screen.getByTestId('card');
    expect(el).toHaveClass('bg-white');
    expect(el).toHaveClass('p-6');
  });

  it('applies bordered variant', () => {
    render(<Card data-testid="card" variant="bordered">x</Card>);
    expect(screen.getByTestId('card')).toHaveClass('border-navy-200');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- src/design-system/Card`
Expected: FAIL — cannot resolve `./index`.

- [ ] **Step 3: Write the implementation**

`src/design-system/Card/index.tsx`:

```tsx
import type { ComponentProps, ReactNode } from 'react';

type CardVariant = 'default' | 'bordered' | 'elevated';
type CardPadding = 'sm' | 'md' | 'lg';

interface CardProps extends ComponentProps<'div'> {
  variant?: CardVariant;
  padding?: CardPadding;
  children: ReactNode;
}

const variantClasses: Record<CardVariant, string> = {
  default: 'bg-white',
  bordered: 'bg-white border border-navy-200',
  elevated: 'bg-white shadow-lg',
};

const paddingClasses: Record<CardPadding, string> = {
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
};

export default function Card({
  variant = 'default',
  padding = 'md',
  className = '',
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={`rounded-xl ${variantClasses[variant]} ${paddingClasses[padding]} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:run -- src/design-system/Card`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/design-system/Card
git commit -m "feat: add Card to design-system"
```

---

### Task 4: Section + Container

**Files:**
- Create: `src/design-system/Section/index.tsx`
- Test: `src/design-system/Section/Section.test.tsx`

**Interfaces:**
- Consumes: Tailwind token classes only.
- Produces: named exports `Section` (props: `spacing?: 'sm'|'md'|'lg'`, `background?: 'none'|'navy'|'sage'`) and `Container` (no variant props).

- [ ] **Step 1: Write the failing test**

`src/design-system/Section/Section.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Section, Container } from './index';

describe('Section', () => {
  it('renders a section element with md spacing by default', () => {
    render(<Section data-testid="s">x</Section>);
    const el = screen.getByTestId('s');
    expect(el.tagName).toBe('SECTION');
    expect(el).toHaveClass('py-16');
  });

  it('applies navy background', () => {
    render(<Section data-testid="s" background="navy">x</Section>);
    expect(screen.getByTestId('s')).toHaveClass('bg-navy-900');
  });
});

describe('Container', () => {
  it('applies max-width and horizontal padding', () => {
    render(<Container data-testid="c">x</Container>);
    const el = screen.getByTestId('c');
    expect(el).toHaveClass('max-w-6xl');
    expect(el).toHaveClass('mx-auto');
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- src/design-system/Section`
Expected: FAIL — cannot resolve `./index`.

- [ ] **Step 3: Write the implementation**

`src/design-system/Section/index.tsx`:

```tsx
import type { ComponentProps, ReactNode } from 'react';

type SectionSpacing = 'sm' | 'md' | 'lg';
type SectionBackground = 'none' | 'navy' | 'sage';

interface SectionProps extends ComponentProps<'section'> {
  spacing?: SectionSpacing;
  background?: SectionBackground;
  children: ReactNode;
}

const spacingClasses: Record<SectionSpacing, string> = {
  sm: 'py-8',
  md: 'py-16',
  lg: 'py-24',
};

const backgroundClasses: Record<SectionBackground, string> = {
  none: '',
  navy: 'bg-navy-900 text-white',
  sage: 'bg-sage-50',
};

export function Section({
  spacing = 'md',
  background = 'none',
  className = '',
  children,
  ...props
}: SectionProps) {
  return (
    <section
      className={`${spacingClasses[spacing]} ${backgroundClasses[background]} ${className}`}
      {...props}
    >
      {children}
    </section>
  );
}

interface ContainerProps extends ComponentProps<'div'> {
  children: ReactNode;
}

export function Container({ className = '', children, ...props }: ContainerProps) {
  return (
    <div
      className={`mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:run -- src/design-system/Section`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/design-system/Section
git commit -m "feat: add Section and Container to design-system"
```

---

### Task 5: Badge + Stat

**Files:**
- Create: `src/design-system/Badge/index.tsx`
- Test: `src/design-system/Badge/Badge.test.tsx`

**Interfaces:**
- Consumes: Tailwind token classes only.
- Produces: named exports `Badge` (props: `variant?: 'navy'|'gold'|'sage'`, `size?: 'sm'|'md'`) and `Stat` (props: `value: ReactNode`, `label: ReactNode`).

- [ ] **Step 1: Write the failing test**

`src/design-system/Badge/Badge.test.tsx`:

```tsx
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge, Stat } from './index';

describe('Badge', () => {
  it('renders children with navy variant by default', () => {
    render(<Badge>New</Badge>);
    const el = screen.getByText('New');
    expect(el).toHaveClass('bg-navy-100');
  });

  it('applies gold variant', () => {
    render(<Badge variant="gold">Hot</Badge>);
    expect(screen.getByText('Hot')).toHaveClass('text-gold-700');
  });
});

describe('Stat', () => {
  it('renders value and label', () => {
    render(<Stat value="120+" label="clients" />);
    expect(screen.getByText('120+')).toHaveClass('font-serif');
    expect(screen.getByText('clients')).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npm run test:run -- src/design-system/Badge`
Expected: FAIL — cannot resolve `./index`.

- [ ] **Step 3: Write the implementation**

`src/design-system/Badge/index.tsx`:

```tsx
import type { ComponentProps, ReactNode } from 'react';

type BadgeVariant = 'navy' | 'gold' | 'sage';
type BadgeSize = 'sm' | 'md';

interface BadgeProps extends ComponentProps<'span'> {
  variant?: BadgeVariant;
  size?: BadgeSize;
  children: ReactNode;
}

const badgeVariantClasses: Record<BadgeVariant, string> = {
  navy: 'bg-navy-100 text-navy-900',
  gold: 'bg-gold-100 text-gold-700',
  sage: 'bg-sage-100 text-sage-800',
};

const badgeSizeClasses: Record<BadgeSize, string> = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-3 py-1',
};

export function Badge({
  variant = 'navy',
  size = 'md',
  className = '',
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full font-medium ${badgeVariantClasses[variant]} ${badgeSizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

interface StatProps extends ComponentProps<'div'> {
  value: ReactNode;
  label: ReactNode;
}

export function Stat({ value, label, className = '', ...props }: StatProps) {
  return (
    <div className={`text-center ${className}`} {...props}>
      <div className="font-serif text-4xl font-bold text-gold-600">{value}</div>
      <div className="mt-1 font-sans text-sm text-navy-600">{label}</div>
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npm run test:run -- src/design-system/Badge`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/design-system/Badge
git commit -m "feat: add Badge and Stat to design-system"
```

---

### Task 6: Barrel export, README, and full verification

**Files:**
- Create: `src/design-system/index.ts`
- Create: `src/design-system/README.md`

**Interfaces:**
- Consumes: all components from Tasks 1-5.
- Produces: `@design-system` barrel — `Button`, `Input`, `Modal` (default re-exports) plus `Heading`, `Text`, `Card`, `Section`, `Container`, `Badge`, `Stat`.

- [ ] **Step 1: Create the barrel export**

`src/design-system/index.ts`:

```ts
export { default as Button } from './Button';
export { default as Input } from './Input';
export { default as Modal } from './Modal';
export { default as Card } from './Card';
export { Heading, Text } from './Typography';
export { Section, Container } from './Section';
export { Badge, Stat } from './Badge';
```

- [ ] **Step 2: Create the README (token + component catalog for `/design-sync`)**

`src/design-system/README.md`:

```markdown
# Zhulova Design System

Code-based design system for zhulova.com. Single source of truth for reusable UI primitives.

## Tokens

Defined in `tailwind.config.mjs` (do not duplicate here):

- **Colors:** `navy` (primary), `gold` (accent/CTA), `sage` (secondary) — 9 shades each (50–900).
- **Fonts:** `font-serif` = Playfair Display (headings), `font-sans` = Inter (body).
- **Spacing:** custom scale `18`, `88`, `112`, `128`.

## Components

Import from `@design-system`:

- **Button** — `variant: primary | secondary | outline`, `size: sm | md | lg`.
- **Input** — labelled text input with `error` / `helperText`, accessible.
- **Modal** — accessible dialog.
- **Heading** — serif heading, `level: 1 | 2 | 3 | 4`.
- **Text** — body text, `size: sm | md | lg`, `tone: default | muted | gold`.
- **Card** — `variant: default | bordered | elevated`, `padding: sm | md | lg`.
- **Section** — vertical rhythm, `spacing: sm | md | lg`, `background: none | navy | sage`.
- **Container** — max-width + horizontal padding wrapper.
- **Badge** — `variant: navy | gold | sage`, `size: sm | md`.
- **Stat** — large serif number + caption.

## Principles

- Presentational only (no hooks/state) — preserves the site's 0KB-JS target.
- Tailwind classes only, no CSS-in-JS.
- TypeScript strict, props extend `ComponentProps<'element'>`.

## Sync to Claude Design

Run `/design-sync` from the repo root — it reads the tokens (`tailwind.config.mjs`) and these React components directly.
```

- [ ] **Step 3: Run the full unit test suite**

Run: `npm run test:run`
Expected: PASS — all suites green, including migrated and new design-system components.

- [ ] **Step 4: Type-check + production build**

Run: `npm run build`
Expected: build succeeds with no TypeScript or import errors.

- [ ] **Step 5: Commit**

```bash
git add src/design-system/index.ts src/design-system/README.md
git commit -m "feat: add design-system barrel export and README"
```

- [ ] **Step 6: Sync to Claude Design (manual, run by user)**

From the repo root: launch `claude` and run `/design-sync`. Verify the Zhulova Design System appears under "Design systems" in Claude Design with the navy/gold/sage tokens and the React components.

---

## Notes

- Feature components (e.g. `ConsultationModal`) intentionally stay in `src/components/` and consume design-system primitives — they are not primitives themselves.
- No `git push` is performed by this plan; pushing requires explicit user approval.
