import Link from 'next/link';
import {
  getSettingString,
  Lang,
  PublicPage,
  PublicTranslation,
  pickTranslation,
} from '../../lib/content';
import { renderRichText } from '../../lib/render-rich-text';
import { getEnabledSocialLinks } from '../../lib/site-chrome';
import { CompetitionShowcase } from './competition-showcase';
import { LandingHeroScene } from './landing-hero-scene';
import { LandingNav } from './landing-nav';
import styles from './landing-template-scoped.module.css';

type LandingPageContentProps = {
  lang: Lang;
  settings: Record<string, Record<string, unknown>> | null;
  translations: PublicTranslation[];
  media: {
    logo: string;
    seasonPhone: string;
    heroPhone: string;
    qr: string;
  };
  pages: {
    privacy: PublicPage | null;
    terms: PublicPage | null;
    faq: PublicPage | null;
  };
};

export function LandingPageContent({
  lang,
  settings,
  translations,
  media,
  pages,
}: LandingPageContentProps) {
  const navLinks = [
    { label: pickTranslation(translations, 'nav', 'how', 'How it works'), href: `/${lang}#how` },
    { label: pickTranslation(translations, 'nav', 'season', 'Seasons'), href: `/${lang}#season` },
    { label: pickTranslation(translations, 'nav', 'download', 'Download'), href: `/${lang}#download` },
  ];
  const shelterLabel = pickTranslation(translations, 'nav', 'shelter', 'Shelter');
  const getAppLabel = pickTranslation(translations, 'hero', 'primaryCta', 'Get App');
  const becomePartnerLabel = pickTranslation(translations, 'hero', 'secondaryCta', 'Become a partner');
  const appleStoreLink = getSettingString(settings, 'store.apple', 'url', '#');
  const googlePlayLink = getSettingString(settings, 'store.google', 'url', '#');
  const socials = getEnabledSocialLinks(settings);

  const competitionItems = [
    {
      eyebrow: pickTranslation(translations, 'competition', 'card1Eyebrow', 'Leaderboard'),
      title: pickTranslation(translations, 'competition', 'card1Title', 'Leader<br><em>boards.</em>'),
      body: pickTranslation(
        translations,
        'competition',
        'card1Body',
        'Compete with friends and the global community.',
      ),
      image: '/assets/brand/ui-leaderboard.png',
    },
    {
      eyebrow: pickTranslation(translations, 'competition', 'card2Eyebrow', 'Groups'),
      title: pickTranslation(translations, 'competition', 'card2Title', 'Seasons &<br><em>Rewards.</em>'),
      body: pickTranslation(
        translations,
        'competition',
        'card2Body',
        'Unlock badges, rewards, and milestone achievements.',
      ),
      image: media.heroPhone || '/assets/brand/ui-hero-phone.png',
    },
    {
      eyebrow: pickTranslation(translations, 'competition', 'card3Eyebrow', 'Recognition'),
      title: pickTranslation(translations, 'competition', 'card3Title', 'Real Food<br><em>Donations.</em>'),
      body: pickTranslation(
        translations,
        'competition',
        'card3Body',
        'Turn your daily steps into real shelter support.',
      ),
      image: '/assets/brand/ui-milestone-path.png',
    },
    {
      eyebrow: pickTranslation(translations, 'competition', 'card4Eyebrow', 'Habit'),
      title: pickTranslation(translations, 'competition', 'card4Title', 'Not a <em>campaign</em> —<br>a habit.'),
      body: pickTranslation(
        translations,
        'competition',
        'card4Body',
        'Game mechanics embedded in daily behaviour. You return without reminders.',
      ),
      image: '/assets/brand/ui-stack.png',
    },
  ];

  return (
    <div className={styles.root}>
      <LandingNav
        brandLogo={media.logo}
        getAppLabel={getAppLabel}
        lang={lang}
        links={navLinks}
        shelterLabel={shelterLabel}
      />

      <main>
        <header className="hero" id="top">
          <LandingHeroScene />
          <div className="wrap hero__inner">
            <div className="hero__copy">
              <div className="hero__eyebrow-row">
                <span className="eyebrow">
                  {pickTranslation(translations, 'hero', 'eyebrow', 'Every step. Every month.')}
                </span>
              </div>
              <h1 className="display hero__title">
                {renderRichText(
                  pickTranslation(
                    translations,
                    'hero',
                    'title',
                    'Every Step Feeds Shelter Animals.',
                  ),
                  'hero-title',
                )}
              </h1>
              <div className="hero__ctas">
                <a className="btn btn--ink" href={appleStoreLink}>
                  {getAppLabel}
                </a>
                <Link className="btn btn--ghost-dark" href={`/${lang}/contact`}>
                  {becomePartnerLabel}
                </Link>
              </div>
            </div>
            <div className="hero__visual" />
          </div>
        </header>

        <div aria-hidden="true" className="marquee marquee--maroon">
          <div className="marquee__track">
            {Array.from({ length: 2 }).flatMap((_, groupIndex) => [
              <span className="marquee__item" key={`m1-${groupIndex}`}>
                {pickTranslation(translations, 'marquee', 'item1', 'WALK. COMPETE. EARN. HELP.')}
              </span>,
              <span className="marquee__sep" key={`s1-${groupIndex}`}>🐾</span>,
              <span className="marquee__item" key={`m2-${groupIndex}`}>
                {pickTranslation(
                  translations,
                  'marquee',
                  'item2',
                  '500KG OF FOOD DELIVERED TO SHELTERS',
                )}
              </span>,
              <span className="marquee__sep" key={`s2-${groupIndex}`}>👟</span>,
              <span className="marquee__item" key={`m3-${groupIndex}`}>
                {pickTranslation(translations, 'marquee', 'item3', 'EVERY MONTH')}
              </span>,
              <span className="marquee__sep" key={`s3-${groupIndex}`}>🥣</span>,
              <span className="marquee__item" key={`m4-${groupIndex}`}>
                {pickTranslation(translations, 'marquee', 'item4', 'EVERY STEP COUNTS')}
              </span>,
              <span className="marquee__sep" key={`s4-${groupIndex}`}>🏅</span>,
            ])}
          </div>
        </div>

        <section className="band band--yellow" id="how">
          <div className="wrap">
            <div className="band__head">
              <div>
                <div className="band__eyebrow">
                  <span className="band__num">§ 01</span>
                  <span className="eyebrow">
                    {pickTranslation(translations, 'how', 'eyebrow', 'How it works')}
                  </span>
                </div>
                <h2 className="display step__title">
                  {renderRichText(
                    pickTranslation(
                      translations,
                      'how',
                      'note',
                      'Turn Your Daily Walk Into Real Help.',
                    ),
                    'how-title',
                  )}
                </h2>
              </div>
            </div>

            <div className="flow">
              <div className="flow__step">
                <div className="flow__disc flow__disc--walk">
                  <span className="flow__disc-num">01</span>
                  <span className="flow__disc-tag">
                    {pickTranslation(translations, 'how', 'step1Tag', 'Walk')}
                  </span>
                </div>
                <h3 className="flow__title">
                  {renderRichText(
                    pickTranslation(translations, 'how', 'step1Title', 'Walk Like You Always Do.'),
                    'how-step1-title',
                  )}
                </h3>
                <p className="flow__body">
                  {pickTranslation(
                    translations,
                    'how',
                    'step1Body',
                    'Your phone tracks steps automatically through Apple Health, Google Fit, or Samsung Health.',
                  )}
                </p>
              </div>

              <div className="flow__arrow" aria-hidden="true">→</div>

              <div className="flow__step">
                <div className="flow__disc flow__disc--earn">
                  <span className="flow__disc-num">02</span>
                  <span className="flow__disc-tag">
                    {pickTranslation(translations, 'how', 'step2Tag', 'Earn')}
                  </span>
                </div>
                <h3 className="flow__title">
                  {renderRichText(
                    pickTranslation(translations, 'how', 'step2Title', 'Steps Become Coins.'),
                    'how-step2-title',
                  )}
                </h3>
                <p className="flow__body">
                  {pickTranslation(
                    translations,
                    'how',
                    'step2Body',
                    'Every step helps you earn coins inside Dosty Walks.',
                  )}
                </p>
              </div>

              <div className="flow__arrow" aria-hidden="true">→</div>

              <div className="flow__step">
                <div className="flow__disc flow__disc--donate">
                  <span className="flow__disc-num">03</span>
                  <span className="flow__disc-tag">
                    {pickTranslation(translations, 'how', 'step3Tag', 'Help')}
                  </span>
                </div>
                <h3 className="flow__title">
                  {renderRichText(
                    pickTranslation(translations, 'how', 'step3Title', 'Coins Turn Into Food.'),
                    'how-step3-title',
                  )}
                </h3>
                <p className="flow__body">
                  {pickTranslation(
                    translations,
                    'how',
                    'step3Body',
                    'Donate your coins and help feed shelter animals together with the community.',
                  )}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="band band--maroon" id="competition">
          <div className="wrap">
            <div className="band__head">
              <div className="band__eyebrow">
                <span className="band__num">§ 03</span>
                <span className="eyebrow eyebrow--on-maroon">
                  {pickTranslation(
                    translations,
                    'competition',
                    'eyebrow',
                    'More Than A Step Counter.',
                  )}
                </span>
              </div>
              <span className="eyebrow eyebrow--on-maroon">
                {pickTranslation(
                  translations,
                  'competition',
                  'note',
                  'Compete, earn rewards, and help feed shelter animals with every step.',
                )}
              </span>
            </div>

            <CompetitionShowcase items={competitionItems} />
          </div>
        </section>

        <section className="band band--pink" id="season">
          <div className="wrap">
            <div className="band__head">
              <div className="band__eyebrow">
                <span className="band__num">§ 04</span>
                <span className="eyebrow">
                  {pickTranslation(translations, 'season', 'eyebrow', 'Season pass')}
                </span>
              </div>
              <span className="eyebrow" style={{ opacity: 0.55 }}>
                {pickTranslation(
                  translations,
                  'season',
                  'note',
                  'Each Dosty Pass season brings a new adventure, new rewards, and a new mission for animals.',
                )}
              </span>
            </div>

            <div className="duo duo--reverse">
              <div className="duo__phone">
                <img
                  alt="Season game path with milestones and rewards"
                  className="duo__phone-img"
                  src={media.seasonPhone || '/assets/brand/ui-milestone-path.png'}
                />
              </div>
              <div>
                <h2 className="display duo__title">
                  {renderRichText(
                    pickTranslation(
                      translations,
                      'season',
                      'title',
                      'Every Step <em>Unlocks More.</em>',
                    ),
                    'season-title',
                  )}
                </h2>
                <div className="duo__body" style={{ color: 'rgba(0,0,0,.75)' }}>
                  {renderRichText(
                    pickTranslation(translations, 'season', 'body', ''),
                    'season-body',
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="final-cta" id="download">
          <div className="wrap">
            <div className="eyebrow eyebrow--on-maroon" style={{ marginBottom: 18 }}>
                {pickTranslation(translations, 'download', 'eyebrow', 'Get the app · free forever')}
              </div>
              <h2 className="display final-cta__title">
                {renderRichText(
                  pickTranslation(translations, 'download', 'title', 'Dosty Walks.'),
                  'download-title',
                )}
              </h2>
              <p className="final-cta__sub">
                {pickTranslation(
                  translations,
                  'download',
                  'body',
                  'A community turning everyday movement into real help for shelter animals.',
                )}
              </p>
              <div className="final-cta__row">
                <div className="final-cta__qr">
                  <img alt="Download QR code" src={media.qr} />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <a className="store-badge store-badge--official" href={appleStoreLink}>
                    <span className="store-badge__icon" aria-hidden="true">
                      <img
                        alt=""
                        className="store-badge__icon--apple"
                        src="/assets/logos/apple-173-svgrepo-com.svg"
                      />
                    </span>
                    <span className="store-badge__copy">
                      <span className="store-badge__small">
                        {pickTranslation(
                          translations,
                          'download',
                          'badgeAppleSmall',
                          'Download on the',
                        )}
                      </span>
                      <span className="store-badge__big">App Store</span>
                    </span>
                  </a>
                  <a className="store-badge store-badge--official" href={googlePlayLink}>
                    <span className="store-badge__icon" aria-hidden="true">
                      <img
                        alt=""
                        className="store-badge__icon--play"
                        src="/assets/logos/google-play-svgrepo-com.svg"
                      />
                    </span>
                    <span className="store-badge__copy">
                      <span className="store-badge__small">
                        {pickTranslation(
                          translations,
                          'download',
                          'badgeGoogleSmall',
                          'Get it on',
                        )}
                      </span>
                      <span className="store-badge__big">Google Play</span>
                    </span>
                  </a>
                </div>
              </div>
          </div>
        </section>
      </main>

      <footer id="contact">
        <div className="wrap">
          <div className="footer-grid">
            <div className="footer-brand">
              <div className="footer-brand-title">
                Dosty
                <br />
                <em>Walks.</em>
              </div>
              <p>
                {pickTranslation(
                  translations,
                  'footer',
                  'tagline',
                  'Every step counts. Every month — 500 kg of food to shelter.',
                )}
              </p>
              <div className="footer-social">
                {socials.map((item) => (
                  <a href={item.url} key={item.key} rel="noreferrer" target="_blank" title={item.label}>
                    {item.icon}
                  </a>
                ))}
              </div>
            </div>
            <div className="footer-col">
              <h5>{pickTranslation(translations, 'footer', 'productTitle', 'Product')}</h5>
              <ul>
                <li><Link href={`/${lang}#how`}>{pickTranslation(translations, 'nav', 'how', 'How it works')}</Link></li>
                <li><Link href={`/${lang}#season`}>{pickTranslation(translations, 'nav', 'season', 'Seasons')}</Link></li>
                <li><Link href={`/${lang}#download`}>{pickTranslation(translations, 'nav', 'download', 'Download')}</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>{pickTranslation(translations, 'footer', 'partnersTitle', 'Partners')}</h5>
              <ul>
                <li><Link href={`/${lang}/contact`}>{pickTranslation(translations, 'footer', 'becomePartner', 'Become a partner')}</Link></li>
                <li><span>{pickTranslation(translations, 'footer', 'pressKit', 'Press kit')}</span></li>
                <li><Link href={`/${lang}/contact`}>{pickTranslation(translations, 'footer', 'contacts', 'Contacts')}</Link></li>
                <li><Link href={`/${lang}/shelter`}>{shelterLabel}</Link></li>
              </ul>
            </div>
            <div className="footer-col">
              <h5>{pickTranslation(translations, 'footer', 'legalTitle', 'Legal')}</h5>
              <ul>
                {pages.privacy?.slug ? <li><Link href={`/${lang}/${pages.privacy.slug}`}>{pages.privacy.title}</Link></li> : null}
                {pages.terms?.slug ? <li><Link href={`/${lang}/${pages.terms.slug}`}>{pages.terms.title}</Link></li> : null}
                <li><span>{pickTranslation(translations, 'footer', 'cookies', 'Cookies')}</span></li>
              </ul>
            </div>
          </div>
          <div className="footer-bottom">
            <span>{pickTranslation(translations, 'footer', 'bottomLeft', '© 2026 Dosty Walks · Made in Baku 🇦🇿')}</span>
            <span>{pickTranslation(translations, 'footer', 'bottomRight', 'Design draft v2 · work in progress')}</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
