# Quickstart: Verifying 004-Legal-Pages Documentation Alignment

**Feature**: 007-fix-legal-pages-docs
**Purpose**: Verify that specification documents for 004-legal-pages accurately reflect actual implementation
**Target Files**: specs/004-legal-pages/{spec.md, plan.md, tasks.md, research.md}

---

## Prerequisites

### 1. Git Branch

Ensure you're on the correct branch:

```bash
git branch --show-current
# Should show: 007-fix-legal-pages-docs
```

### 2. Documentation Access

Verify you have access to both feature specs:

```bash
ls specs/004-legal-pages/
# Should show: spec.md, plan.md, tasks.md, research.md, data-model.md, quickstart.md, checklists/, contracts/

ls specs/007-fix-legal-pages-docs/
# Should show: spec.md, plan.md, quickstart.md (this file), checklists/
```

### 3. Implementation Access

Verify you have access to implementation files:

```bash
ls src/pages/privacy-policy.astro src/pages/terms.astro
# Both files should exist

grep "output:" astro.config.mjs
# Should show: output: 'hybrid'
```

---

## Verification Workflow

### Step 1: Critical Issues (C1-C3)

**Goal**: Verify all 3 critical issues are resolved

#### C1: Constitution Violation - Hybrid Mode Documentation

**Issue**: plan.md claims `output: 'static'` but actual codebase uses `output: 'hybrid'`

```bash
# Check actual astro.config.mjs configuration
grep "output:" astro.config.mjs
# Expected: output: 'hybrid'

# Verify plan.md acknowledges hybrid mode for API routes
grep -A 3 "Static-First" specs/004-legal-pages/plan.md | grep -i hybrid
# Expected: Mentions hybrid mode permitted for /api/* routes only
```

**Validation**:
- ✅ plan.md constitution check states "Hybrid mode permitted exclusively for /api/* serverless functions"
- ✅ plan.md references actual astro.config.mjs configuration
- ✅ plan.md clarifies legal pages remain statically generated

#### C2: Missing Table of Contents

**Issue**: spec.md FR-024 requires TOC, tasks.md T003/T010 specify implementing TOC, but not implemented

```bash
# Check if TOC exists in implementation
grep -i "table of contents\|навігац" src/pages/privacy-policy.astro
# Expected: No matches (TOC not implemented)

grep -i "table of contents\|навігац" src/pages/terms.astro
# Expected: No matches (TOC not implemented)

# Verify spec.md either removes FR-024 OR documents TOC exists
grep "FR-024" specs/004-legal-pages/spec.md
# Expected: Either no FR-024 OR FR-024 shows TOC implementation with code reference
```

**Validation** (choose one):
- ✅ **Option A**: FR-024 removed from spec.md, moved to "Out of Scope" section with note "Simple scroll navigation used"
- ✅ **Option B**: FR-024 documents actual TOC implementation (if TOC was added to code)

#### C3: Section Count Mismatch - Privacy Policy

**Issue**: spec.md FR-003 requires 16 privacy sections, implementation has 10 sections

```bash
# Count sections in actual implementation
grep -c "^      <section" src/pages/privacy-policy.astro
# Expected: 10

# Verify spec.md FR-003 documents actual 10-section format
grep "FR-003" specs/004-legal-pages/spec.md
# Expected: Mentions "10 conversational sections" or "10 sections"
```

**Validation**:
- ✅ FR-003 states "Privacy policy MUST include 10 conversational sections" (not 16)
- ✅ research.md documents rationale: "Conversational format combines Ukrainian Law 2297-VI + GDPR requirements into 10 readable sections"

#### C3: Section Count Mismatch - Terms & Conditions

**Issue**: spec.md FR-008 requires 20 terms sections, implementation has 10 sections

