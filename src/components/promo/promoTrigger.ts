import { promoConfig, type PromoConfig } from '../../config/promo';

/**
 * Pure trigger / frequency-capping logic for the gift promo modal.
 * All decisions take injected time/state so they are unit-testable;
 * the React island (PromoModal) owns timers and DOM listeners.
 * Rules: docs/architecture/promo-modal.md §1–§3.
 */

export type PromoStatus = 'shown' | 'dismissed' | 'converted';

export interface PromoRecord {
  status: PromoStatus;
  at: number; // epoch ms of the last status change
  shownCount: number; // lifetime shows
}

const PROMO_STATUSES: readonly PromoStatus[] = ['shown', 'dismissed', 'converted'];

/** Trigger rule: elapsed ≥ 12s, OR elapsed ≥ 6s AND scroll depth ≥ 50%. */
export function shouldFire(
  elapsedMs: number,
  scrollDepth: number,
  config: PromoConfig = promoConfig
): boolean {
  if (elapsedMs >= config.triggerDelayMs) return true;
  return elapsedMs >= config.engagedDelayMs && scrollDepth >= config.engagedScrollDepth;
}

/** Prefix match with a path-segment boundary: '/quiz' matches '/quiz/x' but not '/quizzes'. */
export function isPathExcluded(pathname: string, config: PromoConfig = promoConfig): boolean {
  if (config.excludedPaths.some((path) => path === pathname)) return true;
  return config.excludedPathPrefixes.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );
}

/** Frequency capping: converted and shownCount ≥ 3 never re-show; dismissed 7d, shown 3d. */
export function isEligible(
  record: PromoRecord | null,
  now: number,
  config: PromoConfig = promoConfig
): boolean {
  if (record === null) return true;
  if (record.status === 'converted') return false;
  if (record.shownCount >= config.maxLifetimeShows) return false;
  const reshowAfterMs =
    record.status === 'dismissed' ? config.reshowAfterDismissedMs : config.reshowAfterShownMs;
  return now - record.at >= reshowAfterMs;
}

export function markShown(prev: PromoRecord | null, now: number): PromoRecord {
  return { status: 'shown', at: now, shownCount: (prev?.shownCount ?? 0) + 1 };
}

export function markDismissed(prev: PromoRecord | null, now: number): PromoRecord {
  return { status: 'dismissed', at: now, shownCount: prev?.shownCount ?? 1 };
}

export function markConverted(prev: PromoRecord | null, now: number): PromoRecord {
  return { status: 'converted', at: now, shownCount: prev?.shownCount ?? 1 };
}

export interface PromoStorage {
  read: () => PromoRecord | null;
  write: (record: PromoRecord) => void;
}

function isPromoRecord(value: unknown): value is PromoRecord {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as Record<string, unknown>;
  return (
    PROMO_STATUSES.includes(candidate.status as PromoStatus) &&
    typeof candidate.at === 'number' &&
    typeof candidate.shownCount === 'number'
  );
}

/**
 * localStorage wrapper with an in-memory fallback (Safari private mode, quota errors).
 * The fallback degrades naturally to "max once per pageview".
 */
export function createPromoStorage(
  getStorage: () => Storage = () => window.localStorage,
  key: string = promoConfig.storageKey
): PromoStorage {
  let memory: PromoRecord | null = null;

  return {
    read: () => {
      try {
        const raw = getStorage().getItem(key);
        if (raw === null) return memory;
        const parsed: unknown = JSON.parse(raw);
        // Invalid stored value degrades to the in-memory copy, same as the catch path
        return isPromoRecord(parsed) ? parsed : memory;
      } catch {
        return memory;
      }
    },
    write: (record) => {
      memory = record;
      try {
        getStorage().setItem(key, JSON.stringify(record));
      } catch {
        // Keep the in-memory copy — storage is unavailable.
      }
    },
  };
}
