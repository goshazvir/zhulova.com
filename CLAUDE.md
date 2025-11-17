# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

High-performance static website for Viktoria Zhulova, a mindset coach. Built with Astro's Islands Architecture for optimal performance and SEO.

**Tech Stack:** Astro v4 + React v18 + TypeScript v5 (strict) + Tailwind CSS v3 + Zustand v4 + Supabase + Resend

**Critical Constraints:**
- **Hybrid static-first** - Static pages + Serverless functions for forms
- **Performance targets:** Lighthouse 95+, LCP <2.5s, CLS <0.1
- **Accessibility:** WCAG AA compliance mandatory
- **Security:** Input validation, environment variables, RLS policies
- **⚠️ CRITICAL: English only for Git** - ALL git commits, PR titles, PR descriptions, PR comments, and git-related communication MUST be written in English. Never use Ukrainian, Russian, or any other language in git operations.
- **⚠️ CRITICAL: Never push without approval** - NEVER execute `git push` without explicit user approval. Always wait for the user to explicitly say "push", "deploy", or give clear permission before pushing to any remote repository.

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
- `.claude/docs/` - Project documentation (technical-spec.md, about.md)
- `.claude/scripts/` - Utility scripts for testing and maintenance

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

## Utility Scripts

Project utility scripts are located in `.claude/scripts/`:

- **`test-supabase.js`** - Supabase connection test script
  - Tests database connection and credentials
  - Validates table structure and RLS policies
  - Performs full CRUD cycle (insert, read, delete)
  - Usage: `npm run test:supabase` or `node .claude/scripts/test-supabase.js`

- **`generate-favicon-from-svg.js`** - Favicon PNG generator from SVG
  - Generates all PNG favicon formats from favicon.svg
  - Creates: favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png, favicon-16.png, favicon-32.png
  - Uses Sharp for SVG to PNG conversion
  - Usage: `npm run favicon:update` or `node .claude/scripts/generate-favicon-from-svg.js`
  - Source: `public/favicon.svg` (dark square with white VZ + gold corner accent)

- **`convert-footer-image.js`** - Footer image converter with Soft Luxury styling
  - Converts `viktoriia2.jpg` to optimized `footer-viktoria.webp`
  - Applies **Soft Luxury** styling matching hero image aesthetic
  - Effects: Subtle color grading (brightness 1.02, saturation 0.95), warm hue shift, soft contrast, gold gradient overlay, subtle vignette
  - Output: 600x800px WebP (quality 92, ~100KB)
  - Usage: `node .claude/scripts/convert-footer-image.js`
  - Benefits: 154x compression, consistent brand styling across site

- **`generate-hero-premium.js`** - Premium hero image style generator
  - Creates 4 premium variants: Soft Luxury, Aurora, Editorial, Minimalist
  - Currently used: **Soft Luxury** (`hero-viktoria-luxury.webp`)
  - Source: `public/images/original.png`

**When creating new scripts:**
- Place all utility scripts in `.claude/scripts/` directory
- Use descriptive names (e.g., `test-<feature>.js`, `migrate-<task>.js`)
- Add shebang `#!/usr/bin/env node` for Node.js scripts
- Document script purpose and usage in header comments
- Use English for all comments and console output

## Development Commands

```bash
npm run dev          # Astro dev server at localhost:4321 (static pages only)
npm run dev:vercel   # Vercel dev server at localhost:3000 (with serverless functions)
npm run build        # Type-check + build to dist/
npm run preview      # Preview production build
npm run astro        # Astro CLI access
```

**Which command to use:**
- **`npm run dev`** - Fast development, use for UI/styling work (NO serverless functions)
- **`npm run dev:vercel`** - Full environment, use when testing forms/API routes (WITH serverless functions)

**Build process:** `astro check` (TypeScript validation) runs before every build. Build fails on type errors.

## Architecture

### Hybrid Static-First Philosophy

Every **page** is pre-rendered at build time. Serverless functions handle non-SEO operations:

```
User Request → CDN → Pre-rendered HTML → Hydration (minimal) → Interactive
                                      ↓
                     Form Submit → Serverless Function → Supabase/Resend
```

