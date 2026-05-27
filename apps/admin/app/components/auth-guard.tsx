'use client';

import { usePathname, useRouter } from 'next/navigation';
import { ReactNode, useEffect, useState } from 'react';

const LOGIN_PATH = '/login';

export function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const normalizedPath = pathname?.replace(/\/+$/, '') || '/';

    if (normalizedPath === LOGIN_PATH) {
      setReady(true);
      return;
    }

    fetch('/api/auth/me', {
      credentials: 'include',
    })
      .then((response) => {
        if (cancelled) {
          return;
        }

        if (!response.ok) {
          router.replace(LOGIN_PATH);
          return;
        }

        setReady(true);
      })
      .catch(() => {
        if (!cancelled) {
          router.replace(LOGIN_PATH);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  if (!ready) {
    return (
      <main className="page-wrap">
        <div className="panel">Loading…</div>
      </main>
    );
  }

  return <>{children}</>;
}
