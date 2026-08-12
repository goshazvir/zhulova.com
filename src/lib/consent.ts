/**
 * Consent Mode v2 state (spec §8). Gates GA4 ad_storage/ad_user_data/
 * ad_personalization, Meta Pixel init, and the Clarity consent API behind
 * the cookie-consent banner's choice.
 *
 * Default posture (spec §8, open question §12.4 — founder has not yet
 * confirmed EU/EEA/UK ad traffic): ads denied by default, analytics_storage
 * granted by default so anonymous GA4 pageviews work under a "necessary"
 * bucket without requiring a click. If the founder wants stricter
 * default-denied-for-everything, flip `analytics_storage` below to
 * `'denied'` — everything else (gtag call shape, banner wiring) is
 * unaffected.
 */
import { initMetaPixel } from './metaPixel';

export type ConsentSignal = 'granted' | 'denied';

export interface ConsentState {
  ad_storage: ConsentSignal;
  ad_user_data: ConsentSignal;
  ad_personalization: ConsentSignal;
  analytics_storage: ConsentSignal;
}

export type ConsentChoice = 'accepted' | 'necessary';

export const DEFAULT_CONSENT_STATE: ConsentState = {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'granted',
};

const GRANTED_CONSENT_STATE: ConsentState = {
  ad_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted',
  analytics_storage: 'granted',
};

function consentStateFor(choice: ConsentChoice): ConsentState {
  return choice === 'accepted' ? GRANTED_CONSENT_STATE : DEFAULT_CONSENT_STATE;
}

const STORAGE_KEY = 'zh_consent_v1';

export interface ConsentStorage {
  read: () => ConsentChoice | null;
  write: (choice: ConsentChoice) => void;
}

function isConsentChoice(value: unknown): value is ConsentChoice {
  return value === 'accepted' || value === 'necessary';
}

/** localStorage wrapper matching `promoTrigger.ts`'s in-memory-fallback pattern. */
export function createConsentStorage(
  getStorage: () => Storage = () => window.localStorage,
  key: string = STORAGE_KEY
): ConsentStorage {
  let memory: ConsentChoice | null = null;

  return {
    read: () => {
      try {
        const raw = getStorage().getItem(key);
        if (raw === null) return memory;
        return isConsentChoice(raw) ? raw : memory;
      } catch {
        return memory;
      }
    },
    write: (choice) => {
      memory = choice;
      try {
        getStorage().setItem(key, choice);
      } catch {
        // Keep the in-memory copy — storage is unavailable.
      }
    },
  };
}

export function getConsentChoice(storage: ConsentStorage): ConsentChoice | null {
  return storage.read();
}

/**
 * Applies a consent choice: updates GA4 Consent Mode, grants/withholds the
 * Clarity consent signal, and — only on acceptance — initializes Meta Pixel.
 * Every vendor call is no-op-safe if that vendor's global isn't loaded.
 */
export function applyConsent(choice: ConsentChoice): void {
  const state = consentStateFor(choice);

  if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
    window.gtag('consent', 'update', state);
  }

  if (choice === 'accepted') {
    if (typeof window !== 'undefined' && typeof window.clarity === 'function') {
      window.clarity('consent');
    }
    initMetaPixel();
  }
}
