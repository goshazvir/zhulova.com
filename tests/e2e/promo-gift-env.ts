/**
 * Single source of the gift-bot URL for e2e runs, shared between
 * playwright.config.ts (injected into the dev server env) and the
 * promo modal spec (asserted on the CTA href).
 */
export const GIFT_BOT_URL = process.env.PUBLIC_GIFT_BOT_URL ?? 'https://t.me/zhulova_gift_e2e_bot';
