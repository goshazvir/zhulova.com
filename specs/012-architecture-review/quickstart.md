# Architecture Review Quick Start Guide

**Purpose**: Step-by-step guide to conduct architecture review and implement improvements
**Created**: 2025-11-24

## Prerequisites

- Node.js 18+ installed
- Access to Vercel dashboard
- Chrome browser with Lighthouse extension
- VS Code with axe Accessibility Linter

## Review Process

### Step 1: Performance Audit

#### Run Lighthouse Audits

1. Start development server:
```bash
npm run dev
```

2. Open Chrome DevTools → Lighthouse tab

3. Configure Lighthouse:
   - Mode: Navigation
   - Device: Desktop
   - Categories: All
   - Throttling: Applied (Slow 4G)

4. Run audits for each page:
   - Home: http://localhost:4321/
   - Courses: http://localhost:4321/courses
   - Course Detail: http://localhost:4321/courses/mindset-mastery
   - Contacts: http://localhost:4321/contacts
   - Privacy: http://localhost:4321/privacy-policy
   - Terms: http://localhost:4321/terms

5. Export reports as JSON for tracking

#### Analyze Bundle Size

```bash
# Build the project
npm run build

# Check build output
ls -la dist/_astro/*.js

# Analyze with source-map-explorer (install first)
npx source-map-explorer dist/_astro/*.js
```

### Step 2: Accessibility Audit

#### Automated Testing

1. Install axe DevTools Chrome extension

2. For each page:
   - Open page in browser
   - Run axe DevTools scan
   - Export violations report

3. Command line audit:
```bash
# Install pa11y
npm install -g pa11y

# Run audit
pa11y http://localhost:4321/
pa11y http://localhost:4321/courses
pa11y http://localhost:4321/contacts
```

#### Manual Keyboard Testing

Test each page with keyboard only:

- [ ] Tab through all interactive elements
- [ ] Verify focus indicators are visible
- [ ] Check tab order is logical
- [ ] Test modal escape with ESC key
- [ ] Verify skip links work
- [ ] Test form submission with Enter

#### Screen Reader Testing

1. Enable screen reader (NVDA/JAWS/VoiceOver)
2. Navigate through pages
3. Verify all content is announced
4. Check ARIA labels make sense
5. Test form field labels

### Step 3: Code Quality Review

#### TypeScript Strictness

```bash
# Check for TypeScript errors
npm run astro check

# Look for any usage
grep -r "any" src/**/*.ts src/**/*.tsx

# Check for unused variables
grep -r "// @ts-ignore" src/
```

#### Component Structure Analysis

```bash
# Count components
find src/components -name "*.tsx" -o -name "*.astro" | wc -l

# Check for test files
find src -name "*.test.*" -o -name "*.spec.*"

# Analyze component complexity
npx madge src/components --circular
```

### Step 4: Architecture Analysis

#### Rendering Mode Verification

1. Check configuration:
```bash
grep "output:" astro.config.mjs
```

2. Verify static pages:
```bash
# Build and check output
npm run build
ls dist/  # Should see HTML files
```

3. Test API endpoints:
```bash
# Start dev server
npm run dev

# Test API
curl -X POST http://localhost:4321/api/submit-lead \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","message":"Test"}'
```

#### Security Review

```bash
# Check for exposed secrets
grep -r "SUPABASE_SERVICE_KEY" src/
grep -r "RESEND_API_KEY" src/

# Verify environment variables
cat .env.example

# Check for hardcoded values
grep -r "localhost" src/ --exclude-dir=node_modules
```

## Interpreting Results

### Lighthouse Scores

**Target**: All scores ≥95

- **Performance**: Focus on LCP, CLS, TBT
- **Accessibility**: Address all violations
- **Best Practices**: Fix security/compatibility issues
- **SEO**: Ensure meta tags present

**Common Issues**:
- Large images → Convert to WebP
- Render-blocking resources → Defer/async
- Missing alt text → Add descriptions
- Low contrast → Adjust colors

