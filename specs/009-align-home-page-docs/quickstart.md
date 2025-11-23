# Quickstart Guide: Align Home Page Documentation

**Feature**: 009-align-home-page-docs | **Date**: 2025-11-23 | **Phase**: 1 (Design)

## Overview

This guide provides step-by-step instructions for validating documentation alignment for feature 002-home-page. Since this is a documentation-only feature, the "quickstart" focuses on VERIFICATION (checking that spec matches implementation) rather than development.

**Time Estimate**: 30-45 minutes for full validation

---

## Prerequisites

Before starting validation, ensure you have:

1. **Repository Access**:
   - Git repository cloned: `git clone [repo-url]`
   - Feature branch checked out: `git checkout 009-align-home-page-docs`
   - Working directory: `/Users/[user]/path/to/zhulova`

2. **File Editor**:
   - VS Code, Cursor, or any text editor with markdown support
   - Ability to read TypeScript/React code (for code reference verification)

3. **Git History Access**:
   - Ability to run `git log` commands
   - Permission to view commit history for feature 002

4. **Documentation Files**:
   - `specs/002-home-page/spec.md` (primary target)
   - `specs/002-home-page/plan.md` (secondary target)
   - `specs/002-home-page/data-model.md` (tertiary target)
   - `CLAUDE.md` (quaternary target)

5. **Implementation Files** (read-only reference):
   - `src/components/forms/ConsultationModal.tsx`
   - `src/pages/api/submit-lead.ts`
   - `src/schemas/consultationSchema.ts`

---

## Setup Steps

### Step 1: Verify Git Status

```bash
# Check current branch
git branch --show-current
# Expected output: 009-align-home-page-docs

# Check for uncommitted changes
git status
# Expected: Clean working directory OR only changes to specs/002-home-page/
```

**Success**: On correct branch with clean or documentation-only changes
**Failure**: Wrong branch → `git checkout 009-align-home-page-docs`

---

### Step 2: Locate Target Files

```bash
# Verify all target documentation files exist
ls -la specs/002-home-page/spec.md
ls -la specs/002-home-page/plan.md
ls -la specs/002-home-page/data-model.md
ls -la CLAUDE.md

# Verify implementation files exist (for code reference validation)
ls -la src/components/forms/ConsultationModal.tsx
ls -la src/pages/api/submit-lead.ts
ls -la src/schemas/consultationSchema.ts
```

**Success**: All files exist
**Failure**: Missing file → `git pull origin main` and retry

---

### Step 3: Get Feature 002 Completion Date from Git

```bash
# Find merge commit for feature 002-home-page
git log --grep="002-home-page" --oneline --date=short | head -5

# Check recent commits around Nov 2025
git log --since="2025-11-01" --until="2025-11-30" --oneline --date=short | grep -i "home"
```

**Expected Output**: Commit dated 2025-11-16 (or similar)
**Action**: Note exact completion date for spec.md status field

---

## Verification Steps

### Verification 1: Status Field Accuracy (R1)

**File**: `specs/002-home-page/spec.md` line 5

**Check**:
1. Open `specs/002-home-page/spec.md`
2. Find line 5: `**Status**: [value]`
3. Verify value is `Completed (2025-11-16)` NOT `Draft`

**Validation Command**:
```bash
# Check current status field
grep "Status:" specs/002-home-page/spec.md | head -1
# Expected: **Status**: Completed (2025-11-16)
```

**Success**: Status shows "Completed (2025-11-16)"
**Failure**: Status shows "Draft" → Update required (use Edit tool)

---

### Verification 2: Creation Date Accuracy (R2)

**File**: `specs/002-home-page/spec.md` line 4

**Check**:
1. Find line 4: `**Created**: [date]`
2. Verify date is `2025-11-16` NOT `2025-01-16` (typo check: month 11 not 01)

**Validation Command**:
```bash
# Check creation date
grep "Created:" specs/002-home-page/spec.md | head -1
# Expected: **Created**: 2025-11-16
```

