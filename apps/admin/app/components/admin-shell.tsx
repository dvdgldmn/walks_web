'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { ReactNode } from 'react';

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  if (pathname === '/login') {
    return <>{children}</>;
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
    } finally {
      router.replace('/login');
    }
  };

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="admin-brand">Dosty Admin</div>
        <nav className="admin-nav">
          <Link href="/">Overview</Link>
          <Link href="/translations">Translations</Link>
          <Link href="/media">Media</Link>
          <Link href="/pages">Pages</Link>
          <Link href="/settings">Settings</Link>
        </nav>
        <button className="ghost-button admin-logout" onClick={logout} type="button">
          Log out
        </button>
      </aside>
      <div className="admin-main">{children}</div>
    </div>
  );
}
