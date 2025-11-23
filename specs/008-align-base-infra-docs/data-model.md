# Data Model: Align Base Infrastructure Documentation

**Feature**: 008-align-base-infra-docs
**Date**: 2025-11-23
**Purpose**: Define entities and validation rules for documentation alignment process

## Overview

This is a **documentation-only feature** with no runtime data model. The "entities" described here are conceptual models for understanding the documentation alignment process, not database schemas or API contracts.

---

## Entity Definitions

### 1. DocumentationArtifact

**Purpose**: Represents a specification document that describes implementation

**Attributes**:

| Attribute | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `filePath` | string | Yes | Absolute path to markdown file | `specs/001-base-infrastructure/spec.md` |
| `artifactType` | enum | Yes | Type of document | `spec` \| `plan` \| `research` \| `data-model` \| `quickstart` \| `tasks` |
| `status` | enum | Yes | Current state | `Draft` \| `Completed (YYYY-MM-DD)` \| `Outdated` |
| `lastUpdated` | date | Yes | ISO date of last modification | `2025-11-16` |
| `requirementCount` | number | Yes | Total FR count in spec | `20` |
| `issueCount` | number | Yes | Number of identified alignment issues | `11` |

**Relationships**:
- **References** ImplementationFile (many-to-many): Which code files implement this spec
- **Contains** DocumentationIssue (one-to-many): Issues found during alignment analysis

**Validation Rules**:
- `filePath` must be valid file system path existing in repository
- `status` "Completed" must include date in format `(YYYY-MM-DD)`
- `lastUpdated` must not be in future
- `requirementCount` must match actual `FR-###` count in file (grep validation)

**State Lifecycle**:
```
Draft → Completed (date) → Outdated (if implementation changes)
  ↓           ↑
  └───────────┘ (documentation alignment fixes)
```

**Example**:
```typescript
{
  filePath: "/Users/.../specs/001-base-infrastructure/spec.md",
  artifactType: "spec",
  status: "Outdated", // Currently shows "Draft" but should be "Completed (2025-11-16)"
  lastUpdated: "2025-11-14",
  requirementCount: 20,
  issueCount: 11
}
```

---

### 2. DocumentationIssue

**Purpose**: Specific discrepancy between spec claim and actual implementation

**Attributes**:

| Attribute | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `issueId` | string | Yes | Unique ID | `C1`, `H2`, `M3` |
| `category` | enum | Yes | Priority level | `Critical` \| `High` \| `Medium` \| `Low` |
| `location` | string | Yes | File path + line number | `spec.md:5` |
| `problem` | string | Yes | What is incorrect | `Status shows 'Draft' but feature completed` |
| `actualBehavior` | string | Yes | What implementation does | `Feature merged to master on 2025-11-16` |
| `recommendation` | string | Yes | How to fix documentation | `Change status to 'Completed (2025-11-16)'` |
| `codeReference` | string | No | Implementation file:line | `BaseLayout.astro:7-12` |

**Relationships**:
- **BelongsTo** DocumentationArtifact (many-to-one): Which spec has this issue
- **MapsTo** FunctionalRequirement (many-to-one): Which FR needs updating

**Validation Rules**:
- `category` determines priority:
  - `Critical`: Blocks developers from understanding system
  - `High`: Blocks QA from creating test plans
  - `Medium`: Technical debt, creates maintenance burden
  - `Low`: Style/wording improvements
- `location` must reference actual line number in file
- `codeReference` must point to existing implementation file (if provided)

**State Lifecycle**:
```
Identified → Resolved → Verified
     ↓          ↓          ↓
  (Found)   (Doc    (Manual
           updated)  check)
```

**Example - Critical Issue**:
```typescript
{
  issueId: "C1",
  category: "Critical",
  location: "specs/001-base-infrastructure/spec.md:5",
  problem: "Status shows 'Draft' but feature completed and deployed",
  actualBehavior: "Feature merged to master on 2025-11-16 (git commit 6f7c570)",
  recommendation: "Change line 5 from 'Status: Draft' to 'Status: Completed (2025-11-16)'",
  codeReference: null // Status is metadata, not code-backed
}
```

