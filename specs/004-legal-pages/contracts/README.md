# API Contracts

**Feature**: 004-legal-pages
**Status**: No API contracts required

## Overview

This feature is **purely static** and does not require any API endpoints or contracts.

## Rationale

- Legal pages are pre-rendered static HTML served via CDN
- No dynamic data fetching required
- No form submissions specific to legal pages
- Footer and modal modifications are client-side only (navigation links)

## Static Routes

The following routes are statically generated at build time:

| Route | Method | Response Type | Description |
|-------|--------|---------------|-------------|
| `/privacy-policy` | GET | text/html | Privacy Policy page (static HTML) |
| `/terms` | GET | text/html | Terms & Conditions page (static HTML) |

**No API endpoints, no serverless functions, no database queries.**

## Existing API (Unchanged)

This feature does not modify any existing API endpoints:

- ✅ `/api/submit-lead` - Consultation form submission (unchanged)

The consultation modal gains a privacy policy link, but form submission logic remains identical.

---

**Conclusion**: No API contracts to document. All interactions are static navigation.
