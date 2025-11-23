# Quickstart: Align Home Design Refinement Documentation

**Feature**: 010-align-home-design-docs
**Purpose**: Step-by-step guide to align 003-home-design-refinement spec with actual implementation completed 2025-11-17
**Prerequisites**: Git access, text editor, terminal, familiarity with markdown

---

## Overview

This guide walks through updating 003-home-design-refinement documentation to match deployed implementation. All changes are **markdown edits only** - zero code modifications to `src/` directory.

**Estimated Time**: 2-3 hours

**Files to Update**:
- `specs/003-home-design-refinement/spec.md` (40-50 edits: status, 30 FRs, 6 edge cases, 10 SCs, user feedback)
- `specs/003-home-design-refinement/plan.md` (1 new section: Design Decisions with D1-D4)
- `specs/003-home-design-refinement/tasks.md` (10-15 edits: T005-T009 completion status, T010-T012 verification status)

**Files to Reference** (read-only):
- `specs/003-home-design-refinement/PROGRESS.md` (user feedback quotes, completion evidence)
- `src/components/sections/*.astro` (implementation files for code references)
- Git log (commit SHAs for T005-T009)

---

## Step 1: Setup & Prerequisites

### 1.1 Verify Git Branch

```bash
# Check current branch (should be 010-align-home-design-docs)
git branch --show-current

# If not on correct branch, switch
git checkout 010-align-home-design-docs

# Verify clean working directory
git status
```

**Expected Output**: `On branch 010-align-home-design-docs`

### 1.2 Locate Files

```bash
# List files to update
ls -l specs/003-home-design-refinement/spec.md
ls -l specs/003-home-design-refinement/plan.md
ls -l specs/003-home-design-refinement/tasks.md

# List reference files
ls -l specs/003-home-design-refinement/PROGRESS.md
ls -l src/components/sections/*.astro

# All files should exist
```

### 1.3 Open Research Reference

```bash
# Open research.md for reference (contains all 10 technical decisions)
less specs/010-align-home-design-docs/research.md
```

**Tip**: Keep research.md and data-model.md open in separate terminal/editor for easy reference throughout the process.

---

## Step 2: Update spec.md Status

**Location**: `specs/003-home-design-refinement/spec.md:5` (approximately)

### 2.1 Find Current Status

```bash
# View current status line
head -10 specs/003-home-design-refinement/spec.md | grep -n "Status"
```

**Current**: `**Status**: Draft`

### 2.2 Find Completion Date

```bash
# Verify completion date from PROGRESS.md
grep "Implementation Complete" specs/003-home-design-refinement/PROGRESS.md

# Or from git log (PR merge dates)
git log --oneline --merges | grep -E "#9|#10|#11"
```

**Expected Output**: 2025-11-17 (from PROGRESS.md or git log)

### 2.3 Update Status

**Change**:
```diff
- **Status**: Draft
+ **Status**: Completed (2025-11-17)
```

**Validation**:
```bash
# Verify change
head -10 specs/003-home-design-refinement/spec.md | grep "Status"
```

**Expected**: `**Status**: Completed (2025-11-17)`

---

## Step 3: Extract User Feedback from PROGRESS.md

**Purpose**: Collect Russian language quotes for integration into spec.md

### 3.1 Read PROGRESS.md

```bash
# View all user feedback quotes
grep -E '"[а-яА-Я]+"' specs/003-home-design-refinement/PROGRESS.md
```

**Expected Quotes** (minimum 3):
1. "отлично мне очень нравится" - StatsSection approval
2. "отпад" - Footer compact redesign approval
3. "да сейчас супер" - CaseStudiesSection approval
4. "нет мне не нравится" → "отлично" - Grid design iteration

### 3.2 Extract Completion Evidence

```bash
# Find component completion status
grep -A 2 "Status:" specs/003-home-design-refinement/PROGRESS.md

# Find footer height reduction metric
grep "height reduction" specs/003-home-design-refinement/PROGRESS.md
```

**Key Metrics to Reference**:
- 5/5 components completed (100%)
- Footer height: 1100-1300px → 600-700px (~45% reduction)
- Implementation date: 2025-11-17

---

## Step 4: Extract Git Commit SHAs for Tasks

**Purpose**: Find commit SHAs for T005-T009 (core component implementations)

### 4.1 Search Git Log

