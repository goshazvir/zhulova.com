# Data Model: Align Home Page Documentation

**Feature**: 009-align-home-page-docs | **Date**: 2025-11-23 | **Phase**: 1 (Design)

## Overview

This document defines the structure of documentation entities modified during feature 009. Unlike typical features with database schemas, this feature modifies MARKDOWN DOCUMENTATION. The "data model" represents the structure of spec files and their required content.

---

## Entity 1: Feature Specification Document

**File**: `specs/002-home-page/spec.md`

**Purpose**: Primary specification document describing feature requirements, user stories, success criteria

**Fields**:

| Field Name | Type | Required | Validation Rules | Example Value |
|------------|------|----------|------------------|---------------|
| title | string | Yes | Must be "Feature Specification: [Feature Name]" | "Feature Specification: Home Page with Consultation Form" |
| featureBranch | string | Yes | Must match git branch pattern: `###-feature-name` | "002-home-page" |
| created | date | Yes | Must be ISO date format YYYY-MM-DD | "2025-11-16" |
| status | enum | Yes | One of: "Draft", "Completed (YYYY-MM-DD)", "In Progress" | "Completed (2025-11-16)" |
| userScenarios | array | Yes | 1-10 user stories with acceptance scenarios | [US1: Consultation booking, US2: Credibility, ...] |
| edgeCases | array | Yes | 4-10 edge case Q&A with code references | [Q1: Network failure, Q2: Duplicates, ...] |
| requirements | array | Yes | 10-30 functional requirements with code references | [FR-001, FR-002, ...] |
| successCriteria | array | Yes | 5-15 measurable outcomes | [SC-001, SC-002, ...] |
| monitoringVerification | array | Yes | Measurement method for each success criterion | [How to measure SC-001, SC-002, ...] |
| assumptions | array | Yes | 3-10 documented assumptions | [Form fields required, No rate limiting, ...] |

