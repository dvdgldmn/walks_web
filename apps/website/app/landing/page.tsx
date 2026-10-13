import type { Metadata } from 'next';
import { getSiteSettings, getTranslations, pickTranslation } from '../lib/content';
import { renderRichText } from '../lib/render-rich-text';
import { HeroAnimation } from '../[lang]/components/landing/hero-animation';

// Standalone AZ ad landing (walks.az/landing): hero block only — logo, slogan,
// Lottie animation and a single "Get App" CTA. No nav links, no footer, noindex.
const GET_APP_URL = 'https://walks.az/app';

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings().catch(() => null);
  const seo = settings?.['site.seo'] || {};
  const title = typeof seo.titleAz === 'string' && seo.titleAz.trim() ? seo.titleAz.trim() : 'Dosty Walks';

  return {
    title,
    description: 'Hər addım sığınacaq heyvanlarını doyurur.',
    robots: { index: false, follow: false },
  };
}

export default async function AdLandingPage() {
  const translations = await getTranslations('az').catch(() => []);
  const t = (key: string, fallback: string) =>
    pickTranslation(translations, 'hero', key, fallback);

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Truculenta:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <main className="landing">
        <nav className="nav on-yellow">
          <div className="wrap nav__inner">
            <span className="nav__brand">
              <img src="/assets/brand/mascot-thumb-up.png" alt="" />
              <span className="nav__brand-text">Dosty Walks</span>
            </span>
          </div>
        </nav>
        <header className="hero" id="top">
          <div className="hero__lottie" id="hero-anim-target" aria-hidden="true" />

          <div className="wrap hero__inner">
            <div className="hero__copy">
              <h1 className="display hero__title">
                {renderRichText(
                  t('title', 'Hər addım sığınacaq heyvanlarını doyurur.'),
                  'hero-title',
                )}
              </h1>
              <div className="hero__ctas">
                <a
                  href={GET_APP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn--yellow"
                >
                  {t('primaryCta', 'Tətbiqi yüklə')}
                </a>
              </div>
            </div>
            <div className="hero__visual">
              <div
                className="hero__mascot"
                id="hero-mascot-target"
                aria-label="Animated Dosty Walks mascot"
              />
            </div>
          </div>

          <HeroAnimation />
        </header>
      </main>
    </>
  );
}
