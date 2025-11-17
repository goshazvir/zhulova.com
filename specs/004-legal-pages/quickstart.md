# Quickstart Guide: Legal Pages Implementation

**Feature**: 004-legal-pages
**Estimated Time**: 3-4 hours
**Difficulty**: Easy

## Prerequisites

- Existing Zhulova project cloned locally
- Node.js 18+ installed
- Familiarity with Astro and Tailwind CSS
- Branch `004-legal-pages` checked out

## Implementation Overview

This feature creates two static legal pages and updates two existing components. No database changes, no API endpoints, no new dependencies.

**Components to create**: 2 static pages
**Components to modify**: 2 existing components (Footer, ConsultationModal)

---

## Step 1: Create Privacy Policy Page (45 min)

### File: `src/pages/privacy-policy.astro`

Create a new Astro page with Ukrainian privacy policy content.

**Structure**:
```astro
---
import BaseLayout from '@layouts/BaseLayout.astro';

const lastUpdated = '2025-11-17';
---

<BaseLayout
  title="Політика конфіденційності - Вікторія Жульова"
  description="Політика конфіденційності Вікторії Жульової - як ми збираємо, використовуємо та захищаємо ваші персональні дані."
>
  <main class="min-h-screen bg-white py-20 px-6">
    <article class="max-w-4xl mx-auto">
      <!-- Last Updated -->
      <p class="text-sm text-navy-600 mb-4">Оновлено: {lastUpdated}</p>

      <!-- Page Title (H1) -->
      <h1 class="text-4xl md:text-5xl font-serif text-navy-900 mb-12">
        Політика конфіденційності
      </h1>

      <!-- Table of Contents -->
      <nav class="mb-12 p-6 bg-sage-50 rounded-lg">
        <h2 class="text-lg font-semibold text-navy-900 mb-4">Зміст</h2>
        <ol class="space-y-2 list-decimal list-inside">
          <li><a href="#controller" class="text-navy-700 hover:text-gold-600">Контролер даних</a></li>
          <li><a href="#purpose" class="text-navy-700 hover:text-gold-600">Мета обробки даних</a></li>
          <!-- Add all 16 sections as TOC items -->
        </ol>
      </nav>

      <!-- Sections (16 mandatory sections from research.md) -->
      <section id="controller" class="mb-10">
        <h2 class="text-2xl font-serif text-navy-900 mb-4">1. Контролер даних</h2>
        <p class="text-navy-700 leading-relaxed mb-4">
          [Ukrainian content describing data controller identity, contact info]
        </p>
      </section>

      <!-- Repeat for all 16 sections... -->

    </article>
  </main>
</BaseLayout>
```

**Content Requirements** (see `research.md` for full details):
- 16 mandatory sections (Data Controller, Purpose, Legal Basis, etc.)
- All text in Ukrainian language
- Contact email for data inquiries
- Reference to Supabase and Resend as third-party processors

**Styling Guidelines**:
- Max width: `max-w-4xl` (optimal line length for readability)
- Headings: `font-serif` (Playfair Display), `text-navy-900`
- Body text: `font-sans` (Inter), `text-navy-700`, `leading-relaxed`
- Line height: `leading-relaxed` (1.625)
- Section spacing: `mb-10` between sections
- TOC background: `bg-sage-50` for subtle differentiation

**Accessibility Checklist**:
- [ ] Single H1 heading
- [ ] Proper heading hierarchy (H2 for sections, H3 for subsections)
- [ ] Descriptive anchor IDs (kebab-case: `data-controller`)
- [ ] Table of contents links navigate to sections
- [ ] All links have hover states
- [ ] `lang="uk"` declared in BaseLayout

---

## Step 2: Create Terms & Conditions Page (60 min)

### File: `src/pages/terms.astro`

Create a new Astro page with Ukrainian terms & conditions content.

**Structure**: Same as Privacy Policy (see above), but with 20 sections instead of 16.

**Content Requirements** (see `research.md` for full details):
- 20 mandatory sections (Service Provider Identity, Service Description, Price, etc.)
- All text in Ukrainian language
- Emphasis on consumer rights (14-day withdrawal, refund policy)
- Health disclaimer (coaching is not medical treatment)
- Liability limitations (cannot exclude liability for negligence causing harm)

