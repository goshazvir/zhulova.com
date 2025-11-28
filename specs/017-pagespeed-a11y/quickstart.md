# Quickstart: PageSpeed Accessibility Optimization

**Feature**: 017-pagespeed-a11y
**Time Estimate**: 1-2 hours

## Prerequisites

- Branch `017-pagespeed-a11y` checked out
- Development server running (`npm run dev`)
- PageSpeed Insights or Lighthouse available for testing

---

## Task 1: Fix ARIA Tablist Structure (QuestionsSection)

**File**: `src/components/sections/QuestionsSection.astro`

### 1.1 Add role="tablist" to tab container

```diff
  {/* Tabs */}
  <div class="flex justify-center mb-12">
-   <div class="flex gap-8 border-b border-gray-200">
+   <div
+     class="flex gap-8 border-b border-gray-200"
+     role="tablist"
+     aria-label="Категорії питань"
+   >
      <button
        id="personal-tab"
        type="button"
        class="pb-3 px-4 font-medium transition-all border-b-2 hover:text-navy-700"
        data-tab="personal"
        aria-selected="true"
        role="tab"
+       aria-controls="personal-panel"
+       tabindex="0"
      >
```

### 1.2 Add aria-controls to business tab

```diff
      <button
        id="business-tab"
        type="button"
        class="pb-3 px-4 font-medium transition-all border-b-2 hover:text-navy-700"
        data-tab="business"
        aria-selected="false"
        role="tab"
+       aria-controls="business-panel"
+       tabindex="-1"
      >
```

### 1.3 Add keyboard navigation to script

```diff
  // Initialize first tab as active
  switchTab('personal');

  personalTab?.addEventListener('click', () => switchTab('personal'));
  businessTab?.addEventListener('click', () => switchTab('business'));

+ // Keyboard navigation (arrow keys)
+ const handleKeydown = (e: KeyboardEvent) => {
+   if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
+     const currentTab = document.activeElement;
+     if (currentTab === personalTab) {
+       businessTab?.focus();
+       switchTab('business');
+     } else if (currentTab === businessTab) {
+       personalTab?.focus();
+       switchTab('personal');
+     }
+   }
+ };
+
+ personalTab?.addEventListener('keydown', handleKeydown);
+ businessTab?.addEventListener('keydown', handleKeydown);
```

### 1.4 Update switchTab to manage tabindex

```diff
  function switchTab(tab: 'personal' | 'business') {
    if (tab === 'personal') {
      personalTab?.classList.add('border-gold-500', 'text-navy-900', 'font-semibold');
      personalTab?.classList.remove('border-transparent', 'text-navy-500');
      personalTab?.setAttribute('aria-selected', 'true');
+     personalTab?.setAttribute('tabindex', '0');

      businessTab?.classList.remove('border-gold-500', 'text-navy-900', 'font-semibold');
      businessTab?.classList.add('border-transparent', 'text-navy-500');
      businessTab?.setAttribute('aria-selected', 'false');
+     businessTab?.setAttribute('tabindex', '-1');
      // ... rest unchanged
    } else {
      // ... mirror for business tab
+     businessTab?.setAttribute('tabindex', '0');
+     personalTab?.setAttribute('tabindex', '-1');
    }
  }
```

---

## Task 2: Fix Color Contrast (StatsSection)

**File**: `src/components/sections/StatsSection.astro`

### 2.1 Change gold-600 to gold-800 for statistics

```diff
- <div class="text-5xl md:text-6xl font-serif font-bold text-gold-600 mb-4 leading-none">
+ <div class="text-5xl md:text-6xl font-serif font-bold text-gold-800 mb-4 leading-none">
    {stat.value}
  </div>
```

