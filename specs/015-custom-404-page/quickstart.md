# Quickstart: Custom 404 Error Page

**Feature**: 015-custom-404-page
**Time Estimate**: 3-4 hours
**Complexity**: Low-Medium

## Prerequisites

- Node.js 18+ installed
- Project dependencies installed (`npm install`)
- Understanding of Astro pages and Tailwind CSS

## Quick Implementation

### Step 1: Create the 404 Page

Create `src/pages/404.astro`:

```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';
---

<BaseLayout
  title="Сторінку не знайдено | Вікторія Жульова"
  description="Сторінка, яку ви шукаєте, не існує. Перегляньте курси або поверніться на головну."
>
  <main class="flex items-center justify-center min-h-screen px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full text-center animate-fade-in">
      <!-- Decorative 404 -->
      <p class="text-6xl sm:text-8xl lg:text-9xl font-serif font-light text-navy-900 mb-4" aria-hidden="true">
        404
      </p>

      <!-- Main heading (for screen readers) -->
      <h1 class="text-xl sm:text-2xl font-serif text-navy-900 mb-4">
        Сторінку не знайдено
      </h1>

      <!-- Empathetic message -->
      <p class="text-base sm:text-lg text-navy-600 mb-8 leading-relaxed">
        Схоже, ця сторінка була переміщена або більше не існує.
        Нічого страшного — давайте знайдемо те, що вам потрібно.
      </p>

      <!-- Primary CTA -->
      <a
        href="/"
        class="inline-flex items-center justify-center w-full sm:w-auto min-h-[48px] px-8 py-3 bg-navy-900 text-white font-medium rounded-lg hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-gold-500 focus:ring-offset-2 transition-colors"
      >
        На головну
      </a>

      <!-- Secondary CTAs -->
      <div class="mt-6 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-6 text-sm">
        <a
          href="/courses"
          class="text-gold-600 hover:text-gold-700 focus:outline-none focus:underline transition-colors min-h-[48px] flex items-center"
        >
          Переглянути курси
        </a>
        <span class="hidden sm:inline text-navy-300" aria-hidden="true">•</span>
        <a
          href="/contacts"
          class="text-gold-600 hover:text-gold-700 focus:outline-none focus:underline transition-colors min-h-[48px] flex items-center"
        >
          Зв'язатися зі мною
        </a>
      </div>
    </div>
  </main>
</BaseLayout>

<style>
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  .animate-fade-in {
    animation: fadeIn 0.6s ease-out;
  }

  @media (prefers-reduced-motion: reduce) {
    .animate-fade-in {
      animation: none;
    }
  }
</style>
```

### Step 2: Test Locally

```bash
# Start dev server
npm run dev

# Visit a non-existent URL
open http://localhost:4321/this-page-does-not-exist
```

### Step 3: Verify Checklist

- [ ] Page displays "404" prominently
- [ ] Ukrainian messaging is warm and empathetic
- [ ] "На головну" button links to `/`
- [ ] "Переглянути курси" links to `/courses`
- [ ] "Зв'язатися зі мною" links to `/contacts`
- [ ] Page is responsive (test at 320px, 768px, 1024px)
- [ ] Tab navigation works through all links
- [ ] Focus indicators are visible
- [ ] Animation respects `prefers-reduced-motion`

### Step 4: Run Tests

```bash
# Build and test
npm run build

# Run E2E tests (when created)
npx playwright test 404.spec.ts

# Check accessibility
npm run audit:all
```

## File Structure After Implementation

```
src/pages/
└── 404.astro    ← New file

tests/e2e/
└── 404.spec.ts  ← New test file (optional)
```

## Key Design Decisions

1. **"404" is decorative** (`aria-hidden="true"`) - Screen readers skip it
2. **Semantic h1** uses meaningful text "Сторінку не знайдено"
3. **48px minimum touch targets** on all interactive elements
4. **CSS-only animation** with reduced-motion support
5. **Mobile-first** responsive design with Tailwind breakpoints

## Common Issues

### Issue: Vercel shows default 404

**Solution**: Ensure `404.astro` is in `src/pages/` (not nested in a subdirectory)

### Issue: Animation is jarring

**Solution**: Reduce animation duration or disable:
```css
.animate-fade-in {
  animation: fadeIn 0.4s ease-out; /* Shorter duration */
}
```

### Issue: Color contrast fails

**Solution**: Use these verified color combinations:
- Navy-900 on white: ✅ 20:1 ratio
- Gold-600 on white: ✅ 4.5:1 ratio (verify with axe-core)

## Resources

- [Astro 404 Pages](https://docs.astro.build/en/basics/astro-pages/#custom-404-error-page)
- [WCAG 2.1 Quick Reference](https://www.w3.org/WAI/WCAG21/quickref/)
- [Research Document](./research.md)
- [Full Specification](./spec.md)
