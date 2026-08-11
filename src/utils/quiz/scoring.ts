import { BANDS, EXTERNAL_CATEGORIES, MAX_INTERNAL } from './questions';
import type { Category } from './questions';

export type { Category };

export interface AnswerScore {
  category: Category;
  internal: number;
}

export type CategoryCounts = Record<Category, number>;

export function computeInternalSum(answers: AnswerScore[]): number {
  return answers.reduce((sum, answer) => sum + answer.internal, 0);
}

export function pctFromInternal(internal: number): number {
  return Math.round((internal / MAX_INTERNAL) * 100);
}

export function resolveBand(pct: number): string {
  for (const band of BANDS) {
    if (pct >= band.min) {
      return band.key;
    }
  }
  return BANDS[BANDS.length - 1].key;
}

export function countCategories(answers: AnswerScore[]): CategoryCounts {
  const result: CategoryCounts = {
    mama: 0,
    tato: 0,
    rodyna: 0,
    partner: 0,
    kontrol: 0,
    sebe: 0,
  };
  for (const answer of answers) {
    result[answer.category]++;
  }
  return result;
}

export function resolveResultType(pct: number, categoryCounts: CategoryCounts): Category {
  if (pct >= 70) {
    return 'sebe';
  }

  if (pct >= 50) {
    const maxExternal = Math.max(...EXTERNAL_CATEGORIES.map((cat) => categoryCounts[cat]));
    if (categoryCounts.sebe >= maxExternal + 2) {
      return 'sebe';
    }
  }

  // First-wins tie-break in order: mama, tato, rodyna, partner, kontrol
  let dominant: Category = EXTERNAL_CATEGORIES[0];
  let dominantCount = categoryCounts[dominant];
  for (const cat of EXTERNAL_CATEGORIES.slice(1)) {
    if (categoryCounts[cat] > dominantCount) {
      dominant = cat;
      dominantCount = categoryCounts[cat];
    }
  }
  return dominant;
}

export interface QuizResult {
  internal: number;
  pct: number;
  band: string;
  resultType: Category;
}

export function scoreQuiz(answers: AnswerScore[]): QuizResult {
  const internal = computeInternalSum(answers);
  const pct = pctFromInternal(internal);
  const band = resolveBand(pct);
  const categoryCounts = countCategories(answers);
  const resultType = resolveResultType(pct, categoryCounts);
  return { internal, pct, band, resultType };
}
