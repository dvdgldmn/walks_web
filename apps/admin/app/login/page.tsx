'use client';

import { FormEvent, useEffect, useState } from 'react';

const API_URL = '';
const ADMIN_HOME_PATH = '/translations';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}/api/auth/me`, {
      credentials: 'include',
    })
      .then((response) => {
        if (response.ok) {
          window.location.replace(ADMIN_HOME_PATH);
        }
      })
      .catch(() => {
        // Stay on login if the session check fails.
      });
  }, []);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json; charset=UTF-8',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        throw new Error('Invalid email or password');
      }

      await response.json();
      window.location.assign(ADMIN_HOME_PATH);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={onSubmit}>
        <h1>Dosty Admin</h1>
        <p className="muted">Sign in to manage translations, media, pages, and settings.</p>
        <label className="field">
          <span>Email</span>
          <input value={email} onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label className="field">
          <span>Password</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </label>
        {error ? <div className="error-box">{error}</div> : null}
        <button className="primary-button" disabled={loading} type="submit">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}
