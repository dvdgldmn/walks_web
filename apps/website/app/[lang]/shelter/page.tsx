import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SecondaryShell } from '../components/secondary-shell';
import { ShelterContent, ShelterPageContent } from '../components/shelter-page-content';
import { getShelterData } from '../page-data';
import { Lang } from '../../lib/content';

type ShelterPageProps = {
  params: Promise<{
    lang: Lang;
  }>;
};

export async function generateMetadata({ params }: ShelterPageProps): Promise<Metadata> {
  const { lang } = await params;
  const { shelterPage } = await getShelterData(lang);

  return {
    title: shelterPage?.seoTitle || shelterPage?.title || 'Shelter',
    description: shelterPage?.seoDescription || shelterPage?.title || 'Shelter',
  };
}

export default async function ShelterPage({ params }: ShelterPageProps) {
  const { lang } = await params;
  const data = await getShelterData(lang);

  if (!data.shelterPage) {
    notFound();
  }

  let parsedContent: ShelterContent | null = null;
  try {
    parsedContent = JSON.parse(data.shelterPage.content || '{}') as ShelterContent;
  } catch {
    parsedContent = null;
  }

  return (
    <SecondaryShell
      heroGhost="Shelter"
      heroSummary={
        (parsedContent?.heroIntro as string | undefined) ||
        'Baku Animal Rescue & Shelter cares for rescued dogs and relies on sustained community support.'
      }
      heroTitle={data.shelterPage.title}
      lang={lang}
      pages={data.pages}
      settings={data.settings}
      translations={data.translations}
    >
      <ShelterPageContent
        animals={data.shelterAnimals}
        content={parsedContent}
        logoAlt={data.shelterLogo?.alt}
        logoUrl={data.shelterLogo?.url}
      />
    </SecondaryShell>
  );
}
