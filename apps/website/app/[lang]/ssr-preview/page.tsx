import { notFound } from 'next/navigation';
import { getMedia, getTranslations, Lang } from '../../lib/content';
import { LandingHero } from '../components/landing/hero';
import { LandingMarquee } from '../components/landing/marquee';
import { LandingHow } from '../components/landing/how';
import { LandingSeason } from '../components/landing/season';
import { LandingFinalCta } from '../components/landing/final-cta';
import '../landing.css';

type Props = { params: Promise<{ lang: Lang }> };

// Phase 2 work-in-progress: SSR rebuild of the landing for 1:1 comparison vs the
// template landing at /[lang]. Removed at the Phase 4 flip.
// Hero + competition (§03) are interactive and land in Phase 3.
export default async function SsrPreviewPage({ params }: Props) {
  const { lang } = await params;
  if (lang !== 'az' && lang !== 'en') {
    notFound();
  }

  const [translations, media] = await Promise.all([
    getTranslations(lang).catch(() => []),
    getMedia().catch(() => []),
  ]);

  return (
    <main className="landing">
      <LandingHero lang={lang} translations={translations} />
      <LandingMarquee translations={translations} />
      <LandingHow translations={translations} />
      <LandingSeason translations={translations} media={media} />
      <LandingFinalCta translations={translations} media={media} />
    </main>
  );
}
