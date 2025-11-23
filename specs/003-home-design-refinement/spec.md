# Feature Specification: Home Page Design Refinement

**Feature Branch**: `003-home-design-refinement`
**Created**: 2025-11-17
**Status**: Completed (2025-11-17)
**Input**: User description: "Home Page Design Improvements - Visual refinement of key sections including case studies, questions, testimonials, stats, and footer to achieve a more minimal luxury aesthetic"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Enhanced Visual Hierarchy and Readability (Priority: P1)

As a potential client visiting the home page, I want the content sections to have clear visual hierarchy and breathing room so that I can quickly understand Viktoria's expertise and decide if I want to engage.

**Why this priority**: Visual clarity directly impacts first impressions and user engagement. A cluttered or visually overwhelming page increases bounce rate and reduces conversion.

**Independent Test**: Can be fully tested by loading the home page and measuring visual density, white space ratios, and user comprehension through A/B testing or user interviews.

**Acceptance Scenarios**:

1. **Given** a user visits the home page, **When** they scroll through the content, **Then** each section should have sufficient white space and clear visual separation
2. **Given** a user reads the case studies section, **When** they scan the before/after transformations, **Then** the information should be digestible without feeling overwhelming
3. **Given** a user views the testimonials, **When** they read client feedback, **Then** the layout should guide their eyes naturally without visual clutter

---

### User Story 2 - Streamlined Footer Experience (Priority: P1)

As a visitor who has scrolled to the bottom of the page, I want a compact and organized footer that provides essential information and next steps without occupying excessive screen space.

**Why this priority**: Footer is the last impression before users leave. A bloated footer creates friction and reduces the likelihood of conversion or return visits.

**Independent Test**: Can be tested by measuring footer height in viewport units, time to locate navigation items, and conversion rate on footer CTA compared to other CTAs.

**Acceptance Scenarios**:

1. **Given** a user scrolls to the footer, **When** they look for navigation links, **Then** links should be immediately visible without excessive scrolling
2. **Given** a user on mobile, **When** they reach the footer, **Then** the footer should occupy no more than 1.5 viewport heights
3. **Given** a user wants to contact Viktoria, **When** they view the footer, **Then** social media links and CTA should be clearly accessible

---

### User Story 3 - Refined Case Studies Presentation (Priority: P2)

As a potential client evaluating Viktoria's coaching effectiveness, I want to see transformation stories in a clean, professional format that highlights results without visual overwhelm.

**Why this priority**: Case studies are social proof and credibility builders. Poor visual design can make legitimate results appear less trustworthy.

**Independent Test**: Can be tested by showing case studies to focus group and measuring comprehension time, trust perception, and information retention.

**Acceptance Scenarios**:

1. **Given** a user reads a case study, **When** they view the before/after comparison, **Then** the format should emphasize outcomes over decorative elements
2. **Given** a user scans multiple case studies, **When** they compare different client results, **Then** the layout should make comparisons easy without cognitive load
3. **Given** a user on mobile, **When** they read case studies, **Then** content should remain readable without horizontal scrolling or tiny text

---

### User Story 4 - Minimalist Luxury Aesthetic Alignment (Priority: P2)

As a high-value client (entrepreneur, IT professional, personal brand builder), I want the page design to reflect the "minimal luxury" brand positioning so that I feel confident this service matches my professional standards.

**Why this priority**: Visual design communicates brand values. Misalignment between stated luxury positioning and visual execution creates cognitive dissonance and reduces trust.

**Independent Test**: Can be tested through brand perception surveys, design audits against luxury brand benchmarks, and conversion rate comparison before/after redesign.

**Acceptance Scenarios**:

1. **Given** a user visits the page, **When** they form first impressions, **Then** the design should convey professionalism, calm, and premium quality
2. **Given** a user compares to competitor coach websites, **When** they evaluate design sophistication, **Then** Viktoria's site should stand out as more refined
3. **Given** a user reviews the questions section, **When** they see interactive elements (tabs, cards), **Then** interactions should feel smooth and premium, not generic

---

### User Story 5 - Optimized Testimonials Display (Priority: P3)

As a skeptical visitor evaluating coaching services, I want to see authentic client testimonials in a format that enhances credibility without appearing manufactured or overwhelming.

