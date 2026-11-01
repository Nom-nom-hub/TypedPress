import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TypedPress Admin',
  description: 'TypedPress administration foundation',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="tp-shell">
          <aside className="tp-sidebar">
            <div className="tp-brand">
              <div className="tp-brand-mark">T</div>
              <div>
                <div style={{ fontWeight: 600 }}>TypedPress</div>
                <div style={{ color: 'var(--tp-color-text-muted)', fontSize: '0.8rem' }}>Administration</div>
              </div>
            </div>
            <nav className="tp-nav" aria-label="Administration">
              <a href="/">Overview</a>
              <a href="/content-types">Content types</a>
              <a href="/content-entries">Content entries</a>
              <a href="/login">Login</a>
            </nav>
            <div style={{ marginTop: 'auto', color: 'var(--tp-color-text-muted)', fontSize: '0.8rem' }}>
              Platform foundation
            </div>
          </aside>
          <main className="tp-main">{children}</main>
        </div>
      </body>
    </html>
  );
}