/**
 * Purchase de-duplication (AC9, spec §11.9): a `purchase` event must fire
 * once per transaction, not again on page refresh. Not currently wired into
 * any page — the Opora checkout redirects through WayForPay and the
 * confirmation page (`success.astro`) receives no order data client-side,
 * so `purchase` tracking is out of scope until that changes (spec §13).
 * This exists so the capability is ready the moment a confirmation page
 * with real order data exists.
 */
import { trackEvent, type PurchaseParams } from './analytics';

const STORAGE_KEY = 'zh_purchase_fired_v1';

export interface PurchaseDedupStorage {
  hasFired: (transactionId: string) => boolean;
  markFired: (transactionId: string) => void;
}

function readFiredIds(storage: Storage): string[] {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((id): id is string => typeof id === 'string') : [];
  } catch {
    return [];
  }
}

export function createPurchaseDedupStorage(
  getStorage: () => Storage = () => window.sessionStorage
): PurchaseDedupStorage {
  const memory = new Set<string>();

  return {
    hasFired: (transactionId) => {
      if (memory.has(transactionId)) return true;
      try {
        return readFiredIds(getStorage()).includes(transactionId);
      } catch {
        return false;
      }
    },
    markFired: (transactionId) => {
      memory.add(transactionId);
      try {
        const storage = getStorage();
        const ids = new Set(readFiredIds(storage));
        ids.add(transactionId);
        storage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
      } catch {
        // Keep the in-memory copy — storage is unavailable.
      }
    },
  };
}

/** Fires `trackEvent('purchase', params)` at most once per `transaction_id`. */
export function trackPurchaseOnce(params: PurchaseParams, storage: PurchaseDedupStorage): void {
  if (storage.hasFired(params.transaction_id)) return;
  trackEvent('purchase', params);
  storage.markFired(params.transaction_id);
}
