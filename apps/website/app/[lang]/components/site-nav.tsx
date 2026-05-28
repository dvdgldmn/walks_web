import { SiteNavLanding } from './site-nav-landing';

type NavLink = {
  label: string;
  href: string;
};

// `variant` controls the scroll behaviour and the initial background:
//  - 'landing' : transparent over the hero (#top), turns solid after scrolling past it.
//  - 'solid'   : always-solid white bar — secondary pages have no hero behind the nav.
// Both variants render the exact same markup + landing.css styles → mobile burger panel
// and layout are pixel-identical between landing and secondary.
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
  return (
    <SiteNavLanding
      getAppLabel={getAppLabel}
      lang={lang}
      links={links}
      rulesLabel={rulesLabel}
      shelterLabel={shelterLabel}
      transparent={variant === 'landing'}
    />
  );
}
