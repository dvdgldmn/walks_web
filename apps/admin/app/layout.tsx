import './globals.css';
import type { Metadata } from 'next';
import { ReactNode } from 'react';
import { AdminShell } from './components/admin-shell';
import { AuthGuard } from './components/auth-guard';

export const metadata: Metadata = {
  title: 'Dosty Walks Admin',
  description: 'Admin panel scaffold for Dosty Walks',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AdminShell>
          <AuthGuard>{children}</AuthGuard>
        </AdminShell>
      </body>
    </html>
  );
}
