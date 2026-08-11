import { useEffect, useRef, useState } from 'react';
import { ARCH, BANDS } from '@utils/quiz/questions';
import type { QuizResult as QuizScore } from '@utils/quiz/scoring';
import { prefersReducedMotion } from './motion';

interface QuizResultProps {
  result: QuizScore;
  botUrl: string;
  bookingUrl: string;
}

const COUNT_UP_DURATION_MS = 700;
const BAR_DELAY_MS = 120;

const CTA_BODY =
  'Я зрозуміла, що багато хто втратив опору на себе, і це нормально. Ми живемо у світі, де коїться бозна що, і найголовніше тут не поїхати кукухою. Я зібрала основні речі, які повертають опору, і вмістила їх у курс «Опора на себе»: три дні по 20 хвилин, три маленькі кроки. Ми починаємо з тіла й доходимо до того, щоб ти нарешті відчула ґрунт під ногами. Я стала Майстром Рейкі й створила власну практику, яка заземляє та прибирає тривожність.';
const GIFT_BODY =
  'Я відкриваю тобі доступ на 48 годин до курсу «Опора на себе», який коштував 29 євро. Забирай його як подарунок, бо я справді хочу, щоб якомога більше людей повернули собі себе.';
const BONUS_BODY =
  'діагностична сесія зі мною особисто, щоб побачити, на що саме тобі варто спертись.';

const CONTENT_LABEL_CLASSES =
  'mb-2 font-sans text-[12px] font-bold uppercase tracking-[0.16em] text-gold-800';

/** Result screen: level block, type copy, CTA panel. Design spec §7. */
export default function QuizResult({ result, botUrl, bookingUrl }: QuizResultProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const arch = ARCH[result.resultType];
  const band = BANDS.find((entry) => entry.key === result.band) ?? BANDS[BANDS.length - 1];
  const reduced = prefersReducedMotion();

  const [displayPct, setDisplayPct] = useState(() => (reduced ? result.pct : 0));
  const [barPct, setBarPct] = useState(() => (reduced ? result.pct : 0));

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    sectionRef.current?.focus();
  }, []);

  useEffect(() => {
    if (prefersReducedMotion()) {
      return;
    }
    let raf = 0;
    let startTs: number | null = null;
    const tick = (ts: number) => {
      if (startTs === null) {
        startTs = ts;
      }
      const progress = Math.min((ts - startTs) / COUNT_UP_DURATION_MS, 1);
      setDisplayPct(Math.round(result.pct * progress));
      if (progress < 1) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    const barTimer = setTimeout(() => setBarPct(result.pct), BAR_DELAY_MS);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(barTimer);
    };
  }, [result.pct]);

  const ctaClasses =
    'inline-flex w-full items-center justify-center rounded-lg bg-gold-500 px-8 py-4 text-lg font-medium text-navy-900 transition-colors hover:bg-gold-400 focus:ring-2 focus:ring-offset-2 focus:ring-gold-600 focus-visible:outline-gold-700 sm:w-auto';
  const bookingClasses =
    'inline-flex items-center justify-center rounded-lg border-2 border-navy-900 bg-white px-6 py-3 font-medium text-navy-900 transition-colors hover:bg-navy-50 focus-visible:outline-gold-700';

  return (
    <div
      ref={sectionRef}
      tabIndex={-1}
      className="focus:outline-none motion-safe:animate-[quiz-fade_0.5s_ease_both]"
    >
      <section>
        <p className="mb-4 font-sans text-[13px] font-bold uppercase tracking-[0.22em] text-gold-800">
          Рівень твоєї опори
        </p>
        <div className="mb-4 flex items-baseline gap-4">
          <span className="font-serif text-6xl font-bold leading-none text-navy-900">
            {displayPct}%
          </span>
          <span className="font-serif text-2xl font-bold leading-tight text-navy-900">
            {band.title}
          </span>
        </div>
        <div
          role="img"
          aria-label={`Рівень опори: ${result.pct}%`}
          className="mb-4 h-2.5 overflow-hidden rounded-full bg-navy-100"
        >
          <div
            className="h-full rounded-full bg-gold-700 transition-[width] duration-[1100ms] ease-out"
            style={{ width: `${barPct}%` }}
          />
        </div>
        <p className="font-sans text-[15px] leading-relaxed text-navy-600 max-w-[52ch]">
          {band.description}
        </p>
      </section>

      <section className="mt-10">
        <p className="mb-2 font-sans text-[13px] font-bold uppercase tracking-[0.22em] text-gold-800">
          Твій тип опори
        </p>
        <h2 className="mb-7 font-serif text-4xl font-bold leading-[1.08] tracking-tight text-navy-900 sm:text-5xl">
          {arch.title}
        </h2>

        <div className="mb-6">
          <p className={CONTENT_LABEL_CLASSES}>На що ти зараз спираєшся</p>
          <p className="font-sans text-[17px] leading-relaxed text-navy-800">{arch.lean}</p>
        </div>
        <div className="mb-6">
          <p className={CONTENT_LABEL_CLASSES}>Де в тебе дефіцит</p>
          <p className="font-sans text-[17px] leading-relaxed text-navy-600">{arch.gap}</p>
        </div>
        <div className="mb-6">
          <p className={CONTENT_LABEL_CLASSES}>Перший крок уже сьогодні</p>
          <div className="rounded-r-lg border-l-2 border-gold-500 bg-gold-50 py-3 pl-5 pr-4">
            <p className="font-sans text-[17px] leading-relaxed text-navy-800">{arch.step}</p>
          </div>
        </div>
      </section>

      <section className="relative mt-9 overflow-hidden rounded-2xl bg-navy-900 p-7 text-white sm:p-9">
        <div
          aria-hidden="true"
          className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-gold-500/15"
        />
        <h3 className="mb-4 font-serif text-2xl font-bold leading-tight text-white sm:text-[28px]">
          Ще одна важлива дія, яку можна зробити вже зараз
        </h3>
        <p className="mb-6 font-sans text-[15px] leading-relaxed text-navy-100 max-w-[44ch]">
          {CTA_BODY}
        </p>
        <div className="mb-6 rounded-xl border border-gold-500/40 bg-white/10 p-5">
          <p className="mb-2 font-serif text-[22px] italic text-gold-300">Мій подарунок тобі</p>
          <p className="font-sans text-[15px] leading-relaxed text-white">{GIFT_BODY}</p>
        </div>
        <a href={botUrl} target="_blank" rel="noopener noreferrer" className={ctaClasses}>
          Забираю курс собі
        </a>
        <p className="mt-5 rounded-lg border border-gold-500/45 bg-gold-500/15 p-4 font-sans text-sm font-semibold leading-relaxed text-gold-100">
          <b className="text-gold-300">Ще один подарунок:</b> {BONUS_BODY}
        </p>
        <p className="mt-4 font-sans text-[13px] text-navy-200">
          Доступ відкритий 48 годин · зазвичай 29 €
        </p>
      </section>

      <p className="mt-6 font-sans text-sm leading-relaxed text-navy-600">
        Збережи свій результат у сторіс і познач{' '}
        <b className="font-bold text-gold-800">@viktoria_revolution</b>. Цікаво, на що опираєшся
        ти.
      </p>
      <p className="mt-6">
        <a href={bookingUrl} target="_blank" rel="noopener noreferrer" className={bookingClasses}>
          Записатись на діагностику вже зараз
        </a>
      </p>
      <p className="mt-10 font-sans text-xs leading-relaxed text-navy-600">
        Результат — це відображення сьогодення, а не вирок. Опора збирається. Крок за кроком.
      </p>
    </div>
  );
}