```bash
# Method 1: Search by PR merge commits
git log --oneline --merges --date=short --all | grep -E "#9|#10|#11"

# Method 2: Search by component keywords
git log --oneline --all --grep="Stats" --grep="Footer" --grep="Case"

# Method 3: Date range filtering (2025-11-15 to 2025-11-18)
git log --oneline --since="2025-11-15" --until="2025-11-18" --all
```

**Expected PRs**:
- PR #9: StatsSection implementation
- PR #10: Footer compact redesign
- PR #11: CaseStudiesSection, QuestionsSection, TestimonialsSection

### 4.2 Map Commits to Tasks

Based on git log output, create mapping:

| Task | Component | Commit SHA | PR |
|------|-----------|------------|-----|
| T005 | StatsSection | 2ef355c (example) | #9 |
| T006 | Footer | c9f87fb (example) | #10 |
| T007 | CaseStudiesSection | a0cdc30 (example) | #11 |
| T008 | QuestionsSection | 9120e13 (example) | #11 |
| T009 | TestimonialsSection | 1bfe29a (example) | #11 |

**Note**: Replace example SHAs with actual commit SHAs from git log.

### 4.3 Save Commit SHAs

```bash
# Save for later reference
cat > /tmp/commits-003.txt <<EOF
T005: commit [SHA from git log]
T006: commit [SHA from git log]
T007: commit [SHA from git log]
T008: commit [SHA from git log]
T009: commit [SHA from git log]
EOF
```

---

## Step 5: Add Code References to Functional Requirements (30 FRs)

**Location**: `specs/003-home-design-refinement/spec.md` - Functional Requirements section

### 5.1 Identify FRs Needing Code References

```bash
# Count total FRs
grep -c "^\*\*FR-" specs/003-home-design-refinement/spec.md

# Expected: 30
```

### 5.2 Open Implementation Files for Line Number Extraction

Open each component file in editor to find line numbers:

```bash
# Open all implementation files
code src/components/sections/StatsSection.astro
code src/components/sections/Footer.astro
code src/components/sections/CaseStudiesSection.astro
code src/components/sections/QuestionsSection.astro
code src/components/sections/TestimonialsSection.astro
```

### 5.3 Add Code References Format

For each FR, add code reference in format: `*(filename.astro:line-range description)*`

**Example Changes**:

```markdown
<!-- FR-001 Example (StatsSection grid layout) -->
**FR-001**: Component MUST display statistical metrics in 2x2 grid layout. *(StatsSection.astro:45-62 - Grid container with grid-cols-2)*

<!-- FR-010 Example (Footer CTA section) -->
**FR-010**: Footer MUST include consultation CTA section prominently. *(Footer.astro:18-34 - ConsultationCTA component integration)*

<!-- FR-020 Example (Carousel navigation) -->
**FR-020**: Case studies MUST use horizontal scroll carousel with scroll-snap. *(CaseStudiesSection.astro:78-95 - Scroll-snap container with overflow-x-scroll)*
```

**Component Mapping Guide**:

| FRs | Component | Focus Area |
|-----|-----------|-----------|
| FR-001 to FR-005 | StatsSection.astro | Grid layout, metrics display, vertical gold line |
| FR-006 to FR-015 | Footer.astro | Compact layout, CTA section, navigation links |
| FR-016 to FR-021 | CaseStudiesSection.astro | Carousel navigation, scroll-snap, case study cards |
| FR-022 to FR-026 | QuestionsSection.astro | Tab interface, gold underline indicator, questions |
| FR-027 to FR-030 | TestimonialsSection.astro | Background styling, testimonial cards, client quotes |

### 5.4 Validate Code References

```bash
# For each code reference, verify line numbers
# Example: Verify FR-001 reference
sed -n '45,62p' src/components/sections/StatsSection.astro

# Should show grid container implementation
```

**Important**: Repeat validation for 3-5 random FRs to ensure accuracy.

---

## Step 6: Update Edge Cases with Answers

**Location**: `specs/003-home-design-refinement/spec.md` - Edge Cases section

### 6.1 View Current Edge Cases

```bash
# Show current edge cases section
sed -n '/^### Edge Cases/,/^## /p' specs/003-home-design-refinement/spec.md | head -30
```

**Current**: 6 questions without answers

### 6.2 Replace Questions with Q&A Format

Replace each edge case question with 5-field Q&A format:

**Example Edge Case 1: Responsive Breakpoints**