```bash
# Count sections in actual implementation
grep -c "^      <section" src/pages/terms.astro
# Expected: 10

# Verify spec.md FR-008 documents actual 10-section format
grep "FR-008" specs/004-legal-pages/spec.md
# Expected: Mentions "10 conversational sections" or "10 sections"
```

**Validation**:
- ✅ FR-008 states "Terms & conditions MUST include 10 conversational sections" (not 20)
- ✅ research.md documents rationale: "User-friendly format combines Ukrainian consumer protection law requirements into 10 accessible sections"

---

### Step 2: High Priority Issues (H1-H5)

**Goal**: Verify all 5 high priority issues are resolved

#### H1: Section Count Mismatch (same as C3)

Already verified in Step 1 (C3).

#### H2: Ambiguous Requirements - "Minimal Luxury Aesthetic"

**Issue**: FR-005 and FR-010 use vague term "minimal luxury aesthetic" without measurable criteria

```bash
# Search for vague aesthetic terminology
grep -i "minimal luxury aesthetic" specs/004-legal-pages/spec.md
# Expected: Either no matches OR replaced with measurable criteria

# Verify measurable criteria exist
grep "Playfair Display\|Inter body\|navy-900\|gold-500" specs/004-legal-pages/spec.md
# Expected: Matches found in FR-005 or FR-010 with specific typography/color criteria
```

**Validation**:
- ✅ FR-005: "Typography: Playfair Display headings (font-serif), Inter body text (font-sans); Colors: navy-900/gold-500/sage-50 palette; Layout: max-width 4xl, leading-relaxed"
- ✅ FR-010: Either consolidated with FR-005 OR has same measurable criteria

#### H3: Missing Responsive Layout Test Task

**Issue**: FR-013 requires responsive footer layout but no dedicated test task

```bash
# Check if validation task exists
grep -i "responsive.*footer\|footer.*responsive" specs/004-legal-pages/tasks.md
# Expected: Task exists validating footer layout breakpoints
```

**Validation**:
- ✅ Task added: "Test footer responsive layout breakpoints: verify vertical stack <640px, horizontal ≥640px"

#### H4: Underspecified Edge Case

**Issue**: Edge case "missing translations" lacks implementation detail

```bash
# Verify edge case has implementation answer
grep -A 3 "missing translations" specs/004-legal-pages/spec.md
# Expected: Answer explaining what happens (build fails, renders with empty content, etc.)
```

**Validation**:
- ✅ Edge case answered: "If content file missing, Astro build fails (static generation error); if text empty, page renders with layout but no content body"

#### H5: Outdated Spec Status

**Issue**: spec.md shows status "Draft" but feature completed 2025-11-17

```bash
# Check git history for completion date
git log --oneline --grep="legal" --grep="004" -i | head -5
# Expected: Commit d7b17fd dated 2025-11-17

# Verify spec.md status field
grep "^**Status**:" specs/004-legal-pages/spec.md
# Expected: "Completed (2025-11-17)" not "Draft"
```

**Validation**:
- ✅ spec.md status shows: `**Status**: Completed (2025-11-17)`

---

### Step 3: Medium Priority Issues (M1-M4)

**Goal**: Verify all 4 medium priority issues are resolved

#### M1: Duplicate Requirements - FR-004/FR-009 Responsive

**Issue**: FR-004 and FR-009 both state "responsive on mobile (375px), tablet (768px), desktop (1920px+)" verbatim

```bash
# Count instances of duplicate responsive requirement
grep -c "responsive on mobile (375px)" specs/004-legal-pages/spec.md
# Expected: 1 (not 2)
```

**Validation**:
- ✅ FR-004 becomes: "Both legal pages MUST be responsive on mobile (375px), tablet (768px), desktop (1920px+)"
- ✅ FR-009 removed (duplicate eliminated)

#### M2: Terminology Drift - Header/Footer Variant

**Issue**: spec.md mentions "legal navigation variant" but doesn't define what it means functionally

