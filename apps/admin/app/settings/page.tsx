'use client';

import { ChangeEvent, FormEvent, useEffect, useMemo, useState } from 'react';
import { apiFetch, MediaItem, SettingItem } from '../lib/api';

type SettingsMap = Record<string, Record<string, unknown>>;

const defaultSettings: SettingsMap = {
  'site.defaultLanguage': { code: 'en' },
  'site.seo': {
    titleAz: '',
    titleEn: '',
    descriptionAz: '',
    descriptionEn: '',
  },
  'social.facebook': { enabled: false, url: '' },
  'social.instagram': { enabled: false, url: '' },
  'social.tiktok': { enabled: false, url: '' },
  'store.apple': { url: '' },
  'store.google': { url: '' },
};

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsMap>(defaultSettings);
  const [logo, setLogo] = useState<MediaItem | null>(null);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const apiBaseUrl = '';

  useEffect(() => {
    const load = async () => {
      try {
        const [items, media] = await Promise.all([
          apiFetch<SettingItem[]>('/settings'),
          apiFetch<MediaItem[]>('/media?section=settings'),
        ]);
        const next: SettingsMap = { ...defaultSettings };
        items.forEach((item) => {
          next[item.key] = item.value;
        });
        setSettings(next);
        setLogo(media.find((item) => item.slot === 'logo') ?? null);
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, []);

  const socialKeys = useMemo(
    () => ['social.facebook', 'social.instagram', 'social.tiktok'],
    [],
  );

  const updateSetting = (key: string, field: string, value: unknown) => {
    setSettings((current) => ({
      ...current,
      [key]: {
        ...(current[key] ?? {}),
        [field]: value,
      },
    }));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('Saving…');

    try {
      await apiFetch('/settings', {
        method: 'PATCH',
        body: JSON.stringify({
          settings: Object.entries(settings).map(([key, value]) => ({ key, value })),
        }),
      });
      setStatus('Saved');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Save failed');
    }
  };

  const uploadLogo = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setStatus('Uploading logo…');
    const formData = new FormData();
    formData.set('file', file);
    formData.set('section', 'settings');
    formData.set('slot', 'logo');
    formData.set('kind', 'logos');

    try {
      const item = await apiFetch<MediaItem>('/media/upload', {
        method: 'POST',
        body: formData,
      });
      setLogo(item);
      setStatus('Logo uploaded');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      event.target.value = '';
    }
  };

  if (loading) {
    return (
      <main className="page-wrap">
        <div className="panel">Loading settings…</div>
      </main>
    );
  }

  return (
    <main className="page-wrap">
      <div className="page-head">
        <h1>Settings</h1>
        <p>Global brand, SEO, socials, and store links.</p>
      </div>

      <form className="stack-lg" onSubmit={onSubmit}>
        <section className="panel stack-md">
          <h2>Logo</h2>
          {logo ? (
            <div className="media-preview">
              <img alt="Current logo" src={`${apiBaseUrl}/uploads/${logo.filePath}`} />
            </div>
          ) : (
            <div className="empty-box">No logo uploaded yet.</div>
          )}
          <label className="upload-box">
            <span>{logo ? 'Replace logo' : 'Upload logo'}</span>
            <input accept=".svg,.png,.jpg,.jpeg,.webp" type="file" onChange={uploadLogo} />
          </label>
        </section>

        <section className="panel stack-md">
          <h2>Default Language</h2>
          <select
            className="input"
            value={String(settings['site.defaultLanguage']?.code ?? 'en')}
            onChange={(event) =>
              updateSetting('site.defaultLanguage', 'code', event.target.value)
            }
          >
            <option value="en">English</option>
            <option value="az">Azerbaijani</option>
          </select>
        </section>

        <section className="panel stack-md">
          <h2>SEO Defaults</h2>
          <div className="grid-2">
            <label className="field">
              <span>SEO title AZ</span>
              <input
                className="input"
                value={String(settings['site.seo']?.titleAz ?? '')}
                onChange={(event) => updateSetting('site.seo', 'titleAz', event.target.value)}
              />
            </label>
            <label className="field">
              <span>SEO title EN</span>
              <input
                className="input"
                value={String(settings['site.seo']?.titleEn ?? '')}
                onChange={(event) => updateSetting('site.seo', 'titleEn', event.target.value)}
              />
            </label>
          </div>
          <label className="field">
            <span>SEO description AZ</span>
            <textarea
              className="input textarea"
              value={String(settings['site.seo']?.descriptionAz ?? '')}
              onChange={(event) =>
                updateSetting('site.seo', 'descriptionAz', event.target.value)
              }
            />
          </label>
          <label className="field">
            <span>SEO description EN</span>
            <textarea
              className="input textarea"
              value={String(settings['site.seo']?.descriptionEn ?? '')}
              onChange={(event) =>
                updateSetting('site.seo', 'descriptionEn', event.target.value)
              }
            />
          </label>
        </section>

        <section className="panel stack-md">
          <h2>Social Links</h2>
          <div className="grid-2">
            {socialKeys.map((key) => (
              <div className="panel nested-panel" key={key}>
                <strong>{key.replace('social.', '')}</strong>
                <label className="checkbox-row">
                  <input
                    checked={Boolean(settings[key]?.enabled)}
                    type="checkbox"
                    onChange={(event) => updateSetting(key, 'enabled', event.target.checked)}
                  />
                  <span>Enabled</span>
                </label>
                <input
                  className="input"
                  placeholder="https://"
                  value={String(settings[key]?.url ?? '')}
                  onChange={(event) => updateSetting(key, 'url', event.target.value)}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="panel stack-md">
          <h2>Store Badge Links</h2>
          <div className="grid-2">
            <label className="field">
              <span>Apple Store link</span>
              <input
                className="input"
                placeholder="https://apps.apple.com/..."
                value={String(settings['store.apple']?.url ?? '')}
                onChange={(event) => updateSetting('store.apple', 'url', event.target.value)}
              />
            </label>
            <label className="field">
              <span>Google Play link</span>
              <input
                className="input"
                placeholder="https://play.google.com/..."
                value={String(settings['store.google']?.url ?? '')}
                onChange={(event) => updateSetting('store.google', 'url', event.target.value)}
              />
            </label>
          </div>
        </section>

        <div className="action-row">
          <button className="primary-button" type="submit">
            Save settings
          </button>
          <span className="muted">{status}</span>
        </div>
      </form>
    </main>
  );
}
