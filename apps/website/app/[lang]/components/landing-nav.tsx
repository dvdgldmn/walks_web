'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

type NavLink = {
  label: string;
  href: string;
};

type LandingNavProps = {
  lang: 'az' | 'en';
  brandLogo: string;
  getAppLabel: string;
  shelterLabel: string;
  links: NavLink[];
};

export function LandingNav({
  lang,
  brandLogo,
  getAppLabel,
  shelterLabel,
  links,
}: LandingNavProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const closeMenu = () => setOpen(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className={`nav on-yellow${scrolled ? ' is-scrolled' : ''}`}
      id="nav"
    >
      <div className="wrap nav__inner">
        <Link className="nav__brand" href={`/${lang}#top`}>
          <img alt="" src={brandLogo} />
          <span className="nav__brand-text">Dosty Walks</span>
        </Link>

        <div className="nav__links">
          {links.map((link) => (
            <Link href={link.href} key={link.href}>
              {link.label}
            </Link>
          ))}
          <Link href={`/${lang}/shelter`}>{shelterLabel}</Link>
        </div>

        <div className="nav__right">
          <div className="lang" aria-label="Language switch">
            <Link
              className={lang === 'az' ? 'active' : undefined}
              href="/az"
            >
              AZ
            </Link>
            <Link
              className={lang === 'en' ? 'active' : undefined}
              href="/en"
            >
              EN
            </Link>
          </div>
          <Link className="btn btn--ink" href={`/${lang}#download`}>
            {getAppLabel}
          </Link>
          <button
            aria-expanded={open}
            aria-label="Open menu"
            className={`nav__burger${open ? ' is-open' : ''}`}
            onClick={() => setOpen((value) => !value)}
            type="button"
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div
        aria-hidden={!open}
        className={`nav__panel${open ? ' is-open' : ''}`}
        id="navPanel"
      >
        <h3 className="nav__panel-brand">Dosty Walks</h3>
        <nav className="nav__panel-links">
          {links.map((link) => (
            <Link href={link.href} key={link.href} onClick={closeMenu}>
              {link.label}
            </Link>
          ))}
          <Link href={`/${lang}/shelter`} onClick={closeMenu}>
            {shelterLabel}
          </Link>
        </nav>
        <div className="nav__panel-lang-row">
          <span>Language</span>
          <div className="nav__panel-lang">
            <Link
              className={lang === 'az' ? 'active' : undefined}
              href="/az"
              onClick={closeMenu}
            >
              AZ
            </Link>
            <Link
              className={lang === 'en' ? 'active' : undefined}
              href="/en"
              onClick={closeMenu}
            >
              EN
            </Link>
          </div>
        </div>
        <div className="nav__panel-cta">
          <Link className="btn btn--maroon" href={`/${lang}#download`} onClick={closeMenu}>
            {getAppLabel}
          </Link>
        </div>
      </div>
    </nav>
  );
}
