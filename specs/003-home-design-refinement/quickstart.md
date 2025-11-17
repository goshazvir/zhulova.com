# Quickstart: Home Page Design Refinement

**Feature**: 003-home-design-refinement
**Branch**: `003-home-design-refinement`
**Estimated Time**: 2-3 hours (5 components to modify)

## Prerequisites

- Git branch `003-home-design-refinement` checked out
- Node.js v18+ installed
- Dependencies installed (`npm install`)
- Dev server running (`npm run dev` at `localhost:4321`)
- Baseline measurements taken (see below)

## Baseline Measurements (Do This First!)

Before making any changes, capture baseline metrics:

```bash
# 1. Take screenshots for visual comparison
# - Desktop: localhost:4321 at 1920x1080
# - Mobile: localhost:4321 at 375x667

# 2. Measure footer height
# - Open DevTools → Elements → Inspect <footer id="contacts">
# - Note getBoundingClientRect().height for desktop and mobile

# 3. Run Lighthouse audit (save results)
npx lighthouse http://localhost:4321 --output=json --output-path=baseline-lighthouse.json

# 4. Note current metrics
# - LCP, CLS, Performance score
```

## Implementation Sequence

### Step 1: Stats Section (15 min)

**File**: `src/components/sections/StatsSection.astro`

**Changes**:
1. Change grid from equal columns to asymmetric layout
2. Increase primary stat size, decrease secondary stats
3. Remove hover backgrounds, add subtle scale effect

**Implementation**:

```diff
- <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
+ <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {statistics.map((stat, index) => (
    <div
-     class="text-center p-6 rounded-lg bg-sage-50 hover:bg-sage-100 transition-colors"
+     class={`text-center p-6 rounded-lg border border-gray-200 hover:scale-105 transition-transform ${index === 0 ? 'md:col-span-2 lg:row-span-2' : ''}`}
      data-animate
      style={`animation-delay: ${index * 100}ms`}
    >
-     <div class="text-4xl md:text-5xl font-serif font-bold text-gold-600 mb-3">
+     <div class={`font-serif font-bold text-gold-600 mb-3 ${index === 0 ? 'text-6xl md:text-7xl' : 'text-3xl md:text-4xl'}`}>
        {stat.value}
      </div>
      <div class="text-navy-700 font-medium">
        {stat.label}
      </div>
    </div>
  ))}
</div>
```

**Test**:
- Verify first stat is larger than others
- Check hover scale effect works
- Test responsive behavior on mobile

---

### Step 2: Questions Section (20 min)

**File**: `src/components/sections/QuestionsSection.astro`

**Changes**:
1. Remove pill-style tab backgrounds
2. Use simple underline indicator for active tab
3. Reduce question card backgrounds to borders

**Implementation**:

```diff
<!-- Tabs -->
<div class="flex justify-center mb-12">
- <div class="inline-flex rounded-lg border border-navy-200 p-1 bg-navy-50">
+ <div class="inline-flex gap-8">
    <button
      id="personal-tab"
      type="button"
-     class="px-6 py-3 rounded-md font-medium transition-colors"
+     class="px-6 py-3 font-medium transition-all border-b-2 border-transparent"
      data-tab="personal"
      aria-selected="true"
      role="tab"
    >
      Особисті питання
    </button>
    <button
      id="business-tab"
      type="button"
-     class="px-6 py-3 rounded-md font-medium transition-colors"
+     class="px-6 py-3 font-medium transition-all border-b-2 border-transparent"
      data-tab="business"
      aria-selected="false"
      role="tab"
    >
      Бізнес і лідерство
    </button>
  </div>
</div>

<!-- Question Cards -->
{personalQuestions.map((question, index) => (
  <div
-   class="flex items-start gap-3 p-4 rounded-lg bg-sage-50 hover:bg-sage-100 transition-colors"
+   class="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-gold-500 transition-colors"
    data-animate
    style={`animation-delay: ${index * 50}ms`}
  >
-   <svg class="w-6 h-6 text-gold-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
+   <svg class="w-6 h-6 text-gold-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
    </svg>
    <p class="text-navy-700 font-medium">{question}</p>
  </div>
))}
```