**Contrast Result**: gold-800 (#7c600f) on white = 6.2:1 ✅

---

## Task 3: Fix Color Contrast (CaseStudiesSection)

**File**: `src/components/sections/CaseStudiesSection.astro`

### 3.1 Fix profession label contrast

```diff
- <p class="text-gold-600 font-medium text-sm mb-3">
+ <p class="text-gold-700 font-medium text-sm mb-3">
    {study.profession}
  </p>
```

### 3.2 Key result badge is OK (gold-700 on gold-50 = 4.8:1)

No change needed - the badge uses `bg-gold-50` with `text-gold-700` which passes.

---

## Task 4: Fix Touch Targets (CaseStudiesSection)

**File**: `src/components/sections/CaseStudiesSection.astro`

### 4.1 Increase touch target area for indicators

```diff
  <!-- Scroll Indicators (Mobile) -->
- <div class="flex justify-center gap-2 mt-6 lg:hidden">
+ <div class="flex justify-center gap-1 mt-6 lg:hidden">
    {caseStudies.map((_, index) => (
      <button
-       class="case-study-indicator w-2 h-2 rounded-full bg-gray-300 transition-all"
+       class="case-study-indicator w-2 h-2 p-5 -m-4 rounded-full bg-gray-300 transition-all flex items-center justify-center"
        data-index={index}
        aria-label={`Перейти до кейсу ${index + 1}`}
-     ></button>
+     >
+       <span class="w-2 h-2 rounded-full bg-current"></span>
+     </button>
    ))}
  </div>
```

**Alternative simpler approach** (padding with background-clip):

```diff
  <button
-   class="case-study-indicator w-2 h-2 rounded-full bg-gray-300 transition-all"
+   class="case-study-indicator min-w-[44px] min-h-[44px] rounded-full transition-all flex items-center justify-center"
    data-index={index}
    aria-label={`Перейти до кейсу ${index + 1}`}
  >
+   <span class="w-2 h-2 rounded-full bg-gray-300 indicator-dot"></span>
  </button>
```

Then update JS to style the inner span:
```diff
  indicators.forEach((indicator, index) => {
+   const dot = indicator.querySelector('.indicator-dot');
    if (index === activeIndex) {
-     indicator.classList.add('bg-gold-500', 'w-6');
-     indicator.classList.remove('bg-gray-300', 'w-2');
+     dot?.classList.add('bg-gold-500', 'w-6');
+     dot?.classList.remove('bg-gray-300', 'w-2');
    } else {
-     indicator.classList.add('bg-gray-300', 'w-2');
-     indicator.classList.remove('bg-gold-500', 'w-6');
+     dot?.classList.add('bg-gray-300', 'w-2');
+     dot?.classList.remove('bg-gold-500', 'w-6');
    }
  });
```

---

## Task 5: Fix Color Contrast (TestimonialsSection)

**File**: `src/components/sections/TestimonialsSection.astro`

### 5.1 Quote icon is decorative - no change needed

The quote icon uses `text-gold-600 opacity-40` which is decorative (has `aria-hidden="true"`).

**No changes required** - decorative elements don't need contrast compliance.

---

## Task 6: Responsive Hero Image (Performance)

**Files**:
- `src/components/sections/HeroSection.astro`
- `src/components/hero/HeroImage.astro`

### 6.1 Copy hero image to src/assets for Astro optimization

```bash
# Astro requires images in src/ for responsive image generation
cp public/images/hero-viktoria-luxury.webp src/assets/images/
```

### 6.2 Import hero image as module in HeroSection

```diff
  ---
  import { heroContent } from '@/data/homePageContent';
  import TrustIndicators from '@/components/hero/TrustIndicators.astro';
  import HeroImage from '@/components/hero/HeroImage.astro';
  import '@/styles/hero.css';
+
+ // Import hero image for Astro's responsive image optimization
+ import heroImageSrc from '@/assets/images/hero-viktoria-luxury.webp';
  ---
```

### 6.3 Update HeroImage component to use imported image

```diff
- <HeroImage
-   src={heroContent.imageSrc}
-   alt={heroContent.imageAlt}
-   width={600}
-   height={800}
- />
+ <HeroImage
+   src={heroImageSrc}
+   alt={heroContent.imageAlt}
+   width={600}
+   height={800}
+ />
```

### 6.4 Add widths and sizes props to HeroImage.astro

```diff
  export interface Props {
    src: ImageMetadata | string;
    alt: string;
    width?: number;
    height?: number;
+   widths?: number[];
+   sizes?: string;
    className?: string;
  }

  const {
    src,
    alt,
    width = 600,
    height = 800,
+   widths = [320, 480, 600],
+   sizes = '(max-width: 640px) 320px, (max-width: 768px) 480px, 600px',
    className = ''
  } = Astro.props;
```

### 6.5 Pass widths/sizes to Image component

```diff
  <Image
    src={src}
    alt={alt}
    width={width}
    height={height}
+   widths={widths}
+   sizes={sizes}
    format="webp"
    quality={92}
    loading="eager"
    fetchpriority="high"
    class="w-full h-full object-cover"
  />
```

**Result**: Generates srcset with 320px (24KB), 480px (43KB), 600px (68KB) variants.

---

## Task 7: LCP Optimization (CaseStudiesSection)

**File**: `src/components/sections/CaseStudiesSection.astro`

### 7.1 Cache carousel width to avoid forced reflows

```diff
  if (carousel && prevBtn && nextBtn) {
+   // Cache carousel width to avoid forced reflows
+   let cachedCarouselWidth = carousel.offsetWidth;
+
+   // Update cached width on resize using ResizeObserver
+   const resizeObserver = new ResizeObserver((entries) => {
+     for (const entry of entries) {
+       cachedCarouselWidth = entry.contentRect.width;
+     }
+   });
+   resizeObserver.observe(carousel);

    // Previous button
    prevBtn.addEventListener('click', () => {
-     const scrollAmount = carousel.offsetWidth * 0.8;
+     const scrollAmount = cachedCarouselWidth * 0.8;
      carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    });
```

**Verified existing optimizations**:
- BaseLayout.astro already has Google Fonts preconnect
- global.css already has `display=swap` via Google Fonts URL
- HeroImage.astro already has `fetchpriority="high"` and `loading="eager"`

---

## Verification Checklist

After all changes:

```bash
# 1. Build to check for errors
npm run build

# 2. Run local Lighthouse audit
npm run perf:check

# 3. Test in PageSpeed Insights
# Visit: https://pagespeed.web.dev/
# Enter: https://zhulova.com (after deploy to preview)
```

### Expected Results

| Metric | Before | After |
|--------|--------|-------|
| Accessibility Score | ~90 | 100 |
| ARIA warnings | 2 | 0 |
| Contrast warnings | 10+ | 0 |
| Touch target warnings | 4 | 0 |

### Manual Testing

1. **Keyboard Navigation**:
   - Tab to QuestionsSection
   - Use Arrow Left/Right to switch tabs
   - Verify focus moves and content changes

2. **Screen Reader**:
   - VoiceOver (Mac): Cmd+F5 to enable
   - Navigate to tabs, verify announcements

3. **Touch Targets**:
   - Open on mobile device
   - Tap carousel indicators
   - Verify easy to tap without misclicks