**Relationships**:
- **References** → Implementation files (src/components/*, src/pages/api/*)
- **Referenced by** → plan.md (links to spec.md)
- **Validated by** → checklists/requirements.md

**State Transitions**:
```
Draft → In Progress → Completed (YYYY-MM-DD)
```

**Validation Rules**:
1. **Status Consistency**: If status is "Completed (DATE)", all user stories MUST have acceptance scenarios
2. **Code References**: All functional requirements MUST include code reference in format `(file.ext:line-numbers)`
3. **Edge Cases Format**: Each edge case MUST have Answer, Code, Behavior fields
4. **Success Criteria**: Each SC-XXX MUST have corresponding entry in Monitoring & Verification section
5. **Date Format**: All dates MUST be YYYY-MM-DD format, no typos (2025-01-16 vs 2025-11-16)

---

## Entity 2: Implementation Plan Document

**File**: `specs/002-home-page/plan.md`

**Purpose**: Technical implementation plan with constitution compliance check

**Fields**:

| Field Name | Type | Required | Validation Rules | Example Value |
|------------|------|----------|------------------|---------------|
| title | string | Yes | Must be "Implementation Plan: [Feature Name]" | "Implementation Plan: Home Page with Consultation Form" |
| branch | string | Yes | Must match spec.md featureBranch | "002-home-page" |
| date | date | Yes | Must match spec.md created date | "2025-11-16" |
| summary | string | Yes | 2-4 sentences describing approach | "Create consultation modal with..." |
| technicalContext | object | Yes | 9 required fields (Language, Dependencies, etc.) | {language: "TypeScript 5.x", ...} |
| constitutionCheck | object | Yes | Pre-Phase 0 validation for all 6 principles | {staticFirst: "✅", performance: "✅", ...} |
| projectStructure | object | Yes | Documentation + source code trees | {documentation: [...], sourceCode: [...]} |
| complexityTracking | string | Optional | Only if constitution violations exist | "No violations" or table |

**Relationships**:
- **Links to** → spec.md
- **Validated by** → constitution.md
- **Informs** → tasks.md

**Validation Rules**:
1. **Constitution Compliance**: All 6 principles MUST have checkmark (✅) or justified violation
2. **Server Mode Clarification**: If feature uses /api/* routes, MUST explain server mode is OK for serverless functions
3. **Date Consistency**: plan.md date MUST match spec.md created date
4. **Branch Consistency**: plan.md branch MUST match spec.md featureBranch

---

## Entity 3: Data Model Document

**File**: `specs/002-home-page/data-model.md`

**Purpose**: Database schema and validation rules for Supabase leads table

**Fields**:

| Field Name | Type | Required | Validation Rules | Example Value |
|------------|------|----------|------------------|---------------|
| entities | array | Yes | 1-5 database entities with fields | [Lead entity with id, name, phone, ...] |
| validationRules | array | No | Should be INLINE in entity field descriptions, not separate section | N/A (remove duplicates) |
| relationships | array | Optional | Foreign key relationships between entities | [] (none for 002-home-page) |
| indexes | array | Optional | Database indexes for performance | [created_at DESC] |

**Relationships**:
- **Implemented by** → src/pages/api/submit-lead.ts (Supabase insert)
- **Validated by** → src/schemas/consultationSchema.ts (Zod schema)

**Validation Rules**:
1. **No Duplication**: Validation rules MUST appear in entity field description only, NOT in separate section
2. **Field Types**: All fields MUST have PostgreSQL data type (TEXT, TIMESTAMPTZ, etc.)
3. **Constraints**: Required fields MUST be marked with "NOT NULL"

---

## Entity 4: Quickstart Guide

**File**: `specs/002-home-page/quickstart.md`

**Purpose**: Step-by-step implementation verification guide

**Fields**:

| Field Name | Type | Required | Validation Rules | Example Value |
|------------|------|----------|------------------|---------------|
| prerequisites | array | Yes | 3-7 setup requirements | [Node.js 18+, Supabase account, ...] |
| setupSteps | array | Yes | 5-15 sequential setup instructions | [1. Clone repo, 2. Install deps, ...] |
| verificationSteps | array | Yes | 5-10 testing procedures | [Test form locally, Verify Supabase, ...] |
| troubleshooting | array | Optional | Common issues and solutions | [ENV vars missing → check .env] |

**Relationships**:
- **Validates** → Implementation in src/ directory
- **References** → spec.md functional requirements

**Validation Rules**:
1. **Completeness**: Must include local testing, database verification, email confirmation
2. **Clarity**: Each step MUST be actionable (command or explicit action)
3. **Error Handling**: Must document what success/failure looks like for each step

---

## Entity 5: CLAUDE.md Recent Changes Entry

**File**: `CLAUDE.md` (root directory)

**Purpose**: Project-wide changelog documenting feature completion dates

**Fields**:

| Field Name | Type | Required | Validation Rules | Example Value |
|------------|------|----------|------------------|---------------|
| featureName | string | Yes | Format: "###-feature-name" | "002-home-page" |
| completionDate | date | Yes | Format: (YYYY-MM-DD) in parentheses | "(2025-11-16)" |
| status | enum | Yes | One of: "✅ COMPLETED", "🚧 IN PROGRESS" | "✅ COMPLETED & DEPLOYED" |
| description | string | Yes | 1-3 sentences summarizing implementation | "52/62 tasks (84%) - Production ready" |
| technologies | array | Optional | List of tech stack used | ["Astro 4.x", "React 18.x", "Supabase"] |

**Relationships**:
- **Summarizes** → All features in specs/ directory
- **Cross-referenced by** → Individual feature spec.md files

**Validation Rules**:
1. **Date Accuracy**: Completion date MUST match git log merge date for feature branch
2. **Status Clarity**: If marked "✅ COMPLETED", description should not imply partial completion (confusing status like "52/62 tasks")
3. **Chronological Order**: Entries MUST be in reverse chronological order (newest first)

---

## Code Reference Entity

**Type**: Inline reference within spec.md

**Purpose**: Links functional requirements to implementation code

**Format**: `(filename.ext:startLine-endLine)` or `(filename.ext:lineNumber)`

**Examples**:
- `(ConsultationModal.tsx:25-56)` - Line range for multi-line implementation
- `(submit-lead.ts:110)` - Single line reference
- `(consultationSchema.ts:9-30)` - Zod schema definition

**Validation Rules**:
1. **File Exists**: Referenced file MUST exist in repository
2. **Lines Valid**: Line numbers MUST be within file bounds
3. **Relevant Code**: Referenced lines MUST contain code related to requirement
4. **Format Consistency**: All code references MUST use `(file:line)` pattern, no variations

**Relationship to FRs**:
- Each FR-XXX functional requirement SHOULD have 1-3 code references
- Code references appear at END of requirement text: `[requirement text] *(code-ref-1, code-ref-2)*`

---

## Edge Case Entity

**Type**: Q&A section within spec.md

**Purpose**: Documents non-obvious implementation behaviors

**Structure**:
```markdown
**Q[N]: [Question about edge case behavior]**
- **Answer**: [What actually happens]
- **Code**: [file.ext:line-numbers]
- **Behavior**: [Additional context or implications]
- **Recommendation**: [Optional - if behavior could be improved]
```

**Validation Rules**:
1. **Answered**: All edge case questions MUST be answered (not left as questions)
2. **Code Reference**: Each answer MUST include code reference showing where behavior is implemented
3. **Testable**: Answer MUST be verifiable by reading referenced code
4. **Relevant**: Edge case MUST relate to actual implementation (not hypothetical scenarios)

**Count**: 4-10 edge cases per feature (enough to cover non-obvious behaviors)

---

## Success Criteria Measurement Entity

**Type**: Section within spec.md

**Purpose**: Documents HOW to measure each success criterion

**Structure**:
```markdown
### Monitoring & Verification

How to measure each success criterion:

- **SC-XXX**: Tool: [Tool Name] | Method: [Step-by-step measurement process]
```

**Validation Rules**:
1. **One-to-One Mapping**: Each SC-XXX MUST have corresponding measurement method
2. **Technology-Agnostic Tools**: Prefer standard tools (Chrome DevTools, W3C Validator) over custom scripts
3. **Actionable Steps**: Method MUST be specific enough for QA to execute without guessing
4. **Observable Results**: Method MUST describe what success/failure looks like

**Example**:
```markdown
- **SC-001**: Tool: **Chrome DevTools Network tab** | Method: Click CTA button → Open DevTools → Monitor Network requests → Verify modal opens within 100ms (no blocking requests)
```

---

## Relationships Between Entities

```
spec.md (PRIMARY)
├── References → Implementation Code (src/components/*, src/pages/api/*)
├── Validated by → checklists/requirements.md
├── Links to → plan.md
└── Summarized in → CLAUDE.md

plan.md (SECONDARY)
├── Links to → spec.md
├── Validated by → .specify/memory/constitution.md
└── Informs → tasks.md

data-model.md (TERTIARY)
├── Implemented by → src/pages/api/submit-lead.ts
└── Validated by → src/schemas/consultationSchema.ts

quickstart.md (TERTIARY)
└── Validates → Implementation (src/ directory)

CLAUDE.md (QUATERNARY)
└── Summarizes → All features (specs/*/)
```

---

## Validation Checklist

Before marking documentation alignment complete, verify:

- [ ] **spec.md status** matches git log completion date
- [ ] **spec.md created date** has no typos (2025-11-16, not 2025-01-16)
- [ ] **All FRs** have code references in format `(file:line)`
- [ ] **All edge cases** have Answer + Code + Behavior fields
- [ ] **All success criteria** have measurement methods in Monitoring & Verification section
- [ ] **plan.md constitution check** explains server mode for /api/* routes
- [ ] **data-model.md** has NO duplicate validation rules (inline only)
- [ ] **CLAUDE.md** completion date matches git log
- [ ] **Code references** point to existing files with valid line numbers
- [ ] **Zero [NEEDS CLARIFICATION] markers** remain in any document

---

## Documentation Quality Standards

**Consistency**: All features (001-009) MUST follow same documentation patterns
**Accuracy**: Spec MUST reflect actual implementation, not aspirational goals
**Completeness**: All mandatory sections MUST be present and filled
**Traceability**: Every requirement MUST be traceable to implementation code
**Maintainability**: Documentation MUST be easy to update when code changes

---

## Next Steps

Phase 1 data model complete. Proceed to:
1. Generate quickstart.md (verification guide)
2. Update agent context (.claude/docs/* if needed)
3. Re-evaluate Constitution Check post-design
