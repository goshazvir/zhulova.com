# Opora Payment Result Pages — Design

**Date:** 2026-06-21
**Status:** Draft (awaiting review)
**Feature:** Branded success and error pages shown after a WayForPay payment for the "Опора на себе" course.

## Problem

The "Опора" course is sold via a hosted WayForPay payment button
(`PUBLIC_OPORA_CHECKOUT_URL`). After paying, the buyer currently lands on
WayForPay's generic, unbranded result page. The course itself is delivered
through a Telegram bot, and the buyer must open that bot manually to get
access. Today there is nothing that bridges a paying customer to the bot, so a
successful payment can dead-end with the customer not knowing where to go.

## Goal

After payment, send the customer to a branded page on zhulova.com that:

- **On success** — confirms the payment and routes the buyer to the Telegram
  bot to claim the course (the single most important action).
- **On failure** — calmly explains the payment did not go through and offers a
  clear retry plus a way to contact us.

## Background: WayForPay button redirects

WayForPay payment buttons support per-button client redirection, configured in
the merchant cabinet (toggle "Налаштувати переадресацію клієнта"):

- **Approve URL** — page shown after a successful payment.
- **Decline URL** — page shown after a failed/declined payment.

**Constraint that drives the design:** WayForPay sends a **POST** request to the
return URL by default. This site is static (Astro SSG on Vercel); a static page
cannot process a POST. Therefore the button must have the
**"Вимкнути надсилання POST на returnUrl"** toggle enabled so the redirect is a
plain **GET** to a static page.

Sources:
- [Платіжна кнопка — WayForPay help](https://help.wayforpay.com/view/3342550)
- [Перенаправлення клієнта після оплати — WayForPay help](https://help.wayforpay.com/view/3342451)
- [Налаштування переадресації в платіжних кнопках — WayForPay blog](https://blog.wayforpay.com/ru/view/nastrojka-pereadresacii-posle-oplaty-v-plateznyh-knopkah-i-otpravka-sobytij-v-sendpulse-obnovlenia-v-wayforpay-id232.html)

## Scope

In scope:
- New static page `/courses/opora/success`.
- New static page `/courses/opora/error`.
- New environment variable `PUBLIC_OPORA_BOT_URL` for the Telegram bot link.
- E2E coverage for both pages.
- Step-by-step WayForPay cabinet configuration notes (manual action by the
  owner, not code).

Out of scope:
- Any server-side verification of payment (the pages are informational only; we
  do not validate that a real payment occurred).
- Webhook / automated bot delivery.
- A generic, course-agnostic success page (only one course exists today).

## Pages

Both pages use `BaseLayout`, `Header variant="main"`, and
`Footer variant="legal"`, matching `/courses/opora`. Content is in Ukrainian,
consistent with the rest of the Opora landing. Both pages set `noindex` so they
do not appear in search results.

### `/courses/opora/success.astro`

- Positive visual (checkmark).
- Heading: "Оплата пройшла успішно".
- Short confirmation line, e.g. "Дякую! Доступ до курсу — у телеграм-боті."
- **Primary CTA:** "Відкрити бота й забрати курс" → `PUBLIC_OPORA_BOT_URL`,
  opens in a new tab (reuses the external-link / new-tab behavior already in
  `CtaButton`).
- Fallback line: "Бот не відкрився? Напиши нам" → `/contacts`.
- Fallback behavior when `PUBLIC_OPORA_BOT_URL` is empty: the CTA points to
  `/contacts` so the page never has a dead button.

### `/courses/opora/error.astro`

- Calm, non-alarming visual.
- Heading: "Оплата не пройшла".
- Short text inviting another attempt.
- **Primary CTA:** "Спробувати ще раз" → `PUBLIC_OPORA_CHECKOUT_URL` (back to
  the WayForPay button), opens in a new tab for external URL.
- Secondary link: "Звернутися до нас" → `/contacts`.

## Configuration

New environment variable, following the existing `PUBLIC_OPORA_CHECKOUT_URL`
pattern:

- `PUBLIC_OPORA_BOT_URL` — Telegram bot link (e.g. `https://t.me/<bot>`).
- Added to `.env`, `.env.example`, and Vercel (Production + Preview).

WayForPay cabinet (owner action, documented in the plan):

1. Open the payment button settings.
2. Enable "Налаштувати переадресацію клієнта".
3. Approve URL: `https://zhulova.com/courses/opora/success`
4. Decline URL: `https://zhulova.com/courses/opora/error`
5. Enable "Вимкнути надсилання POST на returnUrl" (forces a GET redirect).

## Routing

Nested under `/courses/opora/` to read as a continuation of the course flow.
In Astro, the file `src/pages/courses/opora.astro` and the folder
`src/pages/courses/opora/` coexist without conflict
(`/courses/opora`, `/courses/opora/success`, `/courses/opora/error`).

## Testing

E2E (`tests/e2e/`), following existing patterns:

- Both pages load successfully (200, correct URL).
- Each page has a visible `main h1`.
- Success page: primary CTA links to the bot URL (or `/contacts` fallback) and
  has `target="_blank"`.
- Error page: primary CTA links to the checkout URL; secondary link to
  `/contacts`.
- Both pages expose `<meta name="robots" content="noindex">`.

## Decisions

- **D1 — Static pages, no payment verification.** The hosted button gives us no
  trustworthy signed payload on a GET redirect, and the course is delivered by
  the bot, not by the page. Pages are purely informational; verification would
  add a serverless route and complexity for no user-facing gain. (YAGNI.)
- **D2 — Bot link in an env var.** Mirrors `PUBLIC_OPORA_CHECKOUT_URL`; the link
  can change without code edits or redeploys of logic.
- **D3 — Course-scoped routes, not generic `/success`.** Only one course exists;
  nesting under `/courses/opora/` is clearer. Revisit if more courses are added.
- **D4 — GET redirect required.** The WayForPay "disable POST" toggle is
  mandatory because the site is static; without it the redirect breaks.
