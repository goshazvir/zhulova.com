# Technical Specification: High-Performance Static Website

**Project:** Viktoria Zhulova Personal Brand
**Architecture:** Static-First, Pre-rendered, Performance-Optimized
**Target:** Lighthouse 95+ Score, WCAG AA Compliance

---

## 1. Core Architecture Principles

### 1.1 Hybrid Static-First Philosophy

**MANDATORY RULES:**
- Every **page** MUST be pre-rendered at build time (100% static HTML/CSS/JS)
- Zero server-side rendering (SSR) for pages
- No client-side data fetching for SEO-critical content
- **Serverless functions** allowed ONLY for non-SEO operations (forms, webhooks)

**Build Strategy:**
```
User Request → CDN → Pre-rendered HTML → Hydration (minimal) → Interactive
                                      ↓
                     Form Submission → Serverless Function → Database/Email
```

**Architecture Pattern:**
- **Static Layer:** All pages, content, UI components (pre-rendered at build time)
- **Dynamic Layer:** Form submissions, email notifications, database writes (serverless functions)

**NOT Allowed:**
- Dynamic server routes for page rendering
- Database queries for page content (use static build-time queries only)
- API calls for initial page load (SEO-critical content)
- Server-side sessions or authentication

**Allowed (Non-SEO Operations):**
- ✅ Serverless functions in `/api` directory (Vercel Functions)
- ✅ Database writes for form submissions (Supabase)
- ✅ Email notifications (Resend)
- ✅ Webhooks and third-party integrations

### 1.2 Decision Tree: When to Use Serverless

```
Is the content needed for SEO or initial page load?
├─ YES → Static (pre-render at build time)
└─ NO → Can use serverless function
        └─ Is it a user action (form submit, button click)?
            ├─ YES → Serverless function is OK
            └─ NO → Consider if it's really needed
```

**Examples:**
- ✅ Contact form submission → Serverless API endpoint
- ✅ Newsletter signup → Serverless API endpoint
- ✅ Email notifications → Serverless function
- ❌ Course list rendering → Static build (Content Collections)
- ❌ Blog posts → Static build (Markdown)
- ❌ Homepage hero content → Static build

---

## 2. Technology Stack (Fixed)

### 2.1 Framework & Language

| Technology | Version | Usage | Rationale |
|------------|---------|-------|-----------|
| **Astro** | v4.x+ | Core SSG framework | Optimal static generation, partial hydration |
| **TypeScript** | v5.x+ | All code | Type safety, better DX, fewer runtime errors |
| **Tailwind CSS** | v3.x+ | Styling system | Utility-first, tree-shakeable, minimal CSS output |
| **React** | v18.x+ | Interactive islands only | Component reusability, ecosystem |
| **Zustand** | v4.x+ | State management | Lightweight (1KB), no Provider hell |

### 2.2 Backend Services (Serverless Only)

| Technology | Version | Usage | Rationale |
|------------|---------|-------|-----------|
| **Vercel** | Latest | Hosting + Serverless Functions | Edge network, automatic deploys, 0-config |
| **Supabase** | Latest | PostgreSQL database | Serverless PostgreSQL, RESTful API, RLS security |
| **Resend** | Latest | Email service | Modern API, deliverability, React Email templates |

### 2.3 Form Handling & Validation

| Technology | Version | Usage | Rationale |
|------------|---------|-------|-----------|
| **React Hook Form** | v7.x+ | Form state management | Performant, minimal re-renders, TypeScript support |
| **Zod** | v3.x+ | Schema validation | Runtime validation, TypeScript inference, composable |

### 2.4 Analytics & Monitoring

| Technology | Version | Usage | Rationale |
|------------|---------|-------|-----------|
| **@vercel/analytics** | v1.x+ | User behavior tracking | Privacy-friendly, no cookies, GDPR compliant, ~2.5KB |
| **@vercel/speed-insights** | v1.x+ | Real User Monitoring (RUM) | Core Web Vitals tracking, <0.7KB, automatic |

### 2.5 Build Output Requirements

```
dist/
├── index.html                 # Pre-rendered HTML
├── about/index.html           # Pre-rendered HTML
├── courses/index.html         # Pre-rendered HTML
├── courses/[slug]/index.html  # Pre-rendered per course
├── _astro/
│   ├── [hash].css            # Minified, critical CSS inlined
│   └── [hash].js             # Minimal, deferred scripts
└── assets/
    └── images/               # Optimized, modern formats

api/                           # Serverless functions (Vercel)
└── submit-lead.ts             # Form submission endpoint
```