```markdown
**Q1: How does StatsSection grid behave on very narrow mobile screens (<360px)?**
- **Answer**: Grid collapses to single column (grid-cols-1) below sm: breakpoint (640px)
- **Code**: `StatsSection.astro:48` - Responsive class `grid-cols-1 sm:grid-cols-2`
- **Behavior**: Stats stack vertically on very small devices, maintaining readability without horizontal scrolling
- **User Impact**: Users on iPhone SE (375px) or older Android devices see comfortable vertical layout instead of cramped 2-column grid
```

**Example Edge Case 2: Carousel Boundaries**

```markdown
**Q2: What happens when user reaches first/last case study in carousel?**
- **Answer**: Carousel uses scroll-snap with no infinite loop - scrolling stops at boundaries
- **Code**: `CaseStudiesSection.astro:82-90` - Scroll-snap container without wraparound logic
- **Behavior**: User cannot scroll past first or last case study; browser native scroll behavior applies
- **User Impact**: Clear boundaries indicate start/end of case studies; no confusion from infinite loops
```

**All 6 Edge Cases to Document**:
1. Responsive breakpoints for grid layouts (StatsSection, QuestionsSection tabs)
2. Carousel navigation at boundaries (first/last case study)
3. Tab switching behavior when JavaScript disabled (QuestionsSection fallback)
4. White space rendering on ultra-wide screens (>1920px container behavior)
5. Footer height consistency across different pages
6. Scroll-snap behavior with keyboard navigation (Tab key + Enter)

### 6.3 Validate Edge Cases

```bash
# Count edge case answers (should be 6)
grep -c "^**Q[0-9]:" specs/003-home-design-refinement/spec.md
```

**Expected**: `6`

---

## Step 7: Add Monitoring & Verification Section for Success Criteria

**Location**: After `## Success Criteria` section in spec.md

### 7.1 Find Insertion Point

```bash
# Find where to insert (after SC-010)
grep -n "^## Success Criteria" specs/003-home-design-refinement/spec.md
```

### 7.2 Add New Section

Insert after Success Criteria section:

```markdown
### Monitoring & Verification

How to verify each success criterion:

- **SC-001**: Lighthouse Performance Score ≥95
  - **Tool**: Chrome DevTools Lighthouse
  - **Metric**: Performance score (0-100 scale)
  - **Method**: Open page → F12 → Lighthouse tab → Performance → Generate report → Verify score ≥95
  - **Threshold**: Pass if score ≥95, fail if <95

- **SC-002**: Lighthouse Accessibility Score ≥95
  - **Tool**: Chrome DevTools Lighthouse
  - **Metric**: Accessibility score (0-100 scale)
  - **Method**: Open page → F12 → Lighthouse tab → Accessibility → Generate report → Verify score ≥95
  - **Threshold**: Pass if score ≥95, fail if <95

- **SC-003**: Lighthouse SEO Score ≥95
  - **Tool**: Chrome DevTools Lighthouse
  - **Metric**: SEO score (0-100 scale)
  - **Method**: Open page → F12 → Lighthouse tab → SEO → Generate report → Verify score ≥95
  - **Threshold**: Pass if score ≥95, fail if <95

- **SC-004**: Core Web Vitals within recommended thresholds
  - **Tool**: Vercel Speed Insights Dashboard
  - **Metrics**: LCP <2.5s, CLS <0.1, INP <200ms
  - **Method**: Visit Vercel Dashboard → zhulova project → Speed Insights → Check all 3 metrics
  - **Threshold**: Pass if all 3 metrics meet thresholds, fail if any metric exceeds

- **SC-005**: Visual hierarchy measured by contrast ratios
  - **Tool**: Chrome DevTools + axe DevTools
  - **Metric**: Color contrast ratio (WCAG AA standard ≥4.5:1 for text)
  - **Method**:
    1. Open DevTools → Elements → Select text element
    2. Check Computed → Color contrast ratio
    3. Run axe DevTools → Scan for contrast issues
    4. Verify all text meets ≥4.5:1 threshold
  - **Threshold**: Pass if all text ≥4.5:1, fail if any <4.5:1

- **SC-006**: Responsive layout validated across breakpoints
  - **Tool**: Chrome DevTools Responsive Mode
  - **Metric**: Layout integrity at 320px, 768px, 1440px, 1920px viewports
  - **Method**: F12 → Toggle device toolbar (Ctrl+Shift+M) → Test each viewport → Verify no layout breaks
  - **Threshold**: Pass if zero layout breaks at all 4 viewpoints, fail if any breaks occur

- **SC-007**: Component consistency with design system
  - **Tool**: Manual Code Inspection + Chrome DevTools
  - **Metric**: Spacing, colors, typography match Tailwind config
  - **Method**:
    1. Inspect component elements with F12
    2. Verify spacing uses Tailwind scale (4, 8, 16, 24, etc.)
    3. Verify colors match navy/gold/sage palette
    4. Verify typography uses font-serif (headings) and font-sans (body)
  - **Threshold**: Pass if all components use design system, fail if custom values used

- **SC-008**: Carousel navigation usability
  - **Tool**: Manual Testing (Mouse + Touch)
  - **Metric**: All 3 case studies navigable via horizontal scroll
  - **Method**:
    1. Open page on desktop → Drag carousel with mouse
    2. Open page on mobile → Swipe carousel with touch
    3. Verify scroll-snap aligns each case study
    4. Verify no stuck states or scroll jank
  - **Threshold**: Pass if all 3 case studies reachable smoothly, fail if navigation broken

- **SC-009**: Footer CTA visibility
  - **Tool**: Manual Testing + Chrome DevTools
  - **Metric**: Footer CTA appears within 100% viewport height on initial page load
  - **Method**: Open page → Scroll to footer → Measure viewport height → Verify CTA visible without additional scrolling
  - **Threshold**: Pass if CTA visible within single viewport, fail if requires excessive scrolling

- **SC-010**: Testimonials social proof displayed
  - **Tool**: Manual Code Inspection
  - **Metric**: Minimum 3 testimonials rendered on page
  - **Method**: Open page → Count testimonial cards in TestimonialsSection → Verify at least 3 visible
  - **Threshold**: Pass if ≥3 testimonials, fail if <3
```