**Example - High Priority Issue**:
```typescript
{
  issueId: "H1",
  category: "High",
  location: "specs/001-base-infrastructure/spec.md:148-158",
  problem: "Success criteria SC-001 to SC-010 lack measurement methods",
  actualBehavior: "No documentation on where/how to measure each criterion",
  recommendation: "Add 'Monitoring & Verification' section with tool and method for each SC",
  codeReference: null // Measurement methods are verification tools, not code
}
```

---

### 3. FunctionalRequirement

**Purpose**: Testable capability or constraint documented in spec.md

**Attributes**:

| Attribute | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `requirementId` | string | Yes | FR-### format | `FR-001`, `FR-016` |
| `description` | string | Yes | What system must do | `BaseLayout MUST accept props for title, description` |
| `implementationStatus` | enum | Yes | Current state | `Implemented` \| `Partial` \| `Not Implemented` |
| `codeReference` | string | Conditional | file:line where implemented | `BaseLayout.astro:7-12` |
| `verificationMethod` | string | Yes | How to test | `Inspect BaseLayout.astro Props interface` |

**Relationships**:
- **BelongsTo** DocumentationArtifact (many-to-one): Which spec defines this requirement
- **ValidatedBy** ImplementationFile (many-to-many): Code files implementing this requirement
- **HasIssues** DocumentationIssue (one-to-many): Problems with this requirement's documentation

**Validation Rules**:
- `requirementId` must be unique within spec
- `codeReference` **required** if `implementationStatus` is `Implemented`
- `verificationMethod` must be concrete and actionable (not "verify it works")
- Description must use "MUST", "SHOULD", or "MAY" (RFC 2119 keywords)

**State Lifecycle**:
```
Defined → Implemented → Documented → Verified
   ↓          ↓             ↓           ↓
(Written   (Code      (Code ref    (Manual
 in spec)   exists)    added)      check)
```

**Example**:
```typescript
{
  requirementId: "FR-001",
  description: "BaseLayout component MUST accept props for page title, meta description, optional Open Graph image, and optional canonical URL",
  implementationStatus: "Implemented",
  codeReference: "src/layouts/BaseLayout.astro:7-12",
  verificationMethod: "Open BaseLayout.astro and verify interface Props contains: title: string, description: string, image?: string, canonical?: string"
}
```

---

### 4. ImplementationFile

**Purpose**: Source code file that implements documented requirements

**Attributes**:

| Attribute | Type | Required | Description | Example |
|-----------|------|----------|-------------|---------|
| `filePath` | string | Yes | Relative path from repo root | `src/layouts/BaseLayout.astro` |
| `fileType` | enum | Yes | Category | `component` \| `layout` \| `config` \| `style` \| `utility` |
| `primaryPurpose` | string | Yes | Main responsibility | `Provides base page structure with SEO meta tags` |
| `lineCount` | number | Yes | Total lines in file | `97` |

**Relationships**:
- **Implements** FunctionalRequirement (many-to-many): Which FRs are realized in this file
- **ValidatesFor** DocumentationArtifact (many-to-many): Which specs reference this file

**Validation Rules**:
- `filePath` must exist in repository (`ls` check)
- `fileType` inferred from path and extension:
  - `/layouts/` → `layout`
  - `/components/` → `component`
  - `tailwind.config.mjs` → `config`
  - `/styles/` → `style`

**State Lifecycle**: N/A (implementation files are stable, only documentation changes)

**Example**:
```typescript
{
  filePath: "src/layouts/BaseLayout.astro",
  fileType: "layout",
  primaryPurpose: "Provides base page structure with SEO meta tags, Analytics, Speed Insights integration",
  lineCount: 97
}
```

---

## Validation Rules Summary