**Static Layer (pages):**
- All pages pre-rendered at build time
- No SSR (`output: 'static'` in astro.config.mjs)
- Content from Astro Content Collections

**Dynamic Layer (serverless functions):**
- Form submissions → `/api/submit-lead`
- Email notifications → Resend
- Database writes → Supabase PostgreSQL

**Never add:**
- Server-side routes for page rendering (`output: 'server'` or `output: 'hybrid'`)
- Database queries for page content (use Content Collections)
- Client-side data fetching for SEO-critical content

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

### Performance Monitoring

**Real User Monitoring (RUM) enabled via Vercel:**

```astro
// src/layouts/BaseLayout.astro
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';

<Analytics client:load />        <!-- User behavior tracking -->
<SpeedInsights client:load />    <!-- Core Web Vitals monitoring -->
```

**What is tracked automatically:**
- Page views, unique visitors, top pages
- Core Web Vitals: LCP, FID, CLS, FCP, TTFB, INP
- Performance by region, device, browser
- Bundle impact: ~3KB total (gzipped)

**Access data:**
- Vercel Dashboard → zhulova-com → Analytics
- Vercel Dashboard → zhulova-com → Speed Insights

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

## Environment Variables

**Required variables:**

```bash
# Supabase Configuration
SUPABASE_URL=https://project.supabase.co
SUPABASE_ANON_KEY=eyJ...         # Public key (safe for client)
SUPABASE_SERVICE_KEY=eyJ...      # Secret key (server only, NEVER expose)

# Resend Configuration
RESEND_API_KEY=re_...            # Secret key (server only)

# Site Configuration
PUBLIC_SITE_URL=https://zhulova.com
```

**Setup:**
1. Copy `.env.example` to `.env`
2. Fill in actual values
3. Add same variables to Vercel Dashboard (Settings → Environment Variables)
4. Download from Vercel: `vercel env pull .env`

**Security rules:**
- ✅ `PUBLIC_*` variables → exposed to client-side
- ❌ Non-public variables → serverless functions only
- ❌ Never commit `.env` to Git (already in `.gitignore`)

## Deployment

**Platform:** Vercel (primary)

**Build output:**
- Static files in `dist/`
- Serverless functions in `api/`

**Setup:**
1. Connect GitHub repository to Vercel
2. Add environment variables in Vercel Dashboard
3. Auto-deploy on push to main branch

**Configuration:**
- `vercel.json` - Vercel configuration (already configured)
- `.vercel/` - Local Vercel settings (in .gitignore)

**Build command:** `npm run build`
**Output directory:** `dist`
**Serverless functions:** `api/**/*.ts`

**Alternative platforms:**
- Netlify (with Netlify Functions)
- Cloudflare Pages (with Workers)

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

### Adding a Serverless Function

1. Create file in `api/function-name.ts`
2. Import `APIRoute` from Astro
3. Define Zod validation schema
4. Export `POST` (or `GET`) handler
5. Validate inputs with Zod
6. Interact with Supabase/Resend using server-only env vars
7. Return JSON response
8. Test locally with `npm run dev:vercel`

**Example structure:**
```typescript
// api/submit-lead.ts
import type { APIRoute } from 'astro';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  const data = schema.parse(body);

  // Save to Supabase, send email, etc.

  return new Response(JSON.stringify({ success: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
```

## What NOT to Do

- ❌ Add `output: 'server'` or `output: 'hybrid'` to `astro.config.mjs` (keep `output: 'static'`)
- ❌ Use CSS-in-JS libraries (styled-components, emotion)
- ❌ Add heavy npm packages without justification
- ❌ Skip TypeScript types or use `any`
- ❌ Ignore accessibility attributes
- ❌ Use inline styles instead of Tailwind
- ❌ Database queries in Astro components (only in serverless functions)
- ❌ Implement complex payment logic (use external checkout URLs)
- ❌ Client-side fetch for SEO content
- ❌ Expose secret environment variables to client (no `PUBLIC_` prefix for secrets)
- ❌ Skip input validation in API routes
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
- TypeScript 5.x (strict mode), Astro 4.x + Astro (SSG framework), React 18.x (client-side modal updates only), Tailwind CSS 3.x (styling) (004-legal-pages)
- Static content files in `src/pages/` directory (Astro file-based routing) (004-legal-pages)

