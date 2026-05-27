'use client';

const API_URL = '';

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = new Headers(init?.headers);

  if (!(init?.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json; charset=UTF-8');
  }

  const response = await fetch(`${API_URL}/api${path}`, {
    ...init,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    const text = await response.text();
    if (response.status === 401 && typeof window !== 'undefined') {
      window.location.href = '/login';
    }
    throw new Error(text || `Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export type SettingItem = {
  id: string;
  key: string;
  value: Record<string, unknown>;
};

export type TranslationItem = {
  id: string;
  section: string;
  key: string;
  az: string;
  en: string;
};

export type PageItem = {
  id: string;
  type: string;
  titleAz: string;
  titleEn: string;
  slug: string;
  contentAz: string;
  contentEn: string;
  seoTitleAz?: string | null;
  seoTitleEn?: string | null;
  seoDescriptionAz?: string | null;
  seoDescriptionEn?: string | null;
  published: boolean;
};

export type MediaItem = {
  id: string;
  section: string;
  slot: string;
  kind: string;
  fileName: string;
  originalName: string;
  mimeType: string;
  filePath: string;
  altAz?: string | null;
  altEn?: string | null;
};

export type ShelterAnimalItem = {
  id: string;
  pageType: string;
  nameAz: string;
  nameEn: string;
  eyebrowAz?: string | null;
  eyebrowEn?: string | null;
  altAz?: string | null;
  altEn?: string | null;
  thumbLabelAz?: string | null;
  thumbLabelEn?: string | null;
  genderLabelAz?: string | null;
  genderLabelEn?: string | null;
  genderValueAz?: string | null;
  genderValueEn?: string | null;
  birthLabelAz?: string | null;
  birthLabelEn?: string | null;
  birthValueAz?: string | null;
  birthValueEn?: string | null;
  breedLabelAz?: string | null;
  breedLabelEn?: string | null;
  breedValueAz?: string | null;
  breedValueEn?: string | null;
  colorLabelAz?: string | null;
  colorLabelEn?: string | null;
  colorValueAz?: string | null;
  colorValueEn?: string | null;
  storyAz: string;
  storyEn: string;
  imagePath: string;
  imageFileName: string;
  imageOriginalName: string;
  imageMimeType: string;
  sortOrder: number;
  published: boolean;
};