### Documentation Alignment Validation

**Rule 1: Code Reference Completeness**
- Every FR with `implementationStatus: "Implemented"` MUST have `codeReference`
- Format: `filename.ext:startLine-endLine` or `filename.ext:line`
- Example: `BaseLayout.astro:7-12`, `tailwind.config.mjs:30`

**Rule 2: Edge Case Answer Completeness**
- Every edge case question MUST have documented answer
- Answer MUST include `codeReference` showing where behavior is defined
- No "TODO" or "NEEDS INVESTIGATION" markers allowed

**Rule 3: Success Criteria Measurement**
- Every SC MUST have documented measurement method
- Method MUST specify tool name (e.g., "Chrome DevTools Lighthouse")
- Method MUST include steps (e.g., "Open DevTools → Lighthouse → SEO → Verify ≥95")

**Rule 4: Status Accuracy**
- `status` field MUST match git log completion date
- Format: `Completed (YYYY-MM-DD)` where date is merge commit date
- Validation: `git log --grep="feature-name" --oneline --date=short`

**Rule 5: Constitution Compliance**
- Constitution check MUST accurately describe astro.config.mjs `output:` mode
- Hybrid mode explanation required if not pure static
- No false claims about SSR/static architecture

**Rule 6: Date Consistency**
- All dates (CLAUDE.md, spec.md, plan.md) MUST match git history
- Validation: `git log --all --date=short --format="%cd %s" | grep "feature"`

---

## Code Reference Format Specification

### Format Pattern

```
filename.ext:startLine-endLine
```

OR

```
filename.ext:line
```

### Examples

| Format | Use Case |
|--------|----------|
| `BaseLayout.astro:7-12` | Multi-line implementation (interface, function) |
| `tailwind.config.mjs:30` | Single-line configuration |
| `global.css:29-32` | CSS rule block |
| `Header.astro:44, 71, 130-141` | Multiple locations (comma-separated) |

### Validation Method

```bash
# Verify line range exists
sed -n '7,12p' src/layouts/BaseLayout.astro

# Verify single line exists
sed -n '30p' tailwind.config.mjs

# Count total lines (verify endLine ≤ total)
wc -l src/layouts/BaseLayout.astro
```

### Invalid Examples

| Invalid Format | Reason | Correct Format |
|----------------|--------|----------------|
| `BaseLayout.astro` | No line number | `BaseLayout.astro:7-12` |
| `src/layouts/BaseLayout.astro:7-12` | Path from repo root | `BaseLayout.astro:7-12` (relative to src/) |
| `BaseLayout:7` | Missing file extension | `BaseLayout.astro:7` |
| `BaseLayout.astro:7-5` | Start > End (invalid range) | `BaseLayout.astro:5-7` |

---

## Entity Relationship Diagram

```
┌─────────────────────┐
│ DocumentationArtifact│
│ (spec.md)           │
└──────────┬──────────┘
           │ contains (1:N)
           │
           ▼
┌─────────────────────┐      maps to (N:1)      ┌──────────────────┐
│ DocumentationIssue  │─────────────────────────▶│ FunctionalReq    │
│ (C1, H1, M1)        │                          │ (FR-001, FR-002) │
└─────────────────────┘                          └────────┬─────────┘
                                                          │ validated by (N:M)
                                                          │
                                                          ▼
                                                 ┌────────────────────┐
                                                 │ ImplementationFile │
                                                 │ (BaseLayout.astro) │
                                                 └────────────────────┘
```

**Explanation**:
1. **DocumentationArtifact** (spec.md) contains many **DocumentationIssues** (C1, H1, M1)
2. Each **DocumentationIssue** maps to one **FunctionalRequirement** (FR-001) that needs fixing
3. Each **FunctionalRequirement** is validated by many **ImplementationFiles** (code references)
4. **ImplementationFiles** are referenced back to validate **DocumentationArtifacts**

---

## Transformation Rules

