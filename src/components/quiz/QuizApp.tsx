import { useEffect, useRef, useState } from 'react';
import type { FormEvent } from 'react';
import Button from '@design-system/Button';
import Input from '@design-system/Input';
import { QUESTIONS } from '@utils/quiz/questions';
import { scoreQuiz } from '@utils/quiz/scoring';
import type { QuizResult as QuizScore } from '@utils/quiz/scoring';
import QuizProgress from './QuizProgress';
import QuizOptionCard from './QuizOptionCard';
import QuizResult from './QuizResult';

type Screen = 'intro' | 'question' | 'submitting' | 'result' | 'error';

interface QuizAppProps {
  /** Course bot URL (`PUBLIC_OPORA_BOT_URL`); falls back to `/contacts`. */
  botUrl?: string;
  /** Diagnostic booking URL (`PUBLIC_DIAGNOSTIC_BOOKING_URL`); falls back to calendly. */
  bookingUrl?: string;
}

const HANDLE_PATTERN = /^@?[a-zA-Z0-9._]{2,30}$/;
const GATE_ERROR = 'Впиши свій нік, щоб почати';
const TOTAL = QUESTIONS.length;

const FADE_CLASSES = 'motion-safe:animate-[quiz-fade_0.5s_ease_both]';
const FOCUS_CLASSES = 'focus-visible:outline-gold-700';

async function postSubmission(payload: {
  instagram: string;
  answers: Array<{ question: number; option: number }>;
}): Promise<boolean> {
  // One automatic retry; a non-ok response counts as a failure (shaping §3/§7)
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const response = await fetch('/api/submit-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (response.ok) {
        return true;
      }
    } catch {
      // Network failure — fall through to the retry / final failure
    }
  }
  return false;
}

/**
 * Quiz «На що ти опираєшся?» island.
 * State machine: intro → question(0..11) → submitting → result | error.
 */
