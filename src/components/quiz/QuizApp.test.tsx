import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { UserEvent } from '@testing-library/user-event';
import QuizApp from './QuizApp';
import { QUESTIONS } from '@utils/quiz/questions';
import {
  INSTAGRAM_FORMAT_ERROR,
  INSTAGRAM_NOT_FOUND_ERROR,
} from '@utils/quiz/instagram';

/**
 * Expected result fixture: answering the FIRST option of every question gives
 * internal sum 14 → pct 39 → band "25" («Опора майже вся зовнішня»),
 * dominant external category "mama" (first-wins tie-break) → «Хороша дочка».
 */
const EXPECTED_PCT_TEXT = '39%';
const EXPECTED_BAND_TITLE = 'Опора майже вся зовнішня';
const EXPECTED_TYPE_TITLE = 'Хороша дочка';

const GATE_LABEL = /Підтверди, що ти не бот/;
const GATE_ERROR = 'Впиши свій нік, щоб почати';
const GATE_PLACEHOLDER = '@твій нік в інстаграмі';
const START_LABEL = 'Почати тест';
const BACK_LABEL = 'Назад';
const COURSE_CTA_LABEL = 'Забираю курс собі';
const BOOKING_CTA_LABEL = 'Записатись на діагностику вже зараз';
const GIFT_HEADLINE = '🎁 Мій подарунок тобі';
const GIFT_PARAGRAPH_1 =
  'Я відкриваю тобі доступ до курсу «Опора на себе» — того самого, що коштує 9 €. Перші уроки лишаються з тобою, забирай як подарунок 💛';
const GIFT_PARAGRAPH_2 = 'Я справді хочу, щоб якомога більше людей повернули собі себе.';

function stubMatchMedia(matches: boolean): void {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  );
}

function okResponse(): Promise<Partial<Response>> {
  return Promise.resolve({ ok: true, status: 200, json: () => Promise.resolve({ success: true }) });
}

async function startQuiz(user: UserEvent, handle = '@test.handle'): Promise<void> {
  await user.type(screen.getByLabelText(GATE_LABEL), handle);
  await user.click(screen.getByRole('button', { name: START_LABEL }));
}

/** Answer questions [from..to) by clicking the first option of each. */
async function answerQuestions(user: UserEvent, from: number, to: number): Promise<void> {
  for (let i = from; i < to; i++) {
    await user.click(screen.getByRole('button', { name: QUESTIONS[i].options[0].text }));
  }
}

