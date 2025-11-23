# Implementation Plan: Server-Side Error Logging

**Branch**: `011-server-error-logging` | **Date**: 2025-11-23 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/011-server-error-logging/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Implement production-ready structured error logging for server-side operations (API endpoints, database, email service) using Vercel's native logging infrastructure. Create centralized logging utility that outputs structured JSON logs to stdout/stderr for automatic capture by Vercel Dashboard. Focus on strategic logging at critical failure points (API errors, database failures, email delivery issues, validation errors, environment misconfiguration) while avoiding log noise from successful operations. Zero new dependencies - use native console API only. Performance budget: <5ms per log operation. Security: no sensitive data (PII, API keys) logged.

## Technical Context

**Language/Version**: TypeScript 5.x (strict mode enabled)
**Primary Dependencies**: None (native console API only per FR-015)
**Storage**: N/A (logs written to stdout/stderr, captured by Vercel infrastructure)
**Testing**: Manual testing per existing project approach (no automated tests in MVP scope per CLAUDE.md)
**Target Platform**: Vercel Serverless Functions (Node.js 18+ runtime)
**Project Type**: Web application (existing Astro + Vercel setup with serverless API routes)
**Performance Goals**: <5ms logging overhead per request (FR-010), no user-perceivable latency impact
**Constraints**: Zero bundle size increase (no new dependencies), no sensitive data leakage (FR-007, FR-011), structured JSON output for Vercel Dashboard filtering
**Scale/Scope**: Single API endpoint (`/api/submit-lead`) currently, designed for reuse across future endpoints

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### I. Static-First Delivery ⚠️ **PRE-EXISTING ARCHITECTURE**

**Status**: Existing project uses `output: 'server'` in astro.config.mjs (line 14) with static page pre-rendering

**Analysis**:
- Constitution prohibits: "`output: 'server'` or `output: 'hybrid'`"
- Current project: Uses `output: 'server'` + `export const prerender = true` on pages
- This feature: Works within existing architecture, adds logging to existing `/api/*` serverless endpoints
- **This is NOT a new violation** - it's working with the established architecture for API endpoints

**Documented in Complexity Tracking**: See section below for justification of pre-existing architecture decision

**Impact on this feature**: None - logging utility operates within existing serverless API context

### II. Performance-First Development ✅ **PASS**

**Validation**:
- FR-010: Logging operations complete in <5ms (synchronous stdout write, no network)
- SC-004: API response time increase <5ms at p95
- No image optimization needed (server-side utility)
- No JavaScript bundle impact (utility used only in serverless functions, not client-side)

**Performance budget**: This feature adds **0KB** to client-side bundle (server-side only)

### III. Simplicity Over Tooling ✅ **PASS**

**Validation**:
- FR-015: "MUST NOT add any external logging library dependencies (use native `console` API only)"
- No npm dependencies added (winston, pino, bunyan explicitly rejected)
- Single utility file: `src/utils/logger.ts` (~100-150 lines)
- Leverages Vercel's built-in log capture (no custom transport layer)

**Justification for approach**: Native console API automatically captured by Vercel, structured JSON provides filtering without additional tooling

### IV. Accessibility-First Design (WCAG AA Compliance) ✅ **N/A**

**Validation**: Not applicable - server-side logging feature with no user-facing UI components

### V. TypeScript Strict Mode & Type Safety ✅ **PASS**

**Validation**:
- Logger utility will use TypeScript interfaces for `LogEntry`, `LogLevel`, `LogContext`
- Strict mode enabled in tsconfig.json (existing project standard)
- Path alias: `@utils/logger` configured in astro.config.mjs (line 35)
- All function parameters and return types explicitly typed

**Code quality**: Follows existing project conventions (CLAUDE.md lines 133-156)

### VI. Design System Consistency ✅ **N/A**

**Validation**: Not applicable - no UI components, styling, or visual changes

---

**Constitution Compliance Summary**:
- ✅ 4 principles pass
- ⚠️ 1 principle (Static-First) - pre-existing architecture documented in Complexity Tracking
- ✅ 2 principles N/A (Accessibility, Design System - server-side feature)

**GATE STATUS**: ✅ **PASS** - Proceed to Phase 0 research

## Project Structure

### Documentation (this feature)

```text
specs/011-server-error-logging/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output - Logging best practices (TO BE GENERATED)
├── data-model.md        # Phase 1 output - LogEntry entity schema (TO BE GENERATED)
├── quickstart.md        # Phase 1 output - Developer setup instructions (TO BE GENERATED)
├── contracts/           # Phase 1 output - Logger API contracts (TO BE GENERATED)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── pages/
│   └── api/
│       └── submit-lead.ts          # [EXISTING] Integrate logger here (FR-002)
├── utils/
│   └── logger.ts                   # [NEW] Centralized logging utility (FR-001)
└── types/
    └── logger.ts                   # [NEW] TypeScript interfaces for LogEntry, LogLevel

.claude/docs/
└── technical-spec.md               # [UPDATE] Add "Logging & Monitoring" section
```

**Structure Decision**: Single project structure (existing). New utility file `src/utils/logger.ts` follows established pattern (existing utils: `scrollAnimations.ts`). Logger integration primarily in `/api/*` endpoints, designed for reuse as more API routes are added.

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|--------------------------------------|
| **I. Static-First Delivery**: Project uses `output: 'server'` in astro.config.mjs (Constitution prohibits this) | **Pre-existing architecture decision** (not introduced by this feature). Serverless API endpoints (`/api/submit-lead`) require server output mode for runtime execution. All pages still pre-rendered statically with `export const prerender = true`. | Pure static site (`output: 'static'`) insufficient because: (1) Consultation form requires server-side processing for Supabase database writes and Resend email sending, (2) Client-side-only approach would expose Supabase service keys in browser (security violation), (3) CORS complications with third-party services from client-side. **Business requirement**: Secure form submission with email notifications requires serverless backend. |