**Why this priority**: Testimonials build trust, but poor presentation can make even genuine testimonials appear fake. This is lower priority than structural improvements but still impacts conversion.

**Independent Test**: Can be tested by tracking engagement metrics on testimonials section (scroll depth, time spent) and trust indicators in user surveys.

**Acceptance Scenarios**:

1. **Given** a user reads testimonials, **When** they assess authenticity, **Then** the design should support credibility (avoid over-designed elements)
2. **Given** a user on mobile, **When** they view testimonials, **Then** they should be able to read at least one full testimonial without scrolling horizontally
3. **Given** a user wants to see social proof quickly, **When** they land on testimonials section, **Then** key quotes should be immediately scannable

---

### Edge Cases

**Q1: What happens when carousel navigation reaches first/last item on mobile touch devices?**
- **Answer**: Scroll snap prevents over-scrolling past boundaries. On last item, right swipe has no effect (no wrap-around). On first item, left swipe has no effect. Navigation buttons (desktop) disable appropriately (prev on first, next on last).
- **Code**: `CaseStudiesSection.astro:50-120` - CSS scroll-snap-type implementation with overflow-x-scroll, prev/next buttons with disabled state logic
- **Behavior**: Browser native scroll behavior applies at boundaries - visual feedback through scroll resistance, no infinite loop
- **User Impact**: Prevents confusion about number of case studies, provides clear endpoint feedback, avoids disorientation from unexpected wraparound

**Q2: How does responsive breakpoint transition affect layout at exactly 768px (tablet boundary)?**
- **Answer**: Layout switches from mobile (1 card width) to tablet (1.5-2 cards visible) at 768px viewport. CSS media query uses min-width, so 768px triggers tablet layout. White space calculations adjust proportionally via Tailwind responsive utilities.
- **Code**: All section components use Tailwind `md:` prefix for 768px breakpoint transitions (grid-cols-1 → grid-cols-2, py-8 → py-10, etc.)
- **Behavior**: Smooth transition without content jump or overflow - Tailwind utilities handle breakpoint changes atomically
- **User Impact**: Tablet users (iPad 768px portrait) see optimized multi-column layout, avoiding cramped mobile view or excessive white space

**Q3: What happens when QuestionsSection tabs switch while user is mid-scroll through questions?**
- **Answer**: Tab switch resets scroll position to top of questions container. Active tab indicator (gold underline border-b-2) transitions immediately. Content fade-out/fade-in via opacity transition prevents jarring instant swap.
- **Code**: `QuestionsSection.astro:60-90` - JavaScript tab switching logic with scroll reset, CSS transition for border and opacity
- **Behavior**: onClick handler switches active tab, scrolls container to top (scrollTop = 0), applies transition classes
- **User Impact**: Clear visual feedback prevents disorientation, user doesn't lose place when switching between Personal/Business questions

**Q4: How is white space calculated in StatsSection grid to maintain minimal luxury aesthetic?**
- **Answer**: Fixed padding values maintain consistent breathing room: py-20 section padding, py-8 px-6 card padding. Vertical dividers between stats use border-l/border-t with 1px width. Hover effect adds subtle bg-gray-50/50 without layout shift.
- **Code**: `StatsSection.astro:5, 21-24` - Tailwind utility classes for padding (py-20, py-8, px-6), borders (border-l, border-t), hover (hover:bg-gray-50/50)
- **Behavior**: Consistent spacing ratios (20:8:6 outer:card:inner), borders don't add to box dimensions due to Tailwind defaults
- **User Impact**: Professional, uncluttered appearance reinforces luxury brand positioning, adequate breathing room improves readability and reduces visual fatigue

**Q5: What is footer height constraint on mobile viewports shorter than 667px (iPhone SE)?**
- **Answer**: Footer dynamically adjusts to content with responsive padding. CTA section py-8 (mobile), main footer py-6. Total height typically 600-700px (~45% reduction from original 1100-1300px). On short viewports (<667px), content remains readable with minimum font sizes, no content truncation.
- **Code**: `Footer.astro:15, 55` - CTA section py-8 md:py-10, footer content py-6, responsive image max-w-xs md:max-w-md
- **Behavior**: Flexbox layout adapts vertically, all content accessible without horizontal scroll, touch targets maintain 44×44px minimum
- **User Impact**: Footer never blocks critical content on small screens, maintains usability even on iPhone SE (375×667px), no frustrating scroll-to-reach-links