### Markdown → Structured Data

When parsing spec.md to extract entities:

**Extract FunctionalRequirements**:
```bash
# Find all FR-### patterns
grep -n "- \*\*FR-" specs/001-base-infrastructure/spec.md

# Extract requirement ID and description
sed -n 's/.*\*\*\(FR-[0-9]\+\)\*\*: \(.*\)/\1: \2/p' spec.md
```

**Extract Edge Cases**:
```bash
# Find edge cases section
sed -n '/^### Edge Cases/,/^## /p' spec.md
```

**Extract Success Criteria**:
```bash
# Find SC-### patterns
grep -n "- \*\*SC-" specs/001-base-infrastructure/spec.md
```

### Code Reference Validation

For each `codeReference`, validate line range exists:

```bash
#!/bin/bash
# Validate code reference: BaseLayout.astro:7-12

FILE="src/layouts/BaseLayout.astro"
START=7
END=12

# Check file exists
if [[ ! -f "$FILE" ]]; then
  echo "ERROR: File $FILE does not exist"
  exit 1
fi

# Check line range valid
TOTAL_LINES=$(wc -l < "$FILE")
if [[ $END -gt $TOTAL_LINES ]]; then
  echo "ERROR: Line range $START-$END exceeds file length $TOTAL_LINES"
  exit 1
fi

# Extract lines
sed -n "${START},${END}p" "$FILE"
```

---

## Non-Functional Considerations

### Performance

**N/A** - Documentation has no runtime performance. Markdown parsing is instant.

### Security

**N/A** - No sensitive data. All documentation is plain text versioned in Git.

### Scalability

**N/A** - Documentation size is bounded. 001 spec is ~200 lines, alignment adds ~50 lines.

### Maintainability

**HIGH IMPORTANCE**: Documentation must remain synchronized with code.

**Strategy**:
- Code references (file:line) allow automated validation
- Pre-commit hook could validate references before commit
- CI/CD pipeline could check spec status matches deployment status

**Future Enhancement**:
```bash
# Automated spec validation script
.specify/scripts/validate-spec-alignment.sh 001-base-infrastructure

# Checks:
# - Status matches git log
# - All FRs have code references
# - Code references point to valid lines
# - Edge cases have answers
# - Success criteria have measurement methods
```

---

## Testing Strategy

**No automated tests** - This is a documentation feature.

**Manual Verification**:
1. Read updated spec.md - verify all changes make sense
2. For each code reference, open file and check line numbers
3. Run git log to confirm dates match
4. Compare spec claims against implementation files

**Validation Checklist**: See `quickstart.md` for step-by-step verification process.

---

## Glossary

| Term | Definition |
|------|------------|
| **Code Reference** | File:line pointer showing where requirement is implemented |
| **Constitution Check** | Validation that feature complies with project principles |
| **Documentation Artifact** | Spec/plan/research/data-model markdown file |
| **Documentation Issue** | Specific discrepancy between spec and implementation |
| **Edge Case** | Boundary condition or error scenario requiring documented answer |
| **Functional Requirement (FR)** | Testable capability documented in spec.md (FR-001, FR-002, etc.) |
| **Implementation File** | Source code file implementing documented requirements |
| **Success Criterion (SC)** | Measurable outcome defining feature success (SC-001, SC-002, etc.) |

---

## Summary

This data model defines 4 conceptual entities:
1. **DocumentationArtifact** - Spec documents (spec.md, plan.md)
2. **DocumentationIssue** - Inconsistencies between spec and code
3. **FunctionalRequirement** - Testable capabilities (FR-001 to FR-020)
4. **ImplementationFile** - Code files (BaseLayout.astro, Header.astro, etc.)

**Key Validation Rules**:
- Every FR needs code reference if implemented
- Every edge case needs documented answer
- Every SC needs measurement method
- Status must match git history
- Constitution check must be accurate

**Next Step**: See `quickstart.md` for step-by-step implementation guide.