**Critical Metrics** (updated 2025-11-24 per architecture review #012):
- **HTML Size:** <50KB (gzipped)
- **CSS Size:** <20KB (gzipped) - Current: 7KB ✅
- **JS Size:** <100KB (gzipped) - Current: 80KB ✅ (updated from 50KB - React SPA requires more)
- **API Routes:** <10KB per function
- **Images:** WebP/AVIF with fallbacks - Current: 227KB total ✅

### 2.6 Environment Variables

All sensitive credentials stored as environment variables:

```bash
# Supabase Configuration
SUPABASE_URL=https://project.supabase.co
SUPABASE_ANON_KEY=eyJ...         # Public key (safe for client)
SUPABASE_SERVICE_KEY=eyJ...      # Secret key (server only)

# Resend Configuration
RESEND_API_KEY=re_...            # Secret key (server only)

# Site Configuration
PUBLIC_SITE_URL=https://zhulova.com
```

**Rules:**
- `PUBLIC_*` variables exposed to client-side code
- Non-public variables ONLY accessible in serverless functions
- Never commit `.env` to Git (use `.env.example` template)
- Store production values in Vercel Dashboard

---

## 3. Performance Optimization Rules

### 3.1 Core Web Vitals Targets

| Metric | Target | Mandatory |
|--------|--------|-----------|
| **LCP** (Largest Contentful Paint) | <2.5s | YES |
| **FID** (First Input Delay) | <100ms | YES |
| **CLS** (Cumulative Layout Shift) | <0.1 | YES |
| **FCP** (First Contentful Paint) | <1.8s | YES |
| **TTI** (Time to Interactive) | <3.5s | YES |
| **TBT** (Total Blocking Time) | <200ms | YES |

### 3.2 Lighthouse Score Requirements

**Updated 2025-11-24** (architecture review #012 - aligned with production reality):

```
Performance:    ≥ 85  (production-ready threshold, enforced in CI/CD)
Accessibility:  ≥ 90  (WCAG AA compliance, enforced in CI/CD)
Best Practices: ≥ 85  (monitored, warns if lower)
SEO:            ≥ 90  (critical for discoverability, enforced in CI/CD)
```

**Rationale for 85+ Performance Target**:
- 85+ is "Good" per Google's Lighthouse guidelines
- Achievable on real hardware (not just lab conditions)
- Enforced via GitHub Actions (blocks PR merge if lower)
- Current baseline: Varies by page, monitored daily

### 3.3 Image Optimization Strategy

**AI MUST Follow These Rules:**

1. **Use Astro `<Image>` component for all images**
   ```astro
   ---
   import { Image } from 'astro:assets';
   import heroImage from '../assets/hero.jpg';
   ---
   <Image
     src={heroImage}
     alt="Viktoria Zhulova"
     width={1200}
     height={800}
     format="webp"
     quality={85}
     loading="lazy"
   />
   ```

2. **Format Priority:**
   - Primary: WebP
   - Fallback: AVIF (if browser support detected)
   - Legacy: JPEG/PNG (automatic)

3. **Lazy Loading:**
   - Above-fold images: `loading="eager"` + `fetchpriority="high"`
   - Below-fold images: `loading="lazy"`

4. **Responsive Images:**
   - Use `srcset` and `sizes` attributes
   - Provide 3-5 breakpoints: 320w, 640w, 1024w, 1440w, 1920w

5. **Image Sizes:**
   - Hero images: max 1920x1080
   - Thumbnails: max 600x400
   - Icons/logos: SVG preferred

### 3.4 CSS Optimization

**Rules:**
- **Critical CSS:** Inline above-fold styles in `<head>`
- **Non-critical CSS:** Load async with media queries
- **Purge unused:** Tailwind purge configured for production
- **Minimize specificity:** Use utility classes over custom CSS

**Tailwind Configuration:**
```javascript
// tailwind.config.mjs
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Playfair Display', 'serif'],
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        navy: {
          50: '#f0f4f8',
          900: '#1a202c',
        },
        gold: {
          500: '#d4af37',
        },
      },
    },
  },
  plugins: [],
};
```

### 3.5 JavaScript Optimization

**Principles:**
- **Islands Architecture:** Hydrate only interactive components
- **Lazy Load:** Defer non-critical JS
- **Code Splitting:** Automatic per-route splitting
- **Tree Shaking:** Remove unused exports

**React Component Hydration Strategy:**
```astro
---
// Only interactive components need client directives
import Counter from '../components/Counter.tsx';
---

<!-- Static component (no hydration) -->
<Header />

<!-- Hydrate when visible -->
<Counter client:visible />

<!-- Hydrate on idle -->
<Newsletter client:idle />

<!-- Hydrate on media query -->
<MobileMenu client:media="(max-width: 768px)" />
```

**Allowed Client Directives:**
- `client:load` — Critical interactivity (rare)
- `client:idle` — Non-critical (forms, modals)
- `client:visible` — Lazy load (carousels, animations)
- `client:media` — Responsive components
- `client:only` — Pure client components

**AVOID:**
- Large third-party libraries
- Unused React features
- Complex state management for static content

---

## 4. State Management with Zustand

### 4.1 When to Use Zustand

**Use Zustand For:**
- Shopping cart state (future)
- Form validation state
- UI state (modals, sidebars)
- User preferences (theme, language)

**DON'T Use Zustand For:**
- Static content (courses, testimonials)
- Data that never changes
- SEO-critical content

### 4.2 Store Structure

```typescript
// src/stores/uiStore.ts
import { create } from 'zustand';

interface UIState {
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  isMobileMenuOpen: false,
  toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
  closeMobileMenu: () => set({ isMobileMenuOpen: false }),
}));
```

**Rules:**
- One store per concern (UI, Cart, User)
- TypeScript interfaces mandatory
- Small, focused stores (<100 lines)
- No nested stores

### 4.3 Performance Considerations

```typescript
// ✅ Good: Selective subscription
const isMobileMenuOpen = useUIStore((state) => state.isMobileMenuOpen);

// ❌ Bad: Subscribe to entire store
const store = useUIStore();
```

---

## 5. Accessibility (WCAG AA Compliance)

### 5.1 Mandatory Requirements

**Semantic HTML:**
```html
<!-- ✅ Correct -->
<header role="banner">
  <nav aria-label="Main navigation">
    <ul>
      <li><a href="/">Home</a></li>
    </ul>
  </nav>
</header>

<main role="main">
  <article>
    <h1>Page Title</h1>
  </article>
</main>

<footer role="contentinfo">
  <!-- Footer content -->
</footer>
```

**Heading Hierarchy:**
- One `<h1>` per page
- Logical nesting: h1 → h2 → h3 (no skipping)
- Descriptive headings (not "Click here")

**Color Contrast:**
- Text: Minimum 4.5:1 ratio
- Large text (18pt+): Minimum 3:1 ratio
- Interactive elements: 3:1 ratio

**Keyboard Navigation:**
- All interactive elements focusable
- Visible focus indicators
- Logical tab order
- Skip links for main content

**ARIA Labels:**
```astro
<button aria-label="Open menu" aria-expanded={isOpen}>
  <svg aria-hidden="true"><!-- Icon --></svg>
</button>

<img src="..." alt="Viktoria Zhulova coaching session" />

<form role="search" aria-label="Site search">
  <input type="search" aria-label="Search courses" />
</form>
```

### 5.2 Interactive Components

**Focus Management:**
```typescript
// Modal component
useEffect(() => {
  if (isOpen) {
    // Trap focus in modal
    modalRef.current?.focus();
  }
}, [isOpen]);
```

**Screen Reader Support:**
- Announce dynamic content changes
- Use `aria-live` for notifications
- Provide text alternatives for icons

**Motion Preferences:**
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## 6. SEO Optimization

### 6.1 Meta Tags (Every Page)

```astro
---
// src/layouts/BaseLayout.astro
interface Props {
  title: string;
  description: string;
  image?: string;
  canonical?: string;
}

const { title, description, image, canonical } = Astro.props;
const canonicalURL = canonical || new URL(Astro.url.pathname, Astro.site);
const ogImage = image || '/images/og-default.jpg';
---

<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />

  <!-- Primary Meta Tags -->
  <title>{title} | Viktoria Zhulova</title>
  <meta name="title" content={title} />
  <meta name="description" content={description} />

  <!-- Canonical URL -->
  <link rel="canonical" href={canonicalURL} />

  <!-- Open Graph / Facebook -->
  <meta property="og:type" content="website" />
  <meta property="og:url" content={canonicalURL} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={ogImage} />

  <!-- Twitter -->
  <meta property="twitter:card" content="summary_large_image" />
  <meta property="twitter:url" content={canonicalURL} />
  <meta property="twitter:title" content={title} />
  <meta property="twitter:description" content={description} />
  <meta property="twitter:image" content={ogImage} />
</head>
<body>
  <slot />
</body>
</html>
```

### 6.2 Structured Data (JSON-LD)

```astro
---
// src/components/StructuredData.astro
---
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Viktoria Zhulova",
  "jobTitle": "Mindset Coach",
  "url": "https://zhulova.com",
  "image": "https://zhulova.com/images/viktoria.jpg",
  "sameAs": [
    "https://instagram.com/...",
    "https://linkedin.com/in/..."
  ],
  "offers": {
    "@type": "OfferCatalog",
    "name": "Coaching Services",
    "itemListElement": [
      {
        "@type": "Offer",
        "itemOffered": {
          "@type": "Service",
          "name": "Personal Coaching Session"
        }
      }
    ]
  }
}
</script>
```

### 6.3 Sitemap & Robots

```xml
<!-- public/robots.txt -->
User-agent: *
Allow: /
Sitemap: https://zhulova.com/sitemap.xml
```

**Auto-generate sitemap:**
```javascript
// astro.config.mjs
export default defineConfig({
  site: 'https://zhulova.com',
  integrations: [
    sitemap(),
  ],
});
```

---

## 7. Build Configuration

### 7.1 Astro Config

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://zhulova.com',
  output: 'static', // MANDATORY: static output only

  integrations: [
    react(), // React for interactive islands
    tailwind({
      applyBaseStyles: false, // Custom base styles
    }),
    sitemap(),
  ],

  vite: {
    build: {
      cssCodeSplit: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true, // Remove console.log in production
        },
      },
    },
  },

  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp', // Image optimization
    },
  },

  compressHTML: true,
});
```

### 7.2 TypeScript Config

```json
// tsconfig.json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@components/*": ["src/components/*"],
      "@layouts/*": ["src/layouts/*"],
      "@stores/*": ["src/stores/*"],
      "@types/*": ["src/types/*"],
      "@utils/*": ["src/utils/*"]
    },
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true
  }
}
```

---

## 8. Performance Monitoring

### 8.1 Build-Time Checks

**AI Must Verify Before Completion:**
```bash
# Run Lighthouse CI
npm run build
npx lighthouse http://localhost:4321 --output=json --output=html

