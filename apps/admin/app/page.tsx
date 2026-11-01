'use client';

import { useEffect, useState } from 'react';

const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';

export default function DashboardPage() {
  const [status, setStatus] = useState<string>('checking');

  useEffect(() => {
    fetch(`${apiUrl}/health`)
      .then((response) => response.json())
      .then((data) => setStatus((data as { status?: string }).status ?? 'ok'))
      .catch(() => setStatus('offline'));
  }, []);

  return (
    <>
      <div className="tp-topbar">
        <div>
          <h1 className="tp-title">Overview</h1>
          <p style={{ color: 'var(--tp-color-text-muted)', marginTop: 4 }}>Platform foundation and health</p>
        </div>
        <div className="tp-status">
          <span className={status === 'ok' ? 'tp-badge-success' : ''}>●</span> API {status}
        </div>
      </div>

      <div className="tp-grid tp-grid-3">
        <div className="tp-card">
          <p className="tp-stat-value">03</p>
          <p className="tp-stat-label">Phase foundation packages</p>
        </div>
        <div className="tp-card">
          <p className="tp-stat-value">09</p>
          <p className="tp-stat-label">Core platform packages</p>
        </div>
        <div className="tp-card">
          <p className="tp-stat-value">Uptime</p>
          <p className="tp-stat-label">API health monitored above</p>
        </div>
      </div>

      <div className="tp-grid" style={{ marginTop: 24 }}>
        <div className="tp-card">
          <h2 className="tp-card-title">Quick start</h2>
          <div className="tp-row">
            <a className="tp-button tp-button-secondary" href="/content-types">Manage content types</a>
            <a className="tp-button tp-button-secondary" href="/content-entries">Manage content entries</a>
            <a className="tp-button" href="/login">Sign in</a>
          </div>
        </div>
      </div>
    </>
  );
}