```bash
# Search for variant documentation in functional requirements
grep -i "variant.*legal\|legal.*variant" specs/004-legal-pages/spec.md | grep -c "FR-"
# Expected: At least 1 (new FR-025 added)
```

**Validation**:
- ✅ FR-025 added: "Legal pages MUST use Header variant='legal' (simplified menu: Home, Privacy, Terms) and Footer variant='legal' (no CTA section)"

#### M3: Missing Section Completeness Validation Task

**Issue**: FR-003 lists required sections but no task validates all are present

```bash
# Check if validation task exists
grep -i "validate.*section\|section.*validate" specs/004-legal-pages/tasks.md
# Expected: Task exists checking all documented sections are present
```

**Validation**:
- ✅ Task added: "Validate all documented sections are present in privacy-policy.astro and terms.astro against updated FR-003 and FR-008"

#### M4: Missing "Last Updated" Date Format

**Issue**: FR-023 requires date but doesn't specify format (ISO 8601? Ukrainian locale?)

```bash
# Verify FR-023 specifies date format
grep "FR-023" specs/004-legal-pages/spec.md
# Expected: Specific format mentioned (e.g., "Ukrainian locale format")
```

**Validation**:
- ✅ FR-023 specifies: "MUST use Ukrainian locale format: 'Останнє оновлення: 17 листопада 2025 р.'"

---

### Step 4: Low Priority Issues (L1-L2)

**Goal**: Verify all 2 low priority issues are resolved

#### L1: Wording Inconsistency - FR-001 to FR-003

**Issue**: FR-001 starts with "System MUST provide route" while FR-002/FR-003 start with "Privacy policy MUST"

```bash
# Check FR-001 to FR-003 wording consistency
grep -E "FR-00[1-3]" specs/004-legal-pages/spec.md | head -3
# Expected: All start with "Privacy policy page MUST..." or similar consistent pattern
```

**Validation**:
- ✅ All FR-001 to FR-003 standardized to: "Privacy policy page MUST..."

#### L2: Overly Verbose Task Descriptions

**Issue**: T002 lists all 16 sections in parentheses (150+ characters)

```bash
# Check T002 description length
grep "T002" specs/004-legal-pages/tasks.md
# Expected: Concise description without full section list in parentheses
```

**Validation**:
- ✅ T002 simplified to: "Add Ukrainian privacy policy content with 10 sections per updated research.md"

---

### Step 5: Coverage & Validation (FR-018 to FR-021)

**Goal**: Verify requirement-to-task mapping and validation completeness

#### FR-018: All Requirements Have Tasks

```bash
# Count functional requirements
grep -c "^- \*\*FR-" specs/004-legal-pages/spec.md
# Expected: 24 or 25 (after adding FR-025)

# Count tasks
grep -c "^\- \[ \] T" specs/004-legal-pages/tasks.md
# Expected: Similar count OR requirements without tasks are in "Out of Scope"
```

**Validation**:
- ✅ All requirements mapped to tasks OR explicitly documented in "Out of Scope" section

#### FR-019: All Tasks Map to Requirements

```bash
# Extract task IDs
grep -o "T[0-9]\{3\}" specs/004-legal-pages/tasks.md | sort -u | wc -l
# Compare with functional requirement count

# Verify no orphan tasks (tasks without FR reference)
```

**Validation**:
- ✅ Each task references at least one FR or US (User Story) from spec.md

#### FR-020: Technology-Agnostic Success Criteria

```bash
# Search for technology-specific terms in success criteria
grep -E "SC-00[0-9]" specs/004-legal-pages/spec.md | grep -i "astro\|react\|tailwind\|typescript"
# Expected: Zero matches (no implementation details in success criteria)
```

**Validation**:
- ✅ SC-001 to SC-010 describe outcomes, not implementations (e.g., "pages load in <2s" not "Astro pre-renders pages")

#### FR-021: All Clarification Markers Resolved