**Update JavaScript** (tab switching):

```diff
function switchTab(tab: 'personal' | 'business') {
  if (tab === 'personal') {
-   personalTab?.classList.add('bg-white', 'text-navy-900', 'shadow-sm');
+   personalTab?.classList.add('border-gold-600', 'text-navy-900');
-   personalTab?.classList.remove('text-navy-600');
+   personalTab?.classList.remove('border-transparent', 'text-navy-600');
    personalTab?.setAttribute('aria-selected', 'true');

-   businessTab?.classList.remove('bg-white', 'text-navy-900', 'shadow-sm');
+   businessTab?.classList.remove('border-gold-600', 'text-navy-900');
-   businessTab?.classList.add('text-navy-600');
+   businessTab?.classList.add('border-transparent', 'text-navy-600');
    businessTab?.setAttribute('aria-selected', 'false');

    // ... panel switching unchanged
  } else {
    // ... mirror logic for business tab
  }
}
```

**Test**:
- Click tabs to verify underline indicator switches
- Check keyboard navigation (Tab key)
- Verify question cards have hover effect

---

### Step 3: Case Studies Section (30 min)

**File**: `src/components/sections/CaseStudiesSection.astro`

**Changes**:
1. Remove red/green colored backgrounds
2. Simplify before/after indicators to icons
3. Adjust spacing for better readability

**Implementation**:

```diff
<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
  {caseStudies.map((study) => (
    <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow" data-animate>
-     <div class="p-8">
+     <div class="p-6">
        {/* Header - unchanged */}

        {/* Before */}
        <div class="mb-6">
          <h4 class="text-lg font-semibold text-navy-900 mb-3 flex items-center gap-2">
-           <span class="w-2 h-2 bg-red-500 rounded-full"></span>
+           <svg class="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
+             <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
+           </svg>
            Було
          </h4>
-         <div class="bg-red-50 rounded-lg p-4">
+         <div class="border-l-4 border-red-500 pl-4 py-2">
            <p class="text-navy-700 font-medium mb-2">
              {study.before.employment}
            </p>
            <ul class="space-y-2">
              {study.before.challenges.map((challenge) => (
                <li class="flex items-start gap-2 text-navy-600">
-                 <svg class="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
-                   <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/>
-                 </svg>
+                 <span class="text-red-500">✗</span>
                  <span>{challenge}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* After */}
        <div>
          <h4 class="text-lg font-semibold text-navy-900 mb-3 flex items-center gap-2">
-           <span class="w-2 h-2 bg-green-500 rounded-full"></span>
+           <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
+             <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
+           </svg>
            Стало
          </h4>
-         <div class="bg-green-50 rounded-lg p-4">
+         <div class="border-l-4 border-green-500 pl-4 py-2">
            <ul class="space-y-2">
              {study.after.achievements.map((achievement) => (
                <li class="flex items-start gap-2 text-navy-700">
-                 <svg class="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
-                   <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/>
-                 </svg>
+                 <span class="text-green-500">✓</span>
                  <span>{achievement}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  ))}
</div>
```

**Test**:
- Verify before/after sections use border-left instead of backgrounds
- Check icons display correctly
- Test mobile responsiveness

---

### Step 4: Testimonials Section (25 min)

**File**: `src/components/sections/TestimonialsSection.astro`

**Changes**:
1. Replace dark navy gradient with light sage gradient
2. Update text colors from white to navy
3. Reduce quote icon size and opacity

**Implementation**:

