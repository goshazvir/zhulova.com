# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

High-performance static website for Viktoria Zhulova, a mindset coach. Built with Astro's Islands Architecture for optimal performance and SEO.

**Tech Stack:** Astro v4 + React v18 + TypeScript v5 (strict) + Tailwind CSS v3 + Zustand v4

**Critical Constraints:**
- **Static-first only** - No SSR, no runtime API calls for critical content
- **Performance targets:** Lighthouse 95+, LCP <2.5s, CLS <0.1
- **Accessibility:** WCAG AA compliance mandatory

## Spec-Driven Development

This project uses **[Spec-Kit](https://github.com/github/spec-kit)** for structured development workflow.

**Spec-Kit commands** (use as slash commands in Claude Code):

```
/speckit.constitution  # Create/update project principles and standards
/speckit.specify       # Create detailed feature specification
/speckit.plan          # Generate implementation plan
/speckit.tasks         # Break down into actionable tasks
/speckit.implement     # Execute implementation
/speckit.clarify       # Ask structured questions before planning
/speckit.analyze       # Check cross-artifact consistency
/speckit.checklist     # Generate quality validation checklists
```

**Workflow:**
1. Start with `/speckit.constitution` to establish project principles
2. Use `/speckit.specify` for each new feature
3. Follow with `/speckit.plan` → `/speckit.tasks` → `/speckit.implement`

**Spec-Kit files:**
- `.specify/` - Spec-Kit templates and memory
- `.claude/commands/speckit.*.md` - Slash command definitions

## Project Documentation

All project documentation is centralized in `.claude/docs/`:

- **`technical-spec.md`** - Complete technical specification
  - Performance requirements (Lighthouse 95+, Core Web Vitals)
  - Image optimization rules
  - CSS/JS optimization strategies
  - Accessibility guidelines (WCAG AA)
  - SEO requirements
  - Component patterns and decision trees
  - Prohibited patterns

- **`about.md`** - Project requirements and business context
  - Project overview and goals
  - Target audience (entrepreneurs, IT professionals, personal brand builders)
  - Required pages (Home, About, Courses, Contact)
  - Design principles ("Minimal Luxury Coach" aesthetic)
  - Content strategy
  - Payment integration approach

**When building features:**
1. Consult `technical-spec.md` for technical constraints
2. Reference `about.md` for business requirements and design direction
3. Both documents are authoritative - follow them strictly

## Development Commands

```bash
npm run dev        # Dev server at localhost:4321
npm run build      # Type-check + build to dist/
npm run preview    # Preview production build
npm run astro      # Astro CLI access
```

**Build process:** `astro check` (TypeScript validation) runs before every build. Build fails on type errors.

## Architecture

### Static-First Philosophy

Every page is pre-rendered at build time. The build strategy is:
```
User Request → CDN → Pre-rendered HTML → Hydration (minimal) → Interactive
```

**Never add:**
- Server-side routes (`output: 'server'` or `output: 'hybrid'`)
- Runtime database queries
- Client-side data fetching for SEO-critical content
- Any feature requiring a Node.js server

### Islands Architecture

**React components** are used sparingly for interactive UI only:

```astro
<!-- Static by default (no hydration) -->
<Header />

<!-- Hydrate when visible in viewport -->
<Newsletter client:visible />

<!-- Hydrate when browser is idle -->
<ContactForm client:idle />

<!-- Hydrate only on mobile -->
<MobileMenu client:media="(max-width: 768px)" />
```

**Decision tree:**
- Static content (text, images) → Astro component (`.astro`)
- Interactive (forms, modals, state) → React component (`.tsx`) + client directive
- Global UI state → Zustand store

### TypeScript Path Aliases

```typescript
import Button from '@components/common/Button';
import BaseLayout from '@layouts/BaseLayout.astro';
import { useUIStore } from '@stores/uiStore';
import type { Course } from '@types/index';
```

See `tsconfig.json` for full alias list.

### Content Collections

Courses are managed via Astro Content Collections in `src/content/courses/`.

**Schema** (defined in `src/content/config.ts`):
```typescript
{
  title: string;
  description: string;
  price: number;
  currency: string; // default "USD"
  duration: string;
  paymentLink: string; // must be valid URL
  image: string;
  published: boolean; // default true
  order: number; // for sorting, default 0
  features?: string[];
  testimonials?: string[];
}
```

**Creating a course:**

1. Add markdown file to `src/content/courses/mindset-mastery.md`
2. Include frontmatter with required fields
3. Write course content in markdown body
4. Course is automatically available at `/courses/mindset-mastery`

**Fetching courses:**
```typescript
import { getCollection } from 'astro:content';

const courses = await getCollection('courses', ({ data }) => {
  return data.published === true;
});
```

## Performance Requirements

### Image Optimization

**Always use Astro's `<Image>` component** for images:

```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.jpg';
---

<Image
  src={heroImage}
  alt="Descriptive alt text"
  width={1200}
  height={800}
  format="webp"
  quality={85}
  loading="lazy"  // or "eager" for above-fold
/>
```

**Rules:**
- Above-fold images: `loading="eager"` + `fetchpriority="high"`
- Below-fold images: `loading="lazy"`
- Format priority: WebP → AVIF → JPEG/PNG fallback (automatic)
- Max dimensions: Hero 1920x1080, Thumbnails 600x400

### CSS Strategy

- **Tailwind utility-first** - avoid custom CSS unless necessary
- **Critical CSS** automatically inlined in `<head>` by Astro
- **No CSS-in-JS** - Tailwind classes only
- Custom utilities go in `src/styles/global.css` under `@layer utilities`

### JavaScript Constraints

- Keep JS bundle <50KB (gzipped)
- React only for interactive components
- No heavy libraries (moment.js, lodash, etc.)
- Zustand for state management (1KB gzipped)

**Console logs removed in production** (terser config in `astro.config.mjs`).

## Component Patterns

### Astro Component Structure

```astro
---
// 1. Imports
import type { HTMLAttributes } from 'astro/types';
import { Image } from 'astro:assets';

// 2. Type definitions
interface Props extends HTMLAttributes<'div'> {
  title: string;
  description?: string;
  variant?: 'primary' | 'secondary';
}

// 3. Props with defaults
const {
  title,
  description,
  variant = 'primary',
  class: className,
  ...rest
} = Astro.props;

// 4. Logic
const variantClasses = {
  primary: 'bg-navy-900 text-white',
  secondary: 'bg-white text-navy-900 border-2 border-navy-900',
};
---

<!-- 5. Template -->
<div class={`${variantClasses[variant]} ${className}`} {...rest}>
  <h2>{title}</h2>
  {description && <p>{description}</p>}
  <slot />
</div>
```

### React Component (Interactive Islands)

```tsx
import type { ComponentProps } from 'react';

interface ButtonProps extends ComponentProps<'button'> {
  variant?: 'primary' | 'secondary';
}

export default function Button({
  variant = 'primary',
  className = '',
  children,
  ...props
}: ButtonProps) {
  const baseClasses = 'px-6 py-3 rounded-lg font-medium transition-colors';
  const variantClasses = {
    primary: 'bg-navy-900 text-white hover:bg-navy-800',
    secondary: 'bg-gold-500 text-navy-900 hover:bg-gold-400',
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
```

### Zustand Store Pattern

```typescript
import { create } from 'zustand';

interface StoreState {
  // State
  isOpen: boolean;

  // Actions
  open: () => void;
  close: () => void;
  toggle: () => void;
}

export const useStore = create<StoreState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
}));

// Usage in React component:
const isOpen = useStore((state) => state.isOpen); // Selective subscription
```

## SEO & Accessibility

### Meta Tags (BaseLayout)

Every page must use `BaseLayout.astro` and provide:
```astro
<BaseLayout
  title="Page Title"
  description="150-160 char description"
  image="/images/og-image.jpg"  // optional, defaults to /images/og-default.jpg
  canonical="https://zhulova.com/page"  // optional
/>
```

### Accessibility Requirements

**Mandatory for all components:**
- Semantic HTML (`<header>`, `<nav>`, `<main>`, `<article>`, `<footer>`)
- Heading hierarchy (single `<h1>`, logical nesting)
- ARIA labels for interactive elements
- Keyboard navigation support
- Focus indicators (configured globally in `global.css`)
- Color contrast ≥4.5:1 for text, ≥3:1 for UI elements
- Respect `prefers-reduced-motion`

**Example:**
```astro
<button
  aria-label="Open navigation menu"
  aria-expanded={isOpen}
>
  <svg aria-hidden="true"><!-- Icon --></svg>
</button>
```

## Design System

### Colors (Tailwind Config)

- **Navy** (`navy-{50-900}`): Primary brand color
- **Gold** (`gold-{50-900}`): Accent for CTAs
- **Sage** (`sage-{50-900}`): Secondary accent

### Typography

- **Headings:** `font-serif` (Playfair Display)
- **Body:** `font-sans` (Inter)
- Loaded via Google Fonts in `global.css`

### Spacing

Custom spacing scale: `spacing-{18, 88, 112, 128}` for large layouts.

## Deployment

**Build output:** Static files in `dist/`

**Deployment platforms:**
- Vercel (recommended)
- Netlify
- Cloudflare Pages

**Build command:** `npm run build`
**Output directory:** `dist`

## Common Patterns

### Adding a New Page

1. Create `src/pages/new-page.astro`
2. Use `BaseLayout` with SEO props
3. Structure content semantically
4. Use Tailwind utilities for styling
5. Add to navigation if needed

### Adding an Interactive Component

1. Create React component in `src/components/common/Component.tsx`
2. Import in Astro page
3. Add appropriate `client:*` directive
4. Keep component focused (single responsibility)

### Adding Global State

1. Create store in `src/stores/newStore.ts`
2. Define TypeScript interface for state + actions
3. Use Zustand's `create` with typed state
4. Import and use selectively in React components

## What NOT to Do

- ❌ Add `output: 'server'` or `output: 'hybrid'` to `astro.config.mjs`
- ❌ Use CSS-in-JS libraries (styled-components, emotion)
- ❌ Add heavy npm packages without justification
- ❌ Skip TypeScript types or use `any`
- ❌ Ignore accessibility attributes
- ❌ Use inline styles instead of Tailwind
- ❌ Add database integrations
- ❌ Implement complex payment logic (use external checkout URLs)
- ❌ Client-side fetch for SEO content
- ❌ Modify or delete `.specify/` or `.claude/commands/` directories (Spec-Kit system files)

## Project-Specific Context

**Site purpose:** Personal brand website for mindset coach targeting entrepreneurs, IT professionals, and experts building personal brands.

**Tone:** Professional, calm, minimalistic, supportive. "Luxury coach" aesthetic.

**Payment model:** External checkout links (Stripe/WayForPay). No backend payment processing.

**Content strategy:** Courses sold via external links, coaching sessions booked via contact form or external scheduler.

## Documentation References

For detailed technical specifications, see:
- `.claude/docs/technical-spec.md` - Performance targets, optimization rules
- `.claude/docs/about.md` - Project requirements, design principles
- `README.md` - Getting started, project structure

For Astro-specific questions, refer to [Astro Docs](https://docs.astro.build).

## Active Technologies
- TypeScript 5.x (strict mode) + Astro 4.x (SSG framework), React 18.x (interactive islands), Tailwind CSS 3.x (styling), Zustand 4.x (state management) (001-base-infrastructure)
- N/A (static site, no database) (001-base-infrastructure)

## Recent Changes
- 001-base-infrastructure: Added TypeScript 5.x (strict mode) + Astro 4.x (SSG framework), React 18.x (interactive islands), Tailwind CSS 3.x (styling), Zustand 4.x (state management)
