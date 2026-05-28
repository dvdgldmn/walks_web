import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getMedia,
  getPublicPage,
  getSiteSettings,
  getTranslations,
  Lang,
  pickTranslation,
} from '../lib/content';
import { LandingHero } from './components/landing/hero';
import { LandingMarquee } from './components/landing/marquee';
import { LandingHow } from './components/landing/how';
import { LandingCompetition } from './components/landing/competition';
import { LandingSeason } from './components/landing/season';
import { LandingFinalCta } from './components/landing/final-cta';
import { SiteFooter } from './components/site-footer';
import { SiteNav } from './components/site-nav';
import secondaryStyles from './components/secondary-shell.module.css';
import './landing.css';

type LangPageProps = {
  params: Promise<{
    lang: Lang;
  }>;
};

function pickLandingSeo(
  settings: Record<string, Record<string, unknown>> | null,
  lang: Lang,
  field: 'title' | 'description',
  fallback: string,
) {
  const seo = settings?.['site.seo'] || {};
  const suffix = lang === 'az' ? 'Az' : 'En';
  const key = `${field}${suffix}`;
  const value = seo[key];

  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

export async function generateMetadata({ params }: LangPageProps): Promise<Metadata> {
  const { lang } = await params;
  const settings = await getSiteSettings().catch(() => null);

  return {
    title: pickLandingSeo(settings, lang, 'title', 'Dosty Walks'),
    description: pickLandingSeo(settings, lang, 'description', 'Dosty Walks'),
  };
}

export default async function LangHomePage({ params }: LangPageProps) {
  const { lang } = await params;

  if (lang !== 'az' && lang !== 'en') {
    notFound();
  }

  const [translations, media, settings, privacy, terms, faq] = await Promise.all([
    getTranslations(lang).catch(() => []),
    getMedia().catch(() => []),
    getSiteSettings().catch(() => null),
    getPublicPage('privacy', lang).catch(() => null),
    getPublicPage('terms', lang).catch(() => null),
    getPublicPage('faq', lang).catch(() => null),
  ]);

  const shelterLabel = pickTranslation(translations, 'nav', 'shelter', 'Shelter');
  const navLinks = [
    { label: pickTranslation(translations, 'nav', 'how', 'How it works'), href: '#how' },
    { label: pickTranslation(translations, 'nav', 'season', 'Seasons'), href: '#season' },
    { label: pickTranslation(translations, 'nav', 'download', 'Download'), href: '#download' },
  ];
  const getAppLabel = pickTranslation(translations, 'hero', 'primaryCta', 'Get App');

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Truculenta:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <main className="landing">
        <SiteNav
          getAppLabel={getAppLabel}
          lang={lang}
          links={navLinks}
          rulesLabel={pickTranslation(translations, 'nav', 'rules', 'Rules')}
          shelterLabel={shelterLabel}
          variant="landing"
        />
        <LandingHero lang={lang} translations={translations} />
        <LandingMarquee translations={translations} />
        <LandingHow translations={translations} />
        <LandingCompetition translations={translations} media={media} />
        <LandingSeason translations={translations} media={media} />
        <LandingFinalCta translations={translations} media={media} />
        <SiteFooter
          lang={lang}
          pages={{ privacy, terms, faq }}
          settings={settings}
          shelterLabel={shelterLabel}
          styles={secondaryStyles}
          translations={translations}
        />
      </main>
    </>
  );
}
