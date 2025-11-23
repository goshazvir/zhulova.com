# Implementation Plan: Align Home Page Documentation

**Branch**: `009-align-home-page-docs` | **Date**: 2025-11-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/009-align-home-page-docs/spec.md`

## Summary

This feature aligns 002-home-page specification with actual implementation completed 2025-11-16. Documentation-only feature addressing 13 identified inconsistencies across spec.md, plan.md, and CLAUDE.md. Zero code changes to src/ directory. All tasks involve editing markdown files to reflect deployed implementation of consultation form with Supabase integration, Resend email notifications, and React Hook Form validation. Critical updates include status field correction, edge case documentation with code references, and success criteria measurement methods for QA test plan creation.

## Technical Context

**Language/Version**: Markdown (GitHub-flavored), English language + None (plain text editing)
**Primary Dependencies**: Git version control (files in `specs/002-home-page/`)
**Storage**: N/A (documentation files only, no code changes)
**Testing**: Manual validation - compare spec claims against implementation files by reading code
**Target Platform**: N/A (documentation alignment, not software deployment)
**Project Type**: single (documentation in `specs/` directory)
**Performance Goals**: N/A (no code changes, documentation-only feature)
**Constraints**: Zero code changes to `src/` directory, edit only markdown files in `specs/002-home-page/`
**Scale/Scope**: 13 documentation inconsistencies across 3 files (spec.md, plan.md, CLAUDE.md), ~40-50 sections requiring updates

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Pre-Phase 0 Validation ✅

**Documentation-only feature** - Most constitution principles N/A (zero code changes to `src/` directory)

- ✅ **Static-First Delivery**: N/A (no code changes) - Feature documents existing /api/submit-lead serverless function which complies with hybrid architecture (all pages static, only API routes use server mode)
- ✅ **Performance-First Development**: N/A (no code changes) - Documentation describes existing Lighthouse 95+ implementation
- ✅ **Simplicity Over Tooling**: Compliant - Uses markdown and git (minimal tooling, text-only editing)
- ✅ **Accessibility & SEO**: N/A (no UI changes) - Documentation describes existing WCAG AA compliant implementation
- ✅ **TypeScript Strict Mode**: N/A (no code changes) - Documentation describes existing TypeScript implementation
- ✅ **Design System Consistency**: N/A (no UI changes) - Documentation describes existing Navy/Gold/Sage design system usage

**Note on Server Mode**: Feature 002-home-page includes /api/submit-lead serverless function (POST endpoint). This requires `output: 'server'` in astro.config.mjs with explicit `export const prerender = false` for API route. All pages remain pre-rendered static at build time. This aligns with constitution's static-first principle when serverless functions are scoped exclusively to /api/* routes (documented in feature 005-fix-consultation-api).

### Post-Phase 1 Validation ✅

- ✅ **Code References Verified**: All code references follow format `(file.ext:line-numbers)` and point to existing implementation files (ConsultationModal.tsx, submit-lead.ts, consultationSchema.ts)
- ✅ **No Clarification Markers**: Zero [NEEDS CLARIFICATION] markers remain in spec.md (all edge cases answered, rate limiting documented in Future Enhancements)
- ✅ **Edge Case Answers Validated**: All 6 edge cases have Answer + Code + Behavior fields matching actual implementation behavior (network failure, duplicates, email service, phone validation, rate limiting, no-JS)
- ✅ **Measurement Methods Technology-Agnostic**: All success criteria measurement methods use standard tools (Chrome DevTools, Lighthouse, W3C Validator, axe DevTools) without custom scripts or framework-specific commands

## Project Structure

### Documentation (this feature)

```text
specs/009-align-home-page-docs/
├── spec.md              # Feature specification (already created)
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output - documents 13 inconsistencies found
├── data-model.md        # Phase 1 output - entities affected by documentation changes
├── quickstart.md        # Phase 1 output - step-by-step validation guide
├── checklists/
│   └── requirements.md  # Spec quality checklist (already created)
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Target Documentation Files (repository root)

**Files to be updated** (documentation alignment targets):

```text
specs/002-home-page/
├── spec.md              # PRIMARY TARGET - status, dates, edge cases, code refs, success criteria
├── plan.md              # SECONDARY TARGET - constitution check server mode clarification
└── data-model.md        # TERTIARY TARGET - remove duplicate validation rules

CLAUDE.md                # QUATERNARY TARGET - correct completion date in Recent Changes section
```

**Reference Implementation Files** (read-only for code reference validation):

```text
src/
├── components/
│   └── forms/
│       └── ConsultationModal.tsx      # Client-side form with React Hook Form + Zod
├── pages/
│   └── api/
│       └── submit-lead.ts             # Serverless function with Supabase + Resend
└── schemas/
    └── consultationSchema.ts          # Zod validation schema

specs/002-home-page/
├── data-model.md                      # Supabase leads table schema
└── research.md                        # Original implementation decisions
```

**Structure Decision**: Documentation-only feature with single project structure. All changes are edits to existing markdown files in `specs/002-home-page/` directory. No code changes to `src/` directory. Implementation files are referenced for validation only (reading code to verify spec accuracy).

## Complexity Tracking

> No violations - documentation-only feature with zero code changes.

This feature strictly adheres to all constitution principles. Documentation alignment requires only markdown editing with git version control, representing minimal complexity. All 6 core principles are either N/A (no code changes) or compliant (Principle III: Simplicity Over Tooling using markdown and git).