### Accessibility Violations

**Severity Levels**:
- **Critical**: Must fix immediately (blocks users)
- **Serious**: Fix before deployment
- **Moderate**: Fix in next sprint
- **Minor**: Nice to have

**Quick Fixes**:
```astro
<!-- Add skip link -->
<a href="#main" class="sr-only focus:not-sr-only">Skip to main content</a>

<!-- Fix heading hierarchy -->
<h1>Main Title</h1>
  <h2>Subtitle</h2>
    <h3>Sub-subtitle</h3>

<!-- Add ARIA labels -->
<button aria-label="Open menu">☰</button>

<!-- Fix color contrast -->
.text-gold-500 → .text-gold-700
```

## Making Improvements

### Performance Optimizations

1. **Image Optimization**:
```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero.jpg';
---

<Image
  src={heroImage}
  alt="Description"
  width={1920}
  height={1080}
  format="webp"
  quality={85}
  loading={index === 0 ? 'eager' : 'lazy'}
/>
```

2. **Font Optimization**:
```html
<!-- In BaseLayout.astro -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
```

3. **JavaScript Splitting**:
```tsx
// Use dynamic imports for heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'));
```

### Accessibility Fixes

1. **Focus Management**:
```css
/* In global.css */
*:focus-visible {
  outline: 2px solid currentColor;
  outline-offset: 2px;
}
```

2. **Skip Links**:
```astro
<!-- In BaseLayout.astro -->
<body>
  <a href="#main" class="skip-link">Skip to main content</a>
  <Header />
  <main id="main">
    <slot />
  </main>
</body>
```

3. **ARIA Patterns**:
```tsx
// Modal component
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="modal-title"
>
  <h2 id="modal-title">Modal Title</h2>
  {/* content */}
</div>
```

## Validation Process

### Pre-Deployment Checklist

- [ ] Lighthouse scores all ≥95
- [ ] Zero critical accessibility violations
- [ ] TypeScript build passes
- [ ] Bundle size <50KB (gzipped)
- [ ] All images optimized (WebP)
- [ ] Security headers configured
- [ ] API endpoints tested
- [ ] Mobile responsive verified
- [ ] Cross-browser tested (Chrome, Firefox, Safari)

### Continuous Monitoring

1. **Setup Lighthouse CI**:
```yaml
# .github/workflows/lighthouse.yml
name: Lighthouse CI
on: [pull_request]
jobs:
  lighthouse:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: treosh/lighthouse-ci-action@v10
        with:
          urls: |
            https://preview.url/
            https://preview.url/courses
          uploadArtifacts: true
```

2. **Add Performance Budgets**:
```json
// lighthouse.config.js
module.exports = {
  ci: {
    collect: {
      numberOfRuns: 3
    },
    assert: {
      assertions: {
        'categories:performance': ['error', {minScore: 0.95}],
        'categories:accessibility': ['error', {minScore: 0.95}],
        'first-contentful-paint': ['error', {maxNumericValue: 2000}],
        'largest-contentful-paint': ['error', {maxNumericValue: 2500}],
        'cumulative-layout-shift': ['error', {maxNumericValue: 0.1}],
      }
    }
  }
};
```

## Common Commands

```bash
# Development
npm run dev           # Start dev server
npm run build         # Build for production
npm run preview       # Preview production build

# Testing
npm run astro check   # TypeScript checking
npx lighthouse http://localhost:4321 --view  # Run Lighthouse
npx pa11y http://localhost:4321              # Accessibility audit

# Analysis
npx madge src --circular     # Find circular dependencies
npx source-map-explorer dist/_astro/*.js    # Bundle analysis
```

## Resources

- [Lighthouse Documentation](https://developer.chrome.com/docs/lighthouse/)
- [WCAG Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [Astro Performance Guide](https://docs.astro.build/en/concepts/performance/)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)