```diff
-<section id="testimonials" class="py-20 bg-gradient-to-br from-navy-900 to-navy-800 text-white" data-animate>
+<section id="testimonials" class="py-20 bg-gradient-to-br from-sage-50 to-white" data-animate>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div class="text-center mb-16">
-     <h2 class="text-4xl md:text-5xl font-serif font-bold mb-4">
+     <h2 class="text-4xl md:text-5xl font-serif font-bold text-navy-900 mb-4">
        Що кажуть мої клієнти
      </h2>
-     <p class="text-lg text-navy-300 max-w-3xl mx-auto">
+     <p class="text-lg text-navy-700 max-w-3xl mx-auto">
        Реальні відгуки від людей, які довірили мені свій розвиток
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {testimonials.map((testimonial, index) => (
        <div
-         class="bg-white/10 backdrop-blur-sm rounded-xl p-8 hover:bg-white/15 transition-all"
+         class="bg-white rounded-xl p-8 border border-gray-200 hover:shadow-lg transition-all"
          data-animate
          style={`animation-delay: ${index * 150}ms`}
        >
          {/* Quote Icon */}
          <div class="mb-6">
-           <svg class="w-12 h-12 text-gold-400 opacity-50" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
+           <svg class="w-8 h-8 text-gold-500 opacity-30" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
            </svg>
          </div>

          {/* Quote */}
          <blockquote class="mb-6">
-           <p class="text-lg text-white leading-relaxed">
+           <p class="text-lg text-navy-700 leading-relaxed">
              {testimonial.quote}
            </p>
          </blockquote>

          {/* Author */}
-         <div class="pt-6 border-t border-white/20">
+         <div class="pt-6 border-t border-gray-200">
            <cite class="not-italic">
-             <div class="font-semibold text-gold-400 mb-1">
+             <div class="font-semibold text-gold-600 mb-1">
                {testimonial.clientName}
              </div>
-             <div class="text-sm text-navy-300">
+             <div class="text-sm text-navy-600">
                {testimonial.role}
              </div>
            </cite>
          </div>
        </div>
      ))}
    </div>

    {/* Star Rating */}
    <div class="text-center mt-16">
      <!-- ... stars unchanged ... -->
-     <p class="text-navy-300 text-sm">
+     <p class="text-navy-600 text-sm">
        Середня оцінка клієнтів: 5.0 / 5.0
      </p>
    </div>
  </div>
</section>
```

**Test**:
- Verify light background displays correctly
- Check color contrast with WebAIM Contrast Checker
- Test hover shadow effect

---

### Step 5: Footer (40 min)

**File**: `src/components/layout/Footer.astro`

**Changes**:
1. Reduce CTA section padding
2. Convert 3-column footer to horizontal layout (desktop)
3. Maintain stacked layout on mobile

**Implementation**:

