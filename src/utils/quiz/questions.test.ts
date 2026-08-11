/**
 * Unit tests for the canonical quiz content module (GEO-16).
 *
 * Verifies structure (12 questions × 4 options, categories, internal scores,
 * MAX_INTERNAL) and that all Ukrainian copy is VERBATIM identical to the
 * reference implementation in docs/reference/test_opora.html (acceptance
 * criterion 6): the reference QUESTIONS / ARCH / BANDS constants are extracted
 * from the HTML and deep-compared against this module.
 */
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

import { describe, expect, it } from 'vitest';

import {
  ARCH,
  BANDS,
  CATEGORIES,
  EXTERNAL_CATEGORIES,
  MAX_INTERNAL,
  QUESTIONS,
} from './questions';

interface ReferenceOption {
  t: string;
  c: string;
  i: number;
}
interface ReferenceQuestion {
  q: string;
  a: ReferenceOption[];
}
interface ReferenceArchEntry {
  title: string;
  kick: string;
  lean: string;
  gap: string;
  step: string;
}
interface ReferenceBand {
  min: number;
  t: string;
  d: string;
}
interface ReferenceData {
  QUESTIONS: ReferenceQuestion[];
  ARCH: Record<string, ReferenceArchEntry>;
  BANDS: ReferenceBand[];
}

/** Extract the QUESTIONS / ARCH / BANDS constants from the reference HTML. */
function loadReferenceData(): ReferenceData {
  const html = readFileSync(
    resolve(__dirname, '../../../docs/reference/test_opora.html'),
    'utf-8'
  );
  const start = html.indexOf('const QUESTIONS = [');
  const end = html.indexOf('// state', start);
  if (start === -1 || end === -1) {
    throw new Error('Could not locate quiz data in reference HTML');
  }
  const source = html.slice(start, end);
  // eslint-disable-next-line @typescript-eslint/no-implied-eval -- test-only: evaluates trusted repo-local reference data
  const factory = new Function(`${source}; return { QUESTIONS, ARCH, BANDS };`);
  return factory() as ReferenceData;
}

const reference = loadReferenceData();

describe('QUESTIONS structure', () => {
  it('contains exactly 12 questions with 4 options each', () => {
    expect(QUESTIONS).toHaveLength(12);
    for (const question of QUESTIONS) {
      expect(question.question.length).toBeGreaterThan(0);
      expect(question.options).toHaveLength(4);
    }
  });

  it('every option has a valid category and an integer internal score 0–3', () => {
    for (const question of QUESTIONS) {
      for (const option of question.options) {
        expect(CATEGORIES).toContain(option.category);
        expect(Number.isInteger(option.internal)).toBe(true);
        expect(option.internal).toBeGreaterThanOrEqual(0);
        expect(option.internal).toBeLessThanOrEqual(3);
      }
    }
  });

  it('every question has exactly one sebe option scored 3 (max sum = MAX_INTERNAL)', () => {
    let maxSum = 0;
    for (const question of QUESTIONS) {
      const sebeMax = question.options.filter(
        (option) => option.category === 'sebe' && option.internal === 3
      );
      expect(sebeMax).toHaveLength(1);
      maxSum += Math.max(...question.options.map((option) => option.internal));
    }
    expect(maxSum).toBe(MAX_INTERNAL);
    expect(MAX_INTERNAL).toBe(36);
  });
});

describe('category constants', () => {
  it('defines the 6 categories and the external tie-break order', () => {
    expect(CATEGORIES).toEqual(['mama', 'tato', 'rodyna', 'partner', 'kontrol', 'sebe']);
    expect(EXTERNAL_CATEGORIES).toEqual(['mama', 'tato', 'rodyna', 'partner', 'kontrol']);
  });
});

describe('ARCH result copy', () => {
  it('has a complete non-empty copy block for each of the 6 categories', () => {
    expect(Object.keys(ARCH).sort()).toEqual([...CATEGORIES].sort());
    for (const category of CATEGORIES) {
      const block = ARCH[category];
      expect(block.title.length).toBeGreaterThan(0);
      expect(block.kick.length).toBeGreaterThan(0);
      expect(block.lean.length).toBeGreaterThan(0);
      expect(block.gap.length).toBeGreaterThan(0);
      expect(block.step.length).toBeGreaterThan(0);
    }
  });
});

describe('BANDS copy', () => {
  it('has 4 bands with thresholds 70/45/25/0 and matching keys', () => {
    expect(BANDS.map((band) => band.min)).toEqual([70, 45, 25, 0]);
    expect(BANDS.map((band) => band.key)).toEqual(['70', '45', '25', '0']);
    for (const band of BANDS) {
      expect(band.title.length).toBeGreaterThan(0);
      expect(band.description.length).toBeGreaterThan(0);
    }
  });
});

describe('verbatim parity with docs/reference/test_opora.html', () => {
  it('QUESTIONS match the reference exactly (text, category, internal)', () => {
    expect(
      QUESTIONS.map((question) => ({
        q: question.question,
        a: question.options.map((option) => ({
          t: option.text,
          c: option.category,
          i: option.internal,
        })),
      }))
    ).toEqual(reference.QUESTIONS);
  });

  it('ARCH copy matches the reference exactly', () => {
    const arch = Object.fromEntries(
      Object.entries(ARCH).map(([key, block]) => [
        key,
        {
          title: block.title,
          kick: block.kick,
          lean: block.lean,
          gap: block.gap,
          step: block.step,
        },
      ])
    );
    expect(arch).toEqual(reference.ARCH);
  });

  it('BANDS copy matches the reference exactly', () => {
    expect(
      BANDS.map((band) => ({ min: band.min, t: band.title, d: band.description }))
    ).toEqual(reference.BANDS);
  });
});
