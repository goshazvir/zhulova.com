import { describe, it, expect } from 'vitest';
import { promoConfig } from '../../config/promo';
import {
  isPathExcluded,
  isEligible,
  shouldFire,
  markShown,
  markDismissed,
  markConverted,
  createPromoStorage,
  type PromoRecord,
} from './promoTrigger';

const DAY_MS = 24 * 60 * 60 * 1000;

describe('promoConfig', () => {
  it('carries the values fixed by the Designer doc (promo-modal.md §6)', () => {
    expect(promoConfig.storageKey).toBe('zh_promo_gift_v1');
    expect(promoConfig.triggerDelayMs).toBe(12_000);
    expect(promoConfig.engagedDelayMs).toBe(6_000);
    expect(promoConfig.engagedScrollDepth).toBe(0.5);
    expect(promoConfig.reshowAfterDismissedMs).toBe(7 * DAY_MS);
    expect(promoConfig.reshowAfterShownMs).toBe(3 * DAY_MS);
    expect(promoConfig.maxLifetimeShows).toBe(3);
  });
});

describe('shouldFire — trigger rule (elapsed ≥ 12s OR elapsed ≥ 6s AND scroll ≥ 50%)', () => {
  it('does not fire before the 12s timer without scroll engagement', () => {
    expect(shouldFire(11_999, 0)).toBe(false);
  });

  it('fires at 12s regardless of scroll depth', () => {
    expect(shouldFire(12_000, 0)).toBe(true);
  });

  it('fires at 6s when scroll depth reached 50%', () => {
    expect(shouldFire(6_000, 0.5)).toBe(true);
  });

  it('does not fire before the 6s floor even at full scroll depth', () => {
    expect(shouldFire(5_999, 1)).toBe(false);
  });

  it('does not fire at 6s when scroll depth is below 50%', () => {
    expect(shouldFire(6_000, 0.49)).toBe(false);
  });
});

describe('isPathExcluded — exclusion list (promo-modal.md §3)', () => {
  it.each(['/', '/courses', '/contacts'])('allows %s', (path) => {
    expect(isPathExcluded(path)).toBe(false);
  });

  it.each([
    '/quiz',
    '/quiz/opora',
    '/courses/opora',
    '/courses/opora/',
    '/courses/opora/success',
    '/courses/opora/error',
  ])('excludes %s (prefix match)', (path) => {
    expect(isPathExcluded(path)).toBe(true);
  });

  it.each(['/privacy-policy', '/terms', '/oferta', '/404'])(
    'excludes %s (exact match)',
    (path) => {
      expect(isPathExcluded(path)).toBe(true);
    }
  );

  it('does not treat a shared string prefix as a path prefix', () => {
    expect(isPathExcluded('/courses/opora-2')).toBe(false);
    expect(isPathExcluded('/quizzes')).toBe(false);
    expect(isPathExcluded('/privacy-policy-old')).toBe(false);
  });
});

describe('isEligible — frequency capping (promo-modal.md §2)', () => {
  const now = 1_700_000_000_000;
  const record = (over: Partial<PromoRecord>): PromoRecord => ({
    status: 'shown',
    at: now,
    shownCount: 1,
    ...over,
  });

  it('is eligible with no stored record', () => {
    expect(isEligible(null, now)).toBe(true);
  });

  it('never re-shows after conversion', () => {
    expect(isEligible(record({ status: 'converted', at: now - 365 * DAY_MS }), now)).toBe(false);
  });

  it('never re-shows after 3 lifetime shows', () => {
    expect(
      isEligible(record({ status: 'dismissed', at: now - 30 * DAY_MS, shownCount: 3 }), now)
    ).toBe(false);
  });

  it('suppresses a dismissed record for 7 days', () => {
    expect(isEligible(record({ status: 'dismissed', at: now - 7 * DAY_MS + 1 }), now)).toBe(false);
    expect(isEligible(record({ status: 'dismissed', at: now - 7 * DAY_MS }), now)).toBe(true);
  });

  it('suppresses a shown-only record for 3 days', () => {
    expect(isEligible(record({ status: 'shown', at: now - 3 * DAY_MS + 1 }), now)).toBe(false);
    expect(isEligible(record({ status: 'shown', at: now - 3 * DAY_MS }), now)).toBe(true);
  });
});

describe('record transitions', () => {
  const now = 1_700_000_000_000;

  it('markShown starts a record with shownCount 1', () => {
    expect(markShown(null, now)).toEqual({ status: 'shown', at: now, shownCount: 1 });
  });

  it('markShown increments shownCount of a previous record', () => {
    const prev: PromoRecord = { status: 'dismissed', at: now - DAY_MS, shownCount: 2 };
    expect(markShown(prev, now)).toEqual({ status: 'shown', at: now, shownCount: 3 });
  });

  it('markDismissed keeps shownCount and stamps the time', () => {
    const prev: PromoRecord = { status: 'shown', at: now - 1000, shownCount: 2 };
    expect(markDismissed(prev, now)).toEqual({ status: 'dismissed', at: now, shownCount: 2 });
  });

  it('markConverted keeps shownCount and stamps the time', () => {
    const prev: PromoRecord = { status: 'shown', at: now - 1000, shownCount: 1 };
    expect(markConverted(prev, now)).toEqual({ status: 'converted', at: now, shownCount: 1 });
  });

  it('dismiss/convert without a prior record still produces a valid record', () => {
    expect(markDismissed(null, now)).toEqual({ status: 'dismissed', at: now, shownCount: 1 });
    expect(markConverted(null, now)).toEqual({ status: 'converted', at: now, shownCount: 1 });
  });
});

describe('createPromoStorage — localStorage wrapper with in-memory fallback', () => {
  const sample: PromoRecord = { status: 'shown', at: 123, shownCount: 1 };

  it('reads null when nothing is stored', () => {
    localStorage.clear();
    expect(createPromoStorage().read()).toBeNull();
  });

  it('round-trips a record through localStorage under the configured key', () => {
    localStorage.clear();
    const storage = createPromoStorage();
    storage.write(sample);
    expect(storage.read()).toEqual(sample);
    expect(JSON.parse(localStorage.getItem(promoConfig.storageKey) ?? '')).toEqual(sample);
  });

  it('reads null on corrupted JSON', () => {
    localStorage.setItem(promoConfig.storageKey, '{not json');
    expect(createPromoStorage().read()).toBeNull();
  });

  it('reads null on well-formed JSON that is not a promo record', () => {
    localStorage.setItem(promoConfig.storageKey, JSON.stringify({ status: 'weird' }));
    expect(createPromoStorage().read()).toBeNull();
  });

  it('falls back to in-memory storage when localStorage is unavailable', () => {
    const storage = createPromoStorage(() => {
      throw new Error('Safari private mode');
    });
    expect(storage.read()).toBeNull();
    storage.write(sample);
    expect(storage.read()).toEqual(sample);
  });

  it('falls back to in-memory storage when writes throw (quota)', () => {
    const throwing = {
      getItem: () => null,
      setItem: () => {
        throw new Error('QuotaExceededError');
      },
    } as unknown as Storage;
    const storage = createPromoStorage(() => throwing);
    storage.write(sample);
    expect(storage.read()).toEqual(sample);
  });
});
