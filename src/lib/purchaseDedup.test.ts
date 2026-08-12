import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createPurchaseDedupStorage, trackPurchaseOnce } from './purchaseDedup';
import * as analytics from './analytics';

function createMemoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value);
    },
    removeItem: (key) => {
      map.delete(key);
    },
    clear: () => map.clear(),
    key: (index) => Array.from(map.keys())[index] ?? null,
    get length() {
      return map.size;
    },
  };
}

beforeEach(() => {
  delete window.gtag;
});

afterEach(() => {
  vi.restoreAllMocks();
  delete window.gtag;
});

describe('trackPurchaseOnce — AC9 (spec §11.9): fires once, dedupes on refresh', () => {
  it('fires trackEvent("purchase", ...) the first time a transaction is seen', () => {
    const spy = vi.spyOn(analytics, 'trackEvent');
    const storage = createPurchaseDedupStorage(() => createMemoryStorage());

    trackPurchaseOnce({ transaction_id: 'tx_1', value: 9, currency: 'EUR' }, storage);

    expect(spy).toHaveBeenCalledWith('purchase', { transaction_id: 'tx_1', value: 9, currency: 'EUR' });
  });

  it('does not fire again for the same transaction_id (simulated page refresh)', () => {
    const spy = vi.spyOn(analytics, 'trackEvent');
    const raw = createMemoryStorage();
    const storage = createPurchaseDedupStorage(() => raw);

    trackPurchaseOnce({ transaction_id: 'tx_1', value: 9, currency: 'EUR' }, storage);
    // A fresh storage wrapper over the same underlying Storage simulates a reload
    const storageAfterReload = createPurchaseDedupStorage(() => raw);
    trackPurchaseOnce({ transaction_id: 'tx_1', value: 9, currency: 'EUR' }, storageAfterReload);

    expect(spy).toHaveBeenCalledOnce();
  });

  it('fires again for a different transaction_id', () => {
    const spy = vi.spyOn(analytics, 'trackEvent');
    const storage = createPurchaseDedupStorage(() => createMemoryStorage());

    trackPurchaseOnce({ transaction_id: 'tx_1', value: 9, currency: 'EUR' }, storage);
    trackPurchaseOnce({ transaction_id: 'tx_2', value: 9, currency: 'EUR' }, storage);

    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('does not throw and still fires when the underlying storage is unavailable', () => {
    const throwing: Storage = {
      getItem: () => {
        throw new Error('blocked');
      },
      setItem: () => {
        throw new Error('blocked');
      },
      removeItem: () => {},
      clear: () => {},
      key: () => null,
      length: 0,
    };
    const spy = vi.spyOn(analytics, 'trackEvent');
    const storage = createPurchaseDedupStorage(() => throwing);

    expect(() =>
      trackPurchaseOnce({ transaction_id: 'tx_1', value: 9, currency: 'EUR' }, storage)
    ).not.toThrow();
    expect(spy).toHaveBeenCalledOnce();
  });
});