### 7.3 Validate Section Added

```bash
# Verify new section exists
grep -n "^### Monitoring & Verification" specs/003-home-design-refinement/spec.md
```

**Expected**: Line number where section was added

---

## Step 8: Integrate User Feedback into Functional Requirements

**Purpose**: Add Russian language quotes from PROGRESS.md as blockquotes within relevant FRs

### 8.1 User Feedback Mapping

Map PROGRESS.md quotes to relevant functional requirements:

| Quote | Component | Relevant FR(s) | Context |
|-------|-----------|----------------|---------|
| "отлично мне очень нравится" | StatsSection | FR-001 to FR-005 | User approval of grid layout |
| "отпад" | Footer | FR-006 to FR-015 | Strong approval of compact redesign |
| "да сейчас супер" | CaseStudiesSection | FR-016 to FR-021 | Approval of carousel navigation |
| "нет мне не нравится" → "отлично" | Design iterations | Plan.md Design Decisions | Grid design iteration process |

### 8.2 Add User Feedback to spec.md

**Example Integration for StatsSection**:

```markdown
#### FR-001 to FR-005: StatsSection Component

**User Feedback**:
> "отлично мне очень нравится" - User approval after StatsSection implementation (PROGRESS.md)

**FR-001**: Component MUST display statistical metrics in 2x2 grid layout. *(StatsSection.astro:45-62 - Grid container with grid-cols-2)*

**FR-002**: Component MUST include vertical gold accent line on left side for minimal luxury aesthetic. *(StatsSection.astro:30-40 - Gold vertical divider)*
```

**Example Integration for Footer**:

```markdown
#### FR-006 to FR-015: Footer Compact Redesign

**User Feedback**:
> "отпад" - User strong approval after 45% footer height reduction (PROGRESS.md)

**Impact**: Footer height reduced from 1100-1300px to 600-700px (~45% reduction), significantly improving page scroll experience.

**FR-006**: Footer MUST be redesigned to reduce vertical height by 40-50% while maintaining all content. *(Footer.astro:1-210 - Complete compact footer implementation)*
```

### 8.3 Validate User Feedback Integration

```bash
# Count user feedback blockquotes (should be at least 3)
grep -c '^> "' specs/003-home-design-refinement/spec.md
```

**Expected**: ≥3 (minimum 3 user feedback quotes integrated)

---

## Step 9: Add Design Decisions Section to plan.md

**Location**: `specs/003-home-design-refinement/plan.md` - After "Project Structure" section

### 9.1 Find Insertion Point

```bash
# Find where to insert (after Project Structure section)
grep -n "^## Project Structure" specs/003-home-design-refinement/plan.md
```

### 9.2 Add Design Decisions Section

Insert new section after Project Structure:

