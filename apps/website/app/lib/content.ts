const API_URL =
  process.env.INTERNAL_API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  'http://localhost:4000';

export type Lang = 'az' | 'en';

export type PublicPage = {
  id: string;
  type: string;
  slug: string;
  title: string;
  content: string;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

export type PublicTranslation = {
  id: string;
  section: string;
  key: string;
  value: string;
};

export type PublicMediaItem = {
  section: string;
  slot: string;
  filePath: string;
  altAz?: string | null;
  altEn?: string | null;
};

export type PublicShelterAnimal = {
  id: string;
  pageType: string;
  name: string;
  eyebrow?: string | null;
  alt?: string | null;
  thumbLabel?: string | null;
  genderLabel?: string | null;
  genderValue?: string | null;
  birthLabel?: string | null;
  birthValue?: string | null;
  breedLabel?: string | null;
  breedValue?: string | null;
  colorLabel?: string | null;
  colorValue?: string | null;
  story: string;
  imagePath: string;
  sortOrder: number;
};

export async function publicFetch<T>(path: string): Promise<T> {
  const response = await fetch(`${API_URL}/api${path}`, {
    cache: 'no-store',
  });

  if (!response.ok) {
    throw new Error(`Public fetch failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getSiteSettings() {
  return publicFetch<Record<string, Record<string, unknown>>>('/public/settings');
}

export async function getTranslations(lang: Lang) {
  return publicFetch<PublicTranslation[]>(
    `/public/translations?lang=${lang}`,
  );
}

export async function getMedia() {
  return publicFetch<PublicMediaItem[]>('/public/media');
}

export async function getMediaBySection(section: string) {
  return publicFetch<PublicMediaItem[]>(`/public/media?section=${encodeURIComponent(section)}`);
}

export async function getPublicPage(type: string, lang: Lang) {
  return publicFetch<PublicPage | null>(`/public/pages/${type}?lang=${lang}`);
}

export async function getPublicPageBySlug(slug: string, lang: Lang) {
  return publicFetch<PublicPage | null>(`/public/pages-by-slug/${slug}?lang=${lang}`);
}

export async function getPublicShelterAnimals(lang: Lang, pageType = 'shelter') {
  return publicFetch<PublicShelterAnimal[]>(
    `/public/shelter-animals?lang=${lang}&pageType=${encodeURIComponent(pageType)}`,
  );
}

export function getMediaUrl(filePath?: string | null) {
  if (!filePath) {
    return null;
  }

  return `${API_URL}/uploads/${filePath}`;
}

export function pickTranslation(
  items: Array<{ section: string; key: string; value: string }>,
  section: string,
  key: string,
  fallback: string,
) {
  return items.find((item) => item.section === section && item.key === key)?.value ?? fallback;
}

export function getSettingString(
  settings: Record<string, Record<string, unknown>> | null | undefined,
  key: string,
  field: string,
  fallback = '',
) {
  return String(settings?.[key]?.[field] ?? fallback);
}
