export function getEnabledSocialLinks(
  settings: Record<string, Record<string, unknown>> | null,
) {
  return [
    { key: 'social.instagram', label: 'Instagram', icon: 'IG' },
    { key: 'social.facebook', label: 'Facebook', icon: 'FB' },
    { key: 'social.tiktok', label: 'TikTok', icon: 'TT' },
  ]
    .map((item) => {
      const config = settings?.[item.key];
      if (!config?.enabled || !config?.url) {
        return null;
      }

      return {
        ...item,
        url: String(config.url),
      };
    })
    .filter(Boolean) as Array<{ key: string; label: string; icon: string; url: string }>;
}
