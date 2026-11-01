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
    <>
      <div className="tp-topbar">
        <div>
          <h1 className="tp-title">Content types</h1>
          <p style={{ color: 'var(--tp-color-text-muted)', marginTop: 4 }}>Define structured content schemas for a site.</p>
        </div>
      </div>

      <div className="tp-grid tp-grid-2">
        <div className="tp-card">
          <h2 className="tp-card-title">Create content type</h2>
          <div className="tp-form-grid">
            <input className="tp-input" placeholder="Site ID" value={siteId} onChange={(e) => setSiteId(e.target.value)} />
            <input className="tp-input" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            <input className="tp-input" placeholder="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} />
            <div className="tp-row">
              <button className="tp-button" onClick={create}>Create</button>
              <button className="tp-button tp-button-secondary" onClick={load}>Reload</button>
            </div>
            {error ? <p style={{ color: 'var(--tp-color-danger)' }}>{error}</p> : null}
          </div>
        </div>

        <div className="tp-card">
          <h2 className="tp-card-title">Registered types</h2>
          <pre className="tp-pre">{JSON.stringify(types, null, 2)}</pre>
        </div>
      </div>
    </>
  );
}