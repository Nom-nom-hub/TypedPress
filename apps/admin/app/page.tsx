'use client';

import { useEffect, useState } from 'react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export default function DashboardPage() {
  const [status, setStatus] = useState<string>('checking');

  useEffect(() => {
    fetch(`${apiUrl}/health`)
      .then((response) => response.json())
      .then((data) => setStatus(JSON.stringify(data)))
      .catch(() => setStatus('API unreachable'));
  }, []);

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>TypedPress Admin</h1>
      <p>Administrative foundation. API health: {status}</p>
      <nav>
        <a href="/login">Login</a> | <a href="/content-types">Content types</a> | <a href="/content-entries">Content entries</a>
      </nav>
    </main>
  );
}