describe('QuizApp', () => {
  let fetchMock: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    // Reduced motion by default: deterministic (no count-up / delayed bars)
    stubMatchMedia(true);
    fetchMock = vi.fn().mockImplementation(okResponse);
    vi.stubGlobal('fetch', fetchMock);
    vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe('intro gate (AC-1)', () => {
    it('renders the gate input with exact label and placeholder', () => {
      render(<QuizApp />);
      const input = screen.getByLabelText(GATE_LABEL);
      expect(input).toHaveAttribute('placeholder', GATE_PLACEHOLDER);
    });

    it('shows the gate error and does not start the quiz on empty handle', async () => {
      const user = userEvent.setup();
      render(<QuizApp />);
      await user.click(screen.getByRole('button', { name: START_LABEL }));
      expect(screen.getByRole('alert')).toHaveTextContent(GATE_ERROR);
      expect(screen.queryByText(QUESTIONS[0].question)).not.toBeInTheDocument();
    });

    it('rejects a malformed nick with the Ukrainian format error (ADR-0002 #1)', async () => {
      const user = userEvent.setup();
      render(<QuizApp />);
      await user.type(screen.getByLabelText(GATE_LABEL), 'bad handle!');
      await user.click(screen.getByRole('button', { name: START_LABEL }));
      expect(screen.getByRole('alert')).toHaveTextContent(INSTAGRAM_FORMAT_ERROR);
      expect(screen.queryByText(QUESTIONS[0].question)).not.toBeInTheDocument();
    });

    it.each(['.nick', 'nick.', 'ni..ck'])(
      'rejects dot-rule violation "%s" before starting the quiz',
      async (nick) => {
        const user = userEvent.setup();
        render(<QuizApp />);
        await user.type(screen.getByLabelText(GATE_LABEL), nick);
        await user.click(screen.getByRole('button', { name: START_LABEL }));
        expect(screen.getByRole('alert')).toHaveTextContent(INSTAGRAM_FORMAT_ERROR);
        expect(screen.queryByText(QUESTIONS[0].question)).not.toBeInTheDocument();
      }
    );

    it('clears the gate error on next input', async () => {
      const user = userEvent.setup();
      render(<QuizApp />);
      await user.click(screen.getByRole('button', { name: START_LABEL }));
      expect(screen.getByRole('alert')).toBeInTheDocument();
      await user.type(screen.getByLabelText(GATE_LABEL), 'ok');
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('starts the quiz with a valid handle', async () => {
      const user = userEvent.setup();
      render(<QuizApp />);
      await startQuiz(user);
      expect(screen.getByText(QUESTIONS[0].question)).toBeInTheDocument();
      expect(screen.getByText('01 / 12')).toBeInTheDocument();
    });

    it('starts the quiz on Enter inside the input', async () => {
      const user = userEvent.setup();
      render(<QuizApp />);
      await user.type(screen.getByLabelText(GATE_LABEL), 'test.handle{Enter}');
      expect(screen.getByText(QUESTIONS[0].question)).toBeInTheDocument();
    });
  });

  describe('question flow (AC-2, AC-5)', () => {
    it('renders 4 real option buttons for the current question', async () => {
      const user = userEvent.setup();
      render(<QuizApp />);
      await startQuiz(user);
      for (const option of QUESTIONS[0].options) {
        expect(screen.getByRole('button', { name: option.text })).toBeInTheDocument();
      }
    });

    it('advances to the next question and updates progress on answer', async () => {
      const user = userEvent.setup();
      render(<QuizApp />);
      await startQuiz(user);
      await answerQuestions(user, 0, 1);
      expect(screen.getByText(QUESTIONS[1].question)).toBeInTheDocument();
      expect(screen.getByText('02 / 12')).toBeInTheDocument();
    });

    it('announces progress via an aria-live=polite counter', async () => {
      const user = userEvent.setup();
      render(<QuizApp />);
      await startQuiz(user);
      expect(screen.getByText('01 / 12')).toHaveAttribute('aria-live', 'polite');
    });

    it('exposes a progressbar with the current question number', async () => {
      const user = userEvent.setup();
      render(<QuizApp />);
      await startQuiz(user);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '1');
      await answerQuestions(user, 0, 1);
      expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '2');
    });

    it('moves focus to the question heading on advance', async () => {
      const user = userEvent.setup();
      render(<QuizApp />);
      await startQuiz(user);
      await answerQuestions(user, 0, 1);
      const heading = screen.getByRole('heading', { name: QUESTIONS[1].question });
      expect(document.activeElement).toBe(heading);
    });

    it('hides the back button on question 1', async () => {
      const user = userEvent.setup();
      render(<QuizApp />);
      await startQuiz(user);
      expect(screen.queryByRole('button', { name: BACK_LABEL })).not.toBeInTheDocument();
    });

    it('back restores the previous question with its answer preselected', async () => {
      const user = userEvent.setup();
      render(<QuizApp />);
      await startQuiz(user);
      await user.click(screen.getByRole('button', { name: QUESTIONS[0].options[2].text }));
      expect(screen.getByText(QUESTIONS[1].question)).toBeInTheDocument();
      await user.click(screen.getByRole('button', { name: BACK_LABEL }));
      expect(screen.getByText(QUESTIONS[0].question)).toBeInTheDocument();
      expect(screen.getByText('01 / 12')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: QUESTIONS[0].options[2].text })).toHaveAttribute(
        'aria-pressed',
        'true'
      );
      expect(screen.getByRole('button', { name: QUESTIONS[0].options[0].text })).toHaveAttribute(
        'aria-pressed',
        'false'
      );
    });
  });

  describe('submission (AC-3)', () => {
    it('fires exactly one POST with the canonical bare nick and 12 raw answers', async () => {
      const user = userEvent.setup();
      render(<QuizApp />);
      await startQuiz(user, '@Test.Handle');
      await answerQuestions(user, 0, 12);
      await screen.findByText(EXPECTED_TYPE_TITLE);

      expect(fetchMock).toHaveBeenCalledTimes(1);
      const [url, init] = fetchMock.mock.calls[0];
      expect(url).toBe('/api/submit-quiz');
      expect(init.method).toBe('POST');
      const body = JSON.parse(init.body);
      expect(body.instagram).toBe('test.handle');
      expect(body.answers).toHaveLength(12);
      body.answers.forEach((answer: Record<string, unknown>, index: number) => {
        expect(Object.keys(answer).sort()).toEqual(['option', 'question']);
        expect(answer.question).toBe(index);
        expect(answer.option).toBe(0);
      });
    });

    it('shows the submitting state while the POST is in flight', async () => {
      let resolveFetch: (value: Partial<Response>) => void = () => {};
      fetchMock.mockImplementation(
        () => new Promise((resolve) => { resolveFetch = resolve; })
      );
      const user = userEvent.setup();
      render(<QuizApp />);
      await startQuiz(user);
      await answerQuestions(user, 0, 12);
      expect(screen.getByRole('status')).toHaveTextContent('Рахуємо твій результат…');
      resolveFetch({ ok: true, status: 200, json: () => Promise.resolve({ success: true }) });
      await screen.findByText(EXPECTED_TYPE_TITLE);
    });

    it('renders the result screen with pct, band, type copy and both CTA hrefs', async () => {
      const user = userEvent.setup();
      render(
        <QuizApp botUrl="https://t.me/opora_bot" bookingUrl="https://calendly.com/viktoria/diag" />
      );
      await startQuiz(user);
      await answerQuestions(user, 0, 12);

      await screen.findByText(EXPECTED_TYPE_TITLE);
      expect(screen.getByText(EXPECTED_PCT_TEXT)).toBeInTheDocument();
      expect(screen.getByText(EXPECTED_BAND_TITLE)).toBeInTheDocument();
      expect(screen.getByRole('link', { name: COURSE_CTA_LABEL })).toHaveAttribute(
        'href',
        'https://t.me/opora_bot'
      );
      expect(screen.getByRole('link', { name: BOOKING_CTA_LABEL })).toHaveAttribute(
        'href',
        'https://calendly.com/viktoria/diag'
      );
    });

    it('falls back to /contacts and calendly.com when CTA urls are not configured', async () => {
      const user = userEvent.setup();
      render(<QuizApp />);
      await startQuiz(user);
      await answerQuestions(user, 0, 12);

      await screen.findByText(EXPECTED_TYPE_TITLE);
      expect(screen.getByRole('link', { name: COURSE_CTA_LABEL })).toHaveAttribute(
        'href',
        '/contacts'
      );
      expect(screen.getByRole('link', { name: BOOKING_CTA_LABEL })).toHaveAttribute(
        'href',
        'https://calendly.com/viktoriazhulova/30min'
      );
    });
  });

  describe('submission failure (AC-4)', () => {
    it('retries once, still shows the result and logs the lead loss when both attempts fail', async () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      fetchMock.mockRejectedValue(new Error('network down'));
      const user = userEvent.setup();
      render(<QuizApp />);
      await startQuiz(user);
      await answerQuestions(user, 0, 12);

      await screen.findByText(EXPECTED_TYPE_TITLE);
      expect(fetchMock).toHaveBeenCalledTimes(2);
      expect(consoleError).toHaveBeenCalled();
      expect(screen.getByText(EXPECTED_PCT_TEXT)).toBeInTheDocument();
    });

    it('treats a non-ok response as a failure and succeeds on the retry', async () => {
      fetchMock
        .mockImplementationOnce(() =>
          Promise.resolve({ ok: false, status: 500, json: () => Promise.resolve({}) })
        )
        .mockImplementationOnce(okResponse);
      const user = userEvent.setup();
      render(<QuizApp />);
      await startQuiz(user);
      await answerQuestions(user, 0, 12);

      await screen.findByText(EXPECTED_TYPE_TITLE);
      expect(fetchMock).toHaveBeenCalledTimes(2);
    });
  });

  describe('instagram not found (GEO-24, ADR-0002 #5)', () => {
    function notFoundResponse(): Promise<Partial<Response>> {
      return Promise.resolve({
        ok: false,
        status: 400,
        json: () =>
          Promise.resolve({
            success: false,
            error: 'instagram_not_found',
            message: INSTAGRAM_NOT_FOUND_ERROR,
          }),
      });
    }

    it('returns to an editable nick field with the not-found error, without retrying', async () => {
      fetchMock.mockImplementation(notFoundResponse);
      const user = userEvent.setup();
      render(<QuizApp />);
      await startQuiz(user, 'ghost.nick');
      await answerQuestions(user, 0, 12);

      const input = await screen.findByLabelText(GATE_LABEL);
      expect(screen.getByRole('alert')).toHaveTextContent(INSTAGRAM_NOT_FOUND_ERROR);
      expect(input).toHaveValue('ghost.nick');
      expect(fetchMock).toHaveBeenCalledTimes(1); // a confirmed-missing nick is not retried
    });

    it('resubmits all 12 preserved answers with the corrected nick, skipping the questions', async () => {
      fetchMock.mockImplementationOnce(notFoundResponse).mockImplementation(okResponse);
      const user = userEvent.setup();
      render(<QuizApp />);
      await startQuiz(user, 'ghost.nick');
      await answerQuestions(user, 0, 12);

      const input = await screen.findByLabelText(GATE_LABEL);
      await user.clear(input);
      await user.type(input, 'real.nick');
      await user.click(screen.getByRole('button', { name: START_LABEL }));

      await screen.findByText(EXPECTED_TYPE_TITLE);
      expect(fetchMock).toHaveBeenCalledTimes(2);
      const body = JSON.parse(fetchMock.mock.calls[1][1].body);
      expect(body.instagram).toBe('real.nick');
      expect(body.answers).toHaveLength(12);
    });
  });

  describe('result screen details (AC-3, AC-5)', () => {
    it('moves focus to the result region on entry', async () => {
      const user = userEvent.setup();
      render(<QuizApp />);
      await startQuiz(user);
      await answerQuestions(user, 0, 12);
      await screen.findByText(EXPECTED_TYPE_TITLE);
      expect(document.activeElement?.textContent).toContain('Рівень твоєї опори');
    });

    it('renders the final percentage statically under reduced motion', async () => {
      const user = userEvent.setup();
      render(<QuizApp />);
      await startQuiz(user);
      await answerQuestions(user, 0, 12);
      await screen.findByText(EXPECTED_TYPE_TITLE);
      // matchMedia stub reports reduced motion → no count-up, value is final at once
      expect(screen.getByText(EXPECTED_PCT_TEXT)).toBeInTheDocument();
      expect(
        screen.getByRole('img', { name: `Рівень опори: ${EXPECTED_PCT_TEXT}` })
      ).toBeInTheDocument();
    });

    it('renders the gift block with the 🎁 headline and two-paragraph copy (GEO-28)', async () => {
      const user = userEvent.setup();
      render(<QuizApp />);
      await startQuiz(user);
      await answerQuestions(user, 0, 12);
      await screen.findByText(EXPECTED_TYPE_TITLE);

      expect(screen.getByText(GIFT_HEADLINE)).toBeInTheDocument();
      const paragraphOne = screen.getByText(GIFT_PARAGRAPH_1);
      const paragraphTwo = screen.getByText(GIFT_PARAGRAPH_2);
      expect(paragraphOne.tagName).toBe('P');
      expect(paragraphTwo.tagName).toBe('P');
      expect(paragraphTwo).not.toBe(paragraphOne);
    });

    it('counts the percentage up to the final value when motion is allowed', async () => {
      stubMatchMedia(false);
      const user = userEvent.setup();
      render(<QuizApp />);
      await startQuiz(user);
      await answerQuestions(user, 0, 12);
      await screen.findByText(EXPECTED_TYPE_TITLE);
      await waitFor(
        () => expect(screen.getByText(EXPECTED_PCT_TEXT)).toBeInTheDocument(),
        { timeout: 3000 }
      );
    });
  });
});
