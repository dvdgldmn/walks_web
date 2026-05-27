'use client';

import { useMemo, useState } from 'react';
import { PublicShelterAnimal } from '../../lib/content';
import styles from './secondary-shell.module.css';

export type ShelterContent = {
  heroIntro?: string;
  aboutTitle?: string;
  aboutParagraphs?: string[];
  stats?: Array<{ value: string; label: string }>;
  careTitle?: string;
  careIntro?: string;
  careBullets?: string[];
  adoptionTitle?: string;
  adoptionParagraphs?: string[];
  transparencyTitle?: string;
  transparencyParagraphs?: string[];
  supportTitle?: string;
  supportParagraph?: string;
  supportNote?: string;
  dogsTitle?: string;
  dogsIntro?: string;
  contactsTitle?: string;
  contacts?: Array<{ label: string; url?: string }>;
};

const fallbackContent: ShelterContent = {
  heroIntro: 'Baku Animal Rescue & Shelter cares for rescued dogs and relies on sustained community support.',
  aboutTitle: 'About the shelter',
  aboutParagraphs: [
    'BARS rescues dogs in urgent need of safety, veterinary care, and long-term recovery.',
    'The shelter works with limited resources and depends on transparent, recurring support.',
    'Every coin donated through Dosty Walks helps turn movement into food and care.',
  ],
  stats: [
    { value: '9+', label: 'dogs currently highlighted on the page' },
    { value: '24/7', label: 'care, feeding, and safety routines' },
    { value: '100%', label: 'community-backed support model' },
  ],
  careTitle: 'Daily care',
  careIntro: 'The shelter team covers the daily essentials that keep the animals safe and stable.',
  careBullets: [
    'Feeding and hydration',
    'Cleaning and hygiene',
    'Medical observation and treatment support',
    'Socialisation and human contact',
  ],
  adoptionTitle: 'Adoption and recovery',
  adoptionParagraphs: [
    'Some dogs need urgent recovery before they are ready for a family environment.',
    'Others are already open, social, and waiting for a stable home.',
  ],
  transparencyTitle: 'Transparency',
  transparencyParagraphs: [
    'Support should be visible, understandable, and tied to real care outcomes.',
    'That is why Dosty Walks focuses on making the impact easy to communicate.',
  ],
  supportTitle: 'How support helps',
  supportParagraph:
    'Every step in Dosty Walks can contribute to real food and support for shelter animals.',
  supportNote:
    'The shelter page is managed through CMS, so stories, images, and animal cards can be updated continuously.',
  dogsTitle: 'Meet the dogs',
  dogsIntro: 'Each story below represents a real animal who depends on shelter support and human care.',
  contactsTitle: 'Contacts',
  contacts: [],
};