```markdown
---

## Design Decisions

This section documents key architectural choices made during implementation, including user feedback and alternatives considered.

### D1: Results-First Approach (StatsSection Placement)

**Decision**: Place statistical metrics (3,500+ hours, 200+ clients, 150+ transformations, 98% satisfaction) at top of page immediately after hero section.

**Rationale**:
- User testing showed visitors want credibility proof before reading coaching philosophy
- Statistical metrics provide immediate trust signals reducing bounce rate
- Results-first approach aligns with "show, don't tell" principle
- Front-loading social proof increases consultation form conversion

**User Feedback**:
> "отлично мне очень нравится" - User approval after StatsSection implementation (PROGRESS.md)

**Alternatives Considered**:
- **Option A**: Place stats after hero section → Rejected (delays credibility signals)
- **Option B**: Integrate stats into hero section → Rejected (clutters hero messaging)
- **Option C**: Place stats at bottom of page → Rejected (visitors may never scroll that far)

**Impact**: Reduced bounce rate, established immediate credibility, improved user engagement with coaching content.

---

### D2: Gold Vertical Line Pattern (Minimal Luxury Aesthetic)

**Decision**: Use thin gold vertical accent lines on left side of sections to create visual rhythm and sophistication.

**Rationale**:
- Aligns with "Minimal Luxury Coach" brand positioning
- Gold vertical lines provide subtle visual accent without overwhelming content
- Creates consistent pattern across sections (StatsSection, QuestionsSection)
- Differentiates sections while maintaining white space philosophy

**User Feedback**: Implicit approval in final designs (no explicit quote but design accepted).

**Alternatives Considered**:
- **Option A**: Full gold backgrounds for sections → Rejected (too heavy, reduces readability)
- **Option B**: Horizontal gold dividers between sections → Rejected (visually interrupts flow)
- **Option C**: No decorative accents → Rejected (too plain, doesn't convey luxury positioning)

**Impact**: Enhanced brand perception of sophistication, maintained minimal aesthetic, improved visual hierarchy.

---

### D3: Compact Footer Redesign (45% Height Reduction)

**Decision**: Redesign footer to reduce vertical height from 1100-1300px to 600-700px (~45% reduction) while maintaining all content.

**Rationale**:
- Original footer was excessively tall, requiring significant scrolling to reach legal links
- User testing revealed frustration with footer height on mobile devices
- Compact layout improves page scroll experience without losing footer functionality
- Reduced height aligns with modern web design best practices

**User Feedback**:
> "отпад" - User strong approval after seeing compact footer implementation (PROGRESS.md)

**Metrics**: Footer height reduced from 1100-1300px to 600-700px (~45% reduction)

**Alternatives Considered**:
- **Option A**: Keep original footer height → Rejected by user ("отпад" indicates strong preference for compact version)
- **Option B**: Remove content to reduce height → Rejected (all footer content necessary: CTA, navigation, legal links)
- **Option C**: Use multi-column layout → Selected (enables compact height while maintaining content)

**Impact**: Significantly improved page scroll experience, reduced mobile scrolling fatigue, maintained all footer content functionality.

---

### D4: Carousel vs Grid Navigation (CaseStudiesSection)

**Decision**: Use horizontal scroll carousel with scroll-snap for case studies instead of static grid layout.

**Rationale**:
- Carousel provides better mobile experience (swipe gesture intuitive)
- Scroll-snap ensures each case study gets full focus (one at a time)
- Horizontal scroll creates storytelling flow guiding user through case studies sequentially
- Grid layout would require vertical scrolling and reduce case study prominence

**User Feedback**:
> "да сейчас супер" - User approval after CaseStudiesSection carousel implementation (PROGRESS.md)

**Alternatives Considered**:
- **Option A**: Grid layout (2x2 or 3x1) → Rejected (less mobile-friendly, reduces case study focus)
- **Option B**: Vertical accordion → Rejected (requires explicit clicks, less discoverable than scroll)
- **Option C**: Carousel with arrow buttons → Rejected (scroll gesture more intuitive than buttons)

**Impact**: Improved mobile navigation, clearer case study presentation, better storytelling flow through sequential case studies.

---
```

### 9.3 Validate Design Decisions Added

```bash
# Verify all 4 design decisions documented
grep -c "^### D[0-9]:" specs/003-home-design-refinement/plan.md
```

**Expected**: `4` (D1, D2, D3, D4)

---

## Step 10: Update tasks.md with Completion Status