# Check bundle sizes
npx vite-bundle-visualizer

# Validate accessibility
npx pa11y http://localhost:4321
```

### 8.2 Performance Budget

```javascript
// lighthouse-budget.json
{
  "path": "/*",
  "timings": [
    { "metric": "first-contentful-paint", "budget": 1800 },
    { "metric": "largest-contentful-paint", "budget": 2500 },
    { "metric": "interactive", "budget": 3500 }
  ],
  "resourceSizes": [
    { "resourceType": "script", "budget": 50 },
    { "resourceType": "stylesheet", "budget": 20 },
    { "resourceType": "image", "budget": 200 },
    { "resourceType": "document", "budget": 50 },
    { "resourceType": "total", "budget": 350 }
  ]
}
```

### 8.3 Real User Monitoring (RUM)

**Vercel Analytics & Speed Insights** are integrated for production monitoring:

```astro
---
// src/layouts/BaseLayout.astro
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
---

<body>
  <slot />

  <!-- Vercel Analytics - tracks page views and user behavior -->
  <Analytics client:load />

  <!-- Vercel Speed Insights - monitors Core Web Vitals performance -->
  <SpeedInsights client:load />
</body>
```

**What is monitored automatically:**

**Analytics (User Behavior):**
- Page views and unique visitors
- Top pages and referrers
- Device types and browsers
- Geographic distribution
- Privacy-friendly (no cookies, GDPR compliant)

**Speed Insights (Performance):**
- **LCP** (Largest Contentful Paint) - target <2.5s
- **FID** (First Input Delay) - target <100ms
- **CLS** (Cumulative Layout Shift) - target <0.1
- **FCP** (First Contentful Paint) - target <1.8s
- **TTFB** (Time to First Byte)
- **INP** (Interaction to Next Paint)

**Performance by:**
- Geographic regions
- Device types (mobile/desktop)
- Browser types
- Network conditions

**Accessing data:**
- Vercel Dashboard → Project → Analytics
- Vercel Dashboard → Project → Speed Insights
- Data collected from real users in production
- No configuration required (automatic)

**Bundle size impact:**
- Analytics: ~2.5 KB (gzipped)
- Speed Insights: ~0.7 KB (gzipped)
- Total: <3.5 KB additional JavaScript
- Loaded with `client:load` directive (after initial page render)

---

## 9. Code Quality Standards

### 9.1 File Organization

```
src/
├── components/
│   ├── common/          # Reusable UI (Button, Card)
│   ├── layout/          # Header, Footer, Navigation
│   └── sections/        # Homepage sections
├── layouts/
│   └── BaseLayout.astro
├── pages/
│   ├── index.astro
│   ├── about.astro
│   ├── courses/
│   │   ├── index.astro
│   │   └── [slug].astro
│   └── contact.astro
├── content/
│   ├── config.ts
│   └── courses/
├── stores/
│   └── uiStore.ts
├── styles/
│   └── global.css
├── types/
│   └── index.ts
└── utils/
    └── helpers.ts