**Success**: Date is 2025-11-16
**Failure**: Date is 2025-01-16 → Typo fix required

---

### Verification 3: Edge Cases Have Answers (R3)

**File**: `specs/002-home-page/spec.md` lines ~111-180

**Check**:
1. Locate "Edge Cases" section (around line 111)
2. Verify 6 edge cases follow Q&A format:
   - Q1: Network connection loss
   - Q2: Duplicate requests
   - Q3: Email service unavailable
   - Q4: International phone numbers
   - Q5: Multiple submissions (rate limiting)
   - Q6: JavaScript disabled
3. Each edge case MUST have:
   - `**Answer**:` line with documented behavior
   - `**Code**:` line with file:line reference
   - `**Behavior**:` line with additional context

**Validation Command**:
```bash
# Check if edge cases have answers
grep -A 3 "^**Q[1-6]:" specs/002-home-page/spec.md | grep -c "**Answer**:"
# Expected: 6 (one answer per question)

# Check if code references exist
grep -A 3 "^**Q[1-6]:" specs/002-home-page/spec.md | grep -c "**Code**:"
# Expected: 6 (one code reference per question)
```

**Success**: All 6 edge cases have Answer + Code + Behavior
**Failure**: Questions without answers → Update required

---

### Verification 4: Functional Requirements Have Code References (R5)

**File**: `specs/002-home-page/spec.md` lines ~136-220

**Check**:
1. Locate "Functional Requirements" section (around line 136)
2. Count total FRs: should be FR-001 through FR-020+
3. Each FR MUST end with code reference in format `*(file.ext:line-numbers)*`

**Validation Script**:
```bash
# Count functional requirements
grep -c "^- \*\*FR-" specs/002-home-page/spec.md
# Expected: 20+ requirements

# Check how many have code references (should match FR count)
grep "^- \*\*FR-" specs/002-home-page/spec.md | grep -c "(.*\..*:.*)"
# Expected: Same number as FR count
```

**Success**: All FRs have code references
**Failure**: Some FRs missing references → Update required

**Manual Spot Check**:
- Open `specs/002-home-page/spec.md`
- Find FR-001, FR-005, FR-008, FR-010
- Verify each ends with `*(file.ext:line)` pattern

---

### Verification 5: Code References Point to Existing Lines (R12)

**File**: `specs/002-home-page/spec.md` (all code references)

**Check**:
1. Extract all code references from spec.md
2. For each reference, verify:
   - File exists
   - Line numbers are within file bounds
   - Referenced code is relevant to requirement

**Validation Script**:
```bash
# Extract all code references
grep -oP '\([a-zA-Z0-9/._-]+\.[a-z]+:\d+(-\d+)?\)' specs/002-home-page/spec.md | sort | uniq

# For each reference, check file exists
# Example: (ConsultationModal.tsx:25-56)
ls -la src/components/forms/ConsultationModal.tsx
# Expected: File exists

# Check line count
wc -l src/components/forms/ConsultationModal.tsx
# Expected: Line count >= 56 (highest referenced line)
```

**Manual Validation** (sample 3-5 references):
1. Pick a code reference: `(submit-lead.ts:110-114)`
2. Open file: `src/pages/api/submit-lead.ts`
3. Go to lines 110-114
4. Verify code relates to requirement (e.g., Supabase insert for FR-008)

**Success**: All code references valid
**Failure**: Invalid reference → Update required

---

### Verification 6: Success Criteria Have Measurement Methods (R6)

**File**: `specs/002-home-page/spec.md` lines ~245-300

**Check**:
1. Locate "Success Criteria" section (around line 245)
2. Count total success criteria: SC-001 through SC-010
3. Locate "Monitoring & Verification" section (should appear after Success Criteria)
4. Verify each SC-XXX has measurement method in format:
   - `**SC-XXX**: Tool: [Tool Name] | Method: [Step-by-step]`

