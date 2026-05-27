import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ContactForm } from '../components/contact-form';
import { SecondaryShell } from '../components/secondary-shell';
import { getSecondaryPageBaseData } from '../page-data';
import { getPublicPage, Lang } from '../../lib/content';

type ContactPageProps = {
  params: Promise<{
    lang: Lang;
  }>;
};

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { lang } = await params;
  const page = await getPublicPage('contact', lang).catch(() => null);

  return {
    title: page?.seoTitle || page?.title || 'Contact',
    description: page?.seoDescription || page?.title || 'Contact',
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { lang } = await params;
  const [baseData, page] = await Promise.all([
    getSecondaryPageBaseData(lang),
    getPublicPage('contact', lang).catch(() => null),
  ]);

  if (!page) {
    notFound();
  }

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