**Q6: How do carousel navigation buttons behave when JavaScript is disabled or fails to load?**
- **Answer**: Carousel remains functional via CSS scroll-snap and native touch/trackpad scrolling. Navigation buttons hidden via progressive enhancement pattern (rendered by JS, not in HTML). Fallback ensures all case studies accessible through manual scroll.
- **Code**: `CaseStudiesSection.astro:1-180` - CSS scroll-snap-type, overflow-x-scroll for native scrolling, JavaScript optionally adds prev/next buttons
- **Behavior**: Core functionality (scrolling between case studies) works with CSS only, JavaScript enhances with button navigation
- **User Impact**: Site remains accessible for users with JavaScript disabled or slow connections, preserves core functionality without degradation

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The case studies section MUST present client transformations in a visually clear format that emphasizes outcomes over decorative elements *(CaseStudiesSection.astro:1-180 - Horizontal scroll carousel with Results-First design, 70% achievements focus, gold border accents, scroll-snap navigation)*

> **User Feedback**: "да сейчас супер" ✅

- **FR-002**: The footer MUST reduce vertical space consumption while maintaining accessibility to all navigation items and CTAs *(Footer.astro:14-52, 55-120 - Compact layout with py-8/py-6 padding, horizontal flexbox, 45% height reduction from 1100-1300px to 600-700px)*

> **User Feedback**: "отпад" ✅ *Result: ~45% height reduction (1100-1300px → 600-700px)*
- **FR-003**: The questions section MUST maintain current interactive functionality (tab switching or equivalent) while improving visual refinement *(QuestionsSection.astro:1-120 - Underline tabs with gold border-b-2 indicator, gold vertical line accents border-l-[3px], tab switching with JavaScript)*
- **FR-004**: The testimonials section MUST display client feedback in a format that enhances credibility and readability *(TestimonialsSection.astro:1-80 - Light sage/white gradient background, white cards with border, 8×8 quote icons at 30% opacity, navy text colors)*
- **FR-005**: The statistics section MUST present numerical achievements with clear visual hierarchy *(StatsSection.astro:16-37 - Minimalist grid grid-cols-1/2/4, responsive dividers border-t/border-l, text-5xl/6xl gold values, hover effect bg-gray-50/50)*

> **User Feedback**: "отлично мне очень нравится" ✅

- **FR-006**: All redesigned sections MUST maintain responsive behavior across mobile, tablet, and desktop viewports *(All section components use Tailwind responsive prefixes: sm:, md:, lg: for 640px, 768px, 1024px breakpoints)*
- **FR-007**: Visual changes MUST align with the "minimal luxury coach" aesthetic defined in project documentation (clean, professional, calm, supportive tone) *(Implemented via: white space py-8/py-16, subtle hover effects, gold accents, clean borders, minimal decorative elements across all section components)*
- **FR-008**: The hero section, navigation, course preview section, CTA section, and motivational quote section MUST remain unchanged *(No code references - sections not modified in this feature)*
- **FR-009**: All redesigned sections MUST maintain current WCAG AA accessibility compliance (contrast ratios, keyboard navigation, screen reader support) *(Accessibility maintained via: aria-label attributes, semantic HTML, focus:ring utilities, contrast ratios ≥4.5:1 for text across all section components)*
- **FR-010**: Visual improvements MUST NOT increase page load time or negatively impact Core Web Vitals metrics *(CSS-only animations, no new JavaScript dependencies, image optimization via Astro Image component in Footer.astro:20-29)*

### Key Entities *(include if feature involves data)*