**Validation Command**:
```bash
# Count success criteria
grep -c "^- \*\*SC-" specs/002-home-page/spec.md
# Expected: 10 criteria

# Check if Monitoring & Verification section exists
grep -c "Monitoring & Verification" specs/002-home-page/spec.md
# Expected: 1 (section exists)

# Count measurement methods
grep -c "^- \*\*SC-.*Tool:" specs/002-home-page/spec.md
# Expected: 10 (one per success criterion)
```

**Success**: All 10 success criteria have measurement methods
**Failure**: Missing Monitoring section OR incomplete methods → Update required

---

### Verification 7: CLAUDE.md Completion Date Matches Git (R4)

**File**: `CLAUDE.md` line ~753

**Check**:
1. Open `CLAUDE.md`
2. Find "Recent Changes" section
3. Locate "002-home-page" entry
4. Verify date matches git log (should be 2025-11-16)
5. Verify status clarity (should be clear if 100% complete or partial)

**Validation Command**:
```bash
# Find 002-home-page entry in CLAUDE.md
grep -n "002-home-page" CLAUDE.md
# Expected: Line number around 753

# Check date format
grep "002-home-page" CLAUDE.md | grep -oP '\d{4}-\d{2}-\d{2}'
# Expected: 2025-11-16
```

**Success**: Date is 2025-11-16 and status is clear
**Failure**: Wrong date OR confusing status → Update required

---

### Verification 8: Plan.md Constitution Check Server Mode (R8)

**File**: `specs/002-home-page/plan.md` lines ~28-40

**Check**:
1. Open `specs/002-home-page/plan.md`
2. Locate "Constitution Check" section
3. Find "Static-First Architecture" or "Static-First Delivery" principle
4. Verify it explains WHY server mode is OK for /api/submit-lead

**Expected Text** (similar to):
```markdown
- ✅ **Static-First Delivery**: Server mode permitted exclusively for /api/*
  serverless functions; all pages remain pre-rendered static at build time
```

**Validation Command**:
```bash
# Check if server mode is mentioned in constitution check
grep -A 2 "Static-First" specs/002-home-page/plan.md | grep -i "server"
# Expected: Contains "server mode" or "serverless functions"
```

**Success**: Constitution check explains server mode
**Failure**: No explanation → Update required

---

### Verification 9: Data Model No Duplicate Validation Rules (R10)

**File**: `specs/002-home-page/data-model.md`

**Check**:
1. Open `specs/002-home-page/data-model.md`
2. Locate "Lead" entity definition (should have field descriptions with inline validation)
3. Search for separate "Validation Rules" section
4. Verify validation rules appear ONLY in entity field descriptions, NOT duplicated

**Validation Command**:
```bash
# Check if duplicate "Validation Rules" section exists
grep -c "## Validation Rules" specs/002-home-page/data-model.md
# Expected: 0 (no separate section)

# Check if validation is inline in entity fields
grep -A 20 "## Entity 1: Lead" specs/002-home-page/data-model.md | grep -c "validation"
# Expected: >0 (validation in field descriptions)
```

**Success**: Validation rules inline only, no duplicate section
**Failure**: Duplicate section exists → Consolidation required

---

### Verification 10: Tasks.md File Exists (R7)

**File**: `specs/002-home-page/tasks.md`

**Check**:
1. Verify file exists: `ls -la specs/002-home-page/tasks.md`
2. Open file and check it has:
   - Feature name and date
   - Phase breakdown (Phase 1, Phase 2, etc.)
   - Task list with T001-T0XX format
   - Completion status markers [x] or [ ]

**Validation Command**:
```bash
# Check if file exists
ls -la specs/002-home-page/tasks.md
# Expected: File exists

# Check task format
grep -c "^- \[.\] T\d\{3\}" specs/002-home-page/tasks.md
# Expected: >40 tasks (reasonable task count)
```

**Success**: tasks.md exists with proper structure
**Failure**: File missing → Create required (retroactive documentation)

---

## Troubleshooting

### Issue 1: Code Reference Points to Wrong Line Numbers

**Symptom**: Code reference `(file.ext:XX-YY)` but code has moved

**Cause**: Implementation changed after spec was written

