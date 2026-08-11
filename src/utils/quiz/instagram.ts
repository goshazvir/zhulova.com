/**
 * Shared Instagram nick validator for the «Опора» quiz (GEO-24, ADR-0002).
 *
 * Canonical handle form is the bare lowercase nick (no `@`). This module is
 * pure (no DOM, no fetch) so it can be imported by both the QuizApp island
 * (instant intro-gate feedback) and the /api/submit-quiz Zod schema (the
 * server stays authoritative).
 */

/** User-facing format error (Ukrainian — shown verbatim in the quiz UI). */
export const INSTAGRAM_FORMAT_ERROR =
  'Перевір нік: латинські літери, цифри, крапки чи _, до 30 символів';

/**
 * User-facing rejection when the existence check confirmed the account is
 * missing (ADR-0002 #5, machine code `instagram_not_found`).
 */
export const INSTAGRAM_NOT_FOUND_ERROR =
  'Не знаходимо такий акаунт в Instagram — перевір нік';

export type InstagramValidationResult =
  | { valid: true; nick: string }
  | { valid: false; error: string };

const NICK_PATTERN = /^[a-z0-9._]{1,30}$/;

/** Canonicalize raw input: trim, strip one leading `@`, lowercase. */
export function normalizeInstagramNick(raw: string): string {
  const trimmed = raw.trim();
  const bare = trimmed.startsWith('@') ? trimmed.slice(1) : trimmed;
  return bare.toLowerCase();
}

/**
 * Validate a raw Instagram nick. On success returns the canonical bare
 * lowercase form; on failure returns the Ukrainian error message.
 */
export function validateInstagramNick(raw: string): InstagramValidationResult {
  const nick = normalizeInstagramNick(raw);

  const wellFormed =
    NICK_PATTERN.test(nick) &&
    !nick.startsWith('.') &&
    !nick.endsWith('.') &&
    !nick.includes('..');

  if (!wellFormed) {
    return { valid: false, error: INSTAGRAM_FORMAT_ERROR };
  }

  return { valid: true, nick };
}
