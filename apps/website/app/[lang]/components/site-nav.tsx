'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import styles from './secondary-shell.module.css';
import { SiteNavLanding } from './site-nav-landing';

type NavLink = {
  label: string;
  href: string;
};

// `variant` is reserved for the landing migration (Phase 4): the landing nav adds a
// scroll-transparent-over-hero behaviour. For now both render the solid bar.
type SiteNavVariant = 'solid' | 'landing';

type SiteNavProps = {
  lang: 'az' | 'en';
  links: NavLink[];
  rulesLabel: string;
  shelterLabel: string;
  getAppLabel: string;
  variant?: SiteNavVariant;
};

export function SiteNav({
  lang,
  links,
  rulesLabel,
  shelterLabel,
  getAppLabel,
  variant = 'solid',
}: SiteNavProps) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  if (variant === 'landing') {
    return (
      <SiteNavLanding
        getAppLabel={getAppLabel}
        lang={lang}
        links={links}
        rulesLabel={rulesLabel}
        shelterLabel={shelterLabel}
      />
    );
  }

  const buildLangHref = (targetLang: 'az' | 'en') => {
    const cleanPath = pathname || `/${lang}`;
    return cleanPath.replace(/^\/(az|en)(?=\/|$)/, `/${targetLang}`);
  };

  const isLandingAnchorHref = (href: string) => href.startsWith(`/${lang}#`);

  return (
    <nav className={styles.nav}>
      <div className={styles.wrap}>
        <div className={styles.navInner}>
          <a className={styles.brand} href={`/${lang}#top`}>
            <img alt="" src="/assets/brand/mascot-thumb-up.png" />
            <span className={styles.brandText}>Dosty Walks</span>
          </a>

          <div className={styles.navLinks}>
            {links.map((link) => (
              isLandingAnchorHref(link.href) ? (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ) : (
                <Link key={link.href} href={link.href}>
                  {link.label}
                </Link>
              )
            ))}
            <Link href={`/${lang}/shelter`}>{shelterLabel}</Link>
            <Link href={`/${lang}/rules`}>{rulesLabel}</Link>
          </div>

          <div className={styles.navRight}>
            <div className={styles.lang}>
              <Link className={lang === 'az' ? styles.langActive : ''} href={buildLangHref('az')}>
                AZ
              </Link>
              <Link className={lang === 'en' ? styles.langActive : ''} href={buildLangHref('en')}>
                EN
              </Link>
            </div>
            <a className={styles.cta} href="https://walks.onelink.me/JjqT/9mczp2y4" target="_blank" rel="noopener noreferrer">
              {getAppLabel}
            </a>
            <button
              aria-expanded={open}
              aria-label="Open menu"
              className={`${styles.burger} ${open ? styles.burgerOpen : ''}`}
              onClick={() => setOpen((value) => !value)}
              type="button"
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </div>

      <div
        aria-hidden={!open}
        className={`${styles.panel} ${open ? styles.panelOpen : ''}`}
      >
        <h3 className={styles.panelBrand}>Dosty Walks</h3>
        <div className={styles.panelLinks}>
          {links.map((link) => (
            isLandingAnchorHref(link.href) ? (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            ) : (
              <Link key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </Link>
            )
          ))}
          <Link href={`/${lang}/shelter`} onClick={() => setOpen(false)}>
            {shelterLabel}
          </Link>
          <Link href={`/${lang}/rules`} onClick={() => setOpen(false)}>
            {rulesLabel}
          </Link>
        </div>
        <div className={styles.panelLangRow}>
          <span className={styles.panelLangLabel}>Language</span>
          <div className={styles.panelLang}>
            <Link
              className={lang === 'az' ? styles.panelLangActive : ''}
              href={buildLangHref('az')}
              onClick={() => setOpen(false)}
            >
              AZ
            </Link>
            <Link
              className={lang === 'en' ? styles.panelLangActive : ''}
              href={buildLangHref('en')}
              onClick={() => setOpen(false)}
            >
              EN
            </Link>
          </div>
        </div>
        <div className={styles.panelCta}>
          <a className={styles.cta} href="https://walks.onelink.me/JjqT/9mczp2y4" target="_blank" rel="noopener noreferrer" onClick={() => setOpen(false)}>
            {getAppLabel}
          </a>
        </div>
      </div>
    </nav>
  );
}