export function ShelterPageContent({
  content,
  animals,
  logoUrl,
  logoAlt,
}: {
  content: ShelterContent | null;
  animals: PublicShelterAnimal[];
  logoUrl?: string | null;
  logoAlt?: string | null;
}) {
  const mergedContent = content ?? fallbackContent;
  const [activeId, setActiveId] = useState<string | null>(animals[0]?.id ?? null);

  const activeAnimal = useMemo(() => {
    if (!animals.length) {
      return null;
    }

    return animals.find((item) => item.id === activeId) ?? animals[0];
  }, [activeId, animals]);

  return (
    <>
      {logoUrl ? (
        <section className={styles.section}>
          <div className={styles.logoWrap}>
            <img alt={logoAlt || 'Shelter logo'} className={styles.logo} src={logoUrl} />
          </div>
          {mergedContent.heroIntro ? <p>{mergedContent.heroIntro}</p> : null}
        </section>
      ) : null}

      {mergedContent.aboutTitle ? (
        <section className={styles.section}>
          <h2>{mergedContent.aboutTitle}</h2>
          {mergedContent.aboutParagraphs?.map((item, index) => <p key={index}>{item}</p>)}
          {mergedContent.stats?.length ? (
            <div className={styles.stats}>
              {mergedContent.stats.map((item, index) => (
                <div className={styles.stat} key={index}>
                  <strong>{item.value}</strong>
                  <span>{item.label}</span>
                </div>
              ))}
            </div>
          ) : null}
        </section>
      ) : null}

      {mergedContent.careTitle ? (
        <section className={styles.section}>
          <h2>{mergedContent.careTitle}</h2>
          {mergedContent.careIntro ? <p>{mergedContent.careIntro}</p> : null}
          {mergedContent.careBullets?.length ? (
            <ul>
              {mergedContent.careBullets.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : null}
        </section>
      ) : null}

      {mergedContent.adoptionTitle ? (
        <section className={styles.section}>
          <h2>{mergedContent.adoptionTitle}</h2>
          {mergedContent.adoptionParagraphs?.map((item, index) => <p key={index}>{item}</p>)}
        </section>
      ) : null}

      {mergedContent.transparencyTitle ? (
        <section className={styles.section}>
          <h2>{mergedContent.transparencyTitle}</h2>
          {mergedContent.transparencyParagraphs?.map((item, index) => <p key={index}>{item}</p>)}
        </section>
      ) : null}

      {mergedContent.supportTitle ? (
        <section className={styles.section}>
          <h2>{mergedContent.supportTitle}</h2>
          {mergedContent.supportParagraph ? <p>{mergedContent.supportParagraph}</p> : null}
          {mergedContent.supportNote ? <div className={styles.note}>{mergedContent.supportNote}</div> : null}
        </section>
      ) : null}

      {mergedContent.dogsTitle ? (
        <section className={styles.section}>
          <h2>{mergedContent.dogsTitle}</h2>
          {mergedContent.dogsIntro ? <p>{mergedContent.dogsIntro}</p> : null}

          {activeAnimal ? (
            <>
              <div className={styles.dogStory}>
                <div className={styles.dogMedia}>
                  <img alt={activeAnimal.alt || activeAnimal.name} src={activeAnimal.imagePath.startsWith('/') ? activeAnimal.imagePath : activeAnimal.imagePath} />
                </div>
                <div className={styles.dogBody}>
                  {activeAnimal.eyebrow ? <span className={styles.dogEyebrow}>{activeAnimal.eyebrow}</span> : null}
                  <h3 className={styles.dogTitle}>{activeAnimal.name}</h3>
                  <div className={styles.dogMeta}>
                    {[
                      [activeAnimal.genderLabel, activeAnimal.genderValue],
                      [activeAnimal.birthLabel, activeAnimal.birthValue],
                      [activeAnimal.breedLabel, activeAnimal.breedValue],
                      [activeAnimal.colorLabel, activeAnimal.colorValue],
                    ]
                      .filter((item) => item[0] || item[1])
                      .map(([label, value], index) => (
                        <div className={styles.dogMetaRow} key={index}>
                          <strong>{label}</strong>
                          <span>{value}</span>
                        </div>
                      ))}
                  </div>
                  <p className={styles.dogCopy}>{activeAnimal.story}</p>
                </div>
              </div>

              {animals.length > 1 ? (
                <div className={styles.dogThumbs}>
                  {animals.map((animal) => (
                    <button
                      className={`${styles.dogThumb} ${
                        animal.id === activeAnimal.id ? styles.dogThumbActive : ''
                      }`}
                      key={animal.id}
                      onClick={() => setActiveId(animal.id)}
                      type="button"
                    >
                      <img alt={animal.alt || animal.name} src={animal.imagePath} />
                      <span>{animal.thumbLabel || animal.name}</span>
                    </button>
                  ))}
                </div>
              ) : null}
            </>
          ) : null}
        </section>
      ) : null}

      {mergedContent.contactsTitle ? (
        <section className={styles.section}>
          <h2>{mergedContent.contactsTitle}</h2>
          {mergedContent.contacts?.length ? (
            <div className={styles.links}>
              {mergedContent.contacts.map((item, index) =>
                item.url ? (
                  <a href={item.url} key={index} rel="noreferrer" target="_blank">
                    {item.label}
                  </a>
                ) : (
                  <span key={index}>{item.label}</span>
                ),
              )}
            </div>
          ) : null}
        </section>
      ) : null}
    </>
  );
}
