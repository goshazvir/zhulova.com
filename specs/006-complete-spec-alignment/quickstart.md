# Quickstart: Verifying Documentation Alignment

**Feature**: 006-complete-spec-alignment
**Purpose**: Verify that specification documents accurately reflect implementation for feature 005-fix-consultation-api

---

## Prerequisites

### 1. Git Branch

Ensure you're on the correct branch:

```bash
git branch --show-current
# Should show: 006-complete-spec-alignment or 005-fix-consultation-api
```

### 2. Documentation Access

Verify you have access to spec documents:

```bash
ls specs/005-fix-consultation-api/
# Should show: spec.md, data-model.md, research.md, plan.md, tasks.md, quickstart.md, contracts/
```

---

## Verification Workflow

### Step 1: Edge Cases Documentation

**Goal**: Verify all 6 edge cases have answers with code references

```bash
grep -A 5 "### Edge Cases" specs/005-fix-consultation-api/spec.md
```

**Expected**:
- ✅ Duplicate submissions: Documented behavior + rationale
- ✅ Network failures: Documented error handling
- ✅ Supabase down: Email-first strategy explained
- ✅ Email fails: Documented as impossible (email-first)
- ✅ Special characters: Zod validation explained
- ✅ Missing metadata: NULL fallback documented

**Validation**: Each edge case should reference specific code lines in `src/pages/api/submit-lead.ts`

---

### Step 2: Terminology Standardization

**Goal**: Verify "lead" used consistently (zero "consultation request" instances)

```bash
grep -r "consultation request" specs/005-fix-consultation-api/
```

**Expected**: Zero results (command returns empty)

**Files to check**:
- spec.md
- data-model.md
- tasks.md
- quickstart.md
- plan.md

**Exception**: Git commit messages and historical references may contain old terminology (acceptable)

---

### Step 3: FR-010 Timestamp Requirement

**Goal**: Verify email timestamp requirement matches implementation

**Check spec.md**:
```bash
grep -A 2 "FR-010" specs/005-fix-consultation-api/spec.md
```

**Expected**: One of these states:
- ✅ **Option A**: FR-010 removed entirely (timestamp not implemented)
- ✅ **Option B**: FR-010 marked as future enhancement with note
- ✅ **Option C**: FR-010 updated to state "email notification contains: name, phone, telegram, email, source (no timestamp)"

**Validation**: Check `src/pages/api/submit-lead.ts` lines 64-71 - no timestamp in email HTML

---

### Step 4: SC-006 Duplicate Tracking

**Goal**: Verify duplicate tracking claim matches implementation

**Check spec.md**:
```bash
grep -A 2 "SC-006" specs/005-fix-consultation-api/spec.md
```

**Expected**: One of these states:
- ✅ **Option A**: SC-006 removed entirely (duplicate tracking not implemented)
- ✅ **Option B**: SC-006 moved to "Future Enhancements" section
- ✅ **Option C**: SC-006 marked as "(Not implemented in MVP)"

**Validation**: Search `src/pages/api/submit-lead.ts` for "duplicate" - should return zero results

---

### Step 5: Validation Rules Consolidation

**Goal**: Verify spec.md references data-model.md (no duplication)

**Check spec.md FR-001 to FR-006**:
```bash
grep -A 1 "FR-00[1-6]" specs/005-fix-consultation-api/spec.md
```

**Expected**: One of these patterns:
- ✅ **Option A**: FR-001 to FR-006 replaced with single reference: "Field validation requirements documented in [data-model.md](./data-model.md#validation-rules-summary)"
- ✅ **Option B**: Each FR-00X contains link to data-model.md section instead of duplicating validation details

**Validation**: Validation details should exist in ONE place only (data-model.md lines 278-286)

---

### Step 6: RESEND_FROM_EMAIL Configuration

**Goal**: Verify environment variable correctly marked as required

**Check quickstart.md**:
```bash
grep -A 5 "RESEND_FROM_EMAIL" specs/005-fix-consultation-api/quickstart.md
```

**Expected**:
```bash
RESEND_FROM_EMAIL=noreply@zhulova.com  # Required for email notifications
```

**NOT**:
```bash
RESEND_FROM_EMAIL=noreply@zhulova.com  # Optional
```

**Validation**: Check `src/pages/api/submit-lead.ts` lines 45-47 - code throws error if not set

---

### Step 7: Monitoring Verification Strategy

**Goal**: Verify success criteria have documented measurement methods

**Check spec.md or quickstart.md for monitoring section**:
```bash
grep -A 10 "Monitoring" specs/005-fix-consultation-api/spec.md
```

**Expected**: Table or list documenting how to verify each success criterion:

