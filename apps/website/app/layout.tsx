import './globals.css';
// Landing CSS provides the shared SiteNav (landing variant) styles used by every
// page — secondary pages render the same nav now, just without scroll transparency.
import './[lang]/landing.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Dosty Walks Website',
  description: 'Public website scaffold for Dosty Walks',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
