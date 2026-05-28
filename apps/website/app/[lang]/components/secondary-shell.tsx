import Link from 'next/link';
import { ReactNode } from 'react';
import {
  Lang,
  PublicPage,
  PublicTranslation,
  pickTranslation,
} from '../../lib/content';
import { SiteFooter } from './site-footer';
import { SiteNav } from './site-nav';
import styles from './secondary-shell.module.css';

type SecondaryShellProps = {
  lang: Lang;
  heroTitle: ReactNode;
  heroSummary: string;
  heroGhost: string;
  translations: PublicTranslation[];
  pages: {
    privacy: PublicPage | null;
    terms: PublicPage | null;
    faq: PublicPage | null;
  };
  settings: Record<string, Record<string, unknown>> | null;
  children: ReactNode;
};

export function SecondaryShell({
  lang,
  heroTitle,
  heroSummary,
  heroGhost,
  translations,
  pages,
  settings,
  children,
}: SecondaryShellProps) {
  const navLinks = [
    { label: pickTranslation(translations, 'nav', 'how', 'How it works'), href: `/${lang}#how` },
    { label: pickTranslation(translations, 'nav', 'season', 'Seasons'), href: `/${lang}#season` },
    { label: pickTranslation(translations, 'nav', 'download', 'Download'), href: `/${lang}#download` },
  ];
  const shelterLabel = pickTranslation(translations, 'nav', 'shelter', 'Shelter');
  const rulesLabel = pickTranslation(translations, 'nav', 'rules', 'Rules');
  const getAppLabel = pickTranslation(
    translations,
    'hero',
    'primaryCta',
    'Get App',
  );

  return (
    <div className={styles.page}>
      <SiteNav
        getAppLabel={getAppLabel}
        lang={lang}
        links={navLinks}
        rulesLabel={rulesLabel}
        shelterLabel={shelterLabel}
        variant="solid"
      />

      <main>
        <section className={styles.hero}>
          <div className={styles.contentWrap}>
            <div className={styles.heroFrame}>
              <h1 className={styles.heroTitle}>{heroTitle}</h1>
              <p className={styles.heroSummary}>{heroSummary}</p>
              <div className={styles.heroGhost}>{heroGhost}</div>
            </div>
          </div>
        </section>

        <section className={styles.shell}>
          <div className={styles.contentWrap}>
            <article className={styles.card}>{children}</article>
          </div>
        </section>
    </main>

      <SiteFooter
        lang={lang}
        pages={pages}
        settings={settings}
        shelterLabel={shelterLabel}
        styles={styles}
        translations={translations}
      />
    </div>
  );
}
