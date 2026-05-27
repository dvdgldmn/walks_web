import { Lang, PublicTranslation, pickTranslation } from '../../../lib/content';
import { renderRichText } from '../../../lib/render-rich-text';
import { HeroAnimation } from './hero-animation';

type Props = {
  lang: Lang;
  translations: PublicTranslation[];
};

const GET_APP_URL = 'https://walks.onelink.me/JjqT/9mczp2y4';

export function LandingHero({ lang, translations }: Props) {
  const t = (key: string, fallback: string) =>
    pickTranslation(translations, 'hero', key, fallback);

  return (
    <header className="hero" id="top">
      <div className="hero__lottie" id="hero-anim-target" aria-hidden="true" />

      <div className="wrap hero__inner">
        <div className="hero__copy">
          <h1 className="display hero__title">
            {renderRichText(t('title', 'Every Step Feeds Shelter Animals.'), 'hero-title')}
          </h1>
          <div className="hero__ctas">
            <a
              href={GET_APP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--yellow"
            >
              {t('primaryCta', 'Get App')}
            </a>
            <a href={`/${lang}/contact`} className="btn btn--white">
              {t('secondaryCta', 'Become a partner')}
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
  );
}
