import Link from 'next/link';
import {
  Lang,
  PublicPage,
  PublicTranslation,
  pickTranslation,
} from '../../lib/content';
import { getEnabledSocialLinks } from '../../lib/site-chrome';

type FooterStyles = Record<string, string>;

type SiteFooterProps = {
  lang: Lang;
  translations: PublicTranslation[];
  pages: {
    privacy: PublicPage | null;
    terms: PublicPage | null;
    faq: PublicPage | null;
  };
  settings: Record<string, Record<string, unknown>> | null;
  shelterLabel: string;
  styles: FooterStyles;
};

export function SiteFooter({
  lang,
  translations,
  pages,
  settings,
  shelterLabel,
  styles,
}: SiteFooterProps) {
  const socials = getEnabledSocialLinks(settings);

  return (
    <footer className={styles.footer} id="contact">
      <div className={styles.wrap}>
        <div className={styles.footerGrid}>
          <div>
            <div className={styles.footerBrandTitle}>
              Dosty
              <br />
              <em>Walks.</em>
            </div>
            <p className={styles.footerBrandText}>
              {pickTranslation(
                translations,
                'hero',
                'title',
                'Every Step Feeds Shelter Animals.',
              )}
            </p>
            {socials.length ? (
              <div className={styles.footerSocial}>
                {socials.map((item) => (
                  <a
                    href={item.url}
                    key={item.key}
                    rel="noreferrer"
                    target="_blank"
                    title={item.label}
                  >
                    {item.icon}
                  </a>
                ))}
              </div>
            ) : null}
          </div>

          <div className={styles.footerCol}>
            <h4>{pickTranslation(translations, 'footer', 'productTitle', 'Product')}</h4>
            <ul>
              <li><a href={`/${lang}#how`}>{pickTranslation(translations, 'nav', 'how', 'How it works')}</a></li>
              <li><a href={`/${lang}#season`}>{pickTranslation(translations, 'nav', 'season', 'Seasons')}</a></li>
              <li><a href="https://walks.onelink.me/JjqT/9mczp2y4" target="_blank" rel="noopener noreferrer">{lang === 'az' ? 'Tətbiqi yüklə' : 'Get app'}</a></li>
            </ul>
          </div>

          <div className={styles.footerCol}>
            <h4>{pickTranslation(translations, 'footer', 'partnersTitle', 'Partners')}</h4>
            <ul>
              <li><Link href={`/${lang}/contact`}>{pickTranslation(translations, 'footer', 'becomePartner', 'Become a partner')}</Link></li>
              <li><Link href={`/${lang}/contact`}>{pickTranslation(translations, 'footer', 'contacts', 'Contacts')}</Link></li>
              <li><Link href={`/${lang}/shelter`}>{shelterLabel}</Link></li>
            </ul>
          </div>

          <div className={styles.footerCol}>
            <h4>{pickTranslation(translations, 'footer', 'legalTitle', 'Legal')}</h4>
            <ul>
              {pages.privacy?.slug ? <li><Link href={`/${lang}/${pages.privacy.slug}`}>{pages.privacy.title}</Link></li> : null}
              {pages.terms?.slug ? <li><Link href={`/${lang}/${pages.terms.slug}`}>{pages.terms.title}</Link></li> : null}
              {pages.faq?.slug ? <li><Link href={`/${lang}/${pages.faq.slug}`}>{pages.faq.title}</Link></li> : null}
            </ul>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <span>© 2026 Dosty Walks</span>
        </div>
      </div>
    </footer>
  );
}
