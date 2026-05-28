'use client';

import { FormEvent, useState } from 'react';
import styles from './secondary-shell.module.css';

type ContactDictionary = {
  eyebrow: string;
  fallback: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  submit: string;
  sending: string;
  success: string;
  failure: string;
};

export function ContactForm({
  dictionary,
  intro,
  lang,
}: {
  dictionary: ContactDictionary;
  intro: string[];
  lang: 'az' | 'en';
}) {
  const [status, setStatus] = useState<string>('');
  const [statusKind, setStatusKind] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitting, setSubmitting] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    setSubmitting(true);
    setStatus(dictionary.sending);
    setStatusKind('idle');

    try {
      const formData = new FormData(form);
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        body: JSON.stringify({
          name: String(formData.get('name') || '').trim(),
          email: String(formData.get('email') || '').trim(),
          phone: String(formData.get('phone') || '').trim(),
          subject: String(formData.get('subject') || '').trim(),
          message: String(formData.get('message') || '').trim(),
          lang,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || dictionary.failure);
      }

      form.reset();
      setStatus(dictionary.success);
      setStatusKind('success');
    } catch (error) {
      setStatus(error instanceof Error && error.message ? error.message : dictionary.failure);
      setStatusKind('error');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className={styles.section}>
      <span className={styles.eyebrow}>{dictionary.eyebrow}</span>
      <div className={styles.contactIntro}>
        {(intro.length ? intro : [dictionary.fallback]).map((line, index) => (
          <p key={`${line}-${index}`}>{line}</p>
        ))}
      </div>
      <form className={styles.contactForm} onSubmit={onSubmit}>
        <div className={styles.contactGrid}>
          <div className={styles.field}>
            <label htmlFor="contactName">{dictionary.name}</label>
            <input
              id="contactName"
              name="name"
              required
              type="text"
              maxLength={120}
              autoComplete="name"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="contactEmail">{dictionary.email}</label>
            <input
              id="contactEmail"
              name="email"
              required
              type="email"
              maxLength={160}
              autoComplete="email"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="contactPhone">{dictionary.phone}</label>
            <input
              id="contactPhone"
              name="phone"
              type="tel"
              maxLength={40}
              autoComplete="tel"
              inputMode="tel"
            />
          </div>
          <div className={styles.field}>
            <label htmlFor="contactSubject">{dictionary.subject}</label>
            <input
              id="contactSubject"
              name="subject"
              type="text"
              maxLength={160}
              autoComplete="off"
            />
          </div>
          <div className={styles.fieldFull}>
            <label htmlFor="contactMessage">{dictionary.message}</label>
            <textarea
              id="contactMessage"
              name="message"
              required
              minLength={10}
              maxLength={5000}
              autoComplete="off"
            />
          </div>
        </div>
        <div className={styles.contactActions}>
          <button className={styles.cta} disabled={submitting} type="submit">
            {submitting ? dictionary.sending : dictionary.submit}
          </button>
          {status ? (
            <span
              className={`${styles.status} ${
                statusKind === 'error'
                  ? styles.statusError
                  : statusKind === 'success'
                    ? styles.statusSuccess
                    : ''
              }`}
            >
              {status}
            </span>
          ) : null}
        </div>
      </form>
    </section>
  );
}
