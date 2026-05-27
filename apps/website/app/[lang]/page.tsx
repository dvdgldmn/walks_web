import type { Metadata } from 'next';
import Script from 'next/script';
import { notFound } from 'next/navigation';
import { getSiteSettings, Lang } from '../lib/content';
import { getLandingTemplateParts } from './landing-template';

type LangPageProps = {
  params: Promise<{
    lang: Lang;
  }>;
};

function pickLandingSeo(
  settings: Record<string, Record<string, unknown>> | null,
  lang: Lang,
  field: 'title' | 'description',
  fallback: string,
) {
  const seo = settings?.['site.seo'] || {};
  const suffix = lang === 'az' ? 'Az' : 'En';
  const key = `${field}${suffix}`;
  const value = seo[key];

  return typeof value === 'string' && value.trim() ? value.trim() : fallback;
}

export async function generateMetadata({ params }: LangPageProps): Promise<Metadata> {
  const { lang } = await params;
  const settings = await getSiteSettings().catch(() => null);

  return {
    title: pickLandingSeo(settings, lang, 'title', 'Dosty Walks'),
    description: pickLandingSeo(settings, lang, 'description', 'Dosty Walks'),
  };
}

export default async function LangHomePage({ params }: LangPageProps) {
  const { lang } = await params;

  if (lang !== 'az' && lang !== 'en') {
    notFound();
  }

  const template = getLandingTemplateParts();

  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link
        href="https://fonts.googleapis.com/css2?family=Truculenta:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700;800&display=swap"
        rel="stylesheet"
      />
      <style dangerouslySetInnerHTML={{ __html: template.styles }} />
      <div dangerouslySetInnerHTML={{ __html: template.markup }} />
      <Script id="landing-lang" strategy="beforeInteractive">
        {`window.__LANDING_LANG__ = ${JSON.stringify(lang)};`}
      </Script>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/bodymovin/5.12.2/lottie.min.js"
        strategy="beforeInteractive"
      />
      {template.scripts.map((script, index) => (
        <Script
          id={`landing-runtime-${index + 1}`}
          key={`landing-runtime-${index + 1}`}
          strategy="afterInteractive"
        >
          {script}
        </Script>
      ))}
    </>
  );
}
