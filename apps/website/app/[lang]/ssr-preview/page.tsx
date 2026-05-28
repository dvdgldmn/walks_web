import { notFound } from 'next/navigation';
import {
  getMedia,
  getPublicPage,
  getSiteSettings,
  getTranslations,
  Lang,
  pickTranslation,
} from '../../lib/content';
import { LandingHero } from '../components/landing/hero';
import { LandingMarquee } from '../components/landing/marquee';
import { LandingHow } from '../components/landing/how';
import { LandingCompetition } from '../components/landing/competition';
import { LandingSeason } from '../components/landing/season';
import { LandingFinalCta } from '../components/landing/final-cta';
import { SiteFooter } from '../components/site-footer';
import { SiteNav } from '../components/site-nav';
import secondaryStyles from '../components/secondary-shell.module.css';
import '../landing.css';

type Props = { params: Promise<{ lang: Lang }> };

// Phase 2-4 work-in-progress: SSR rebuild of the landing for 1:1 comparison vs the
// template landing at /[lang]. Removed at the Phase 4 flip.
export default async function SsrPreviewPage({ params }: Props) {
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
  );
}
