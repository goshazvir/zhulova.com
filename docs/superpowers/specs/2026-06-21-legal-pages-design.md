# Legal Pages — Design

**Date:** 2026-06-21
**Status:** Approved (pending user spec review)
**Topic:** T&C / Legal pages for zhulova.com (public offer, privacy, terms)

## Problem

The site currently ships two legal pages — `terms.astro` and `privacy-policy.astro` —
both written in Ukrainian for a **1-on-1 coaching** business model (Zoom sessions,
60–90 min, 24h reschedule rules, payment per session). The actual product now sold is a
**digital mini-course** ("Опора на себе", €9, delivered via Telegram, one-time WayForPay
payment). The legal documents are out of sync with what is actually being sold, and there
is no public offer (договір публічної оферти) — which WayForPay acquiring expects for a
merchant selling digital goods in Ukraine.

## Decisions (from brainstorming)

- **Business model covered:** both digital products (mini-courses via Telegram) **and**
  coaching (individual/group sessions).
- **Seller:** ФОП (Ukraine). Requisites unknown at authoring time → use explicit
  placeholders for the owner to fill in (e.g. `[ПІБ]`, `[РНОКПП]`).
- **Language:** Ukrainian, matching the rest of the site.
- **Page set:** 3 pages (public offer + privacy + general site terms).
- **Refund policy:** mixed —
  - Digital products: buyer consents to immediate access and waives the 14-day
    withdrawal right; after access is granted, no refund.
  - Coaching: refund for sessions not yet delivered; cancellation/reschedule rules apply.
- **Text source:** original Ukrainian copy written for this business model. The
  sviridov-pro.com examples are used only as structural reference — **their text is not
  copied**.

## Pages

### 1. `/oferta` — Публічна оферта (Договір) — NEW (`src/pages/oferta.astro`)

A legally binding offer contract (acceptance = payment). This is the document WayForPay
acquiring expects. Sections (Ukrainian headings):

1. Загальні положення — offer accepted by payment.
2. Терміни та визначення.
3. Предмет договору — digital products + coaching.
4. Опис продуктів і послуг — mini-courses delivered in Telegram; individual/group coaching.
5. Вартість та порядок оплати — WayForPay, UAH/EUR, one-time payment.
6. Надання доступу / «доставка» — Telegram access immediately after payment; coaching by
   arrangement.
7. Повернення коштів (mixed policy):
   - Digital: consent to immediate access + waiver of the 14-day right; no refund once
     access is granted.
   - Coaching: refund for sessions not delivered; cancellation/reschedule rules (24h).
8. Права та обов'язки сторін.
9. Інтелектуальна власність.
10. Відповідальність та обмеження — coaching is not therapy/medical care; no guaranteed
    result.
11. Форс-мажор.
12. Конфіденційність — link to `/privacy-policy`.
13. Строк дії, зміна умов.
14. Вирішення спорів — Ukrainian law, consumer protection authority.
15. Реквізити продавця — ФОП ПІБ, РНОКПП/ЄДРПОУ, email (placeholders).

Add an effective-date / last-updated line.

### 2. `/privacy-policy` — Політика конфіденційності — REFRESH existing

Align with the real stack. Add/clarify data processors and channels:

- **WayForPay** — payment processing; card data is not stored by us.
- **Supabase** — storage of lead/contact submissions.
- **Resend** — transactional email notifications.
- **Vercel Analytics / Speed Insights** — usage and performance metrics.
- **Telegram** — delivery channel for digital products.

Keep a basic **cookies** section (no separate cookie page). Cover data subject rights,
retention periods, and contact details. Preserve the existing structure and tone; update
content to match the actual data flows.

### 3. `/terms` — Умови використання — REFRESH existing

Currently this file duplicates the role of an offer (payment, refunds, session rules).
Slim it down to:

- General rules of using the website.
- Coaching disclaimer (not therapy / not medical care).
- Intellectual property of site content.
- A pointer: purchases are governed by the **Публічна оферта** (`/oferta`); personal data
  by the **Політика конфіденційності** (`/privacy-policy`).

Move all purchase/payment/refund/session detail out of this page into the offer.

## Navigation

In `src/components/layout/Footer.astro` (the legal links block, ~lines 190–205), add a
third link **«Публічна оферта»** → `/oferta`, alongside the existing
«Політика конфіденційності» and «Умови використання».

## Technical approach

Follow the existing legal-page pattern exactly:

- `BaseLayout` + `Header variant="main"` + `Footer variant="legal"`.
- Tailwind only; `<article class="max-w-4xl mx-auto">`, same section rhythm
  (`h2.text-2xl font-serif`, `text-navy-700 leading-relaxed space-y-4`, lists, sage-50
  contact box).
- Static Astro content — no React, no new dependencies.
- Requisite values and effective dates marked as explicit placeholders (e.g. `[РНОКПП]`)
  for the owner to fill in.
- BaseLayout SEO `title` / `description` per page, in Ukrainian.

## Out of scope (YAGNI)

- Separate cookie policy page.
- Cookie consent banner / consent tracking.
- Multilingual legal pages.
- Any backend logic for the offer.
- Copying example sites' text.

## Acceptance criteria

- `/oferta` exists with all 15 sections and seller-requisite placeholders.
- `/privacy-policy` reflects the real stack (WayForPay, Supabase, Resend, Vercel, Telegram)
  and includes a cookies section.
- `/terms` is slimmed to site usage + coaching disclaimer + IP, and links purchases to the
  offer and data to the privacy policy.
- Footer legal block links to all three pages.
- All three pages render in Ukrainian, use the shared layout/header/footer, and build
  cleanly (`npm run build` / `astro check` passes).
- No example-site text is reproduced.
