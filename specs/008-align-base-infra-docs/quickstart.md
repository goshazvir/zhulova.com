# Quickstart: Align Base Infrastructure Documentation

**Feature**: 008-align-base-infra-docs
**Purpose**: Step-by-step guide to align 001-base-infrastructure spec with actual implementation
**Prerequisites**: Git access, text editor, terminal

---

## Overview

This guide walks through updating 001-base-infrastructure documentation to match deployed implementation. All changes are **markdown edits only** - zero code modifications.

**Estimated Time**: 45-60 minutes

**Files to Update**:
- `specs/001-base-infrastructure/spec.md` (10-12 edits)
- `specs/001-base-infrastructure/plan.md` (2-3 edits)
- `CLAUDE.md` (1 edit)

---

## Step 1: Setup & Prerequisites

### 1.1 Verify Git Branch

```bash
# Check current branch (should be 008-align-base-infra-docs)
git branch --show-current

# If not on correct branch, switch
git checkout 008-align-base-infra-docs

# Verify clean working directory
git status
```

**Expected Output**: `On branch 008-align-base-infra-docs`

### 1.2 Locate Files

```bash
# List files to update
ls -l specs/001-base-infrastructure/spec.md
ls -l specs/001-base-infrastructure/plan.md
ls -l CLAUDE.md

# All files should exist
```

###1.3 Open Research Reference

```bash
# Open research.md for reference (contains all findings)
cat specs/008-align-base-infra-docs/research.md | less
```

**Tip**: Keep research.md open in separate terminal/editor for easy reference.

---

## Step 2: Update spec.md Status (Critical Fix C1)

**Location**: `specs/001-base-infrastructure/spec.md:5`

### 2.1 Find Current Status

```bash
# View current status line
head -10 specs/001-base-infrastructure/spec.md | grep -n "Status"
```

**Current**: `**Status**: Draft`

### 2.2 Find Completion Date

```bash
# Verify completion date from git log
git log --grep="001-base-infrastructure" --oneline --date=short | head -1
```

**Expected Output**: `2025-11-16` (merge commit date)

### 2.3 Update Status

**Change**:
```diff
- **Status**: Draft
+ **Status**: Completed (2025-11-16)
```

**Validation**:
```bash
# Verify change
head -10 specs/001-base-infrastructure/spec.md | grep "Status"
```

**Expected**: `**Status**: Completed (2025-11-16)`

---

## Step 3: Update Edge Cases Section (Critical Fix C2)

**Location**: `specs/001-base-infrastructure/spec.md:103-108`

### 3.1 View Current Edge Cases

```bash
# Show current edge cases section
sed -n '101,110p' specs/001-base-infrastructure/spec.md
```

**Current**: 6 questions without answers

### 3.2 Replace Questions with Answers

Open `specs/001-base-infrastructure/spec.md` in editor and replace lines 103-108 with:

```markdown
### Edge Cases

**1. What happens when BaseLayout is used without required props (title, description)?**
- **Answer**: TypeScript compilation fails with error "Property 'title' is required but was not provided"
- **Code**: BaseLayout.astro:7-12 defines Props interface without optional modifiers for title/description
- **Behavior**: Build-time validation, not runtime error

**2. How does header navigation behave on tablets (between mobile and desktop breakpoints)?**
- **Answer**: Header uses md:flex breakpoint (768px) - below 768px shows hamburger menu, 768px+ shows horizontal desktop navigation
- **Code**: Header.astro responsive classes with md: prefix, MobileMenu.tsx for mobile menu component
- **Tablet Behavior**: iPad portrait (768px) shows desktop nav, smaller tablets show mobile menu

**3. What happens if custom fonts fail to load (font fallback strategy)?**
- **Answer**: Browser falls back to system fonts - serif for headings (Georgia, Times New Roman), sans-serif for body (Helvetica, Arial)
- **Code**: tailwind.config.mjs font-serif and font-sans definitions include fallback stacks, global.css:1 loads fonts with display=swap
- **User Experience**: Content remains readable with slight visual difference until fonts load

**4. How does the mobile menu handle very long navigation labels?**
- **Answer**: Labels use natural text wrapping within 256px menu width - text wraps to multiple lines if exceeds container width
- **Code**: MobileMenu.tsx navigation items use block w-full text-left px-4 py-3 (no truncate utility)
- **Fallback**: Text wraps naturally on all screen sizes

**5. What happens if social media links are not provided to the Footer component?**
- **Answer**: Footer always renders social media section - if links missing from homePageContent.ts, href attributes would be empty/undefined creating non-functional anchor tags
- **Code**: Footer.astro:96-162 unconditionally renders social section, imports links from @/data/homePageContent
- **Visual Impact**: Social icons display but may not be functional without data

**6. How does the site handle browsers without modern CSS features (CSS Grid, custom properties)?**
- **Answer**: No polyfills provided - site requires modern browser support for CSS Grid, Custom Properties, Flexbox, and CSS transitions
- **Code**: tailwind.config.mjs uses modern CSS custom properties without fallbacks, no browserslist configuration in astro.config.mjs
- **Target**: Last 2 versions of major browsers (Chrome 90+, Firefox 88+, Safari 14+, Edge 90+)
```