**Critical Legal Language**:
- Refund policy: "Refunds processed within 7 days"
- Withdrawal right: "14-day cooling-off period for online coaching"
- Health disclaimer: "Coaching is not medical, psychological, or psychiatric treatment"
- Liability: "We cannot exclude liability for death or injury caused by our negligence"

**Styling**: Same as Privacy Policy page for consistency.

---

## Step 3: Update Footer Component (30 min)

### File: `src/components/layout/Footer.astro`

Modify footer to add legal links with responsive layout.

**Current Footer Structure** (approximate):
```astro
<footer class="bg-navy-900 text-white py-12">
  <div class="container mx-auto px-6">
    <!-- Existing content: logo, social links, etc. -->
    <div class="mt-8 pt-8 border-t border-navy-700">
      <p class="text-center text-sm text-navy-300">
        © 2025 Вікторія Жульова
      </p>
    </div>
  </div>
</footer>
```

**New Footer Structure**:
```astro
<footer class="bg-navy-900 text-white py-12">
  <div class="container mx-auto px-6">
    <!-- Existing content unchanged -->

    <!-- MODIFIED: Copyright + Legal Links Row -->
    <div class="mt-8 pt-8 border-t border-navy-700">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <!-- Copyright (left on desktop, center on mobile) -->
        <p class="text-sm text-navy-300 text-center sm:text-left">
          © 2025 Вікторія Жульова
        </p>

        <!-- Legal Links (right on desktop, center on mobile) -->
        <nav class="flex flex-col sm:flex-row gap-2 sm:gap-6 text-center sm:text-right">
          <a
            href="/privacy-policy"
            class="text-sm text-navy-300 hover:text-gold-400 transition-colors"
            aria-label="Перейти до політики конфіденційності"
          >
            Політика конфіденційності
          </a>
          <a
            href="/terms"
            class="text-sm text-navy-300 hover:text-gold-400 transition-colors"
            aria-label="Перейти до умов використання"
          >
            Умови використання
          </a>
        </nav>
      </div>
    </div>
  </div>
</footer>
```

**Changes**:
1. Wrap copyright + legal links in flexbox container
2. Add responsive breakpoint: `sm:flex-row` (horizontal on ≥640px)
3. Add legal navigation with 2 links
4. Add hover states: `hover:text-gold-400`
5. Add aria-label for accessibility

**Testing**:
- [ ] Desktop: Copyright left, links right
- [ ] Mobile: Stacked vertically, center-aligned
- [ ] Links navigate to correct pages
- [ ] Hover states work correctly

---

## Step 4: Update Consultation Modal (20 min)

### File: `src/components/forms/ConsultationModal.tsx`

Add privacy notice text with link above submit button.

**Current Modal Structure** (approximate):
```tsx
<form onSubmit={handleSubmit}>
  {/* Form fields */}
  <input type="text" name="name" />
  <input type="email" name="email" />
  <textarea name="message" />

  {/* Submit button */}
  <button type="submit">Надіслати заявку</button>
</form>
```

**New Modal Structure**:
```tsx
<form onSubmit={handleSubmit}>
  {/* Form fields unchanged */}
  <input type="text" name="name" />
  <input type="email" name="email" />
  <textarea name="message" />

  {/* NEW: Privacy Notice */}
  <p className="mt-4 mb-6 text-xs text-navy-600 text-center">
    Натискаючи кнопку, ви погоджуєтесь з нашою{' '}
    <a
      href="/privacy-policy"
      target="_blank"
      rel="noopener noreferrer"
      className="text-gold-600 hover:text-gold-400 underline transition-colors"
      aria-label="Прочитати політику конфіденційності (відкривається в новій вкладці)"
    >
      політики конфіденційності
    </a>
    .
  </p>

  {/* Submit button */}
  <button type="submit">Надіслати заявку</button>
</form>
```

**Changes**:
1. Add privacy notice paragraph above submit button
2. Link to `/privacy-policy` with `target="_blank"`
3. Add `rel="noopener noreferrer"` for security
4. Style link: `text-gold-600 hover:text-gold-400 underline`
5. Add descriptive aria-label indicating new tab

**Testing**:
- [ ] Privacy notice appears above submit button
- [ ] Link opens privacy policy in new tab
- [ ] Link has hover state (gold color change)
- [ ] Text wraps properly on mobile
- [ ] aria-label announces new tab behavior to screen readers

---

## Step 5: Testing & Validation (45 min)

### Manual Testing

