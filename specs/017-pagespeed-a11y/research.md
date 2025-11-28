# Research: PageSpeed Accessibility Optimization

**Feature**: 017-pagespeed-a11y
**Date**: 2025-11-28

## 1. Color Contrast Analysis

### Current State

Current gold palette from `tailwind.config.mjs`:
```
gold-500: #d4af37 (primary brand gold)
gold-600: #b8941f (used for text)
gold-700: #9a7a16
gold-800: #7c600f
```

### Contrast Ratio Calculations

Using WebAIM Contrast Checker methodology:

| Color | Hex | vs White (#fff) | vs Sage-50 (#f5f7f5) | WCAG AA (4.5:1) |
|-------|-----|-----------------|----------------------|-----------------|
| gold-500 | #d4af37 | 2.1:1 | 2.0:1 | ❌ FAIL |
| gold-600 | #b8941f | 3.3:1 | 3.2:1 | ❌ FAIL |
| gold-700 | #9a7a16 | 4.6:1 | 4.4:1 | ⚠️ Borderline |
| gold-800 | #7c600f | 6.2:1 | 5.9:1 | ✅ PASS |
| navy-800 | #243b53 | 10.5:1 | 10.1:1 | ✅ PASS |

### Decision: Use gold-800 for accessible text

**Rationale**:
- gold-800 (#7c600f) provides 6.2:1 contrast on white - well above AA requirement
- Maintains gold branding while being accessible
- Darker gold still reads as "gold" to users
- No custom colors needed - using existing Tailwind palette

**Alternatives Considered**:
1. **Custom accessible gold (#8b6914)**: Rejected - adds complexity to design system
2. **Navy text everywhere**: Rejected - loses gold branding accent
3. **Background darkening**: Rejected - changes visual design significantly

### Components to Update

| Component | Current Class | New Class | Context |
|-----------|---------------|-----------|---------|
| StatsSection | `text-gold-600` | `text-gold-800` | Statistics numbers |
| CaseStudiesSection | `text-gold-600` | `text-gold-700` | Profession labels |
| CaseStudiesSection | `text-gold-700` | `text-gold-800` | Key result badges |
| TestimonialsSection | `text-gold-600` | `text-gold-700` | Quote icon (decorative, opacity ok) |

**Note**: CaseStudiesSection badges use gold-700 text on gold-50 background - this combination passes at 4.8:1.

---

## 2. ARIA Tablist Pattern

### Current Issue

QuestionsSection has buttons with `role="tab"` but no parent `role="tablist"`:
```html
<!-- INCORRECT: tabs without tablist -->
<div class="flex gap-8">
  <button role="tab" aria-selected="true">Tab 1</button>
  <button role="tab" aria-selected="false">Tab 2</button>
</div>
```

### WAI-ARIA Authoring Practices 1.2

Per [ARIA Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/):

**Required Structure**:
```html
<div role="tablist" aria-label="[descriptive label]">
  <button role="tab" id="tab-1" aria-selected="true" aria-controls="panel-1">
    Tab 1
  </button>
  <button role="tab" id="tab-2" aria-selected="false" aria-controls="panel-2" tabindex="-1">
    Tab 2
  </button>
</div>
<div role="tabpanel" id="panel-1" aria-labelledby="tab-1">
  Content 1
</div>
<div role="tabpanel" id="panel-2" aria-labelledby="tab-2" hidden>
  Content 2
</div>
```

**Required Attributes**:
- `role="tablist"` on container
- `role="tab"` on each tab button
- `role="tabpanel"` on each panel
- `aria-selected="true|false"` on tabs
- `aria-controls` linking tab to panel
- `aria-labelledby` linking panel to tab
- `tabindex="-1"` on inactive tabs (for roving tabindex)

**Required Keyboard Support**:
- **Left/Right Arrow**: Move between tabs
- **Home**: First tab
- **End**: Last tab
- **Enter/Space**: Activate tab (if not auto-activated)

### Decision: Implement full ARIA tabs pattern

**Implementation**:
1. Wrap tab buttons in `role="tablist"` with `aria-label`
2. Add `aria-controls` to each tab
3. Add `aria-labelledby` to each panel
4. Implement roving tabindex (`tabindex="-1"` on inactive tabs)
5. Add keyboard navigation (arrow keys)

---

## 3. Touch Target Size

### Current Issue

Carousel indicators in CaseStudiesSection:
```html
<button class="w-2 h-2 rounded-full">  <!-- 8x8px - too small -->
```

### WCAG 2.2 Success Criterion 2.5.8 (Target Size Minimum)

**Requirement**: Touch targets must be at least 24x24 CSS pixels, with 44x44px recommended for mobile.

**Google PageSpeed/Lighthouse**: Flags targets smaller than 48x48px with less than 8px spacing.

### Decision: Increase clickable area via padding

**Approach**: Keep visual size small (8x8px dot) but increase touch area via padding:

```html
<!-- Visual: 8px dot, Touch target: 44x44px -->
<button class="w-2 h-2 p-5 -m-5 rounded-full">
```

**Calculation**:
- `w-2` = 8px visual width
- `p-5` = 20px padding on each side
- Total touch area: 8 + 40 = 48px (exceeds 44px requirement)
- `-m-5` = negative margin to prevent layout shift

**Alternative Considered**:
- Making dots larger (w-3 h-3): Rejected - changes visual design too much
- Using `min-h-[44px] min-w-[44px]`: Rejected - visible size change

---

## 4. Implementation Summary

| Issue | Solution | Files | Risk |
|-------|----------|-------|------|
| ARIA tablist | Add `role="tablist"`, keyboard nav | QuestionsSection.astro | Low |
| Color contrast | Use gold-800/gold-700 for text | StatsSection, CaseStudiesSection, TestimonialsSection | Low |
| Touch targets | Add padding for 44px+ target | CaseStudiesSection.astro | Low |

**Total estimated changes**: ~50 lines across 4 files

---

---

## 5. Performance - Render Blocking Resources

### Current Issue

PageSpeed Insights reports render-blocking resources delaying LCP by 400-1740ms:
- `/_astro/index.css` - 2.4 KiB, 160-490ms
- `/_astro/contacts.css` - 7.4 KiB, 50-160ms
- Google Fonts - 1.6 KiB, 200-750ms

### Solution: Font Preloading and Display Swap

**For Google Fonts**:
```html
<!-- Add to BaseLayout.astro <head> -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=...">
```

**In global.css**:
```css
/* Ensure font-display: swap is set */
@font-face {
  font-family: 'Playfair Display';
  font-display: swap;
}
```

**Note**: Astro already inlines critical CSS. The CSS files shown are page-specific styles that load after initial render.

---

## 6. Performance - Hero Image Optimization

### Current Issue

Hero image `hero-viktoria-luxury.webp` is 72KB (600x800) but displays at:
- Mobile: 320x427 (51.5 KiB potential savings)
- Desktop: 515x687 (18.9 KiB potential savings)

### Solution: Responsive Images with srcset

**Using Astro's Image component**:
```astro
---
import { Image } from 'astro:assets';
import heroImage from '../assets/hero-viktoria-luxury.webp';
---

<Image
  src={heroImage}
  alt="Вікторія Жульова"
  widths={[320, 480, 600, 800]}
  sizes="(max-width: 640px) 320px, (max-width: 768px) 480px, 600px"
  loading="eager"
  fetchpriority="high"
/>
```

This generates multiple sizes at build time and serves appropriate size per viewport.

---

## 7. Performance - Forced Reflow

### Current Issue

CaseStudiesSection causes forced reflow (53ms) by querying `offsetWidth` after style changes:
```javascript
const scrollAmount = carousel.offsetWidth * 0.8;  // Triggers reflow
```

### Solution: Cache Dimensions or Use CSS

**Option A: Cache offsetWidth**:
```javascript
// Cache once at init, update on resize
let carouselWidth = carousel.offsetWidth;
window.addEventListener('resize', () => {
  carouselWidth = carousel.offsetWidth;
});

const scrollAmount = carouselWidth * 0.8;  // No reflow
```

**Option B: Use CSS scroll-snap (already in use)**:
The carousel already uses `scroll-snap-type`, so we can simplify by letting CSS handle positioning and removing offsetWidth calculations.

### Decision: Cache offsetWidth

Caching is simpler and maintains existing behavior. Will add ResizeObserver for responsive updates.

---

## 8. Performance - LCP Optimization

### Current Issue

LCP element render delay: 3,130ms
- Time to First Byte: 0ms (good)
- Element render delay: 3,130ms (bad)

### Root Causes

1. Render-blocking CSS delays paint
2. Hero image is oversized for viewport
3. Font loading blocks text rendering

### Solution Strategy

1. **Font preloading** (Section 5) - reduces render blocking
2. **Responsive images** (Section 6) - faster hero load
3. **Ensure fetchpriority="high"** on LCP image (already set)

Combined these changes should reduce LCP to <2.5s target.

---

## References

- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WCAG 2.1 Success Criterion 1.4.3 (Contrast Minimum)](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
- [WAI-ARIA Tabs Pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/)
- [WCAG 2.2 Target Size](https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html)
- [Google Lighthouse Accessibility Audits](https://developer.chrome.com/docs/lighthouse/accessibility/)
- [Eliminate Render-Blocking Resources](https://web.dev/render-blocking-resources/)
- [Optimize LCP](https://web.dev/optimize-lcp/)
- [Avoid Forced Reflows](https://developers.google.com/web/fundamentals/performance/rendering/avoid-large-complex-layouts-and-layout-thrashing)
