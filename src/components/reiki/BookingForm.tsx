import { useState, type FormEvent } from 'react';

export default function BookingForm() {
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    const form = e.currentTarget;
    const formData = new FormData(form);

    const payload = {
      phone: formData.get('phone') as string,
      message: formData.get('request') as string,
      email: formData.get('email') as string,
      package: formData.get('package') as string,
      source: 'reiki-en',
    };

    try {
      const res = await fetch('/api/submit-lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSubmitted(true);
        form.reset();
      } else {
        setError('Something went wrong. Please try WhatsApp instead.');
      }
    } catch {
      setError('Something went wrong. Please try WhatsApp instead.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="book-form">
      <form id="booking-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="f-phone">Phone number</label>
          <input id="f-phone" name="phone" type="tel" required autoComplete="tel" />
        </div>
        <div className="field">
          <label htmlFor="f-request">What's on your mind?</label>
          <textarea id="f-request" name="request" required placeholder="A few words about what brings you here"></textarea>
        </div>
        <div className="field">
          <label htmlFor="f-email">Email</label>
          <input id="f-email" name="email" type="email" required autoComplete="email" />
        </div>
        <div className="field">
          <label htmlFor="f-pkg">Interested in</label>
          <select id="f-pkg" name="package">
            <option>Not sure yet</option>
            <option>Arrival Reset</option>
            <option>Your Week Here</option>
            <option>Single Session</option>
            <option>The Renewal</option>
            <option>The Immersion</option>
            <option>A session for my child</option>
          </select>
        </div>
        <label className="consent">
          <input type="checkbox" name="consent" required />
          I agree that my data is used only to reply to this request.
        </label>
        <div className="form-actions">
          <button type="submit" className="btn-gold" style={{ width: '100%', justifyContent: 'center' }} disabled={submitting}>
            {submitting ? 'Sending...' : 'Send'}
          </button>
          <a className="btn-wa" href="https://wa.me/380634543338" target="_blank" rel="noopener noreferrer">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Or write on WhatsApp
          </a>
        </div>
        {submitted && (
          <div className="form-ok" style={{ display: 'block' }}>
            Thank you — I'll get back to you on WhatsApp within 24 hours.
          </div>
        )}
        {error && (
          <div className="form-ok" style={{ display: 'block', color: '#e74c3c' }}>
            {error}
          </div>
        )}
      </form>
    </div>
  );
}
