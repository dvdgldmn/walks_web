import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContactForm } from '../components/contact-form';
import { LegalPageContent } from '../components/legal-page-content';
import { SecondaryShell } from '../components/secondary-shell';
import { ShelterContent, ShelterPageContent } from '../components/shelter-page-content';
import { getDynamicPageBySlug, getSecondaryPageBaseData, getShelterData } from '../page-data';
import { Lang } from '../../lib/content';

type DynamicLegalProps = {
  params: Promise<{
    lang: Lang;
    slug: string;
  }>;
};

export async function generateMetadata({ params }: DynamicLegalProps): Promise<Metadata> {
  const { lang, slug } = await params;
  const page = await getDynamicPageBySlug(lang, slug);

  return {
    title: page?.seoTitle || page?.title || slug,
    description: page?.seoDescription || page?.title || slug,
  };
}

export default async function DynamicLegalPage({ params }: DynamicLegalProps) {
  const { lang, slug } = await params;
  const [baseData, page] = await Promise.all([
    getSecondaryPageBaseData(lang),
    getDynamicPageBySlug(lang, slug),
  ]);

  if (!page) {
    notFound();
  }

  if (page.type === 'contact') {
    const lines = String(page.content || '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean);

    const dictionary =
      lang === 'az'
        ? {
            eyebrow: 'Əlaqə forması',
            fallback: 'Əlaqə, tərəfdaşlıq və media sorğuları üçün aşağıdakı formanı doldurun.',
            name: 'Ad və soyad',
            email: 'E-poçt',
            phone: 'Telefon',
            subject: 'Mövzu',
            message: 'Mesaj',
            submit: 'Göndər',
            sending: 'Göndərilir ...',
            success: 'Mesaj göndərildi.',
            failure: 'Mesaj göndərilmədi. Bir daha cəhd edin.',
          }
        : {
            eyebrow: 'Contact form',
            fallback: 'Use the form below for contact, partnerships, or media requests.',
            name: 'Full name',
            email: 'Email',
            phone: 'Phone',
            subject: 'Subject',
            message: 'Message',
            submit: 'Send message',
            sending: 'Sending ...',
            success: 'Message sent.',
            failure: 'Message failed to send. Please try again.',
          };

    return (
      <SecondaryShell
        heroGhost="Contact"
        heroSummary={lines[0] || ''}
        heroTitle={page.title}
        lang={lang}
        pages={baseData.pages}
        settings={baseData.settings}
        translations={baseData.translations}
      >
        <ContactForm dictionary={dictionary} intro={lines.slice(1)} lang={lang} />
      </SecondaryShell>
    );
  }

  if (page.type === 'shelter') {
    const shelterData = await getShelterData(lang);
    let parsedContent: ShelterContent | null = null;
    try {
      parsedContent = JSON.parse(page.content || '{}') as ShelterContent;
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
        heroTitle={page.title}
        lang={lang}
        pages={baseData.pages}
        settings={baseData.settings}
        translations={baseData.translations}
      >
        <ShelterPageContent
          animals={shelterData.shelterAnimals}
          content={parsedContent}
          logoAlt={shelterData.shelterLogo?.alt}
          logoUrl={shelterData.shelterLogo?.url}
        />
      </SecondaryShell>
    );
  }

  const heroGhostByType: Record<string, string> = {
    privacy: 'Legal',
    terms: 'Terms',
    rules: 'Rules',
    faq: 'FAQ',
    contact: 'Contact',
    shelter: 'Shelter',
  };

  return (
    <SecondaryShell
      heroGhost={heroGhostByType[page.type] || 'Legal'}
      heroSummary={String(page.content || '').split('\n').map((line) => line.trim()).filter(Boolean)[0] || ''}
      heroTitle={page.title}
      lang={lang}
      pages={baseData.pages}
      settings={baseData.settings}
      translations={baseData.translations}
    >
      <LegalPageContent content={page.content} highlightQuestions={page.type === 'faq'} />
    </SecondaryShell>
  );
}
