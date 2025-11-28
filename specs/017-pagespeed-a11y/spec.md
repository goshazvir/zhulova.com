# Feature Specification: PageSpeed Accessibility Optimization

**Feature Branch**: `017-pagespeed-a11y`
**Created**: 2025-11-28
**Status**: Implementation Complete (pending production verification)
**Input**: User description: "PageSpeed Optimization - improve accessibility to 100 and performance metrics. Issues from PageSpeed Insights: 1) ARIA role="tab" buttons not contained in role="tablist" parent (QuestionsSection tabs), 2) Color contrast insufficient for text-gold-600 on gray backgrounds (StatsSection, CaseStudiesSection badges, testimonial roles), 3) Touch targets too small for carousel indicators (case-study-indicator buttons w-2 h-2). Target: Accessibility 100, Performance improvements."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Screen Reader Navigation (Priority: P1)

A visually impaired user navigates the website using a screen reader. When reaching the Questions section with tab controls, their screen reader correctly announces the tabs and their states, allowing them to switch between "Особисті питання" and "Бізнес і лідерство" tabs effectively.

**Why this priority**: Screen reader accessibility is fundamental for WCAG compliance and affects users who rely entirely on assistive technology to access content. Without proper ARIA structure, these users cannot navigate the interface.

**Independent Test**: Can be tested by running PageSpeed Insights accessibility audit and verifying ARIA warnings are resolved. Screen reader testing with VoiceOver/NVDA confirms correct tab announcements.

**Acceptance Scenarios**:

1. **Given** a user navigating with a screen reader, **When** they reach the Questions section, **Then** the tabs are announced with their role and selection state
2. **Given** a screen reader user on the tab controls, **When** they use arrow keys to navigate between tabs, **Then** focus moves correctly and content updates

---

### User Story 2 - Low Vision User Reading Content (Priority: P1)

A user with low vision or color blindness views the website. All text content, including statistics numbers, case study badges, and testimonial role labels, is readable with sufficient contrast against backgrounds.

**Why this priority**: Color contrast directly impacts readability for users with visual impairments. Current gold text on gray backgrounds fails WCAG AA 4.5:1 contrast requirements, making content difficult or impossible to read.

**Independent Test**: Can be tested by running PageSpeed Insights contrast check and verifying all text meets 4.5:1 contrast ratio (AA) or 7:1 (AAA) for normal text.

**Acceptance Scenarios**:

1. **Given** the StatsSection with numbers "10 років", "200+", "12 000+", **When** a user with low vision views the page, **Then** the text has sufficient contrast (≥4.5:1) against the background
2. **Given** case study cards with result badges (+8x дохід, +2x дохід), **When** viewing on any background, **Then** badge text is readable with proper contrast
3. **Given** testimonial cards with role labels (Agency Owner, IT Specialist), **When** displayed, **Then** text contrast meets accessibility standards

---

### User Story 3 - Mobile Touch Navigation (Priority: P2)

A mobile user scrolls through case studies and wants to navigate using the carousel indicators. The touch targets are large enough to tap accurately without frustration.

**Why this priority**: Small touch targets cause frustration and misclicks, especially for users with motor impairments. Current 8x8px indicators are far below the recommended 44x44px minimum.

**Independent Test**: Can be tested by running PageSpeed Insights on mobile and verifying touch target size warnings are resolved.

**Acceptance Scenarios**:

1. **Given** the CaseStudiesSection carousel on mobile, **When** a user tries to tap an indicator, **Then** the touch target area is at least 44x44px
2. **Given** multiple carousel indicators displayed, **When** tapping between them, **Then** there is sufficient spacing to prevent accidental taps on adjacent indicators

---

### User Story 4 - Fast Page Load on Mobile (Priority: P1)

A user on a mobile device with average 4G connection visits the website. The page loads quickly with visible content appearing within 2.5 seconds (LCP target), without render-blocking resources delaying the experience.

**Why this priority**: Current LCP is 3,130ms due to render-blocking CSS, oversized hero image, and forced reflows. This directly impacts user experience and SEO rankings.

**Independent Test**: Run PageSpeed Insights on mobile and verify Performance score improves, LCP < 2.5s, no render-blocking warnings.

**Acceptance Scenarios**:

1. **Given** a mobile user loading the homepage, **When** the page renders, **Then** LCP occurs within 2.5 seconds
2. **Given** CSS and font resources, **When** page loads, **Then** critical CSS is inlined and fonts are preloaded
3. **Given** the hero image, **When** displayed on mobile, **Then** appropriately sized image is served (not 600x800 for 320px viewport)
4. **Given** carousel JavaScript, **When** executed, **Then** no forced reflows occur (avoid offsetWidth queries after style changes)

---

### User Story 5 - Optimized Resource Loading (Priority: P2)

The website serves optimally sized assets and avoids unnecessary network requests that block rendering.

**Why this priority**: Current issues include oversized hero image (72KB, could save 19-52KB), render-blocking CSS (400-1740ms delay), and chained critical requests.

**Independent Test**: Run PageSpeed Insights and verify zero render-blocking resource warnings, image delivery warnings resolved.

