# Research: Home Page Design Refinement

**Feature**: 003-home-design-refinement
**Phase**: 0 - Outline & Research
**Date**: 2025-11-17

## Research Summary

This feature focuses on **visual refinement only** - no new technical dependencies, frameworks, or architectural changes required. All design improvements will use the existing, proven tech stack.

## Design Pattern Research

### Decision 1: Component Styling Approach

**Chosen**: Tailwind CSS utility classes with existing design system tokens

**Rationale**:
- Project already uses Tailwind CSS v3+ with established design tokens (navy, gold, sage colors)
- Minimal luxury aesthetic requires precise control over spacing, typography, and visual hierarchy
- Tailwind's utility-first approach allows rapid iteration without introducing new CSS
- Purge configuration ensures only used classes are included in production bundle

**Alternatives Considered**:
- **CSS Modules**: Rejected - adds build complexity, increases CSS bundle size
- **Inline styles**: Rejected - violates project constitution (prohibited pattern)
- **Custom CSS classes**: Rejected - harder to maintain consistency, increases specificity issues

### Decision 2: Footer Compaction Strategy

**Chosen**: Single-row horizontal footer with collapsible sections on mobile

**Rationale**:
- Achieves 30-40% vertical space reduction target (SC-001)
- Maintains accessibility to all navigation items
- Industry standard pattern for luxury/premium websites (Apple, Rolex, luxury hotels)
- Reduces visual weight while preserving functionality

**Alternatives Considered**:
- **Remove CTA section entirely**: Rejected - CTA drives conversions, essential for business goals
- **Sticky footer**: Rejected - increases visual clutter, reduces viewport space for content
- **Footer in modal**: Rejected - reduces discoverability, harms SEO

### Decision 3: Case Studies Layout Pattern

**Chosen**: Timeline-style vertical layout with minimalist before/after cards

**Rationale**:
- Emphasizes outcomes over decorative elements (FR-001)
- Reduces visual clutter compared to current red/green color blocks
- Timeline metaphor reinforces transformation narrative
- Better mobile responsiveness (single column, vertical flow)

**Alternatives Considered**:
- **Carousel/slider**: Rejected - requires additional JavaScript, hides content from SEO
- **Accordion**: Rejected - requires clicks to view content, reduces scanability
- **Two-column grid (current)**: Rejected - too visually dense, overwhelming on mobile

### Decision 4: Testimonials Display Pattern

**Chosen**: Light background with minimal quote styling, emphasis on text and author

**Rationale**:
- Luxury brands use subtle testimonials (avoid over-designed elements per US5)
- Light background better aligns with "minimal luxury" aesthetic than dark navy
- Improved readability and accessibility (better contrast ratios)
- Reduces visual weight of testimonials section

**Alternatives Considered**:
- **Keep dark background**: Rejected - creates heavy visual anchor, conflicts with minimal luxury aesthetic
- **Carousel with single testimonial**: Rejected - hides social proof, reduces SEO value
- **No testimonials section**: Rejected - testimonials are critical trust signals

### Decision 5: Questions Section Interaction Pattern

**Chosen**: Keep tab switching but refine visual styling (remove backgrounds, simplify indicators)

**Rationale**:
- Maintains current functionality (FR-003) while improving visual refinement
- Tabs reduce vertical scroll compared to showing all questions
- Simple tab indicators (underline) more premium than button-style tabs
- Preserves existing JavaScript, no new dependencies

**Alternatives Considered**:
- **Remove tabs, show all questions**: Rejected - increases page length by ~600px
- **Accordion**: Rejected - requires clicks, reduces scanability
- **Separate pages**: Rejected - out of scope, increases navigation complexity

### Decision 6: Statistics Section Enhancement

**Chosen**: Asymmetric grid layout with visual hierarchy (larger primary stat, smaller secondary stats)

**Rationale**:
- Creates visual interest without complexity
- Emphasizes most important statistic (years of experience or client count)
- Aligns with luxury design patterns (asymmetry, intentional hierarchy)
- No JavaScript required, pure CSS Grid