```diff
<!-- CTA Section -->
-<div class="bg-sage-50 text-navy-900 py-16">
+<div class="bg-sage-50 text-navy-900 py-10">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
-   <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
+   <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
      <!-- Image - reduce size on mobile -->
      <div class="order-2 lg:order-1">
        <Image
          src={footerContent.imageSrc}
          alt={footerContent.imageAlt}
-         width={600}
-         height={600}
+         width={500}
+         height={500}
          format="webp"
          quality={85}
          loading="lazy"
          class="rounded-lg shadow-xl w-full h-auto"
        />
      </div>

      <!-- CTA Text -->
      <div class="order-1 lg:order-2 space-y-6">
        <h2 class="text-4xl md:text-5xl font-serif font-bold text-navy-900">
          Готовий змінити своє життя?
        </h2>
        <p class="text-lg text-navy-700">
          Запишіться на безкоштовну діагностичну сесію та отримайте персональний план розвитку.
        </p>
        <button
          id="footer-cta-button"
          type="button"
          class="bg-gold-500 text-navy-900 px-8 py-4 text-lg font-medium rounded-lg hover:bg-gold-400 transition-colors focus:ring-2 focus:ring-offset-2 focus:ring-gold-500"
          aria-label="Записатись на діагностику"
        >
          {footerContent.ctaText}
        </button>
      </div>
    </div>
  </div>
</div>

<!-- Footer Content -->
-<div class="py-12 bg-navy-900">
+<div class="py-8 bg-navy-900">
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
-   <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
+   <div class="flex flex-col md:flex-row md:justify-between md:items-start gap-8">
      <!-- Column 1: Brand -->
-     <div>
+     <div class="md:flex-shrink-0">
        <img
          src="/logo-light.svg"
          alt="Viktoria Zhulova"
-         class="h-12 mb-4"
+         class="h-10 mb-4"
          width="90"
          height="50"
        />
-       <p class="text-navy-300">
+       <p class="text-navy-300 text-sm max-w-xs">
          Сертифікований коуч з досвідом роботи понад 10 років. Допомагаю людям досягати їхніх цілей.
        </p>
      </div>

      <!-- Column 2: Navigation -->
-     <div>
+     <div class="md:flex-shrink-0">
        <h4 class="text-lg font-semibold text-white mb-4">Навігація</h4>
-       <nav class="space-y-2" aria-label="Footer navigation">
+       <nav class="flex flex-col gap-2" aria-label="Footer navigation">
          <a href="#home" class="block text-navy-300 hover:text-gold-400 transition-colors text-sm">
            Про мене
          </a>
          <!-- ... other links with text-sm class ... -->
        </nav>
      </div>

      <!-- Column 3: Social Media -->
-     <div>
+     <div class="md:flex-shrink-0">
        <h4 class="text-lg font-semibold text-white mb-4">Соціальні мережі</h4>
-       <div class="flex space-x-4">
+       <div class="flex gap-4">
          <a
            href={socialLinks.youtube}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube"
            class="text-navy-300 hover:text-gold-400 transition-colors"
          >
-           <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
+           <svg class="w-7 h-7" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <!-- ... icon paths unchanged ... -->
            </svg>
          </a>
          <!-- ... other social icons with w-7 h-7 ... -->
        </div>
      </div>
    </div>

    <!-- Copyright -->
-   <div class="mt-12 pt-8 border-t border-navy-700 text-center text-navy-400">
+   <div class="mt-8 pt-6 border-t border-navy-700 text-center text-navy-400 text-sm">
      <p>{footerContent.copyright}</p>
    </div>
  </div>
</div>
```

**Test**:
- Measure new footer height (should be ≥30% smaller on desktop)
- Verify horizontal layout on desktop
- Check stacked layout on mobile
- Test all navigation links and social icons

---

## Validation & Testing

### After Each Component

1. **Visual Check**: Reload page, verify changes look correct
2. **Responsive Check**: Test on mobile (DevTools → Responsive Mode)
3. **Accessibility Check**: Tab through section with keyboard

### After All Components

```bash
# 1. Run Lighthouse audit
npx lighthouse http://localhost:4321 --output=json --output-path=redesign-lighthouse.json

# 2. Compare metrics
# - Performance: Should be ≥95 (same as baseline)
# - Accessibility: Should be ≥95 (same as baseline)
# - LCP: Should be <2.5s (same as baseline)
# - CLS: Should be <0.1 (same as baseline)

# 3. Measure footer height reduction
# - Desktop: Compare baseline vs. redesign
# - Mobile: Compare baseline vs. redesign
# - Target: ≥30% (desktop), ≥40% (mobile)

# 4. Color contrast verification
# Visit: https://webaim.org/resources/contrastchecker/
# Test all new color combinations from data-model.md
```

### Manual Testing Checklist

