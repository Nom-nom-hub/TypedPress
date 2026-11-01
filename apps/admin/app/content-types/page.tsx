'use client';

import { useEffect, useState } from 'react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export default function ContentTypesPage() {
  const [types, setTypes] = useState<Array<Record<string, unknown>>>([]);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [siteId, setSiteId] = useState('');
  const [error, setError] = useState('');

  async function load() {
    const token = localStorage.getItem('typedpress_token');
    const response = await fetch(`${apiUrl}/content-types?siteId=${encodeURIComponent(siteId)}`, {
      headers: { authorization: `Bearer ${token ?? ''}` },
    });
    const data = await response.json();
    if (response.ok) setTypes(data.contentTypes ?? []);
    else setError(data.error ?? 'Load failed');
  }

  async function create() {
    const token = localStorage.getItem('typedpress_token');
    const response = await fetch(`${apiUrl}/content-types`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token ?? ''}` },
      body: JSON.stringify({ siteId, name, slug }),
    });
    const data = await response.json();
    if (response.ok) {
      setName('');
      setSlug('');
      await load();
    } else setError(data.error ?? 'Create failed');
  }

  useEffect(() => {
    if (siteId) void load();
  }, [siteId]);

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Content Types</h1>
      <input placeholder="siteId" value={siteId} onChange={(e) => setSiteId(e.target.value)} />
      <br />
      <input placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
      <br />
      <input placeholder="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
      <br />
      <button onClick={create}>Create</button>
      <button onClick={load}>Load</button>
      <p>{error}</p>
      <pre>{JSON.stringify(types, null, 2)}</pre>
    </main>
  );
}