```bash
# Search for unresolved clarifications
grep -i "NEEDS CLARIFICATION" specs/004-legal-pages/spec.md
# Expected: Zero matches
```

**Validation**:
- ✅ No [NEEDS CLARIFICATION] markers remain in spec.md

---

### Step 6: Monitoring & Verification Section

**Goal**: Verify success criteria have documented measurement methods

```bash
# Check if Monitoring section exists
grep -i "Monitoring.*Verification\|How to measure" specs/004-legal-pages/spec.md
# Expected: Section found with table or list documenting measurement methods
```

**Validation**:
- ✅ Section added with table showing:
  - Criterion | How to Measure | Tool/Location
  - SC-001 | Check Vercel function logs | Vercel Dashboard
  - SC-002 | Check responsive layout | Browser DevTools
  - etc.

---

### Step 7: Cross-Document Link Validation

**Goal**: Verify all markdown links work in GitHub preview

#### Extract All Markdown Links

```bash
# Extract all markdown links from spec.md
grep -oP '\[.*?\]\(.*?\)' specs/004-legal-pages/spec.md
```

**Manual validation**:
1. Open spec.md in GitHub web interface (or local markdown preview)
2. Click each `[link](./file.md)` reference
3. Verify:
   - ✅ Relative links resolve correctly
   - ✅ Anchor links (e.g., `#validation-rules-summary`) jump to correct section
   - ✅ No 404 errors

**Common link patterns to verify**:
- `[data-model.md](./data-model.md)`
- `[research.md](./research.md)`
- `[quickstart.md](./quickstart.md)`

---

## Manual Review Checklist

After automated verification, manually review these items:

