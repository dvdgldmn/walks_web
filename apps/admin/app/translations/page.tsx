'use client';

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { apiFetch, TranslationItem } from '../lib/api';

const sectionOrder = [
  'nav',
  'hero',
  'how',
  'competition',
  'season',
  'download',
  'footer',
  'legal',
] as const;

const hiddenSections = new Set(['impact', 'pricing', 'tracker', 'partners']);

const hiddenSectionKeys: Record<string, string[]> = {
  nav: ['impact', 'partners'],
};

const sectionLabels: Record<string, string> = {
  nav: '01. Navigation',
  hero: '02. Hero',
  how: '03. How It Works',
  competition: '04. Competition / S03',
  season: '05. Season',
  download: '06. Get The App',
  footer: '07. Footer',
  legal: '08. Legal Pages',
};

export default function TranslationsPage() {
  const [items, setItems] = useState<TranslationItem[]>([]);
  const [section, setSection] = useState('all');
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [newItem, setNewItem] = useState({
    section: 'hero',
    key: '',
    az: '',
    en: '',
  });

  const load = async (activeSection: string) => {
    setLoading(true);
    try {
      const query = activeSection === 'all' ? '' : `?section=${activeSection}`;
      const data = await apiFetch<TranslationItem[]>(`/translations${query}`);
      setItems(data);
      setStatus(data.length ? '' : 'No translations found for this section.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load translations';
      setItems([]);
      setStatus(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load(section);
  }, [section]);

  const sortedItems = useMemo(
    () =>
      [...items]
        .filter((item) => {
          if (hiddenSections.has(item.section)) return false;
          return !(hiddenSectionKeys[item.section] ?? []).includes(item.key);
        })
        .sort((a, b) => `${a.section}.${a.key}`.localeCompare(`${b.section}.${b.key}`)),
    [items],
  );

  const visibleSections = useMemo(() => {
    if (section !== 'all') return [section];

    const existing = new Set(sortedItems.map((item) => item.section));
    const ordered = sectionOrder.filter((item) => existing.has(item));
    const extra = [...existing]
      .filter((item) => !sectionOrder.includes(item as (typeof sectionOrder)[number]))
      .sort((a, b) => a.localeCompare(b));

    return [...ordered, ...extra];
  }, [section, sortedItems]);

  const itemsBySection = useMemo(() => {
    return visibleSections.map((sectionName) => ({
      section: sectionName,
      label: sectionLabels[sectionName] ?? sectionName,
      items: sortedItems.filter((item) => item.section === sectionName),
    }));
  }, [sortedItems, visibleSections]);

  const saveItem = async (item: TranslationItem) => {
    setStatus(`Saving ${item.key}…`);
    try {
      const updated = await apiFetch<TranslationItem>(`/translations/${item.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          section: item.section,
          key: item.key,
          az: item.az,
          en: item.en,
        }),
      });
      setItems((current) => current.map((entry) => (entry.id === updated.id ? updated : entry)));
      setStatus('Saved');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Save failed');
    }
  };

  const createItem = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus('Creating…');

    try {
      const created = await apiFetch<TranslationItem>('/translations', {
        method: 'POST',
        body: JSON.stringify(newItem),
      });
      setItems((current) => [created, ...current]);
      setNewItem({ section: newItem.section, key: '', az: '', en: '' });
      setStatus('Created');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Create failed');
    }
  };

  return (
    <main className="page-wrap">
      <div className="page-head">
        <h1>Translations</h1>
        <p>Manage AZ / EN copy by section and key.</p>
      </div>

      <div className="panel stack-md">
        <div className="toolbar">
          <select className="input" value={section} onChange={(event) => setSection(event.target.value)}>
            <option value="all">All sections</option>
            {sectionOrder.map((item) => (
              <option key={item} value={item}>
                {sectionLabels[item]}
              </option>
            ))}
          </select>
          <span className="muted">{status}</span>
        </div>

        <form className="panel nested-panel stack-md" onSubmit={createItem}>
          <strong>Add translation key</strong>
          <div className="grid-4">
            <select
              className="input"
              value={newItem.section}
              onChange={(event) => setNewItem((current) => ({ ...current, section: event.target.value }))}
            >
              {sectionOrder.map((item) => (
                <option key={item} value={item}>
                  {sectionLabels[item]}
                </option>
              ))}
            </select>
            <input
              className="input"
              placeholder="Key"
              value={newItem.key}
              onChange={(event) => setNewItem((current) => ({ ...current, key: event.target.value }))}
            />
            <input
              className="input"
              placeholder="AZ text"
              value={newItem.az}
              onChange={(event) => setNewItem((current) => ({ ...current, az: event.target.value }))}
            />
            <input
              className="input"
              placeholder="EN text"
              value={newItem.en}
              onChange={(event) => setNewItem((current) => ({ ...current, en: event.target.value }))}
            />
          </div>
          <div className="action-row">
            <button className="primary-button" type="submit">
              Add key
            </button>
          </div>
        </form>

        {loading ? (
          <div className="panel nested-panel">Loading translations…</div>
        ) : itemsBySection.length === 0 ? (
          <div className="panel nested-panel">
            <strong>No translations visible.</strong>
            <p className="muted" style={{ marginTop: 8 }}>
              {status || 'The page did not receive any translation records.'}
            </p>
          </div>
        ) : (
          <div className="stack-lg">
            {itemsBySection.map((group) => (
              <section className="translations-section" key={group.section}>
                <div className="translations-section__head">
                  <h2>{group.label}</h2>
                  <span className="muted">{group.items.length} keys</span>
                </div>

                <div className="table-wrap">
                  <table className="data-table">
                    <thead>
                      <tr>
                        <th>Key</th>
                        <th>AZ</th>
                        <th>EN</th>
                        <th />
                      </tr>
                    </thead>
                    <tbody>
                      {group.items.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="translation-key-wrap">
                              <input
                                className="input table-input"
                                value={item.key}
                                onChange={(event) =>
                                  setItems((current) =>
                                    current.map((entry) =>
                                      entry.id === item.id ? { ...entry, key: event.target.value } : entry,
                                    ),
                                  )
                                }
                              />
                              <span className="translation-key-meta">{item.section}</span>
                            </div>
                          </td>
                          <td>
                            <textarea
                              className="input textarea table-textarea"
                              value={item.az}
                              onChange={(event) =>
                                setItems((current) =>
                                  current.map((entry) =>
                                    entry.id === item.id ? { ...entry, az: event.target.value } : entry,
                                  ),
                                )
                              }
                            />
                          </td>
                          <td>
                            <textarea
                              className="input textarea table-textarea"
                              value={item.en}
                              onChange={(event) =>
                                setItems((current) =>
                                  current.map((entry) =>
                                    entry.id === item.id ? { ...entry, en: event.target.value } : entry,
                                  ),
                                )
                              }
                            />
                          </td>
                          <td>
                            <button className="secondary-button" onClick={() => void saveItem(item)} type="button">
                              Save
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
