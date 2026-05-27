'use client';

import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import { apiFetch, MediaItem } from '../lib/api';

const slotPresets = [
  { section: 'download', slot: 'qr', kind: 'qr', label: 'Get the app QR' },
  { section: 'hero', slot: 'phone', kind: 'sections', label: 'Hero phone' },
  { section: 'hero', slot: 'mascot', kind: 'sections', label: 'Hero mascot' },
  { section: 'competition', slot: 'screen-1', kind: 'sections', label: 'Competition screen 1' },
  { section: 'competition', slot: 'screen-2', kind: 'sections', label: 'Competition screen 2' },
  { section: 'competition', slot: 'screen-3', kind: 'sections', label: 'Competition screen 3' },
  { section: 'competition', slot: 'screen-4', kind: 'sections', label: 'Competition screen 4' },
  { section: 'season', slot: 'phone', kind: 'sections', label: 'Season screen' },
];

const API_URL = '';

export default function MediaPage() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<MediaItem[]>('/media');
      setItems(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const itemMap = useMemo(
    () => Object.fromEntries(items.map((item) => [`${item.section}.${item.slot}`, item])),
    [items],
  );

  const uploadFile = async (
    event: ChangeEvent<HTMLInputElement>,
    preset: (typeof slotPresets)[number],
  ) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setStatus(`Uploading ${preset.label}…`);
    const formData = new FormData();
    formData.set('file', file);
    formData.set('section', preset.section);
    formData.set('slot', preset.slot);
    formData.set('kind', preset.kind);

    try {
      await apiFetch<MediaItem>('/media/upload', {
        method: 'POST',
        body: formData,
      });
      await load();
      setStatus('Uploaded');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      event.target.value = '';
    }
  };

  const saveMeta = async (item: MediaItem) => {
    setStatus(`Saving ${item.slot}…`);
    try {
      const updated = await apiFetch<MediaItem>(`/media/${item.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          altAz: item.altAz,
          altEn: item.altEn,
        }),
      });
      setItems((current) => current.map((entry) => (entry.id === updated.id ? updated : entry)));
      setStatus('Saved');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Save failed');
    }
  };

  const remove = async (item: MediaItem) => {
    setStatus(`Deleting ${item.slot}…`);
    try {
      await apiFetch(`/media/${item.id}`, {
        method: 'DELETE',
      });
      setItems((current) => current.filter((entry) => entry.id !== item.id));
      setStatus('Deleted');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Delete failed');
    }
  };

  return (
    <main className="page-wrap">
      <div className="page-head">
        <h1>Media</h1>
        <p>Manage QR and section visuals.</p>
      </div>

      <div className="muted">{status}</div>

      {loading ? (
        <div className="panel">Loading media…</div>
      ) : (
        <div className="grid-2">
          {slotPresets.map((preset) => {
            const key = `${preset.section}.${preset.slot}`;
            const item = itemMap[key];

            return (
              <div className="panel stack-md" key={key}>
                <div>
                  <strong>{preset.label}</strong>
                  <p className="muted">{key}</p>
                </div>

                {item ? (
                  <>
                    <div className="media-preview">
                      <img alt={item.slot} src={`${API_URL}/uploads/${item.filePath}`} />
                    </div>

                    <label className="field">
                      <span>Alt AZ</span>
                      <input
                        className="input"
                        value={item.altAz ?? ''}
                        onChange={(event) =>
                          setItems((current) =>
                            current.map((entry) =>
                              entry.id === item.id ? { ...entry, altAz: event.target.value } : entry,
                            ),
                          )
                        }
                      />
                    </label>
                    <label className="field">
                      <span>Alt EN</span>
                      <input
                        className="input"
                        value={item.altEn ?? ''}
                        onChange={(event) =>
                          setItems((current) =>
                            current.map((entry) =>
                              entry.id === item.id ? { ...entry, altEn: event.target.value } : entry,
                            ),
                          )
                        }
                      />
                    </label>

                    <div className="action-row">
                      <button className="secondary-button" onClick={() => void saveMeta(item)} type="button">
                        Save meta
                      </button>
                      <button className="ghost-button danger-button" onClick={() => void remove(item)} type="button">
                        Delete
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="empty-box">No file uploaded yet.</div>
                )}

                <label className="upload-box">
                  <span>{item ? 'Replace file' : 'Upload file'}</span>
                  <input type="file" onChange={(event) => void uploadFile(event, preset)} />
                </label>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