### Critical Issues
- [ ] **C1**: plan.md constitution check acknowledges hybrid mode for /api/* routes only
- [ ] **C2**: FR-024 removed OR TOC documented as implemented with code reference
- [ ] **C3**: FR-003 states "10 conversational sections", FR-008 states "10 conversational sections"

### High Priority Issues
- [ ] **H1**: Same as C3 (section count)
- [ ] **H2**: FR-005/FR-010 replaced with measurable typography/color criteria
- [ ] **H3**: Responsive footer layout test task added
- [ ] **H4**: "Missing translations" edge case has implementation answer
- [ ] **H5**: spec.md status shows "Completed (2025-11-17)"

### Medium Priority Issues
- [ ] **M1**: FR-004/FR-009 consolidated (no duplication)
- [ ] **M2**: FR-025 added documenting Header/Footer variant behavior
- [ ] **M3**: Section completeness validation task added
- [ ] **M4**: FR-023 specifies Ukrainian locale date format

### Low Priority Issues
- [ ] **L1**: FR-001 to FR-003 wording standardized
- [ ] **L2**: Task descriptions concise (no 150+ char lists)

### Coverage & Validation
- [ ] **FR-018**: All 24-25 requirements mapped to tasks OR in "Out of Scope"
- [ ] **FR-019**: All tasks reference at least one FR or US
- [ ] **FR-020**: SC-001 to SC-010 have zero mentions of Astro/React/Tailwind
- [ ] **FR-021**: Zero [NEEDS CLARIFICATION] markers

### Monitoring
- [ ] **Monitoring section**: Table with SC-001 to SC-010 measurement methods

### Links
- [ ] **All markdown links**: Work in GitHub preview (no 404 errors)

---

## Final Validation Commands

Run these commands to verify all changes:

```bash
# Count sections (should be 10 each)
grep -c "^      <section" src/pages/privacy-policy.astro
grep -c "^      <section" src/pages/terms.astro

# Verify spec.md section count claims
grep "10 conversational sections" specs/004-legal-pages/spec.md

# Verify no duplicate responsive requirements
grep -c "responsive on mobile (375px)" specs/004-legal-pages/spec.md
# Expected: 1

# Verify measurable aesthetic criteria
grep "Playfair Display headings" specs/004-legal-pages/spec.md
# Expected: Match found

# Verify status updated
grep "^**Status**:" specs/004-legal-pages/spec.md
# Expected: "Completed (2025-11-17)"

# Verify no NEEDS CLARIFICATION markers
grep -c "NEEDS CLARIFICATION" specs/004-legal-pages/spec.md
# Expected: 0

# Verify FR-025 exists (variant documentation)
grep "FR-025" specs/004-legal-pages/spec.md
# Expected: Match found
```

---

## Troubleshooting

### Issue: grep returns "minimal luxury aesthetic" matches

**Cause**: Ambiguous requirement not replaced

**Solution**:
1. Find exact FR number: `grep -n "minimal luxury aesthetic" specs/004-legal-pages/spec.md`
2. Replace with measurable criteria: "Typography: Playfair Display headings, Inter body; Colors: navy-900/gold-500/sage-50"
3. Re-run verification

### Issue: Section count mismatch (expected 10, got different number)

**Cause**: Implementation changed OR counting wrong elements

**Solution**:
1. Open privacy-policy.astro or terms.astro in editor
2. Manually count `<section>` tags
3. Update spec.md FR-003/FR-008 to match actual count
4. Document rationale in research.md

### Issue: Markdown link returns 404 in GitHub preview

**Cause**: Incorrect relative path or missing anchor

**Solution**:
1. Verify target file exists: `ls specs/004-legal-pages/[target-file].md`
2. Check anchor exists: `grep "## Target Section" specs/004-legal-pages/[file].md`
3. Fix relative path: same directory uses `./file.md`, parent uses `../file.md`

### Issue: Duplicate requirements still exist

**Cause**: FR not fully consolidated

**Solution**:
1. Identify duplicate: `grep -n "responsive on mobile" specs/004-legal-pages/spec.md`
2. Keep better version (more complete, clearer wording)
3. Remove duplicate entirely (not just mark as duplicate)
4. Update task references to point to consolidated FR

---

## Git Workflow

After all verifications pass:

```bash
# Stage documentation changes
git add specs/004-legal-pages/

# Commit with descriptive message
git commit -m "docs: align 004-legal-pages specs with implementation

- Fix plan.md constitution check: acknowledge hybrid mode for API routes
- Update spec.md section counts: document actual 10-section format
- Remove/descope FR-024: table of contents not implemented
- Replace FR-005/FR-010: measurable typography/color criteria
- Add FR-025: document Header/Footer variant behavior
- Consolidate FR-004/FR-009: remove duplicate responsive requirements
- Update spec.md status: Completed (2025-11-17)
- Add Monitoring & Verification section
- Standardize FR wording for consistency

All changes align spec documents with implemented behavior in
src/pages/privacy-policy.astro and src/pages/terms.astro (no code changes).

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Verify commit
git log -1 --stat
```

---

## Success Criteria Verification

Use this checklist to verify all success criteria from feature 007 spec:

- [ ] **SC-001**: 100% of critical issues (C1-C3) resolved
- [ ] **SC-002**: 100% of high priority issues (H1-H5) resolved
- [ ] **SC-003**: Zero duplicate requirements (FR-004/FR-009 consolidated)
- [ ] **SC-004**: 100% requirement-to-task mapping OR "Out of Scope" documented
- [ ] **SC-005**: All SC-001 to SC-010 have documented measurement methods
- [ ] **SC-006**: Constitution compliance accurately documented (hybrid mode for API routes)
- [ ] **SC-007**: Spec status reflects reality ("Completed (2025-11-17)")
- [ ] **SC-008**: All claims verifiable (can cross-reference every statement against code)
- [ ] **SC-009**: All ambiguous requirements replaced with testable criteria
- [ ] **SC-010**: Terminology consistency (zero undefined terms, all behaviors documented)

**All checked**: ✅ Documentation alignment complete!

---

**Status**: Ready for task execution via `/speckit.tasks`
