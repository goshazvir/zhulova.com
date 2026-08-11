interface QuizOptionCardProps {
  text: string;
  selected: boolean;
  onSelect: () => void;
}

/** Tappable answer card with a radio-style marker. Design spec §5.2. */
export default function QuizOptionCard({ text, selected, onSelect }: QuizOptionCardProps) {
  const markerSelected = 'border-gold-700 shadow-[inset_0_0_0_5px_#9a7a16]';
  const markerIdle = 'border-navy-500 group-hover:border-gold-700';

  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onSelect}
      className="group flex w-full items-start gap-3.5 rounded-xl border border-navy-200 bg-white p-5 text-left font-sans text-base font-medium leading-snug text-navy-900 transition-colors hover:border-gold-700 hover:bg-gold-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-700 motion-safe:sm:hover:translate-x-0.5"
    >
      <span
        aria-hidden="true"
        className={`mt-0.5 h-[22px] w-[22px] flex-none rounded-full border-2 transition-all ${
          selected ? markerSelected : markerIdle
        }`}
      />
      <span>{text}</span>
    </button>
  );
}