**Acceptance Scenarios**:

1. **Given** the hero image, **When** loaded on different viewports, **Then** responsive images serve appropriate sizes
2. **Given** Google Fonts, **When** loading, **Then** fonts are preloaded or use font-display: swap
3. **Given** page CSS, **When** loading, **Then** critical CSS is inlined, non-critical deferred

---

### Edge Cases

- What happens when users have custom font scaling enabled? Text must remain readable and not overflow containers.
- How does system handle reduced motion preferences? Animations should respect `prefers-reduced-motion`.
- What happens on very small screens (320px width)? Touch targets must remain accessible.

## Requirements *(mandatory)*

### Functional Requirements

#### ARIA Structure (QuestionsSection)

- **FR-001**: Tab buttons MUST be wrapped in a container with `role="tablist"` attribute
- **FR-002**: Each tab button MUST have `role="tab"` with correct `aria-selected` state
- **FR-003**: Tab panels MUST have `role="tabpanel"` and be associated with tabs via `aria-controls`/`aria-labelledby`
- **FR-004**: Tab navigation MUST support arrow key navigation per WAI-ARIA authoring practices

#### Color Contrast (Multiple Components)

- **FR-005**: StatsSection number text MUST have minimum 4.5:1 contrast ratio against background
- **FR-006**: CaseStudiesSection result badges MUST have minimum 4.5:1 contrast ratio
- **FR-007**: TestimonialsSection role labels MUST have minimum 4.5:1 contrast ratio
- **FR-008**: All interactive elements MUST have minimum 3:1 contrast ratio for non-text elements

#### Touch Targets (CaseStudiesSection)

- **FR-009**: Carousel indicator buttons MUST have minimum 44x44px touch target area
- **FR-010**: Adjacent touch targets MUST have minimum 8px spacing between them
- **FR-011**: Touch targets MUST be centered within their clickable area

#### General Accessibility

- **FR-012**: All changes MUST not break existing keyboard navigation functionality
- **FR-013**: All changes MUST respect `prefers-reduced-motion` media query
- **FR-014**: PageSpeed Insights Accessibility score MUST reach 100/100

#### Performance - Render Blocking Resources

- **FR-015**: Google Fonts MUST be preloaded with `<link rel="preload">` or use `font-display: swap`
- **FR-016**: Critical CSS MUST be inlined in `<head>` (Astro does this automatically, verify it works)
- **FR-017**: Non-critical CSS MUST be loaded asynchronously or deferred

#### Performance - Image Optimization

- **FR-018**: Hero image MUST use responsive `srcset` to serve appropriate sizes for different viewports
- **FR-019**: Hero image for mobile (320px viewport) SHOULD be ~320px wide, not 600px
- **FR-020**: Images MUST use modern formats (WebP/AVIF) with appropriate quality settings

#### Performance - JavaScript Optimization

- **FR-021**: CaseStudiesSection carousel MUST NOT cause forced reflows (avoid offsetWidth after style changes)
- **FR-022**: Section JavaScript MUST be loaded with `defer` or `async` where possible
- **FR-023**: Critical path latency MUST be reduced by minimizing chained requests

#### Performance - LCP Optimization

- **FR-024**: LCP element (hero section) MUST render within 2.5 seconds on mobile 4G
- **FR-025**: LCP image MUST have `fetchpriority="high"` and `loading="eager"` (already set, verify)
- **FR-026**: Resources blocking LCP MUST be minimized or eliminated

### Assumptions

- Gold color values can be adjusted to darker shades for better contrast without significantly impacting visual design
- Touch target visual appearance can remain small (w-2 h-2) while having larger clickable area via padding
- Existing tab JavaScript logic can be extended to support proper ARIA management
- Responsive hero images can be generated at build time using Astro's Image component
- Font preloading can be added to BaseLayout without breaking existing styles
- Forced reflow in carousel can be fixed by caching offsetWidth or using CSS-based approach

## Success Criteria *(mandatory)*

### Measurable Outcomes

#### Accessibility
- **SC-001**: PageSpeed Insights Accessibility score reaches 100/100 (currently ~90)
- **SC-002**: Zero ARIA-related warnings in PageSpeed Insights audit
- **SC-003**: All text elements pass WCAG AA contrast requirements (4.5:1 ratio minimum)
- **SC-004**: All touch targets meet 44x44px minimum size requirement
- **SC-005**: Lighthouse accessibility audit shows 0 critical violations
- **SC-006**: Screen reader users can navigate tabs using standard keyboard patterns (arrow keys)

#### Performance
- **SC-007**: PageSpeed Insights Performance score improves (target: 90+, currently ~75-85)
- **SC-008**: LCP (Largest Contentful Paint) < 2.5 seconds on mobile
- **SC-009**: Zero render-blocking resource warnings in PageSpeed Insights
- **SC-010**: Hero image savings of at least 19KB on mobile (responsive sizing)
- **SC-011**: No forced reflow warnings in PageSpeed Insights
- **SC-012**: Critical path latency reduced (target: < 400ms)
