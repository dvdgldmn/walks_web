import { redirect } from 'next/navigation';
import { getSiteSettings } from './lib/content';

export default async function WebsiteHomePage() {
  const settings = await getSiteSettings().catch(() => null);
  const defaultLanguage = String(settings?.['site.defaultLanguage']?.code ?? 'az');

  redirect(`/${defaultLanguage}`);
}