- **Case Study Card**: Represents a client transformation story with before/after states, timeline, metrics, and outcomes
- **Testimonial Item**: Represents client feedback with quote text, client name, role, and optional metadata (rating, company)
- **Statistic Metric**: Represents a numerical achievement (years of experience, client count, etc.) with value and descriptive label
- **Question Item**: Represents a common client concern or pain point with question text and optional category (personal/business)
- **Footer Navigation Section**: Represents organized groups of links (navigation, social media, legal/contact)

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Footer vertical height reduces by at least 30% on desktop and 40% on mobile while maintaining all current functionality
- **SC-002**: Users can scan and comprehend a case study in under 20 seconds (measured through user testing)
- **SC-003**: Visual clutter score (measured by ratio of content to white space) improves by at least 25% in redesigned sections
- **SC-004**: Mobile viewport efficiency improves - redesigned sections use vertical space 20% more efficiently while maintaining readability
- **SC-005**: User perception of "luxury/premium" design increases by at least 20% in post-redesign surveys compared to baseline
- **SC-006**: Time to locate and click footer CTA reduces by 15% on average (measured through analytics)
- **SC-007**: Testimonials section engagement (measured by scroll depth and time spent) increases by 10%
- **SC-008**: Page maintains Lighthouse Performance score of 95+ and Accessibility score of 95+ after redesign
- **SC-009**: Zero increase in page load time (measured by LCP metric staying <2.5s)
- **SC-010**: User task completion rate for "find case study examples" remains at 100% or improves

### Monitoring & Verification

**SC-001: Footer Height Reduction**
- **Tool**: Chrome DevTools (Device Toolbar + Measure tool)
- **Metric**: Footer section height in pixels (desktop 1920×1080, mobile 375×667)
- **Method**: Inspect footer element, measure `offsetHeight` before/after, calculate percentage reduction
- **Threshold**: Desktop ≥30% reduction, Mobile ≥40% reduction (baseline: 1100-1300px → target: 600-700px)

**SC-002: Case Study Comprehension Time**
- **Tool**: User testing sessions with 5-10 participants, screen recording software
- **Metric**: Time from first viewing case study to answering comprehension questions correctly
- **Method**: Show users one case study, ask 3 questions (client result, timeline, key metric), measure time to answer
- **Threshold**: Average time <20 seconds across all participants

**SC-003: Visual Clutter Score**
- **Tool**: Chrome DevTools (Computed styles, Layout measurements)
- **Metric**: Ratio of content pixels to white space pixels in redesigned sections
- **Method**: Calculate total section height, subtract content block heights (text, images, buttons), divide white space by total area
- **Threshold**: White space ratio increases by ≥25% compared to baseline (measure StatsSection, CaseStudiesSection, TestimonialsSection)

**SC-004: Mobile Viewport Efficiency**
- **Tool**: Chrome DevTools (iPhone SE 375×667, iPhone 12 Pro 390×844)
- **Metric**: Content density (characters per viewport height) in redesigned sections
- **Method**: Measure section height in viewport units (vh), count readable text content, calculate chars/vh ratio
- **Threshold**: Sections use ≥20% less vertical space while maintaining font-size ≥16px (no readability compromise)

**SC-005: Luxury/Premium Perception**
- **Tool**: Post-redesign user survey (Google Forms/Typeform) with Likert scale 1-5
- **Metric**: Average rating for "How luxury/premium does this design feel?" question
- **Method**: Survey 20+ users from target audience (entrepreneurs, IT professionals), compare before/after average scores
- **Threshold**: Average score increases by ≥20% (e.g., 3.0 → 3.6 or higher)

**SC-006: Footer CTA Click Time**
- **Tool**: Vercel Analytics (or Google Analytics with event tracking)
- **Metric**: Time from page scroll to footer CTA click (in seconds)
- **Method**: Track scroll events to footer section, measure time delta to CTA button click, average across 100+ sessions
- **Threshold**: Average time reduces by ≥15% compared to baseline

**SC-007: Testimonials Section Engagement**
- **Tool**: Vercel Analytics (scroll depth tracking) + Chrome DevTools (Performance profiling)
- **Metric**: Percentage of users scrolling through full testimonials section + average time spent in section
- **Method**: Track scroll depth to testimonials section bottom, measure dwell time (time between scroll-in and scroll-out)
- **Threshold**: Scroll-through rate OR dwell time increases by ≥10%

**SC-008: Lighthouse Scores**
- **Tool**: Lighthouse CI (command: `npm run build && npx lighthouse http://localhost:4321 --view`)
- **Metric**: Performance score and Accessibility score (0-100)
- **Method**: Run Lighthouse 3 times on production build, average scores, ensure no regressions
- **Threshold**: Performance ≥95, Accessibility ≥95 (current baseline: both ~95+)

