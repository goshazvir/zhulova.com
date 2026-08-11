interface QuizProgressProps {
  current: number;
  total: number;
}

/** Progress row: `01 / 12` counter (aria-live) + progress bar. Design spec §5.1. */
export default function QuizProgress({ current, total }: QuizProgressProps) {
  const padded = String(current).padStart(2, '0');
  // Question 1 = 0% fill, matching the reference behavior
  const fillPct = ((current - 1) / total) * 100;

  return (
    <div className="mb-9 flex items-center gap-4">
      <span
        aria-live="polite"
        className="font-sans text-xl font-bold tabular-nums tracking-wide text-navy-800"
      >
        {padded} / {total}
      </span>
      <div
        role="progressbar"
        aria-label="Прогрес тесту"
        aria-valuemin={1}
        aria-valuemax={total}
        aria-valuenow={current}
        className="h-1.5 flex-1 overflow-hidden rounded-full bg-navy-100"
      >
        <div
          className="h-full rounded-full bg-gold-700 transition-[width] duration-500 ease-out"
          style={{ width: `${fillPct}%` }}
        />
      </div>
    </div>
  );
}