| Criterion | How to Measure | Tool/Location |
|-----------|----------------|---------------|
| SC-001: 100% DB saves | Check Vercel function logs for errors | Vercel Dashboard → Functions → Logs |
| SC-002: Email <5 seconds | Check Resend email delivery times | Resend Dashboard → Emails |
| SC-003: Validation errors | Monitor error responses in logs | Vercel Logs → 400 status codes |
| SC-004: Zero data loss | Audit DB records vs function calls | Supabase + Vercel logs comparison |
| SC-005: API <2 seconds | Check p95 response times | Vercel Speed Insights |

---

### Step 8: Cross-Document Link Validation

**Goal**: Verify all markdown links work in GitHub preview

**Extract all markdown links**:
```bash
grep -oP '\[.*?\]\(.*?\)' specs/005-fix-consultation-api/spec.md
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
- `[validation rules](./data-model.md#validation-rules-summary)`

---

## Manual Review Checklist

After automated verification, manually review these items:

- [ ] **Edge Cases**: All 6 questions have answers (not just questions)
- [ ] **FR-010**: Timestamp requirement removed OR marked future OR updated to match code
- [ ] **SC-006**: Duplicate tracking removed OR marked not implemented
- [ ] **Validation Duplication**: spec.md FR-001 to FR-006 reference data-model.md (no full duplication)
- [ ] **Terminology**: Zero instances of "consultation request" in docs
- [ ] **Monitoring**: Success criteria have measurement strategy documented
- [ ] **RESEND_FROM_EMAIL**: Marked as required in quickstart.md
- [ ] **Links**: All cross-document references work in GitHub markdown preview

---

## Final Validation

Compare documentation against success criteria from `specs/006-complete-spec-alignment/spec.md`:

```bash
# SC-001: All 6 edge cases have answers
grep -c "^[0-9]\. \*\*" specs/005-fix-consultation-api/spec.md
# Expected: 6 (one for each edge case)

# SC-004: Zero "consultation request" instances
grep -c "consultation request" specs/005-fix-consultation-api/*.md
# Expected: 0

# SC-006: RESEND_FROM_EMAIL marked required
grep "RESEND_FROM_EMAIL.*Required" specs/005-fix-consultation-api/quickstart.md
# Expected: Match found
```

---

## Troubleshooting

### Issue: grep returns "consultation request" matches

**Cause**: Terminology not fully standardized

**Solution**:
1. Check which file contains matches: `grep -l "consultation request" specs/005-fix-consultation-api/*.md`
2. Open file and replace with "lead"
3. Re-run verification

### Issue: Edge case still shows question without answer

**Cause**: Edge case section not updated

**Solution**:
1. Open `specs/005-fix-consultation-api/spec.md`
2. Find edge case question
3. Replace question with documented behavior from `specs/006-complete-spec-alignment/spec.md` lines 89-142

### Issue: Link returns 404 in GitHub preview

**Cause**: Incorrect relative path or missing anchor

**Solution**:
1. Verify target file exists: `ls specs/005-fix-consultation-api/[target-file].md`
2. Check anchor exists: `grep "## Target Section" specs/005-fix-consultation-api/[file].md`
3. Fix relative path: same directory uses `./file.md`, parent uses `../file.md`

---

## Git Workflow

After all verifications pass:

```bash
# Stage documentation changes
git add specs/005-fix-consultation-api/

# Commit with descriptive message
git commit -m "docs: complete spec alignment for 005-fix-consultation-api

- Document all 6 edge case behaviors with code references
- Remove/update FR-010 (timestamp) and SC-006 (duplicate tracking)
- Consolidate validation rules to data-model.md
- Standardize terminology to 'lead'
- Add monitoring verification strategy
- Mark RESEND_FROM_EMAIL as required

All changes align spec documents with implemented behavior in
src/pages/api/submit-lead.ts (no code changes).

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>"

# Push to feature branch
git push origin 006-complete-spec-alignment
```

---

## Success Criteria Verification

Use this checklist to verify all success criteria from feature 006 spec:

- [ ] **SC-001**: All 6 edge case questions have documented answers with code references
- [ ] **SC-002**: Zero functional requirements claim unimplemented features (FR-010, SC-006 fixed)
- [ ] **SC-003**: Zero validation rule duplication (spec.md references data-model.md)
- [ ] **SC-004**: 100% terminology consistency (zero "consultation request" instances)
- [ ] **SC-005**: All 5 success criteria have documented monitoring verification strategy
- [ ] **SC-006**: quickstart.md correctly marks RESEND_FROM_EMAIL as required
- [ ] **SC-007**: All cross-document references validate in GitHub markdown preview

**All checked**: ✅ Documentation alignment complete!

---

**Status**: Ready for task execution via `/speckit.tasks`
