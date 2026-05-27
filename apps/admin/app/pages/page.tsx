'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { apiFetch, PageItem } from '../lib/api';

const pageOrder = ['privacy', 'terms', 'rules', 'faq', 'shelter', 'contact'] as const;

const pageLabels: Record<string, string> = {
  privacy: 'Privacy Policy',
  terms: 'Terms of Use',
  rules: 'Rules',
  faq: 'FAQ',
  shelter: 'Shelter Page',
  contact: 'Contact Page',
};

const pageDescriptions: Record<string, string> = {
  privacy: 'Legal privacy page with bilingual content and SEO.',
  terms: 'Legal terms page with bilingual content and SEO.',
  rules: 'Leaderboard and Season Pass rules page with bilingual content and SEO.',
  faq: 'Frequently asked questions page for key app usage, rewards, and season logic.',
  shelter: 'Editorial page for the partner shelter, with long-form content and SEO.',
  contact: 'Secondary contact page with bilingual intro, SEO, and a live feedback form.',
};

export default function PagesPage() {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        const data = await apiFetch<PageItem[]>('/pages');
        setPages(data);
      } catch (error) {
        setStatus(error instanceof Error ? error.message : 'Failed to load pages');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const sortedPages = useMemo(() => {
    const indexed = [...pages];
    indexed.sort((a, b) => {
      const aIndex = pageOrder.indexOf(a.type as (typeof pageOrder)[number]);
      const bIndex = pageOrder.indexOf(b.type as (typeof pageOrder)[number]);
      const safeA = aIndex === -1 ? 999 : aIndex;
      const safeB = bIndex === -1 ? 999 : bIndex;
      if (safeA !== safeB) return safeA - safeB;
      return a.type.localeCompare(b.type);
    });
    return indexed;
  }, [pages]);

  if (loading) {
    return (
      <main className="page-wrap">
        <div className="panel">Loading pages…</div>
      </main>
    );
  }

  return (
    <main className="page-wrap">
      <div className="page-head">
        <h1>Pages</h1>
        <p>Open each page in its own editor. Shelter is separated so it can grow into a richer content model.</p>
      </div>

      <div className="stack-lg">
        {status ? <div className="muted">{status}</div> : null}
        <div className="page-card-grid">
          {sortedPages.map((page) => (
            <article className="panel page-card" key={page.id}>
              <div className="page-card__head">
                <div>
                  <h2>{pageLabels[page.type] ?? page.type}</h2>
                  <p className="muted">{pageDescriptions[page.type] ?? 'Manage bilingual content and SEO.'}</p>
                </div>
                <span className={`page-status ${page.published ? 'is-live' : 'is-draft'}`}>
                  {page.published ? 'Published' : 'Draft'}
                </span>
              </div>

              <div className="page-card__meta">
                <div>
                  <strong>Slug</strong>
                  <span>{page.slug}</span>
                </div>
                <div>
                  <strong>AZ title</strong>
                  <span>{page.titleAz}</span>
                </div>
                <div>
                  <strong>EN title</strong>
                  <span>{page.titleEn}</span>
                </div>
              </div>

              <div className="action-row">
                <Link className="primary-button" href={`/pages/${page.type}`}>
                  Open editor
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