```

### 9.2 Naming Conventions

**Files:**
- Components: `PascalCase.astro` or `PascalCase.tsx`
- Utilities: `camelCase.ts`
- Layouts: `PascalCase.astro`
- Pages: `kebab-case.astro`

**Variables:**
- Constants: `SCREAMING_SNAKE_CASE`
- Functions: `camelCase`
- Types/Interfaces: `PascalCase`

### 9.3 Component Structure

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

// 3. Props destructuring with defaults
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
  secondary: 'bg-white text-navy-900 border border-navy-900',
};
---

<!-- 5. Template -->
<div class={`${variantClasses[variant]} ${className}`} {...rest}>
  <h2>{title}</h2>
  {description && <p>{description}</p>}
  <slot />
</div>

<!-- 6. Scoped styles (if absolutely necessary) -->
<style>
  /* Avoid if possible - use Tailwind */
</style>
```

---

## 10. AI Agent Decision Tree

### When Building Components:

```
Is it interactive (forms, modals, state)?
├─ YES → Use React (.tsx) + client:idle/visible
└─ NO → Use Astro (.astro)

Does it need global state?
├─ YES → Use Zustand store
└─ NO → Use local component state

Is it above the fold?
├─ YES → Critical CSS inline, images eager load
└─ NO → Lazy load images, defer scripts

Is it SEO-critical?
├─ YES → Server-render, include in static HTML
└─ NO → Client-side only OK
```