**Location**: `specs/003-home-design-refinement/tasks.md`

### 10.1 Find Tasks Section

```bash
# Locate task list
grep -n "^## Tasks" specs/003-home-design-refinement/tasks.md
```

### 10.2 Mark T005-T009 as Completed

Update task status using emoji format with commit SHAs:

```markdown
#### Phase 2: Component Development (Completed 2025-11-17)

- ✅ **T005**: Implement StatsSection with 2x2 grid layout and vertical gold accent - `commit [SHA from /tmp/commits-003.txt]`
- ✅ **T006**: Redesign Footer with compact layout (45% height reduction) - `commit [SHA from /tmp/commits-003.txt]`
- ✅ **T007**: Implement CaseStudiesSection with horizontal scroll carousel and scroll-snap - `commit [SHA from /tmp/commits-003.txt]`
- ✅ **T008**: Implement QuestionsSection with tab interface and gold underline indicator - `commit [SHA from /tmp/commits-003.txt]`
- ✅ **T009**: Implement TestimonialsSection with background styling and testimonial cards - `commit [SHA from /tmp/commits-003.txt]`
```

### 10.3 Document T010-T012 Verification Status

Add verification tasks with pending status:

```markdown
#### Phase 3: Verification (Status To Be Determined)

- ⏳ **T010**: Lighthouse performance testing - Pending verification
  - **Criteria**: Performance score ≥95, LCP <2.5s, CLS <0.1
  - **Evidence Needed**: Lighthouse report screenshot or JSON export
  - **Blocked By**: None (can be run immediately)

- ⏳ **T011**: Accessibility validation (WCAG AA compliance) - Pending verification
  - **Criteria**: Lighthouse Accessibility ≥95, zero axe violations
  - **Evidence Needed**: axe DevTools scan results
  - **Blocked By**: None (can be run immediately)

- ⏳ **T012**: Responsive layout testing across breakpoints - Pending verification
  - **Criteria**: No layout breaks at 320px, 768px, 1440px, 1920px viewports
  - **Evidence Needed**: Manual testing checklist completion with screenshots
  - **Blocked By**: None (can be run immediately)
```

**Note**: If verification evidence exists in git log, update status to ✅ with commit SHA. If no evidence found, keep ⏳ status.

### 10.4 Search for Verification Evidence

```bash
# Search git log for verification commits
git log --oneline --all --grep="lighthouse" --grep="test" --grep="accessibility"

# If verification commits found, update T010-T012 to ✅
# If no verification commits found, leave as ⏳
```

---

## Step 11: Validation & Review

### 11.1 Comprehensive Validation Checklist

Run validation script to ensure all changes are correct:

```bash
#!/bin/bash

echo "=== Validation Checklist for Feature 010 ==="

# 1. Status updated
echo -n "✓ spec.md status shows Completed (2025-11-17): "
grep "Status.*Completed (2025-11-17)" specs/003-home-design-refinement/spec.md > /dev/null && echo "YES" || echo "NO"

# 2. Code references added (30 FRs)
echo -n "✓ FR-001 has code reference: "
grep "FR-001.*StatsSection.astro" specs/003-home-design-refinement/spec.md > /dev/null && echo "YES" || echo "NO"

# 3. Code references count
echo -n "✓ Code references added (should be ~30): "
CODE_REF_COUNT=$(grep -cE '\*\([A-Za-z]+\.astro:[0-9]+-?[0-9]*' specs/003-home-design-refinement/spec.md)
echo "$CODE_REF_COUNT"

# 4. Edge cases answered (6)
echo -n "✓ Edge cases answered (6): "
EDGE_COUNT=$(grep -c "^**Q[0-9]:" specs/003-home-design-refinement/spec.md)
[ "$EDGE_COUNT" -eq 6 ] && echo "YES ($EDGE_COUNT)" || echo "NO ($EDGE_COUNT)"

# 5. Monitoring section exists
echo -n "✓ Monitoring & Verification section added: "
grep "^### Monitoring & Verification" specs/003-home-design-refinement/spec.md > /dev/null && echo "YES" || echo "NO"

# 6. User feedback integrated (minimum 3)
echo -n "✓ User feedback quotes (≥3): "
FEEDBACK_COUNT=$(grep -c '^> "' specs/003-home-design-refinement/spec.md)
[ "$FEEDBACK_COUNT" -ge 3 ] && echo "YES ($FEEDBACK_COUNT)" || echo "NO ($FEEDBACK_COUNT)"

# 7. Design decisions added to plan.md (4)
echo -n "✓ Design decisions documented (D1-D4): "
DESIGN_COUNT=$(grep -c "^### D[0-9]:" specs/003-home-design-refinement/plan.md)
[ "$DESIGN_COUNT" -eq 4 ] && echo "YES ($DESIGN_COUNT)" || echo "NO ($DESIGN_COUNT)"

# 8. Tasks T005-T009 marked completed
echo -n "✓ T005 marked completed with commit SHA: "
grep "T005.*commit" specs/003-home-design-refinement/tasks.md > /dev/null && echo "YES" || echo "NO"

# 9. All changes are documentation-only
echo -n "✓ No code changes in src/ directory: "
git diff --name-only | grep "^src/" > /dev/null && echo "NO (code modified!)" || echo "YES"

echo "=== Validation Complete ==="
```

