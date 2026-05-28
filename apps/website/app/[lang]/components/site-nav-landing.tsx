'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

type NavLink = { label: string; href: string };

type Props = {
  lang: 'az' | 'en';
  links: NavLink[];
  rulesLabel: string;
  shelterLabel: string;
  getAppLabel: string;
};

const GET_APP_URL = 'https://walks.onelink.me/JjqT/9mczp2y4';

// Landing variant of the shared nav: uses the landing.css classes (1:1 with the original
// landing nav) and reproduces the template's scroll-based transparent/solid behaviour.
export function SiteNavLanding({ lang, links, rulesLabel, shelterLabel, getAppLabel }: Props) {
  const navRef = useRef<HTMLElement>(null);
  const [open, setOpen] = useState(false);

  // Transparent over the hero (#top), solid after — mirrors the template's updateNav().
  useEffect(() => {
    const nav = navRef.current;
    const hero = document.getElementById('top');
    if (!nav) return;

    const update = () => {
      const heroRect = hero ? hero.getBoundingClientRect() : null;
      if (heroRect && heroRect.bottom > 80) {
        nav.classList.add('on-yellow');
        nav.style.background = window.scrollY > 12 ? 'rgba(245, 200, 66, 0.92)' : 'transparent';
        nav.style.backdropFilter = window.scrollY > 12 ? 'blur(14px)' : '';
        nav.style.borderBottom = '1px solid transparent';
      } else {
        nav.classList.remove('on-yellow');
        nav.style.background = 'rgba(255,255,255,0.92)';
        nav.style.backdropFilter = 'blur(14px)';
        nav.style.borderBottom = '1px solid var(--hairline)';
      }
    };

    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, []);

  const go = (target: 'az' | 'en') => {
    window.location.href = `/${target}`;
  };

  const renderLinks = (onClick?: () => void) => (
    <>
      {links.map((link) => (
        <a key={link.href} href={link.href} onClick={onClick}>
          {link.label}
        </a>
      ))}
      <Link href={`/${lang}/shelter`} data-shelter-link onClick={onClick}>
        {shelterLabel}
      </Link>
      <Link href={`/${lang}/rules`} data-rules-link onClick={onClick}>
        {rulesLabel}
      </Link>
    </>
  );

  return (
    <nav className="nav on-yellow" id="nav" ref={navRef}>
      <div className="wrap nav__inner">
        <a href="#top" className="nav__brand">
          <img src="/assets/brand/mascot-thumb-up.png" alt="" />
          <span className="nav__brand-text">Dosty Walks</span>
        </a>
        <div className="nav__links">{renderLinks()}</div>
        <div className="nav__right">
          <div className="lang">
            <button type="button" className={lang === 'az' ? 'active' : ''} onClick={() => go('az')}>
              AZ
            </button>
            <button type="button" className={lang === 'en' ? 'active' : ''} onClick={() => go('en')}>
              EN
            </button>
          </div>
          <a href={GET_APP_URL} target="_blank" rel="noopener noreferrer" className="btn btn--ink">
            {getAppLabel}
          </a>
          <button
            type="button"
            className={`nav__burger${open ? ' is-open' : ''}`}
            id="navBurger"
            aria-label="Open menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`nav__panel${open ? ' is-open' : ''}`} id="navPanel" aria-hidden={!open}>
        <h3 className="nav__panel-brand">Dosty Walks</h3>
        <nav className="nav__panel-links" aria-label="Main menu">
          {renderLinks(() => setOpen(false))}
        </nav>
        <div className="nav__panel-lang-row">
          <span>Language</span>
          <div className="nav__panel-lang">
            <button type="button" className={lang === 'az' ? 'active' : ''} onClick={() => go('az')}>
              AZ
            </button>
            <button type="button" className={lang === 'en' ? 'active' : ''} onClick={() => go('en')}>
              EN
            </button>
          </div>
        </div>
        <div className="nav__panel-cta">
          <a
            href={GET_APP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn--maroon"
            onClick={() => setOpen(false)}
          >
            {getAppLabel}
          </a>
        </div>
      </div>
    </nav>
  );
}
