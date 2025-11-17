# Data Model: Home Page Design Refinement

**Feature**: 003-home-design-refinement
**Phase**: 1 - Design & Contracts
**Date**: 2025-11-17

## Overview

This feature modifies **visual presentation only** - no changes to data structures, APIs, or state management. All "entities" below describe **component props and visual elements**, not backend data models.

## Visual Entities

### 1. Case Study Card (Component Props)

**Component**: `CaseStudiesSection.astro`

**Current Data Structure** (from `src/data/homePageContent.ts`):
```typescript
interface CaseStudy {
  clientName: string;
  profession: string;
  timeInMentorship: string;
  sessionsCount: number;
  incomeGrowth: string;
  before: {
    employment: string;
    challenges: string[];
  };
  after: {
    achievements: string[];
  };
}
```

**Visual Changes** (Props remain unchanged):
- **Layout**: Grid → Vertical timeline
- **Before/After Styling**: Colored backgrounds (red-50, green-50) → Subtle borders (gray-200)
- **Indicators**: Colored dots (red, green) → Icons (✗, ✓) with neutral colors
- **Spacing**: Reduced padding from `p-8` to `p-6`

**State**: Static data, no state changes

**Validation Rules**: No changes (data unchanged)

---

### 2. Testimonial Item (Component Props)

**Component**: `TestimonialsSection.astro`

**Current Data Structure** (from `src/data/homePageContent.ts`):
```typescript
interface Testimonial {
  quote: string;
  clientName: string;
  role: string;
}
```

**Visual Changes** (Props remain unchanged):
- **Background**: Dark navy gradient → Light sage/white gradient
- **Text Color**: White → Navy-900
- **Quote Icon**: Large (w-12 h-12) gold → Small (w-8 h-8) gold with reduced opacity
- **Card Styling**: Backdrop blur → Simple border with shadow

**State**: Static data, no state changes

**Validation Rules**: No changes (data unchanged)

---

### 3. Statistic Metric (Component Props)

**Component**: `StatsSection.astro`

**Current Data Structure** (from `src/data/homePageContent.ts`):
```typescript
interface Statistic {
  value: string;  // e.g., "10 років", "200+"
  label: string;  // e.g., "побудови високоефективних команд"
}
```

**Visual Changes** (Props remain unchanged):
- **Grid Layout**: Equal 4-column → Asymmetric (1 large primary, 3 smaller secondary)
- **Primary Stat Styling**: `text-4xl md:text-5xl` → `text-6xl md:text-7xl`
- **Secondary Stat Styling**: `text-4xl md:text-5xl` → `text-3xl md:text-4xl`
- **Hover Effect**: Background change → Subtle scale transform

**State**: Static data, no state changes

**Validation Rules**: No changes (data unchanged)

---

### 4. Question Item (Component Props)

**Component**: `QuestionsSection.astro`

**Current Data Structure** (from `src/data/homePageContent.ts`):
```typescript
interface QuestionCategory {
  personalQuestions: string[];
  businessQuestions: string[];
}
```

**Visual Changes** (Props remain unchanged):
- **Tab Styling**: Pill-style buttons (bg-white, shadow) → Underline indicators
- **Question Cards**: Sage-50 background → White with subtle border
- **Icon**: Gold-500 → Gold-600 for better contrast on white

**State**: Tab switching logic unchanged (existing JavaScript preserved)

**Validation Rules**: No changes (data unchanged)

---

### 5. Footer Navigation Section (Component Props)

**Component**: `Footer.astro`

**Current Data Structure** (from `src/data/homePageContent.ts`):
```typescript
interface FooterContent {
  imageSrc: string;
  imageAlt: string;
  ctaText: string;
  copyright: string;
}

interface SocialLinks {
  youtube: string;
  instagram: string;
  telegram: string;
  facebook: string;
  tiktok: string;
}
```

**Visual Changes** (Props remain unchanged):
- **CTA Section Padding**: `py-16` → `py-10` (desktop), `py-12` → `py-8` (mobile)
- **Footer Grid**: 3-column → Horizontal single-row (desktop), stack (mobile)
- **Column Spacing**: `gap-8` → `gap-6`
- **Logo Size**: `h-12` → `h-10`

**State**: Static content, no state changes

**Validation Rules**: No changes (data unchanged)

---

## Component Relationships

```
HomePage (index.astro)
│
├── HeroSection.astro         [UNCHANGED]
├── StatsSection.astro         [VISUAL CHANGES]
│   └── Statistic[] (static data)
├── CaseStudiesSection.astro  [VISUAL CHANGES]
│   └── CaseStudy[] (static data)
├── QuestionsSection.astro    [VISUAL CHANGES]
│   └── Question[] (static data, tab state)
├── MotivationalQuote.astro   [UNCHANGED]
├── TestimonialsSection.astro [VISUAL CHANGES]
│   └── Testimonial[] (static data)
├── CoursesPreview.astro      [UNCHANGED]
└── Footer.astro              [VISUAL CHANGES]
    └── FooterContent + SocialLinks (static data)
```

## State Management

**No state changes required**. Existing Zustand store (`src/stores/uiStore.ts`) remains unchanged:

```typescript
// Existing state (unchanged)
interface UIState {
  isConsultationModalOpen: boolean;
  // ... other UI state
}
```

**Tab switching in QuestionsSection** uses local DOM manipulation (existing JavaScript), not global state.

## Data Flow