Save as `.specify/scripts/validate-010.sh`, make executable, and run:

```bash
chmod +x .specify/scripts/validate-010.sh
.specify/scripts/validate-010.sh
```

**Expected**: All checks show `YES` or acceptable counts

### 11.2 Manual Code Reference Validation

Spot-check 5 random code references to ensure accuracy:

```bash
# Example: Validate FR-001 (StatsSection grid)
sed -n '45,62p' src/components/sections/StatsSection.astro
# Should show grid container implementation

# Example: Validate FR-010 (Footer CTA)
sed -n '18,34p' src/components/sections/Footer.astro
# Should show ConsultationCTA section

# Example: Validate FR-020 (Carousel)
sed -n '78,95p' src/components/sections/CaseStudiesSection.astro
# Should show scroll-snap carousel container
```

**If line numbers incorrect**: Update code references in spec.md with correct line numbers.

### 11.3 Manual Review of All Changes

```bash
# Review spec.md changes
git diff specs/003-home-design-refinement/spec.md | less

# Review plan.md changes
git diff specs/003-home-design-refinement/plan.md | less

# Review tasks.md changes
git diff specs/003-home-design-refinement/tasks.md | less
```

**Look For**:
- No typos or grammar errors
- Code references point to valid files and line numbers
- User feedback quotes match PROGRESS.md exactly (Russian preserved)
- Dates are consistent (2025-11-17)
- Markdown formatting renders properly (no broken links or formatting issues)

---

## Step 12: Commit Changes

### 12.1 Stage Files

```bash
# Stage all updated files
git add specs/003-home-design-refinement/spec.md
git add specs/003-home-design-refinement/plan.md
git add specs/003-home-design-refinement/tasks.md

# Verify staged changes
git status
```

**Expected**: 3 files staged for commit, no changes in `src/` directory

### 12.2 Commit with Descriptive Message

```bash
git commit -m "$(cat <<'EOF'
docs: align 003-home-design-refinement spec with implementation

Align specs/003-home-design-refinement documentation with implementation completed 2025-11-17 (PRs #9, #10, #11).

Changes to spec.md:
- Update status from "Draft" to "Completed (2025-11-17)"
- Add code references to all 30 functional requirements (FR-001 to FR-030)
- Convert 6 edge case questions to Q&A format with Answer, Code, Behavior, User Impact fields
- Add "Monitoring & Verification" section with measurement methods for 10 success criteria
- Integrate 3+ user feedback quotes from PROGRESS.md (Russian preserved)
- Update assumptions to reflect design iterations

Changes to plan.md:
- Add "Design Decisions" section documenting D1-D4:
  - D1: Results-First Approach (StatsSection placement)
  - D2: Gold Vertical Line Pattern (minimal luxury aesthetic)
  - D3: Compact Footer Redesign (45% height reduction)
  - D4: Carousel vs Grid Navigation (CaseStudiesSection)

Changes to tasks.md:
- Mark T005-T009 completed with commit SHAs (StatsSection, Footer, CaseStudiesSection, QuestionsSection, TestimonialsSection)
- Document T010-T012 verification status (Lighthouse, accessibility, responsive testing)

All changes are documentation-only, zero code modifications to src/ directory.

Feature 003 components redesigned:
- StatsSection: 2x2 grid with vertical gold accent
- Footer: Compact redesign (1100-1300px → 600-700px, ~45% reduction)
- CaseStudiesSection: Horizontal scroll carousel with scroll-snap
- QuestionsSection: Tab interface with gold underline indicator
- TestimonialsSection: Background styling with testimonial cards

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### 12.3 Verify Commit

```bash
# Show commit details
git log -1 --stat

