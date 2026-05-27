import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LegalPageContent } from '../components/legal-page-content';
import { SecondaryShell } from '../components/secondary-shell';
import { getSecondaryPageBaseData } from '../page-data';
import { getPublicPage, Lang } from '../../lib/content';

type TermsProps = {
  params: Promise<{
    lang: Lang;
  }>;
};

export async function generateMetadata({ params }: TermsProps): Promise<Metadata> {
  const { lang } = await params;
  const page = await getPublicPage('terms', lang).catch(() => null);

  return {
    title: page?.seoTitle || page?.title || 'Terms of Use',
    description: page?.seoDescription || page?.title || 'Terms of Use',
  };
}

export default async function TermsOfUsePage({ params }: TermsProps) {
  const { lang } = await params;
  const [baseData, page] = await Promise.all([
    getSecondaryPageBaseData(lang),
    getPublicPage('terms', lang).catch(() => null),
  ]);

  if (!page) {
    notFound();
  }

  return (
    <SecondaryShell
      heroGhost="Terms"
      heroSummary={String(page.content || '').split('\n').map((line) => line.trim()).filter(Boolean)[0] || ''}
      heroTitle={page.title}
      lang={lang}
      pages={baseData.pages}
      settings={baseData.settings}
      translations={baseData.translations}
    >
      <LegalPageContent content={page.content} />
    </SecondaryShell>
  );
}