**Alternatives Considered**:
- **Animated counters**: Rejected - adds JavaScript, increases bundle size, violates simplicity principle
- **Horizontal timeline**: Rejected - harder to implement responsively, less scannable
- **Keep current 4-column grid**: Rejected - lacks visual hierarchy, all stats have equal weight

## Performance & Accessibility Considerations

### No Performance Impact

**Analysis**: All changes are CSS-only modifications to existing components. No new images, JavaScript, or assets required.

**Evidence**:
- No new dependencies to add
- No new images to load (reusing existing content)
- CSS changes will be purged by Tailwind (only used classes shipped)
- Lighthouse Performance score will remain 95+ (SC-008)

### Accessibility Maintained

**Verification**:
- All changes preserve semantic HTML structure
- ARIA labels and keyboard navigation unchanged (FR-009)
- Color contrast ratios verified for new color combinations
- Reduced motion preferences respected (existing animations only)
- Lighthouse Accessibility score will remain 95+ (SC-008)

## Technical Implementation Notes

### Components to Modify

1. **CaseStudiesSection.astro** (`src/components/sections/CaseStudiesSection.astro`)
   - Change grid layout from 2-column to vertical timeline
   - Replace colored backgrounds (red-50, green-50) with subtle borders
   - Simplify before/after indicators (use icons instead of colored dots)

2. **QuestionsSection.astro** (`src/components/sections/QuestionsSection.astro`)
   - Remove pill-style tab backgrounds (navy-50)
   - Use simple underline indicator for active tab
   - Reduce card backgrounds (sage-50) to subtle borders
   - Maintain existing tab switching JavaScript

3. **TestimonialsSection.astro** (`src/components/sections/TestimonialsSection.astro`)
   - Replace dark navy gradient with light sage/white gradient
   - Reduce quote icon size and opacity
   - Simplify card styling (less backdrop blur, cleaner borders)
   - Maintain 3-column grid on desktop, stack on mobile

4. **StatsSection.astro** (`src/components/sections/StatsSection.astro`)
   - Implement asymmetric grid (1 large stat, 3 smaller stats)
   - Increase primary stat font size, reduce secondary stat sizes
   - Remove hover backgrounds, use subtle scale transforms

5. **Footer.astro** (`src/components/layout/Footer.astro`)
   - Reduce CTA section padding (py-16 → py-10)
   - Convert 3-column footer to horizontal single-row layout
   - Stack on mobile with reduced padding
   - Maintain all navigation links and social icons

### Design System Tokens (No Changes)

All changes use existing Tailwind configuration:
- Colors: `navy-{50-900}`, `gold-{50-900}`, `sage-{50-900}`
- Typography: `font-serif` (Playfair Display), `font-sans` (Inter)
- Spacing: Standard Tailwind scale + custom `spacing-{18, 88, 112, 128}`

## Validation Criteria

**Before Implementation**:
- Baseline measurements: Footer height, visual clutter scores, engagement metrics
- Screenshot existing design for comparison

**After Implementation**:
- Footer height reduction verified (SC-001): ≥30% desktop, ≥40% mobile
- Lighthouse scores maintained (SC-008): Performance 95+, Accessibility 95+
- LCP metric verified (SC-009): <2.5s
- Visual inspection confirms minimal luxury aesthetic alignment (SC-005)

## Dependencies & Prerequisites

**No new dependencies required**. All changes use:
- Astro v4.x (existing)
- Tailwind CSS v3.x (existing)
- Existing design system tokens
- Existing component structure

**Prerequisites**:
- Read existing component source code
- Understand current Tailwind configuration
- Review `.claude/docs/about.md` for minimal luxury aesthetic guidelines

## References

- Project Constitution: `.specify/memory/constitution.md` (confirmed no violations)
- Technical Spec: `.claude/docs/technical-spec.md` (performance and accessibility requirements)
- Design Guidelines: `.claude/docs/about.md` (minimal luxury aesthetic definition)
- Feature Specification: `specs/003-home-design-refinement/spec.md`

## Next Steps

Proceed to **Phase 1: Design & Contracts** to create:
1. `data-model.md` - Component props and visual entities
2. `quickstart.md` - Developer implementation guide
3. Update agent context with design decisions