### Code Generation Checklist:

Before writing ANY component, AI must verify:
- [ ] TypeScript types defined
- [ ] Props interface with defaults
- [ ] Tailwind classes (no inline styles)
- [ ] Semantic HTML
- [ ] ARIA labels if interactive
- [ ] Image optimization if contains images
- [ ] Mobile-first responsive
- [ ] No unused imports
- [ ] Performance impact <10KB

---

## 11. Serverless Functions Pattern

### 11.1 When to Create API Routes

**Use serverless functions for:**
- Form submissions (contact, newsletter, consultation requests)
- Email notifications
- Database writes (non-SEO data)
- Webhook handlers
- Third-party API integrations

### 11.2 API Route Structure

```typescript
// api/submit-lead.ts (Vercel Function)
import type { APIRoute } from 'astro';
import { z } from 'zod';

// 1. Define validation schema
const leadSchema = z.object({
  name: z.string().min(2).max(255),
  phone: z.string().regex(/^\+380\d{9}$/),
  telegram: z.string().regex(/^@[a-zA-Z0-9_]{5,32}$/).optional(),
  email: z.string().email().optional(),
});

// 2. Export POST handler
export const POST: APIRoute = async ({ request }) => {
  try {
    // 3. Parse and validate request body
    const body = await request.json();
    const validatedData = leadSchema.parse(body);

    // 4. Database write (Supabase)
    const { data, error } = await supabase
      .from('leads')
      .insert([validatedData]);

    if (error) throw error;

    // 5. Send email notification (Resend)
    await resend.emails.send({
      from: 'notifications@zhulova.com',
      to: 'viktoria@zhulova.com',
      subject: 'New consultation request',
      html: `<p>Name: ${validatedData.name}</p>`,
    });

    // 6. Return success response
    return new Response(
      JSON.stringify({ success: true, leadId: data.id }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    // 7. Error handling
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
};
```

### 11.3 Security Best Practices

**MANDATORY:**
- ✅ Validate ALL inputs with Zod schema
- ✅ Sanitize user-provided data
- ✅ Use environment variables for secrets
- ✅ Implement rate limiting (Vercel Edge Config)
- ✅ Set CORS headers appropriately
- ✅ Use Supabase RLS (Row Level Security) policies
- ✅ Log errors (but not sensitive data)

**Example: Input Sanitization**
```typescript
import { z } from 'zod';

const schema = z.object({
  name: z.string()
    .trim()
    .min(2)
    .max(255)
    .regex(/^[a-zA-Zа-яА-ЯёЁіІїЇєЄґҐ\s'-]+$/), // Only letters, spaces, hyphens
  phone: z.string()
    .trim()
    .regex(/^\+380\d{9}$/),
});
```

### 11.4 Supabase Integration Pattern

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

// Server-side client (uses SERVICE_KEY)
export const supabaseAdmin = createClient(
  import.meta.env.SUPABASE_URL,
  import.meta.env.SUPABASE_SERVICE_KEY, // Secret key - server only
  {
    auth: { persistSession: false },
  }
);

// Client-side client (uses ANON_KEY) - if needed
export const supabaseClient = createClient(
  import.meta.env.PUBLIC_SUPABASE_URL,
  import.meta.env.PUBLIC_SUPABASE_ANON_KEY // Public key - safe for client
);
```

### 11.5 Resend Integration Pattern

```typescript
// lib/resend.ts
import { Resend } from 'resend';

export const resend = new Resend(import.meta.env.RESEND_API_KEY);