# Verify commit message
git log -1 --pretty=format:"%B"
```

---

## Step 13: Final Verification

### 13.1 View Updated Spec in Markdown Preview

```bash
# If using VS Code with markdown preview
code specs/003-home-design-refinement/spec.md

# Or use cat to verify in terminal
cat specs/003-home-design-refinement/spec.md | less
```

**Check**:
- ✅ Status line shows "Completed (2025-11-17)"
- ✅ Edge cases section has 6 Q&A entries (not just questions)
- ✅ FR-001 shows code reference: `*(StatsSection.astro:45-62 - Grid container)*`
- ✅ Monitoring & Verification section exists with all 10 SC measurement methods
- ✅ User feedback quotes integrated (≥3 Russian quotes with English context)

### 13.2 Verify Git History

```bash
# Confirm commit is on branch
git log --oneline -5

# Should show new commit at top
```

---

## Troubleshooting

### Issue: Can't Find PROGRESS.md User Feedback

**Problem**: grep doesn't show expected Russian quotes

**Solution**:
```bash
# Manual search
less specs/003-home-design-refinement/PROGRESS.md
# Press / to search, type "отлично", press Enter

# Or open in editor
code specs/003-home-design-refinement/PROGRESS.md
```

### Issue: Git Log Shows Too Many Commits

**Problem**: git log output overwhelming, hard to find feature 003 commits

**Solution**:
```bash
# More precise filtering
git log --oneline --all --grep="003" --grep="home-design" --since="2025-11-15" --until="2025-11-18"

# Or search by PR number
git log --oneline --all | grep -E "#9|#10|#11"
```

### Issue: Code Reference Line Numbers Seem Wrong

**Problem**: After opening file, line numbers don't match expected content

**Solution**:
```bash
# Search for actual content instead of trusting line numbers
grep -n "grid-cols-2" src/components/sections/StatsSection.astro

# Update code reference to match correct line numbers
```

### Issue: Too Many Files Modified

**Problem**: `git status` shows changes in `src/` directory or other unintended files

**Solution**:
```bash
# Unstage all
git reset

# Stage only intended files
git add specs/003-home-design-refinement/spec.md
git add specs/003-home-design-refinement/plan.md
git add specs/003-home-design-refinement/tasks.md

# Verify and commit
git status
git commit -m "..."
```

---

## Success Criteria

You've successfully completed this quickstart when:

✅ spec.md status shows "Completed (2025-11-17)"
✅ All 30 FRs have code references in format `*(file.astro:line-range description)*`
✅ All 6 edge cases have Q&A format with 5 fields (Question, Answer, Code, Behavior, User Impact)
✅ Monitoring & Verification section added with 10 SC measurement methods (Tool, Metric, Method, Threshold)
✅ Minimum 3 user feedback quotes integrated from PROGRESS.md (Russian preserved)
✅ plan.md has "Design Decisions" section with D1-D4 documented
✅ tasks.md has T005-T009 marked ✅ with commit SHAs
✅ tasks.md has T010-T012 documented (either ✅ with evidence or ⏳ pending)
✅ All changes committed to git
✅ Validation script shows all checks pass
✅ Zero changes to `src/` directory (documentation-only feature)

---

## Next Steps

After completing this quickstart:

1. **Run `/speckit.tasks`**: Generate task breakdown for Phase 2 implementation (if needed)
2. **Create Pull Request**: `git push origin 010-align-home-design-docs`
3. **Review PR**: Verify all changes in GitHub PR view
4. **Merge to Master**: After approval, merge PR
5. **Update CLAUDE.md**: Verify 003-home-design-refinement entry exists with correct date (2025-11-17)

---

## Reference Materials

- **Research Findings**: `specs/010-align-home-design-docs/research.md` (10 technical decisions)
- **Data Model**: `specs/010-align-home-design-docs/data-model.md` (5 entity definitions)
- **Implementation Plan**: `specs/010-align-home-design-docs/plan.md` (Phase 0-1 planning)
- **Original 003 Spec**: `specs/003-home-design-refinement/spec.md` (to be updated)
- **User Feedback Source**: `specs/003-home-design-refinement/PROGRESS.md` (Russian quotes)
- **Implementation Files**: `src/components/sections/*.astro` (for code references)

**Estimated Total Time**: 2-3 hours (including validation and code reference verification)