- [ ] Stats section: Primary stat larger than secondary stats
- [ ] Stats section: Hover scale effect works
- [ ] Questions section: Tab switching with underline indicator works
- [ ] Questions section: Keyboard navigation (Tab, Enter) works
- [ ] Case studies: Border-left styling instead of backgrounds
- [ ] Case studies: Icons (✗, ✓) display correctly
- [ ] Testimonials: Light background with good contrast
- [ ] Testimonials: Quote icon smaller and subtle
- [ ] Footer CTA: Reduced padding, maintains readability
- [ ] Footer: Horizontal layout on desktop, stacked on mobile
- [ ] Footer: All navigation links accessible
- [ ] Footer: Social icons responsive

---

## Troubleshooting

### Issue: Footer height not reducing enough

**Solution**: Check padding values, ensure CTA image is properly sized on mobile

```css
/* Add if needed */
@media (max-width: 640px) {
  .footer-cta-image {
    max-height: 400px;
    object-fit: cover;
  }
}
```

### Issue: Tab switching broken in Questions section

**Solution**: Verify JavaScript logic updated with new class names

```javascript
// Double-check active state classes
personalTab?.classList.add('border-gold-600', 'text-navy-900');
personalTab?.classList.remove('border-transparent', 'text-navy-600');
```

### Issue: Low color contrast in testimonials

**Solution**: Darken text color if needed

```diff
- <p class="text-lg text-navy-700 leading-relaxed">
+ <p class="text-lg text-navy-800 leading-relaxed">
```

### Issue: CLS (Cumulative Layout Shift) increased

**Solution**: Add explicit dimensions to footer elements

```astro
<div class="py-8 bg-navy-900" style="min-height: 400px;">
  <!-- footer content -->
</div>
```

---

## Commit Strategy

Create one commit per component for easy rollback:

```bash
# After Step 1
git add src/components/sections/StatsSection.astro
git commit -m "refactor: redesign stats section with asymmetric grid

- Change from equal 4-column to asymmetric layout (1 large + 3 small)
- Increase primary stat size (text-6xl), reduce secondary (text-3xl)
- Replace hover background with subtle scale transform
- Remove sage-50 backgrounds, use border-gray-200

Contributes to SC-003 (visual clutter reduction)"

# After Step 2
git add src/components/sections/QuestionsSection.astro
git commit -m "refactor: simplify questions section tab styling

- Replace pill-style tabs with underline indicators
- Remove navy-50 backgrounds from tabs
- Change question cards from sage-50 to white with borders
- Update tab switching JS for new class names

Maintains FR-003 (current functionality preserved)"

# ... repeat for each step
```

---

## Success Criteria Verification

After all changes:

| Criterion | Target | Measurement | Pass? |
|-----------|--------|-------------|-------|
| SC-001 | Footer ≥30% shorter (desktop) | Baseline: ___px → Redesign: ___px | ⬜ |
| SC-001 | Footer ≥40% shorter (mobile) | Baseline: ___px → Redesign: ___px | ⬜ |
| SC-008 | Lighthouse Performance ≥95 | Redesign score: ___ | ⬜ |
| SC-008 | Lighthouse Accessibility ≥95 | Redesign score: ___ | ⬜ |
| SC-009 | LCP <2.5s | Redesign LCP: ___s | ⬜ |
| SC-009 | CLS <0.1 | Redesign CLS: ___ | ⬜ |

**Fill in measurements** and verify all pass before merging to main branch.

---

## Next Steps

After implementation:

1. **Create PR**: `gh pr create --title "Home Page Design Refinement" --body "Implements 003-home-design-refinement spec"`
2. **User Testing**: Show to stakeholders, gather feedback
3. **Analytics**: Monitor engagement metrics post-deployment
4. **Iterate**: Address feedback in follow-up PRs if needed

## Support

If you encounter issues not covered here, refer to:
- **Feature Spec**: `specs/003-home-design-refinement/spec.md`
- **Research**: `specs/003-home-design-refinement/research.md`
- **Data Model**: `specs/003-home-design-refinement/data-model.md`
- **Project Docs**: `.claude/docs/technical-spec.md`, `.claude/docs/about.md`
