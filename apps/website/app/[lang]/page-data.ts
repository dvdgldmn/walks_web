import {
  getMediaBySection,
  getMediaUrl,
  getPublicPage,
  getPublicPageBySlug,
  getPublicShelterAnimals,
  getSiteSettings,
  getTranslations,
  Lang,
  PublicPage,
  PublicShelterAnimal,
  PublicTranslation,
} from '../lib/content';

export async function getSecondaryPageBaseData(lang: Lang) {
  const [settings, translations, privacy, terms, faq] = await Promise.all([
    getSiteSettings().catch(() => null),
    getTranslations(lang).catch(() => [] as PublicTranslation[]),
    getPublicPage('privacy', lang).catch(() => null),
    getPublicPage('terms', lang).catch(() => null),
    getPublicPage('faq', lang).catch(() => null),
  ]);

  return {
    settings,
    translations,
    pages: {
      privacy,
      terms,
      faq,
    },
  };
}

export function getLegalHeroSummary(page: PublicPage | null) {
  const lines = String(page?.content || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  return lines[0] || '';
}

export async function getLandingData(lang: Lang) {
  const [settings, translations, settingsMedia, heroMedia, seasonMedia, downloadMedia, privacy, terms, faq] =
    await Promise.all([
      getSiteSettings().catch(() => null),
      getTranslations(lang).catch(() => [] as PublicTranslation[]),
      getMediaBySection('settings').catch(() => []),
      getMediaBySection('hero').catch(() => []),
      getMediaBySection('season').catch(() => []),
      getMediaBySection('download').catch(() => []),
      getPublicPage('privacy', lang).catch(() => null),
      getPublicPage('terms', lang).catch(() => null),
      getPublicPage('faq', lang).catch(() => null),
    ]);

  return {
    settings,
    translations,
    pages: {
      privacy,
      terms,
      faq,
    },
    media: {
      logo:
        getMediaUrl(settingsMedia.find((item) => item.slot === 'logo')?.filePath) ||
        '/assets/brand/mascot-thumb-up.png',
      heroPhone:
        getMediaUrl(heroMedia.find((item) => item.slot === 'phone')?.filePath) ||
        '/assets/brand/ui-hero-phone.png',
      seasonPhone:
        getMediaUrl(seasonMedia.find((item) => item.slot === 'phone')?.filePath) ||
        '/assets/brand/ui-milestone-path.png',
      qr:
        getMediaUrl(downloadMedia.find((item) => item.slot === 'qr')?.filePath) ||
        '/assets/brand/logo-full.png',
    },
  };
}

export async function getShelterData(lang: Lang) {
  const [baseData, shelterPage, shelterAnimals, shelterMedia] = await Promise.all([
    getSecondaryPageBaseData(lang),
    getPublicPage('shelter', lang).catch(() => null),
    getPublicShelterAnimals(lang, 'shelter').catch(() => [] as PublicShelterAnimal[]),
    getMediaBySection('shelter').catch(() => []),
  ]);

  const shelterLogo = shelterMedia.find((item) => item.slot === 'logo');

  return {
    ...baseData,
    shelterPage,
    shelterAnimals: shelterAnimals.map((item) => ({
      ...item,
      imagePath: getMediaUrl(item.imagePath) || '',
    })),
    shelterLogo: shelterLogo
      ? {
          url: getMediaUrl(shelterLogo.filePath),
          alt:
            lang === 'az'
              ? shelterLogo.altAz || shelterLogo.altEn || 'Shelter logo'
              : shelterLogo.altEn || shelterLogo.altAz || 'Shelter logo',
        }
      : null,
  };
}

export async function getDynamicPageBySlug(lang: Lang, slug: string) {
  return getPublicPageBySlug(slug, lang).catch(() => null);
}