**Architectural Note**: This feature works **within** the existing hybrid architecture. It does NOT introduce new server-side rendering - it adds observability to existing serverless API routes. The violation predates this feature (established in 002-home-page spec, 2025-11-16).

**Constitution Update Recommendation**: Consider amending Principle I to explicitly allow serverless API endpoints (`/api/*` routes with `prerender: false`) while maintaining static-first approach for all pages. Current wording creates false-positive violations for legitimate serverless use cases.

---

## Phase 0: Research (NEXT STEP)

**Purpose**: Resolve technical unknowns and establish best practices for production logging

### Research Tasks

1. **Vercel Serverless Logging Behavior**
   - Question: How does Vercel capture console.log/error/warn from serverless functions?
   - Question: Are logs buffered or streamed? When are they flushed?
   - Question: What's the maximum log entry size before truncation?
   - Question: How do Vercel request IDs work for log correlation?
   - Deliverable: Document Vercel logging infrastructure behavior in `research.md`

2. **Structured Logging Best Practices (OWASP)**
   - Question: What fields should structured logs include per OWASP guidelines?
   - Question: How to sanitize sensitive data (API keys, PII) in error messages?
   - Question: Best practices for log levels (ERROR vs WARN vs INFO distinction)?
   - Question: How to handle circular references in JSON.stringify?
   - Deliverable: Document OWASP logging guidelines relevant to this project in `research.md`

3. **Performance Profiling**
   - Question: What's the real overhead of JSON.stringify on 1KB context objects?
   - Question: Will synchronous console calls block event loop?
   - Question: Can logging impact cold start time?
   - Deliverable: Benchmark results and optimization strategies in `research.md`

4. **Context7 MCP Integration** (Optional Enhancement)
   - Question: Can Context7 provide additional logging patterns for Astro/Vercel?
   - Question: Are there Claude MCP tools for log analysis/aggregation?
   - Deliverable: Document any relevant Context7 patterns in `research.md`

**Research Method**: Web research (Vercel docs, OWASP guidelines), microbenchmarks (Node.js console performance), optional Context7 MCP queries

**Output**: `research.md` with decisions, rationale, and alternatives considered for each question

---

## Phase 1: Design (AFTER RESEARCH)

**Prerequisites**: `research.md` complete with all NEEDS CLARIFICATION resolved

### Deliverables

1. **`data-model.md`**: LogEntry entity schema
   - Fields: `level`, `timestamp`, `endpoint`, `error_type`, `message`, `context`, `request_id`
   - Validation rules: max context size (1KB), sensitive data patterns to redact
   - State transitions: N/A (logging is stateless)

2. **`contracts/logger-api.md`**: Logger utility API contract
   - Function signatures: `logError()`, `logWarn()`, `logInfo()`
   - Input parameters: message (string), context (object), endpoint (string)
   - Output format: JSON schema for log entries
   - Error handling: fallback behavior when logging fails

3. **`quickstart.md`**: Developer integration guide
   - Setup: Import logger utility
   - Usage examples: Logging database errors, validation failures, email errors
   - Testing: How to verify logs in Vercel Dashboard
   - Troubleshooting: Common issues (missing env vars, log truncation)

4. **Agent context update**: Run `.specify/scripts/bash/update-agent-context.sh claude`
   - Adds: New technology "Native Console API (Vercel logging)" to CLAUDE.md
   - Preserves: Existing manual additions in CLAUDE.md

**Design Validation**: Re-run Constitution Check after design complete (ensure no new violations introduced)

---

## Implementation Phases (NOT PART OF THIS COMMAND)

**Note**: Implementation planning happens in `/speckit.tasks` command. This section is informational only.

**Expected Implementation Order**:
1. **Phase 0**: Create logger utility (`src/utils/logger.ts`) with basic functionality
2. **Phase 1**: Integrate into `/api/submit-lead` endpoint for all error paths
3. **Phase 2**: Add sanitization for sensitive data (FR-007, FR-011)
4. **Phase 3**: Performance optimization and testing
5. **Phase 4**: Documentation updates (technical-spec.md)

**Estimated Complexity**: Small (single utility file, ~10 integration points in existing API)

---

## Success Validation (POST-IMPLEMENTATION)

**Performance**:
- [ ] API response time p95 increase <5ms (SC-004) - measured via Vercel Speed Insights
- [ ] Logging operations complete <5ms - microbenchmark

**Security**:
- [ ] Zero PII in logs (SC-003) - manual grep for email/phone patterns
- [ ] Zero API keys in logs (SC-003) - manual grep for `sk_`, `pk_` patterns

**Functionality**:
- [ ] All error paths logged (database, email, validation, env vars)
- [ ] Logs viewable in Vercel Dashboard within 30 seconds (SC-001)
- [ ] Logs filterable by `error_type` field (SC-005)

**Developer Experience**:
- [ ] 90% of errors diagnosable from logs alone (SC-002) - 1-week retrospective
- [ ] Configuration errors include fix instructions (SC-006)

---

**Phase 0 Status**: ✅ COMPLETE - research.md generated with Vercel logging, OWASP guidelines, performance analysis
**Phase 1 Status**: ✅ COMPLETE - data-model.md, contracts/logger-api.md, quickstart.md created
**Phase 2 Status**: ✅ COMPLETE - Implementation complete (43 tasks: 25 implementation, 18 manual testing/validation)
**Next Steps**:
1. Deploy to Vercel: `git add . && git commit && git push`
2. Manual testing in production (tasks T016-T041)
3. Monitor logs in Vercel Dashboard for 7 days
4. Validate all success criteria (SC-001 through SC-006)