### 3.3 Validate Changes

```bash
# Count edge case answers (should be 6)
grep -c "^**[0-9]\. What happens" specs/001-base-infrastructure/spec.md
```

**Expected**: `6`

---

## Step 4: Add Code References to Functional Requirements (High Priority H1)

**Location**: `specs/001-base-infrastructure/spec.md:114-134`

### 4.1 View Current FRs

```bash
# Show FR section
sed -n '114,134p' specs/001-base-infrastructure/spec.md
```

### 4.2 Add Code References

For each FR, append code reference in format `*(filename.ext:line-range)*`:

**Example Changes**:

```diff
- **FR-001**: BaseLayout component MUST accept props for page title, meta description, optional Open Graph image, and optional canonical URL
+ **FR-001**: BaseLayout component MUST accept props for page title, meta description, optional Open Graph image, and optional canonical URL *(BaseLayout.astro:7-12)*

- **FR-002**: BaseLayout component MUST render a complete HTML5 document structure with `<html>`, `<head>`, `<body>`, and semantic content sections
+ **FR-002**: BaseLayout component MUST render a complete HTML5 document structure with `<html>`, `<head>`, `<body>`, and semantic content sections *(BaseLayout.astro:26-97)*

- **FR-003**: BaseLayout component MUST include all required SEO meta tags: title, description, Open Graph (og:title, og:description, og:image, og:url), Twitter Cards (twitter:card, twitter:title, twitter:description, twitter:image)
+ **FR-003**: BaseLayout component MUST include all required SEO meta tags: title, description, Open Graph (og:title, og:description, og:image, og:url), Twitter Cards (twitter:card, twitter:title, twitter:description, twitter:image) *(BaseLayout.astro:36-65)*
```

**Complete Mapping** (from research.md):

| FR | Code Reference |
|----|----------------|
| FR-001 | BaseLayout.astro:7-12 |
| FR-002 | BaseLayout.astro:26-97 |
| FR-003 | BaseLayout.astro:36-65 |
| FR-004 | BaseLayout.astro:21-22, 42 |
| FR-005 | BaseLayout.astro:26-30 |
| FR-006 | tailwind.config.mjs:10-46 |
| FR-007 | tailwind.config.mjs:6-9 |
| FR-008 | tailwind.config.mjs:48-53 |
| FR-009 | global.css:1 |
| FR-010 | Header.astro:17-40, 44-82 |
| FR-011 | Header.astro:44, 71, 130-141 |
| FR-012 | Header.astro:12-14, 59, 65, 190-196 |
| FR-013 | Footer.astro:166-171 |
| FR-014 | Footer.astro:96-162 |
| FR-015 | Footer.astro:74-93, 174-189 |
| FR-016 | global.css:29-32 |
| FR-017 | global.css:43-55 |
| FR-018 | tailwind.config.mjs (color contrast ratios) |
| FR-019 | Header.astro, Footer.astro, BaseLayout.astro (semantic HTML throughout) |
| FR-020 | Header.astro, Footer.astro (keyboard accessible elements) |

### 4.3 Validate Code References

```bash
# Verify FR-001 reference is correct
sed -n '7,12p' src/layouts/BaseLayout.astro

# Should show:
# interface Props {
#   title: string;
#   description: string;
#   image?: string;
#   canonical?: string;
# }
```

**Repeat for 3-4 random FRs to ensure accuracy**.

---

## Step 5: Add Monitoring & Verification Section (High Priority H2)

**Location**: After `## Success Criteria *(mandatory)*` section in spec.md

### 5.1 Find Insertion Point

```bash
# Find where to insert (after SC-010)
grep -n "^## Success Criteria" specs/001-base-infrastructure/spec.md
```

### 5.2 Add New Section

Insert after Success Criteria section (around line 158):