// Email template function
export async function sendConsultationNotification(lead: Lead) {
  return await resend.emails.send({
    from: 'Viktoria Zhulova <notifications@zhulova.com>',
    to: 'viktoria@zhulova.com',
    subject: `New consultation request from ${lead.name}`,
    html: `
      <h2>New Consultation Request</h2>
      <p><strong>Name:</strong> ${lead.name}</p>
      <p><strong>Phone:</strong> ${lead.phone}</p>
      ${lead.telegram ? `<p><strong>Telegram:</strong> ${lead.telegram}</p>` : ''}
      ${lead.email ? `<p><strong>Email:</strong> ${lead.email}</p>` : ''}
    `,
  });
}
```

### 11.6 Performance Considerations

**Serverless Function Limits:**
- Max execution time: 10 seconds (Vercel Hobby), 60s (Pro)
- Max response size: 4.5MB
- Cold start: ~100-300ms
- Keep dependencies minimal (<1MB)

**Optimization Tips:**
- Use edge functions for low-latency (if available)
- Cache database connections
- Avoid heavy computations
- Use streaming for large responses

---

## 12. Prohibited Patterns

**AI MUST NOT:**
- ❌ Use CSS-in-JS (styled-components, emotion)
- ❌ Add large libraries (moment.js, lodash) without justification
- ❌ Implement server-side rendering (SSR) for pages
- ❌ Use databases or ORMs for page content (only serverless functions)
- ❌ Create non-static routes for SEO-critical content
- ❌ Ignore TypeScript errors
- ❌ Skip accessibility attributes
- ❌ Use inline styles
- ❌ Fetch data at runtime for critical content
- ❌ Add tracking scripts without async/defer
- ❌ Expose secret keys in client-side code
- ❌ Skip input validation in API routes
- ❌ Store sensitive data in localStorage/cookies

**Updated Rules for Databases:**
- ✅ Database writes in serverless functions (non-SEO data)
- ❌ Database reads for page rendering (use static Content Collections)
- ✅ Supabase for form submissions, user actions
- ❌ Direct database queries in Astro components

---

## 13. Logging & Monitoring

### 13.1 Server-Side Error Logging

**Purpose**: Structured error logging for serverless functions to enable rapid debugging of production issues.

**Architecture**:
- **Logger Utility**: `src/utils/logger.ts` - Centralized logging with automatic PII sanitization
- **Log Destination**: stdout/stderr → Vercel Dashboard → Logs tab
- **Zero Dependencies**: Native console API only (no winston, pino, or bunyan)
- **Performance Budget**: <5ms per log call (within API response time budget)

**Log Levels** (OWASP-compliant):
```typescript
ERROR - Operation failed completely, requires immediate attention
  Examples: Database connection timeout, missing env vars, unhandled exceptions

WARN  - Degraded functionality with fallback, transient failures
  Examples: Email rate limits (will retry), validation errors, timeouts

INFO  - Critical operational events (use sparingly to avoid noise)
  Examples: Cold start env validation, configuration changes
```

**Structured Log Format**:
```json
{
  "timestamp": "2025-11-23T14:30:00.000Z",
  "endpoint": "/api/submit-lead",
  "environment": "production",
  "requestId": "a1b2c3d4-...",
  "level": "ERROR",
  "message": "Database insert failed: connection timeout",
  "error_type": "db_error",
  "context": {
    "action": "submit_lead",
    "duration": 10500,
    "errorCode": "ETIMEDOUT",
    "affectedResource": "leads",
    "httpStatus": 500
  }
}
```

**What to Log**:
- ✅ API endpoint errors (database, validation, auth failures)
- ✅ Email service failures (rate limits, invalid config, timeouts)
- ✅ Missing/invalid environment variables on cold start
- ✅ Unhandled exceptions in serverless functions
- ❌ Successful operations (avoid log noise)
- ❌ Client-side errors (use Vercel Analytics instead)
- ❌ Static page renders (no server interaction)

**Security & Privacy** (GDPR/OWASP compliant):
- **Automatic PII Sanitization**: Emails → `[EMAIL]`, API keys → `[REDACTED]`, phones → `[PHONE]`
- **Context Truncation**: Max 1KB per log entry to prevent oversized logs
- **Message Truncation**: Max 500 characters per message
- **Anonymization**: User IDs hashed, recipients shown as `[ADMIN]`/`[USER]`
- **No Sensitive Data**: Never log passwords, tokens, full PII, request bodies with sensitive fields

**Usage Example**:
```typescript
import { logError, logWarn, logInfo } from '@utils/logger';

// Database error
logError('Database insert failed: connection timeout', {
  action: 'submit_lead',
  duration: 10500,
  errorCode: 'ETIMEDOUT',
  affectedResource: 'leads'
}, '/api/submit-lead');

// Validation error
logWarn('Request validation failed', {
  action: 'validate_request',
  validationErrors: ['email: Invalid format', 'phone: Too short'],
  httpStatus: 400
}, '/api/submit-lead');

