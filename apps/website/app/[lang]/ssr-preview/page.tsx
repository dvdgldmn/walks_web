import { notFound } from 'next/navigation';
import { getTranslations, Lang } from '../../lib/content';
import { LandingHow } from '../components/landing/how';
import '../landing.css';

type Props = { params: Promise<{ lang: Lang }> };

// Phase 2 work-in-progress: SSR rebuild of the landing for 1:1 comparison vs the
// template landing at /[lang]. Removed at the Phase 4 flip.
export default async function SsrPreviewPage({ params }: Props) {
  const { lang } = await params;
  if (lang !== 'az' && lang !== 'en') {
    notFound();
  }

  const translations = await getTranslations(lang).catch(() => []);

  return (
    <main className="landing">
      <LandingHow translations={translations} />
    </main>
  );
}