```markdown
### Monitoring & Verification

How to verify each success criterion:

- **SC-001**: Tool: Chrome DevTools Lighthouse | Method: Open page → F12 → Lighthouse tab → SEO category → Analyze page load → Verify score ≥95
- **SC-002**: Tool: Chrome DevTools Lighthouse | Method: Open page → F12 → Lighthouse tab → Accessibility category → Analyze page load → Verify score ≥95
- **SC-003**: Tool: axe DevTools + Manual | Method: Install axe extension → Scan page → Check focus indicator contrast (≥3:1) OR Tab through elements and verify visible focus
- **SC-004**: Tool: Manual Tab Testing | Method: Press Tab repeatedly through page → Verify all interactive elements reachable → Check logical tab order → No keyboard traps
- **SC-005**: Tool: Vercel Speed Insights Dashboard | Method: Visit https://vercel.com/dashboard → Select zhulova project → Speed Insights tab → Check CLS metric (<0.1)
- **SC-006**: Tool: Chrome DevTools Responsive Mode | Method: F12 → Toggle device toolbar (Ctrl+Shift+M) → Test 320px, 768px, 1440px → Verify layout adapts correctly
- **SC-007**: Tool: WAVE / axe DevTools | Method: Visit https://wave.webaim.org/ → Enter page URL → Assess → Check "Contrast Errors" shows 0 violations
- **SC-008**: Tool: Chrome DevTools Media Query Emulation | Method: F12 → Ctrl+Shift+P → "Emulate CSS prefers-reduced-motion: reduce" → Verify animations disabled
- **SC-009**: Tool: W3C HTML Validator | Method: Visit https://validator.w3.org/ → Enter page URL → Check → Verify "No errors or warnings"
- **SC-010**: Tool: Manual Code Inspection + Dev Server | Method: Run `npm run dev` → Inspect elements with F12 → Verify Tailwind classes (bg-navy-900, text-gold-500) render correctly
```

### 5.3 Validate Section Added

```bash
# Verify new section exists
grep -n "^### Monitoring & Verification" specs/001-base-infrastructure/spec.md
```

**Expected**: Line number where section was added

---

## Step 6: Update plan.md Constitution Check (Critical Fix C3)

**Location**: `specs/001-base-infrastructure/plan.md:28`

### 6.1 View Current Constitution Text

```bash
# Show current constitution check
sed -n '28,35p' specs/001-base-infrastructure/plan.md
```

**Current**: Likely claims "Static-First: ✅ all components pre-rendered, no SSR"

### 6.2 Verify Actual astro.config

```bash
# Check actual output mode
grep "output:" astro.config.mjs
```

**Expected**: `output: 'hybrid'` OR `output: 'server'`

### 6.3 Update Constitution Check

