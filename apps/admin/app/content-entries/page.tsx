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
    <>
      <div className="tp-topbar">
        <div>
          <h1 className="tp-title">Content entries</h1>
          <p style={{ color: 'var(--tp-color-text-muted)', marginTop: 4 }}>Create and inspect immutable content revisions.</p>
        </div>
      </div>

      <div className="tp-grid tp-grid-2">
        <div className="tp-card">
          <h2 className="tp-card-title">Create entry</h2>
          <div className="tp-form-grid">
            <input className="tp-input" placeholder="Site ID" value={siteId} onChange={(e) => setSiteId(e.target.value)} />
            <input className="tp-input" placeholder="Content type ID" value={contentTypeId} onChange={(e) => setContentTypeId(e.target.value)} />
            <input className="tp-input" placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
            <input className="tp-input" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <textarea className="tp-textarea" value={data} onChange={(e) => setData(e.target.value)} />
            <div className="tp-row">
              <button className="tp-button" onClick={create}>Create entry</button>
              <button className="tp-button tp-button-secondary" onClick={load}>Reload</button>
            </div>
            {error ? <p style={{ color: 'var(--tp-color-danger)' }}>{error}</p> : null}
          </div>
        </div>

        <div className="tp-card">
          <h2 className="tp-card-title">Entries</h2>
          <pre className="tp-pre">{JSON.stringify(entries, null, 2)}</pre>
        </div>
      </div>
    </>
  );
}