**Solution**:
1. Open implementation file
2. Find correct line numbers for relevant code
3. Update code reference in spec.md
4. Document change in commit message

---

### Issue 2: Edge Case Behavior Unclear from Code

**Symptom**: Can't determine edge case behavior by reading code

**Cause**: Behavior is implicit or spread across multiple files

**Solution**:
1. Test actual behavior (run app locally, trigger edge case)
2. Document observed behavior in spec
3. Add code references to all relevant files
4. If behavior is problematic, add to "Future Enhancements" section

---

### Issue 3: Success Criterion Not Measurable

**Symptom**: SC-XXX doesn't specify HOW to measure

**Cause**: Original spec used vague success criteria

**Solution**:
1. Identify specific tool for measurement (Chrome DevTools, Lighthouse, etc.)
2. Write step-by-step measurement method
3. Make method actionable for QA engineer
4. Update Monitoring & Verification section

---

### Issue 4: Git Log Doesn't Show Clear Completion Date

**Symptom**: Multiple commits for feature 002, unclear which is "completion"

**Cause**: Feature completed incrementally

**Solution**:
1. Look for merge commit to main branch
2. Check CLAUDE.md Recent Changes for documented date
3. Use most recent significant commit date
4. Document decision in spec assumptions

---

## Validation Checklist

After completing all verification steps, check:

- [ ] spec.md status is "Completed (2025-11-16)" NOT "Draft"
- [ ] spec.md created date is "2025-11-16" NOT "2025-01-16"
- [ ] All 6 edge cases have Answer + Code + Behavior
- [ ] All 20+ functional requirements have code references
- [ ] All code references point to existing files and valid line numbers
- [ ] Monitoring & Verification section exists with 10 measurement methods
- [ ] CLAUDE.md shows correct date (2025-11-16) and clear status
- [ ] plan.md constitution check explains server mode
- [ ] data-model.md has NO duplicate validation rules
- [ ] tasks.md file exists with proper task structure
- [ ] Zero [NEEDS CLARIFICATION] markers remain
- [ ] All documentation changes committed to git

---

## Success Criteria

Documentation alignment is considered SUCCESSFUL when:

1. **Accuracy**: Spec reflects actual implementation (no aspirational claims)
2. **Completeness**: All mandatory sections filled (no missing data)
3. **Traceability**: All requirements traceable to code (code references valid)
4. **Consistency**: Same documentation pattern as other features (001, 003-008)
5. **Maintainability**: Easy to update when code changes (clear structure)

---

## Next Steps

After validation complete:
1. Commit all documentation changes: `git add specs/002-home-page/ CLAUDE.md`
2. Create commit: `git commit -m "docs: align 002-home-page spec with implementation"`
3. Push to remote: `git push origin 009-align-home-page-docs`
4. Create pull request with summary of documentation updates
5. Request review from PM/Tech Lead
6. Merge to main after approval

---

## Reference Commands

**Quick validation script** (run all checks):
```bash
#!/bin/bash
echo "=== Validation Report ==="

echo "1. Status field:"
grep "Status:" specs/002-home-page/spec.md | head -1

echo "2. Created date:"
grep "Created:" specs/002-home-page/spec.md | head -1

echo "3. Edge case answers:"
grep -c "**Answer**:" specs/002-home-page/spec.md

echo "4. Functional requirements:"
grep -c "^- \*\*FR-" specs/002-home-page/spec.md

echo "5. Code references:"
grep "^- \*\*FR-" specs/002-home-page/spec.md | grep -c "(.*\..*:.*)"

echo "6. Success criteria:"
grep -c "^- \*\*SC-" specs/002-home-page/spec.md

echo "7. Measurement methods:"
grep -c "^- \*\*SC-.*Tool:" specs/002-home-page/spec.md

echo "8. Tasks file:"
ls -la specs/002-home-page/tasks.md 2>/dev/null || echo "MISSING"

echo "=== End Report ==="
```

Save as `.specify/scripts/bash/validate-docs.sh` and run: `bash .specify/scripts/bash/validate-docs.sh`