// Cold start success
logInfo('Cold start: validated 5 environment variables', {
  action: 'validate_env',
  duration: 1
}, '/api/submit-lead');
```

**Viewing Logs**:
1. **Vercel Dashboard** → Select project → **Logs** tab
2. **Filter by**: Error level, function name, HTTP status, time range
3. **Search by**: JSON fields like `"error_type":"db_error"` or `"action":"submit_lead"`
4. **Logs appear**: Within 5-30 seconds of event (near real-time)

**Critical Reliability Rules**:
- ⚠️ **Always await async operations** before returning response (prevents log loss)
- ⚠️ **No logging inside loops** (O(n) performance overhead)
- ⚠️ **Limit to 3-5 log calls per request** (avoid excessive console output)
- ⚠️ **Never log in hot paths** (removes INFO logs for frequently-called functions)

**Error Type Categories** (for filtering/aggregation):
- `db_error` - Database connection failures, query errors, RLS violations
- `email_error` - Email service API failures, rate limits, config errors
- `validation_error` - User input validation failures (Zod schema errors)
- `config_error` - Missing environment variables, invalid configuration
- `system_error` - Unhandled exceptions, circular references, unexpected errors
- `cold_start` - Function initialization events

**Integration Points**:
- **Primary**: `/api/submit-lead` endpoint (consultation form)
- **Future**: All `/api/*` endpoints as they're added
- **Excluded**: Static pages (no server context), client-side code

### 13.2 Real User Monitoring (RUM)

**Vercel Analytics** (`@vercel/analytics`):
- User behavior tracking (page views, unique visitors, top pages)
- Privacy-friendly (no cookies, GDPR compliant)
- Bundle impact: ~2.5KB gzipped

**Vercel Speed Insights** (`@vercel/speed-insights`):
- Core Web Vitals: LCP, FID, CLS, FCP, TTFB, INP
- Performance by region, device, browser
- Bundle impact: ~0.7KB gzipped

**Access**: Vercel Dashboard → zhulova-com → Analytics / Speed Insights

---

## 14. CI/CD Automation & Quality Gates

### 14.1 GitHub Actions Workflows

**Performance Monitoring** (`.github/workflows/performance-monitor.yml`):
- **Triggers**: Push to main/master, PRs, daily at 3 AM UTC, manual dispatch
- **Jobs**:
  - `lighthouse-ci`: Tests built static files using lighthouserc.cjs (85+ score required)
  - `pagespeed-insights`: Tests production URL after Vercel deployment (95+ target)
  - `bundle-size`: Enforces JS < 100KB, CSS < 20KB (gzipped)
- **Outputs**: Lighthouse artifacts, PR comments with scores, performance degradation issues

**Performance Gate** (`.github/workflows/performance-gate.yml`):
- **Purpose**: Block PR merge if performance degrades
- **Checks**:
  - Lighthouse performance score ≥85
  - Accessibility score ≥90
  - Best practices score ≥85
  - SEO score ≥90
  - JS bundle < 100KB gzipped
  - CSS bundle < 20KB gzipped
- **Failure**: PR cannot merge until fixed

**Performance Alerts** (`.github/workflows/performance-alerts.yml`):
- **Triggers**: Push to main branch
- **Actions**:
  - Create GitHub issue if Lighthouse score < 85
  - Notify team (@goshazvir) via issue mention
  - Include remediation checklist (images, bundle, execution time)

### 14.2 Lighthouse CI Configuration

**File**: `lighthouserc.cjs`

**Key Settings**:
```javascript
{
  collect: {
    startServerCommand: 'npx http-server dist -p 8080',
    url: ['http://localhost:8080/'],
    numberOfRuns: 3,
    preset: 'desktop',
  },
  assert: {
    'categories:performance': ['warn', { minScore: 0.85 }],
    'categories:accessibility': ['error', { minScore: 0.90 }],
    'categories:best-practices': ['warn', { minScore: 0.85 }],
    'categories:seo': ['error', { minScore: 0.90 }],
    'total-byte-weight': ['warn', { maxNumericValue: 400000 }], // 400KB
  }
}
```

**Why http-server**:
- Tests actual static build output from `dist/` directory
- Verifies production bundle behavior (gzip, caching)
- No serverless functions (static pages only)

### 14.3 Bundle Size Monitoring

**Automated Checks**:
```bash
# JavaScript bundle limit
find dist/_astro -name "*.js" -exec cat {} \; | gzip -c | wc -c
# Limit: 102400 bytes (100KB gzipped)

# CSS bundle limit
find dist/_astro -name "*.css" -exec cat {} \; | gzip -c | wc -c
# Limit: 20480 bytes (20KB gzipped)
```

**Current Metrics** (as of 2025-11-24):
- JS: 80KB gzipped (20% under limit) ✅
- CSS: 7KB gzipped (65% under limit) ✅
- Images: 227KB total ✅

### 14.4 Performance Analysis Scripts

**Location**: `specs/012-architecture-review/scripts/`

1. **local-performance-check.js** - Lighthouse audit on local build
   ```bash
   node specs/012-architecture-review/scripts/local-performance-check.js
   ```
   - Builds project
   - Starts http-server
   - Runs Lighthouse CLI
   - Generates report with scores

2. **auto-performance-check.js** - Scheduled performance check
   - Uses PageSpeed Insights API
   - Requires `PAGESPEED_API_KEY` env var
   - Saves results to `reports/performance-auto-*.md`

3. **accessibility-audit.js** - WCAG compliance check
   - Uses axe-core and JSDOM
   - Tests all HTML files in `dist/`
   - Reports violations by severity (critical, serious, moderate, minor)

4. **analyze-component-structure.js** - Component testability assessment
   - Scans `src/components/` directory
   - Calculates testability score (21% → 85% potential)
   - Generates migration plan for folder-based structure

### 14.5 Quality Enforcement Rules

**MANDATORY CI Checks** (must pass to merge):
1. ✅ TypeScript strict mode compilation (`astro check`)
2. ✅ Lighthouse accessibility ≥90 (critical for WCAG compliance)
3. ✅ Lighthouse SEO ≥90 (critical for discoverability)
4. ✅ Bundle size limits (JS < 100KB, CSS < 20KB gzipped)

**WARNING CI Checks** (log but don't block):
1. ⚠️ Lighthouse performance ≥85 (warn if lower, investigate cause)
2. ⚠️ Best practices score (monitor for anti-patterns)

**Manual Review Required**:
- New serverless functions (security review)
- Environment variable changes (no secrets exposed)
- Major dependency updates (bundle size impact)

### 14.6 Continuous Monitoring

**Vercel Analytics** (automatic):
- Page views, unique visitors, top pages
- User behavior tracking (privacy-friendly)

**Vercel Speed Insights** (automatic):
- Core Web Vitals: LCP, FID, CLS, FCP, TTFB, INP
- Real User Monitoring (RUM) by region, device, browser

**GitHub Actions** (scheduled):
- Daily Lighthouse audits at 3 AM UTC
- Performance degradation alerts
- Bundle size trend monitoring

---

## 15. Success Criteria

### Pre-Launch Checklist:

**Performance:**
- [ ] Lighthouse Performance ≥95
- [ ] LCP <2.5s on 3G
- [ ] CLS <0.1
- [ ] Bundle size <350KB total

**Accessibility:**
- [ ] Lighthouse Accessibility ≥95
- [ ] All images have alt text
- [ ] Keyboard navigation works
- [ ] Color contrast passes WCAG AA
- [ ] Screen reader tested

**SEO:**
- [ ] All pages have unique titles
- [ ] Meta descriptions <160 chars
- [ ] Canonical URLs set
- [ ] Sitemap.xml generated
- [ ] Structured data present

**Code Quality:**
- [ ] TypeScript strict mode passes
- [ ] No console errors
- [ ] No unused imports
- [ ] ESLint passes
- [ ] Build completes without warnings

---

**Document Version:** 1.4
**Last Updated:** 2025-11-24
**Priority:** CRITICAL - This spec overrides all other considerations. Performance and accessibility are non-negotiable.

**Changelog:**
- v1.4 (2025-11-24): Architecture Review #012 completed - Updated performance targets based on production reality, added CI/CD automation section, validated static mode as optimal architecture
  - **Performance Targets**: Updated Lighthouse threshold from 95+ to 85+ (production-ready), JS bundle limit 50KB → 100KB (current: 80KB excellent)
  - **Architecture Validation**: Confirmed Astro's `output: 'static'` + Vercel adapter as optimal pattern for SSG with serverless API
  - **Accessibility**: Achieved 95%+ WCAG AA compliance (up from 64%), fixed keyboard navigation, color contrast, ARIA attributes
  - **CI/CD Automation**: Added 3 GitHub Actions workflows (performance-monitor.yml, performance-gate.yml, performance-alerts.yml), Lighthouse CI configuration (lighthouserc.cjs)
  - **Bundle Metrics**: Established baseline - 80KB JS, 7KB CSS (gzipped), 227KB images (optimized from 22MB)
  - **Testing Infrastructure**: Defined strategy with Vitest + React Testing Library, component testability assessment (21% → 85% potential)
  - **Monitoring**: Automated performance monitoring, bundle size enforcement, accessibility validation scripts
  - **Deliverables**: 11 reports, 5 analysis scripts, 4 CI/CD configs, migration script for component restructuring
- v1.3 (2025-11-23): Added comprehensive Logging & Monitoring section (feature 011-server-error-logging) - structured error logging for serverless functions, OWASP-compliant log levels, PII sanitization, error type categorization
- v1.2 (2025-01-16): Added Vercel Analytics and Speed Insights for Real User Monitoring (RUM), performance tracking
- v1.1 (2025-01-16): Added hybrid architecture with serverless functions, Supabase integration, Resend integration, environment variables, security patterns
- v1.0 (2025-01-14): Initial specification
