import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TypedPress Site',
  description: 'TypedPress public website rendering foundation',
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