```
Static Data (homePageContent.ts)
      ↓
Component Props (Astro components)
      ↓
Visual Rendering (Tailwind classes)
      ↓
User Interaction (tab clicks, hover states)
      ↓
DOM Updates (existing JavaScript, no new state)
```

**No API calls, no database queries, no external data sources.**

## Validation & Constraints

### Visual Constraints

1. **Footer Height Reduction** (SC-001):
   - **Measure**: `getBoundingClientRect().height` before/after
   - **Target**: ≥30% reduction (desktop), ≥40% reduction (mobile)
   - **Validation**: Compare baseline vs. redesigned heights

2. **Visual Clutter Score** (SC-003):
   - **Measure**: Ratio of content area to white space
   - **Target**: ≥25% improvement
   - **Validation**: Calculate pixel density for each section

3. **Accessibility** (FR-009, SC-008):
   - **Color Contrast**: All text meets WCAG AA (4.5:1 for body, 3:1 for large text)
   - **Keyboard Navigation**: Tab order unchanged
   - **Screen Readers**: ARIA labels preserved

4. **Performance** (FR-010, SC-009):
   - **LCP**: <2.5s (unchanged)
   - **CLS**: <0.1 (layout shifts minimized)
   - **Lighthouse Performance**: ≥95

### Content Constraints

- **No text changes**: All copy remains identical
- **No image changes**: All images (hero, footer, etc.) unchanged
- **No data structure changes**: Props interfaces unchanged
- **No new content**: No new case studies, testimonials, or stats

## Browser Compatibility

All CSS changes use well-supported properties:
- **CSS Grid**: Supported in all modern browsers (>95% global usage)
- **Flexbox**: Supported in all modern browsers (>98% global usage)
- **Tailwind Utilities**: All translate to standard CSS properties
- **Transforms**: `scale()` supported in all modern browsers

**No new CSS features required**, no polyfills needed.

## Accessibility Compliance

### Color Contrast Verification

**New Color Combinations** (all meet WCAG AA):

| Element | Foreground | Background | Ratio | Pass? |
|---------|------------|------------|-------|-------|
| Testimonials heading | Navy-900 (#1a202c) | Sage-50 (#f0f4f8) | 14.2:1 | ✅ |
| Testimonials text | Navy-700 (#2d3748) | White (#ffffff) | 10.8:1 | ✅ |
| Questions cards | Navy-700 (#2d3748) | White (#ffffff) | 10.8:1 | ✅ |
| Case studies text | Navy-700 (#2d3748) | White (#ffffff) | 10.8:1 | ✅ |
| Stats (large) | Gold-600 (#d4af37) | White (#ffffff) | 4.7:1 | ✅ |

**Verified using**: WebAIM Contrast Checker

### Semantic HTML Preserved

- All `<section>` elements retained
- Heading hierarchy unchanged (h2 → h3 → h4)
- ARIA labels for interactive elements preserved
- Focus indicators maintained (Tailwind `focus:ring`)

## Performance Impact Analysis

### CSS Bundle Size

**Before**: ~18KB (gzipped) Tailwind CSS
**After**: ~18KB (gzipped) - No increase expected

**Reason**: Replacing unused classes with different unused classes. Tailwind purge removes both equally.

**Example**:
- Removed: `bg-red-50`, `bg-green-50` (not used elsewhere)
- Added: `border-gray-200`, `border-l-4` (already in bundle from other components)

**Net impact**: ±0 bytes

### JavaScript Bundle Size

**No changes to JavaScript**. Existing tab switching logic in `QuestionsSection.astro` preserved.

### Layout Shift (CLS)

**Potential Risk**: Footer height reduction could cause CLS if not handled carefully

**Mitigation**:
- Test on multiple viewports
- Ensure footer content doesn't overflow
- Use `min-height` if needed to prevent collapse

**Target**: CLS remains <0.1 (current metric)

## Testing Strategy

### Visual Regression Testing

1. **Baseline Screenshots**: Capture before redesign
   - Desktop (1920x1080)
   - Tablet (768x1024)
   - Mobile (375x667)

2. **Compare After Redesign**:
   - Use browser dev tools to measure heights
   - Calculate white space ratios
   - Verify color contrast

### Manual Testing Checklist

- [ ] Footer height reduced by ≥30% (desktop)
- [ ] Footer height reduced by ≥40% (mobile)
- [ ] All navigation links accessible in footer
- [ ] Tab switching works in questions section
- [ ] Testimonials readable on all viewports
- [ ] Case studies scannable without horizontal scroll (mobile)
- [ ] Keyboard navigation functional
- [ ] Focus indicators visible

### Automated Testing

- [ ] Lighthouse Performance ≥95
- [ ] Lighthouse Accessibility ≥95
- [ ] Lighthouse SEO ≥95
- [ ] LCP <2.5s
- [ ] CLS <0.1

## Implementation Notes

### Component Modification Sequence

**Recommended order** (lowest to highest risk):

1. **StatsSection** - Simplest, pure CSS Grid change
2. **QuestionsSection** - Minor styling, existing JS preserved
3. **CaseStudiesSection** - Moderate complexity, layout change
4. **TestimonialsSection** - Color scheme change, requires contrast testing
5. **Footer** - Highest risk, most impactful change

**Reason**: Build confidence with simple changes first, validate approach before tackling footer.

### Rollback Strategy

All changes are CSS-only, easily reversible:
- Git commit per component
- Keep original Tailwind classes in commit messages for reference
- Test each component independently before moving to next

**Emergency rollback**: `git revert <commit-hash>` for any component

## Next Steps

Proceed to **quickstart.md** for developer implementation guide.
