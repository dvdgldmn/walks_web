import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { LegalPageContent } from '../components/legal-page-content';
import { SecondaryShell } from '../components/secondary-shell';
import { getSecondaryPageBaseData } from '../page-data';
import { getPublicPage, Lang } from '../../lib/content';

type PrivacyProps = {
  params: Promise<{
    lang: Lang;
  }>;
};

export async function generateMetadata({ params }: PrivacyProps): Promise<Metadata> {
  const { lang } = await params;
  const page = await getPublicPage('privacy', lang).catch(() => null);

  return {
    title: page?.seoTitle || page?.title || 'Privacy Policy',
    description: page?.seoDescription || page?.title || 'Privacy Policy',
  };
}

export default async function PrivacyPolicyPage({ params }: PrivacyProps) {
  const { lang } = await params;
  const [baseData, page] = await Promise.all([
    getSecondaryPageBaseData(lang),
    getPublicPage('privacy', lang).catch(() => null),
  ]);

  if (!page) {
    notFound();
  }

  return (
    <SecondaryShell
      heroGhost="Legal"
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