export default function QuizApp({ botUrl, bookingUrl }: QuizAppProps) {
  const [screen, setScreen] = useState<Screen>('intro');
  const [handle, setHandle] = useState('');
  const [gateError, setGateError] = useState<string | undefined>(undefined);
  const [instagram, setInstagram] = useState('');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Array<number | null>>(Array(TOTAL).fill(null));
  const [result, setResult] = useState<QuizScore | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (screen === 'question') {
      headingRef.current?.focus();
    }
  }, [screen, questionIndex]);

  function handleStart(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const trimmed = handle.trim();
    if (!HANDLE_PATTERN.test(trimmed)) {
      setGateError(GATE_ERROR);
      inputRef.current?.focus();
      return;
    }
    setInstagram(trimmed.startsWith('@') ? trimmed : `@${trimmed}`);
    setScreen('question');
  }

  async function finishQuiz(finalAnswers: Array<number | null>, igHandle: string): Promise<void> {
    if (finalAnswers.some((answer) => answer === null)) {
      setScreen('error');
      return;
    }
    const complete = finalAnswers as number[];
    setScreen('submitting');

    const persisted = await postSubmission({
      instagram: igHandle,
      answers: complete.map((option, question) => ({ question, option })),
    });
    if (!persisted) {
      // Lead-loss event: submission failed after one retry; result still shown (D5)
      console.error('[quiz] lead lost: POST /api/submit-quiz failed after retry', {
        instagram: igHandle,
      });
    }

    try {
      setResult(scoreQuiz(complete.map((option, index) => QUESTIONS[index].options[option])));
      setScreen('result');
    } catch {
      setScreen('error');
    }
  }

  function selectOption(optionIndex: number): void {
    const next = [...answers];
    next[questionIndex] = optionIndex;
    setAnswers(next);
    if (questionIndex < TOTAL - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      void finishQuiz(next, instagram);
    }
  }

  if (screen === 'intro') {
    return (
      <div className={`relative ${FADE_CLASSES}`}>
        <span
          aria-hidden="true"
          className="absolute -left-6 bottom-2 top-2 hidden w-1.5 rounded-r bg-gold-500 sm:block"
        />
        <p className="mb-5 font-sans text-[13px] font-bold uppercase tracking-[0.22em] text-gold-800">
          Тест · 2 хвилини
        </p>
        <h1 className="mb-6 font-serif text-[2.5rem] font-bold leading-[1.05] tracking-tight text-navy-900 sm:text-5xl md:text-6xl">
          На що ти зараз <em className="italic text-gold-700">опираєшся?</em>
        </h1>
        <p className="mb-4 font-sans text-lg leading-relaxed text-navy-600 max-w-[44ch]">
          Ми всі на чомусь стоїмо. Питання тільки в тому, де твоя опора: усередині тебе чи в
          комусь іншому, кого можна втратити.
        </p>
        <p className="mb-4 font-sans text-lg leading-relaxed text-navy-600 max-w-[44ch]">
          12 запитань покажуть, скільки в тебе своєї опори, на кого ти спираєшся найбільше і чого
          тобі зараз бракує.
        </p>
        <p className="mt-2 mb-9 flex flex-wrap gap-x-6 gap-y-2 font-sans text-sm text-navy-600">
          <span>
            <b className="font-bold text-navy-900">12</b> запитань
          </span>
          <span>
            <b className="font-bold text-navy-900">2</b> хвилини
          </span>
          <span>чесно тільки з собою</span>
        </p>
        <form
          onSubmit={handleStart}
          noValidate
          className="mb-8 flex max-w-[420px] flex-col items-start gap-4"
        >
          <Input
            ref={inputRef}
            label="Підтверди, що ти не бот"
            placeholder="@твій нік в інстаграмі"
            type="text"
            autoComplete="off"
            spellCheck={false}
            maxLength={31}
            required
            value={handle}
            error={gateError}
            onChange={(event) => {
              setHandle(event.target.value);
              if (gateError) {
                setGateError(undefined);
              }
            }}
          />
          <Button type="submit" variant="primary" size="lg" className={FOCUS_CLASSES}>
            Почати тест
          </Button>
        </form>
        <p className="mt-2 font-sans text-xs leading-relaxed text-navy-600">
          Це не діагноз і не заміна допомоги фахівця. Просто дзеркало, щоб побачити себе трохи
          ясніше.
        </p>
      </div>
    );
  }

  if (screen === 'question') {
    const question = QUESTIONS[questionIndex];
    return (
      <div>
        <QuizProgress current={questionIndex + 1} total={TOTAL} />
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="mb-8 font-serif text-3xl font-bold leading-tight text-navy-900 focus:outline-none md:text-4xl"
        >
          {question.question}
        </h2>
        <div className="flex flex-col gap-3">
          {question.options.map((option, index) => (
            <QuizOptionCard
              key={index}
              text={option.text}
              selected={answers[questionIndex] === index}
              onSelect={() => selectOption(index)}
            />
          ))}
        </div>
        {questionIndex > 0 && (
          <Button
            variant="outline"
            size="md"
            className={`mt-7 ${FOCUS_CLASSES}`}
            onClick={() => setQuestionIndex(questionIndex - 1)}
          >
            Назад
          </Button>
        )}
      </div>
    );
  }

  if (screen === 'submitting') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="flex flex-col items-center gap-6 py-24 text-center"
      >
        <span
          aria-hidden="true"
          className="h-10 w-10 animate-spin rounded-full border-4 border-navy-100 border-t-gold-700"
        />
        <p className="font-serif text-xl text-navy-800">Рахуємо твій результат…</p>
      </div>
    );
  }

  if (screen === 'result' && result) {
    return (
      <QuizResult
        result={result}
        botUrl={botUrl || '/contacts'}
        bookingUrl={bookingUrl || 'https://calendly.com/'}
      />
    );
  }

  return (
    <div
      role="alert"
      className="mx-auto flex max-w-md flex-col items-center gap-5 py-24 text-center"
    >
      <span
        aria-hidden="true"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gold-100 font-serif text-2xl font-bold text-gold-800"
      >
        !
      </span>
      <h2 className="font-serif text-3xl font-bold text-navy-900">Щось пішло не так</h2>
      <p className="font-sans text-base text-navy-600">
        Не вдалося показати результат. Спробуй ще раз — твої відповіді збережені на цьому екрані.
      </p>
      <Button
        variant="primary"
        size="lg"
        className={FOCUS_CLASSES}
        onClick={() => void finishQuiz(answers, instagram)}
      >
        Спробувати ще раз
      </Button>
    </div>
  );
}
