/**
 * Diagnostic session booking link (Calendly).
 *
 * Used by every "діагностична сесія" CTA (footer, quiz result) to open the
 * booking page directly in a new tab instead of the lead-form modal.
 *
 * Source of truth is `PUBLIC_DIAGNOSTIC_BOOKING_URL`; we fall back to the full
 * Calendly booking page when the env var is unset OR still points at the bare
 * `https://calendly.com/` host (which would land on the Calendly homepage, not
 * a bookable slot).
 */
const FULL_BOOKING_URL = 'https://calendly.com/viktoriazhulova/30min';

const configured = import.meta.env.PUBLIC_DIAGNOSTIC_BOOKING_URL?.trim();

export const DIAGNOSTIC_BOOKING_URL =
  !configured || /^https?:\/\/calendly\.com\/?$/i.test(configured)
    ? FULL_BOOKING_URL
    : configured;
