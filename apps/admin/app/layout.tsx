import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TypedPress Admin',
  description: 'TypedPress administration foundation',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}