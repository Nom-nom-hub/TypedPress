'use client';

import { useEffect, useState } from 'react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export default function ContentEntriesPage() {
  const [entries, setEntries] = useState<Array<Record<string, unknown>>>([]);
  const [siteId, setSiteId] = useState('');
  const [contentTypeId, setContentTypeId] = useState('');
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [data, setData] = useState('{}');
  const [error, setError] = useState('');

  async function load() {
    const token = localStorage.getItem('typedpress_token');
    const response = await fetch(`${apiUrl}/content-entries?siteId=${encodeURIComponent(siteId)}`, {
      headers: { authorization: `Bearer ${token ?? ''}` },
    });
    const result = await response.json();
    if (response.ok) setEntries(result.contentEntries ?? []);
    else setError(result.error ?? 'Load failed');
  }

  async function create() {
    const token = localStorage.getItem('typedpress_token');
    let parsedData: unknown = {};
    try {
      parsedData = JSON.parse(data);
    } catch {
      setError('Data must be valid JSON');
      return;
    }
    const response = await fetch(`${apiUrl}/content-entries`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `Bearer ${token ?? ''}` },
      body: JSON.stringify({ siteId, contentTypeId, slug, title, data: parsedData, authorId: null }),
    });
    const result = await response.json();
    if (response.ok) {
      setSlug('');
      setTitle('');
      await load();
    } else setError(result.error ?? 'Create failed');
  }

  useEffect(() => {
    if (siteId) void load();
  }, [siteId]);

  return (
    <main style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>Content Entries</h1>
      <input placeholder="siteId" value={siteId} onChange={(e) => setSiteId(e.target.value)} />
      <button onClick={load}>Load</button>
      <br />
      <input placeholder="contentTypeId" value={contentTypeId} onChange={(e) => setContentTypeId(e.target.value)} />
      <br />
      <input placeholder="slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
      <br />
      <input placeholder="title" value={title} onChange={(e) => setTitle(e.target.value)} />
      <br />
      <textarea value={data} onChange={(e) => setData(e.target.value)} rows={6} cols={60} />
      <br />
      <button onClick={create}>Create Entry</button>
      <p>{error}</p>
      <pre>{JSON.stringify(entries, null, 2)}</pre>
    </main>
  );
}