import { PublicMediaItem } from '../../../lib/content';

// Browser-facing media URL: relative /uploads/... so it goes through the Next proxy
// (works in dev and prod). Falls back to a static asset path when the CMS has no upload.
export function landingMediaSrc(
  media: PublicMediaItem[],
  section: string,
  slot: string,
  fallback: string,
) {
  const item = media.find((m) => m.section === section && m.slot === slot);
  return item ? `/uploads/${item.filePath}` : fallback;
}
