'use client';

import { useState } from 'react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  async function submit() {
    const response = await fetch(`${apiUrl}/auth/login`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok && data.token) {
      localStorage.setItem('typedpress_token', data.token);
      setMessage('Logged in');
    } else {
      setMessage(data.error ?? 'Login failed');
    }
  }

  return (
    <div className="tp-card" style={{ maxWidth: 420, margin: '8vh auto' }}>
      <h1 className="tp-title" style={{ fontSize: '1.4rem', marginBottom: 8 }}>Sign in</h1>
      <p style={{ color: 'var(--tp-color-text-muted)', marginTop: 0 }}>Access the TypedPress administration.</p>
      <div className="tp-form-grid">
        <input className="tp-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="tp-input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button className="tp-button" onClick={submit}>Sign in</button>
        {message ? <p style={{ color: message === 'Logged in' ? 'var(--tp-color-success)' : 'var(--tp-color-danger)' }}>{message}</p> : null}
      </div>
    </div>
  );
}