**Change**:
```diff
- ✅ **Static-First Architecture**: All components will be pre-rendered at build time, no SSR
+ ✅ **Hybrid Static-First Architecture**: Pages pre-rendered at build time (static), API routes handled as serverless functions. Uses `output: 'hybrid'` in astro.config.mjs with Vercel adapter. No SSR for regular pages - only dynamic API endpoints in `/api/*` directory.
```

### 6.4 Validate Change

```bash
# Verify updated text mentions "Hybrid" and "/api/*"
grep -A 2 "Static-First" specs/001-base-infrastructure/plan.md | grep -i "hybrid\|api"
```

**Expected**: Output contains "hybrid" and "api"

---

## Step 7: Fix CLAUDE.md Date (Critical Fix C4)

**Location**: `CLAUDE.md:752` (approximately - search for "001-base-infrastructure")

### 7.1 Find Current Entry

```bash
# Search for 001 entry in CLAUDE.md
grep -n "001-base-infrastructure" CLAUDE.md
```

**Current**: Shows `2025-01-14`

### 7.2 Update Date

**Change**:
```diff
- - **001-base-infrastructure** (2025-01-14): Initial project setup...
+ - **001-base-infrastructure** (2025-11-14 to 2025-11-16): Initial project setup...
```

OR (using single merge date):
```diff
- - **001-base-infrastructure** (2025-01-14): Initial project setup...
+ - **001-base-infrastructure** (2025-11-16): Initial project setup...
```

### 7.3 Validate Change

```bash
# Verify correct date
grep "001-base-infrastructure" CLAUDE.md | grep "2025-11-"
```

**Expected**: Output contains `2025-11-16` or `2025-11-14 to 2025-11-16`

---

## Step 8: Update Assumptions Section (Medium Priority M1)

**Location**: `specs/001-base-infrastructure/spec.md:137` (approximately)

### 8.1 Find Assumptions Section

```bash
# Locate assumptions
grep -n "^## Assumptions" specs/001-base-infrastructure/spec.md
```

### 8.2 Update Navigation Assumption

**Find**:
```markdown
- Navigation structure includes Home, About, Courses, and Contact pages (can be configured)
```

**Replace With**:
```markdown
- Navigation structure includes Home page with integrated "About Me" section (anchor #about), plus dedicated Courses and Contact pages. There is no separate /about page; the about content is part of the home page's StatsSection component.
```

### 8.3 Clarify Browser Support Assumption

**Find**:
```markdown
- The site supports modern browsers (last 2 versions of major browsers)
```

**Replace With**:
```markdown
- The site targets modern browsers (last 2 versions of major browsers). Browserslist is not explicitly configured; the project relies on Tailwind and PostCSS defaults (typically: "> 0.5%, last 2 versions, Firefox ESR, not dead").
```

### 8.4 Validate Changes

```bash
# Check updated assumptions
sed -n '/^## Assumptions/,/^## /p' specs/001-base-infrastructure/spec.md | grep -i "about\|browserslist"
```

---

## Step 9: Consolidate Accessibility Requirements (Medium Priority M2)

**Location**: `specs/001-base-infrastructure/spec.md:129-131` (FR-016, FR-017, FR-018)

### 9.1 Identify Duplicate FRs

```bash
# Show current FR-016, FR-017, FR-018
sed -n '129,131p' specs/001-base-infrastructure/spec.md
```

### 9.2 Merge into Single FR-016

**Replace FR-016, FR-017, FR-018 with**:

```markdown
- **FR-016**: Global CSS MUST implement WCAG AA accessibility: focus indicators (2px outline, high contrast ratio ≥3:1 against background), prefers-reduced-motion media query (disable/reduce all animations and transitions), text color contrast ≥4.5:1 for normal text and ≥3:1 for large text (18pt+) *(global.css:29-32 for focus, global.css:43-55 for reduced motion)*
```

**Remove**: Original FR-017 and FR-018 lines

### 9.3 Renumber Following FRs

If FR-019, FR-020 exist, they remain numbered as-is (no renumbering needed - just consolidate 016/017/018).

### 9.4 Validate Consolidation

```bash
# Verify only one accessibility FR
grep -c "^- \*\*FR-016\*\*" specs/001-base-infrastructure/spec.md
grep -c "^- \*\*FR-017\*\*" specs/001-base-infrastructure/spec.md
grep -c "^- \*\*FR-018\*\*" specs/001-base-infrastructure/spec.md
```

**Expected**: 1, 0, 0 (only FR-016 exists)

---

## Step 10: Validation & Review

### 10.1 Final Checklist

Run this validation script to ensure all changes are correct:

```bash
#!/bin/bash

echo "=== Validation Checklist ==="

# 1. Status updated
echo -n "✓ Status shows Completed: "
grep "Status.*Completed (2025-11-16)" specs/001-base-infrastructure/spec.md > /dev/null && echo "YES" || echo "NO"

# 2. Edge cases have answers
echo -n "✓ Edge cases answered (6): "
EDGE_COUNT=$(grep -c "^**[0-9]\. What happens" specs/001-base-infrastructure/spec.md)
[ "$EDGE_COUNT" -eq 6 ] && echo "YES ($EDGE_COUNT)" || echo "NO ($EDGE_COUNT)"

# 3. FRs have code references
echo -n "✓ FR-001 has code ref: "
grep "FR-001.*BaseLayout.astro" specs/001-base-infrastructure/spec.md > /dev/null && echo "YES" || echo "NO"

# 4. Monitoring section exists
echo -n "✓ Monitoring section added: "
grep "^### Monitoring & Verification" specs/001-base-infrastructure/spec.md > /dev/null && echo "YES" || echo "NO"

# 5. Constitution check updated
echo -n "✓ Plan mentions hybrid mode: "
grep -i "hybrid.*api" specs/001-base-infrastructure/plan.md > /dev/null && echo "YES" || echo "NO"

# 6. CLAUDE.md date fixed
echo -n "✓ CLAUDE.md shows 2025-11-: "
grep "001-base-infrastructure.*(2025-11-" CLAUDE.md > /dev/null && echo "YES" || echo "NO"

# 7. Assumptions updated
echo -n "✓ Navigation assumption mentions #about: "
grep "anchor #about" specs/001-base-infrastructure/spec.md > /dev/null && echo "YES" || echo "NO"

# 8. FR consolidation done
echo -n "✓ Only one FR-016 exists: "
FR016_COUNT=$(grep -c "^- \*\*FR-016\*\*" specs/001-base-infrastructure/spec.md)
[ "$FR016_COUNT" -eq 1 ] && echo "YES" || echo "NO (found $FR016_COUNT)"

echo "=== Validation Complete ==="
```

Save as `.specify/scripts/validate-008.sh`, make executable, and run:

```bash
chmod +x .specify/scripts/validate-008.sh
.specify/scripts/validate-008.sh
```

**Expected**: All checks show `YES`

### 10.2 Manual Review

Read updated files to ensure changes make sense:

```bash
# Review spec.md changes
git diff specs/001-base-infrastructure/spec.md | less

# Review plan.md changes
git diff specs/001-base-infrastructure/plan.md | less

# Review CLAUDE.md changes
git diff CLAUDE.md | less
```

**Look For**:
- No typos or grammar errors
- Code references point to valid files
- Dates are consistent (2025-11-16)
- Formatting is correct (markdown renders properly)

---

## Step 11: Commit Changes

### 11.1 Stage Files

```bash
# Stage all updated files
git add specs/001-base-infrastructure/spec.md
git add specs/001-base-infrastructure/plan.md
git add CLAUDE.md

# Verify staged changes
git status
```

**Expected**: 3 files staged for commit

### 11.2 Commit with Message

```bash
git commit -m "$(cat <<'EOF'
docs: align 001-base-infrastructure spec with implementation

Fix 11 inconsistencies between spec and deployed code:
- Update status to Completed (2025-11-16)
- Document 6 edge case answers with code references
- Add code references to FR-001 through FR-020
- Add Monitoring & Verification section for SC-001 to SC-010
- Clarify constitution check regarding hybrid mode
- Fix CLAUDE.md date from 2025-01-14 to 2025-11-16
- Update navigation and browser support assumptions
- Consolidate accessibility requirements into single FR-016

All changes are documentation-only, no code modifications.

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
EOF
)"
```

### 11.3 Verify Commit

```bash
# Show commit details
git log -1 --stat

# Verify commit message
git log -1 --pretty=format:"%B"
```

---

## Step 12: Final Verification

### 12.1 View Updated Spec in Browser

```bash
# If using VS Code with markdown preview
code specs/001-base-infrastructure/spec.md
```

**Check**:
- Status line shows "Completed (2025-11-16)"
- Edge cases section has 6 answered questions (not questions alone)
- FR-001 shows code reference in format `*(BaseLayout.astro:7-12)*`
- Monitoring & Verification section exists with all 10 SC measurement methods

### 12.2 Verify Git History

```bash
# Confirm commit is on branch
git log --oneline -5

# Should show new commit at top
```

---

## Troubleshooting

### Issue: Can't Find Line Numbers

**Problem**: grep/sed commands don't show expected content

**Solution**:
```bash
# Use manual search
less specs/001-base-infrastructure/spec.md
# Press / to search, type "Status", press Enter
```

### Issue: Code Reference Points to Wrong Line

**Problem**: After editing, line numbers shifted

**Solution**:
```bash
# Re-check actual line numbers
grep -n "interface Props" src/layouts/BaseLayout.astro

# Update code reference to match new line numbers
```

### Issue: Git Diff Shows Unexpected Changes

**Problem**: More files changed than intended

**Solution**:
```bash
# Unstage all
git reset

# Stage only intended files
git add specs/001-base-infrastructure/spec.md
git add specs/001-base-infrastructure/plan.md
git add CLAUDE.md

# Verify and commit
git status
git commit -m "..."
```

---

## Success Criteria

You've successfully completed this quickstart when:

✅ spec.md status shows "Completed (2025-11-16)"
✅ All 6 edge cases have documented answers
✅ FR-001 through FR-020 have code references
✅ Monitoring & Verification section added with 10 SC methods
✅ plan.md constitution check mentions hybrid mode
✅ CLAUDE.md shows correct date (2025-11-16 or 2025-11-14 to 2025-11-16)
✅ Navigation assumption mentions #about anchor
✅ Only one FR-016 exists (accessibility consolidated)
✅ All changes committed to git
✅ Validation script shows all checks pass

---

## Next Steps

After completing this quickstart:

1. **Create Pull Request**: `git push origin 008-align-base-infra-docs`
2. **Review PR**: Verify all changes in GitHub PR view
3. **Merge to Master**: After approval, merge PR
4. **Apply to 002**: Use same process for 002-home-page alignment (feature 009)
5. **Apply to 003**: Use same process for 003-home-design-refinement alignment (feature 010)

---

## Reference Materials

- **Research Findings**: `specs/008-align-base-infra-docs/research.md`
- **Data Model**: `specs/008-align-base-infra-docs/data-model.md`
- **Implementation Plan**: `specs/008-align-base-infra-docs/plan.md`
- **Original 001 Spec**: `specs/001-base-infrastructure/spec.md`

**Estimated Total Time**: 45-60 minutes (including validation)