**Frontend (Static):**
- TypeScript 5.x (strict mode) - Type safety
- Astro 4.x - SSG framework with Islands Architecture
- React 18.x - Interactive islands only
- Tailwind CSS 3.x - Utility-first styling
- Zustand 4.x - Lightweight state management (1KB)

**Backend (Serverless):**
- Vercel Functions - Serverless API routes
- Supabase PostgreSQL - Serverless database with RLS
- Resend - Email service

**Validation & Forms:**
- Zod 3.x - Runtime schema validation with TypeScript inference
- React Hook Form 7.x - Performant form state management

**Analytics & Monitoring:**
- @vercel/analytics - Privacy-friendly user behavior tracking (~2.5KB)
- @vercel/speed-insights - Real User Monitoring for Core Web Vitals (~0.7KB)

**Deployment:**
- Vercel - Hosting + Serverless Functions + Edge Network + Analytics

## Recent Changes

- **Logo & Branding** (2025-11-17): ✅ **COMPLETED**
  - **Logo Design**: Minimalist "VZ" with gold dot accent
    - Desktop: VZ + gold circle (90x50px, h-14)
    - Mobile: Same logo (h-12 for consistency)
    - Files: `/public/logo.svg`, `/public/logo-light.svg`
  - **Favicon System**: VZ square badge retained
    - Source: `/public/favicon.svg` (dark square with white VZ + gold corner)
    - Generated: favicon.ico, favicon-16/32.png, apple-touch-icon.png, icon-192/512.png
    - Script: `npm run favicon:update` (Sharp-based PNG generation)
  - **Header Integration**: Logo integrated in Header.astro
    - Responsive: Same VZ logo on all devices
    - Hover effect: opacity-80 transition
  - **Mobile Fixes**: Hero section padding adjustments
    - Fixed header overlap on low-height screens
    - Updated media queries: `padding-top: 7rem` (landscape), `6rem` (low height)
    - Issue: CSS media queries were overriding Tailwind classes
  - **Preview Page**: Created `/logo-preview` for all logo variants showcase

- **Footer & Navigation Updates** (2025-11-17): ✅ **COMPLETED**
  - **Footer Image Optimization**:
    - Converted `viktoriia2.jpg` (16MB) → `footer-viktoria.webp` (103KB) - **154x compression**
    - Applied **Soft Luxury** styling (same as hero image)
    - Script: `.claude/scripts/convert-footer-image.js` (Sharp-based with SVG overlays)
    - Styling: Subtle color grading, warm tones, soft vignette, gold accent gradient
  - **Footer Branding**: Replaced text "Вікторія Жульова" with white logo (`/logo-light.svg`)
  - **Navigation Labels**: Changed "Головна" → "Про мене" across all components
    - Header (desktop navigation)
    - MobileMenu (mobile drawer)
    - Footer (footer navigation)
  - **Performance Impact**: Footer section now loads 154x faster with optimized WebP image

- **002-home-page** (2025-11-16): ✅ **COMPLETED & DEPLOYED**
  - **Status**: 52/62 tasks (84%) - Production ready
  - **All 6 user stories implemented**:
    - US1: Consultation booking with Supabase + Resend (MVP)
    - US2: Credibility section with stats and case studies
    - US3: Problem-solution matching questions
    - US4: Client testimonials and social proof
    - US5: Course preview section
    - US6: Navigation and social media integration
  - **18 components created** (Astro + React + TypeScript)
  - **Serverless API**: /api/submit-lead endpoint with Zod validation
  - **Full SEO optimization**: meta tags, JSON-LD structured data, Ukrainian locale
  - **Accessibility**: WCAG AA compliance, keyboard navigation, ARIA labels
  - **Deployed**: https://zhulova.com (custom domain configured)
  - **Path aliases configured** in tsconfig.json and astro.config.mjs
  - **Analytics**: Vercel Analytics + Speed Insights integrated
  - **Remaining**: Image optimization, end-to-end testing (optional)

- **001-base-infrastructure** (2025-01-14): Initial project setup with TypeScript 5.x (strict mode) + Astro 4.x (SSG framework), React 18.x (interactive islands), Tailwind CSS 3.x (styling), Zustand 4.x (state management)