**Browser Testing** (all devices):
```bash
npm run dev
# Visit http://localhost:4321
```

Test checklist:
- [ ] Navigate to `/privacy-policy` - page loads correctly
- [ ] Navigate to `/terms` - page loads correctly
- [ ] Click footer legal links - navigate to correct pages
- [ ] Click TOC links on legal pages - scroll to sections
- [ ] Open consultation modal - privacy notice visible
- [ ] Click privacy policy link in modal - opens in new tab
- [ ] Test responsive layouts (mobile 375px, tablet 768px, desktop 1920px)

**Accessibility Testing**:
```bash
# Lighthouse audit (Performance, Accessibility, SEO ≥95)
# Chrome DevTools > Lighthouse > Generate report
```

- [ ] Lighthouse Accessibility score ≥95
- [ ] Keyboard navigation: Tab through all links
- [ ] Focus indicators visible on all interactive elements
- [ ] Heading hierarchy valid (H1 → H2 → H3)
- [ ] Color contrast ≥4.5:1 (check with WebAIM)

**Screen Reader Testing** (optional but recommended):
- [ ] NVDA (Windows) or VoiceOver (macOS)
- [ ] Navigate by headings (H key)
- [ ] Navigate by links (K key)
- [ ] TOC announces correctly

### Build Validation

```bash
# Type-check and build
npm run build

# Preview production build
npm run preview
# Visit http://localhost:4321
```

Build checklist:
- [ ] No TypeScript errors
- [ ] No build warnings
- [ ] Legal pages present in `dist/` directory
- [ ] Page weight <100KB per page (check Network tab)

---

## Step 6: Git Commit (10 min)

```bash
# Check changes
git status
git diff

# Stage files
git add src/pages/privacy-policy.astro
git add src/pages/terms.astro
git add src/components/layout/Footer.astro
git add src/components/forms/ConsultationModal.tsx

# Commit with descriptive message
git commit -m "feat(legal): add privacy policy and terms & conditions pages

- Create /privacy-policy page with 16 mandatory sections (Ukrainian Law + GDPR)
- Create /terms page with 20 mandatory sections (Ukrainian consumer law)
- Update Footer with legal links (copyright left, legal links right)
- Add privacy notice with link in ConsultationModal
- Implement responsive layouts for mobile/tablet/desktop
- Ensure WCAG AA accessibility compliance

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"
```

**Do NOT push yet** - wait for PR creation approval from user.

---

## Troubleshooting

### Issue: Footer links not aligned correctly on mobile

**Solution**: Check Tailwind breakpoints. Ensure `sm:flex-row` and `sm:justify-between` are present.

### Issue: Table of contents links don't scroll to sections

**Solution**: Verify anchor IDs match href values exactly. Example: `<h2 id="data-collection">` matches `<a href="#data-collection">`.

### Issue: Privacy policy link doesn't open in new tab

**Solution**: Verify `target="_blank"` attribute is present on `<a>` element in modal.

### Issue: Heading hierarchy errors in Lighthouse

**Solution**: Ensure single `<h1>` per page, no skipped levels (H2 → H4 without H3).

---

## Next Steps

After implementation:

1. **Manual QA**: Test all user stories from `spec.md`
2. **Legal Review**: Have legal expert review Ukrainian content (recommended but not required for MVP)
3. **Create PR**: Use `/speckit.tasks` to generate task breakdown, then create pull request
4. **Deploy**: Merge to main, auto-deploy to production via Vercel

---

## Estimated Timeline

| Task | Time | Cumulative |
|------|------|------------|
| Privacy Policy page | 45 min | 45 min |
| Terms & Conditions page | 60 min | 1h 45min |
| Footer component update | 30 min | 2h 15min |
| Modal component update | 20 min | 2h 35min |
| Testing & validation | 45 min | 3h 20min |
| Git commit | 10 min | **3h 30min** |

**Total**: ~3.5 hours for experienced developer

---

## Reference Files

- **Legal Requirements**: `specs/004-legal-pages/research.md`
- **Data Model**: `specs/004-legal-pages/data-model.md`
- **Feature Spec**: `specs/004-legal-pages/spec.md`
- **Project Constitution**: `.specify/memory/constitution.md`
- **Technical Spec**: `.claude/docs/technical-spec.md`

**Questions?** Refer to `CLAUDE.md` for project-specific guidance.