**SC-009: Page Load Time (LCP)**
- **Tool**: Lighthouse + Vercel Speed Insights (Real User Monitoring)
- **Metric**: Largest Contentful Paint (LCP) in seconds
- **Method**: Run Lighthouse on production URL, check LCP metric in "Performance" report, verify in Vercel dashboard (75th percentile)
- **Threshold**: LCP ≤2.5s (no increase from baseline, preferably <2.0s)

**SC-010: Task Completion Rate**
- **Tool**: User testing sessions with task-based scenarios
- **Metric**: Percentage of users successfully locating case study examples within 30 seconds
- **Method**: Ask 10 users "Find an example of a client transformation", observe navigation, record success/failure
- **Threshold**: 100% completion rate (10/10 users succeed)

## Assumptions

### Technical Assumptions

- Current content (text, images, data) remains unchanged - only visual presentation is refined
- The project's existing design system (colors: navy, gold, sage; typography: Playfair Display, Inter) will be used
- Performance targets (Lighthouse 95+, LCP <2.5s, CLS <0.1) must be maintained
- The site remains fully static (no new dynamic features or backend requirements)
- All changes must be implementable using existing tech stack (Astro, React, Tailwind CSS)
- User testing can be conducted through A/B testing, user interviews, or analytics comparison

### Responsive Design Assumptions

- Redesign will follow mobile-first responsive approach as defined in project technical spec
- **Responsive breakpoint strategy**: Tailwind CSS defaults will be used (640px sm:, 768px md:, 1024px lg:, 1280px xl:) - no custom breakpoints needed
- Mobile viewports tested: iPhone SE (375×667), iPhone 12 Pro (390×844)
- Tablet viewports tested: iPad (768×1024)
- Desktop viewports tested: MacBook Pro (1440×900), 1920×1080

### Design Philosophy Assumptions

- **"Minimal luxury" aesthetic** is defined by project documentation: high white space, elegant typography, subtle animations, clean borders, gold accents
- **White space philosophy**: Prioritize breathing room over content density - minimum 80px (py-20) vertical spacing between major sections, generous card padding (py-8 px-6)
- **Gold accent usage pattern**: Gold color (gold-400, gold-500, gold-600) reserved for CTAs, interactive indicators (tab underlines, borders), and subtle accents - never used for large background areas
- **User feedback drives iterations**: Design decisions validated through direct user approval, not assumptions - iterations continue until user expresses satisfaction

### Design Iteration History

- **Initial asymmetric grid design (StatsSection)**: User rejected as "ugly" - symmetric minimalist grid with vertical dividers chosen instead (Decision documented in plan.md D1)
- **AI-template feedback**: Early design explorations used AI-generated templates as starting points, then refined through minimalist aesthetic lens - removed decorative elements, simplified color usage, increased white space
- **Design iteration count**: Approximately 3 major iterations per component to reach final user approval:
  1. Initial research.md proposal (e.g., vertical timeline for case studies)
  2. First implementation attempt (e.g., asymmetric grid for stats)
  3. Final user-approved design (e.g., horizontal carousel, minimalist grid)
- **Carousel layout decision**: Initial research.md proposed vertical timeline for CaseStudiesSection, but horizontal carousel chosen during implementation for space efficiency and better user experience (Decision documented in plan.md D4)

## Out of Scope

- Changes to hero section, navigation, courses section, CTA section, or motivational quote section
- New content creation (new case studies, testimonials, or statistics)
- Backend functionality or database changes
- Multi-language support or content translation
- New interactive features beyond existing tab functionality
- Changes to site structure or routing
- Integration with new third-party services
- Redesign of other pages (About, Courses, Contact)
- Performance optimization beyond maintaining current metrics

## Dependencies

- Access to current user analytics data for baseline measurements
- Ability to conduct user testing or A/B testing for validation
- Design decisions should align with `.claude/docs/about.md` and `.claude/docs/technical-spec.md`
- Current Tailwind configuration and design tokens remain available
- Existing images and assets remain unchanged

## Open Questions

None at this time. All requirements are sufficiently clear for planning and implementation.
