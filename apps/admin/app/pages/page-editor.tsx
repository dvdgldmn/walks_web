'use client';

import Link from 'next/link';
import { FormEvent, useEffect, useMemo, useState } from 'react';
import { apiFetch, MediaItem, PageItem, ShelterAnimalItem } from '../lib/api';

const pageLabels: Record<string, string> = {
  privacy: 'Privacy Policy',
  terms: 'Terms of Use',
  rules: 'Rules',
  faq: 'FAQ',
  shelter: 'Shelter Page',
  contact: 'Contact Page',
};

const pageHints: Record<string, string> = {
  privacy: 'Legal policy page. Edit content, slug, and SEO.',
  terms: 'Terms page. Edit content, slug, and SEO.',
  rules: 'Rules page. Edit bilingual content, slug, and SEO.',
  faq: 'FAQ page. Edit bilingual questions, answers, slug, and SEO.',
  shelter: 'Structured editor for all visible texts on the shelter page.',
  contact: 'Contact page intro, title, slug, and SEO. The form itself is rendered from the shared template.',
};

type ShelterStat = {
  value: string;
  label: string;
};

type ShelterDog = {
  id: string;
  name: string;
  eyebrow: string;
  alt: string;
  thumbLabel: string;
  genderLabel: string;
  genderValue: string;
  birthLabel: string;
  birthValue: string;
  breedLabel: string;
  breedValue: string;
  colorLabel: string;
  colorValue: string;
  story: string;
};

type EditableShelterAnimal = Omit<
  ShelterAnimalItem,
  'id' | 'imagePath' | 'imageFileName' | 'imageOriginalName' | 'imageMimeType'
> & {
  id?: string;
  imagePath?: string;
  imageFileName?: string;
  imageOriginalName?: string;
  imageMimeType?: string;
  file?: File | null;
};

type ShelterContact = {
  label: string;
  url: string;
};

type ShelterContent = {
  heroIntro: string;
  aboutTitle: string;
  aboutParagraphs: string[];
  stats: ShelterStat[];
  careTitle: string;
  careIntro: string;
  careBullets: string[];
  adoptionTitle: string;
  adoptionParagraphs: string[];
  transparencyTitle: string;
  transparencyParagraphs: string[];
  supportTitle: string;
  supportParagraph: string;
  supportNote: string;
  dogsTitle: string;
  dogsIntro: string;
  contactsTitle: string;
  contacts: ShelterContact[];
  dogs: ShelterDog[];
};

const shelterDefaultAz: ShelterContent = {
  heroIntro:
    'BARS sığınacağı Dosty Walks-un hər ay yemək dəstəyi göndərdiyi əsas sığınacaqlardan biridir. Bu səhifə sığınacaq, onun qayğı prosesi və yardımın necə real nəticəyə çevrildiyi haqqında məlumat verir.',
  aboutTitle: 'BARS haqqında',
  aboutParagraphs: [
    'Baku Animal Rescue Society (BARS) 2012-ci ildə Bakıda qeydiyyatdan keçmiş heyvan müdafiəsi təşkilatıdır.',
    'İllər ərzində BARS yüzlərlə it və pişiyə kömək edib. Komanda heyvanları küçədən xilas edir, müalicə edir, sığınacaqda qayğı göstərir və onlara Azərbaycanda və xaricdə yeni ailələr tapmağa çalışır.',
    'Təşkilat şəxsi zəhmət, fərdi ianələr və heyvanların taleyinə biganə olmayan insanların dəstəyi ilə yaşayır.',
  ],
  stats: [
    { value: '2012', label: 'Təşkilatın Bakıda rəsmi qeydiyyat ili.' },
    { value: 'Yüzlərlə', label: 'BARS fəaliyyəti ərzində yüzlərlə it və pişiyə yardım edib.' },
    { value: 'Tonlarla', label: 'Heyvanların gündəlik qayğısı üçün tonlarla yem istifadə olunub.' },
  ],
  careTitle: 'Heyvanlar necə qeydiyyata alınır',
  careIntro:
    'Heyvanların qeydiyyatı BARS komandası daxilində aparılır. Sığınacağa düşən hər itin vəziyyəti xilas olunduğu andan izlənir.',
  careBullets: [
    'Cins, təxmini yaş, həyat hekayəsi və tibbi tarix qeydə alınır.',
    'İtin vəziyyəti, xasiyyəti, davranışı, foto və videolar saxlanılır.',
    'Bəzi itlərin artıq pasportu var, qalan heyvanlar üçün də sənədləşmə davam edir.',
    'Baytar həkimlərdə də adətən ayrıca heyvan dosyesi olur.',
  ],
  adoptionTitle: 'Qəbul və sahibləndirmə',
  adoptionParagraphs: [
    'Heyvanın sığınacağa qəbulu təsvir, foto və video ilə qeydə alınır. Yeni sahibə verilməzdən əvvəl komanda insanla tanış olur, gələcək yaşayış şəraitini qiymətləndirir və uyğun iti seçir.',
    'Sahibləndirmə zamanı müqavilə imzalanır. Beynəlxalq sahibləndirmə olduqda, daşınma və sənədləşmə üçün əlavə sənədlər hazırlanır.',
  ],
  transparencyTitle: 'Qayğının şəffaflığı',
  transparencyParagraphs: [
    'Yem, müalicə, dərman və saxlanma xərcləri uçota alınır. BARS donorlar və dəstəkçilər qarşısında şəffaflığı qorumaq üçün çek və hesabatları sosial şəbəkələrdə mütəmadi paylaşır.',
    'BARS 2–3 nəfərlik kiçik komandadır və iştirakçılar bu işi əsas işləri ilə paralel görür. Buna görə daimi Excel formatında detallı maliyyə uçotu aparılmasa da, əsas xərclər izlənir və rəsmi bank uçotu mühasib tərəfindən müşayiət olunur.',
  ],
  supportTitle: 'Dosty Walks necə kömək edir',
  supportParagraph:
    'Dosty Walks hər ay sığınacaq üçün yeməyə dəstək göndərir. İstifadəçi üçün addımlar ölçülə bilən yardıma çevrilir, BARS üçün isə heyvanların real ehtiyaclarına bağlanan daha stabil bir yardım dövrü yaranır.',
  supportNote:
    'Bu səhifə Dosty Walks vasitəsilə yardım alan sığınacağı göstərir və tətbiq, donorlar və BARS komandası arasında şəffaf etibar nöqtəsi kimi işləyir.',
  dogsTitle: 'İtlərlə tanış olun',
  dogsIntro:
    'Aşağıda BARS komandasının qayğı göstərdiyi itlərdən bəziləri var. Hekayəni və şəkli görmək üçün miniatürə klikləyin.',
  contactsTitle: 'Əlaqə və sosial keçidlər',
  contacts: [
    { label: 'Instagram · @bars_baku', url: 'https://www.instagram.com/bars_baku/' },
    { label: 'Instagram · @barsadopt', url: 'https://www.instagram.com/barsadopt/' },
    { label: 'Website · barsadopt.nl', url: 'https://barsadopt.nl' },
    {
      label: 'YouTube · Baku Animal Rescue Society',
      url: 'https://www.youtube.com/results?search_query=Baku+Animal+Rescue+Society',
    },
    { label: 'PayPal / Contact · info@barsadopt.nl', url: 'mailto:info@barsadopt.nl' },
  ],
  dogs: Array.from({ length: 9 }, (_, index) => ({
    id: index === 0 ? 'king' : `dog${index + 1}`,
    name: index === 0 ? 'Kinq' : `BARS Dog ${String(index + 1).padStart(2, '0')}`,
    eyebrow: 'BARS sakini · Hekayə',
    alt: index === 0 ? 'Kinq — BARS sığınacağında it' : 'BARS sığınacağında it',
    thumbLabel: index === 0 ? 'Kinq' : `BARS Dog ${String(index + 1).padStart(2, '0')}`,
    genderLabel: 'Cins',
    genderValue: 'Erkək',
    birthLabel: 'Doğum tarixi',
    birthValue: '1 may 2022',
    breedLabel: 'Cins tipi',
    breedValue: 'Kane-korso metisi',
    colorLabel: 'Rəng',
    colorValue: 'Qara',
    story:
      'Kinq çox ağır vəziyyətdə xilas olunmuşdu, demək olar ki, yalnız dəri və sümük qalmışdı. Görünüşü sərt olsa da, əslində çox mehriban, sakit və insanları sevən bir itdir. Hamı ilə yaxşı yola gedir və onu çox sevirik.',
  })),
};

const shelterDefaultEn: ShelterContent = {
  heroIntro:
    'BARS Shelter is one of the shelters supported by Dosty Walks through its monthly food mission. This page explains the shelter, its care process, and how support is turned into real help for animals.',
  aboutTitle: 'About BARS',
  aboutParagraphs: [
    'Baku Animal Rescue Society (BARS) is a non-profit animal welfare organisation registered in Baku in 2012.',
    'Over the years, BARS has helped hundreds of dogs and cats. The team rescues animals from the streets, treats them, cares for them in the shelter, and works to find them new families in Azerbaijan and abroad.',
    'The organisation exists through personal effort, private donations, and the help of people who care about the fate of animals.',
  ],
  stats: [
    { value: '2012', label: 'Year of official registration of the organisation in Baku.' },
    { value: 'Hundreds', label: 'Hundreds of dogs and cats have received help through BARS.' },
    { value: 'Tons', label: 'Tons of dry food, grain, and meat have been used for daily care.' },
  ],
  careTitle: 'How Animals Are Tracked',
  careIntro:
    'Animal records are maintained inside the BARS team. Every dog in the shelter is tracked from the moment it is rescued.',
  careBullets: [
    'Sex, approximate age, life story, and medical history are recorded.',
    'Condition, personality, behaviour, photo, and video records are kept.',
    'Some dogs already have passports, and BARS is gradually documenting the rest.',
    'Veterinarians also usually keep their own records for each animal.',
  ],
  adoptionTitle: 'Intake And Adoption',
  adoptionParagraphs: [
    'Each intake is documented through description, photos, and video. Before adoption, the team meets the future owner, evaluates the living conditions, and matches the dog to the right family.',
    'An adoption agreement is signed before transfer. If the adoption is international, additional transport and documentation papers are prepared.',
  ],
  transparencyTitle: 'Transparency Of Care',
  transparencyParagraphs: [
    'Core costs for food, treatment, medicine, and daily care are tracked. BARS regularly publishes receipts and updates on social media to keep transparency with donors and supporters.',
    'BARS is a small team of 2–3 people, and the work runs in parallel with each person\'s main job. Because of that, there is no constant detailed Excel-style accounting yet, but the main expenses are tracked and official bank records are supported by an accountant.',
  ],
  supportTitle: 'How Dosty Walks Helps',
  supportParagraph:
    'Dosty Walks sends monthly support for shelter food. For the user, this turns steps into measurable help. For BARS, it creates a more stable and understandable support cycle tied to the real needs of the animals.',
  supportNote:
    'This page shows the shelter that receives support through Dosty Walks and acts as a transparent trust point between the app, donors, and the BARS team.',
  dogsTitle: 'Meet The Dogs',
  dogsIntro:
    'Below are some of the dogs cared for by the BARS team. Click a thumbnail to open the story and photograph.',
  contactsTitle: 'Contacts And Social Links',
  contacts: [
    { label: 'Instagram · @bars_baku', url: 'https://www.instagram.com/bars_baku/' },
    { label: 'Instagram · @barsadopt', url: 'https://www.instagram.com/barsadopt/' },
    { label: 'Website · barsadopt.nl', url: 'https://barsadopt.nl' },
    {
      label: 'YouTube · Baku Animal Rescue Society',
      url: 'https://www.youtube.com/results?search_query=Baku+Animal+Rescue+Society',
    },
    { label: 'PayPal / Contact · info@barsadopt.nl', url: 'mailto:info@barsadopt.nl' },
  ],
  dogs: Array.from({ length: 9 }, (_, index) => ({
    id: index === 0 ? 'king' : `dog${index + 1}`,
    name: index === 0 ? 'King' : `BARS Dog ${String(index + 1).padStart(2, '0')}`,
    eyebrow: 'BARS resident · Story',
    alt: index === 0 ? 'King — dog at BARS shelter' : 'Dog at BARS shelter',
    thumbLabel: index === 0 ? 'King' : `BARS Dog ${String(index + 1).padStart(2, '0')}`,
    genderLabel: 'Gender',
    genderValue: 'Boy',
    birthLabel: 'Date of birth',
    birthValue: '1 May 2022',
    breedLabel: 'Breed',
    breedValue: 'Cane corso mix',
    colorLabel: 'Color',
    colorValue: 'Black',
    story:
      'King was rescued in very poor condition, almost skin and bones. Despite his strong appearance, he is in fact a gentle, affectionate, and very sweet dog. He gets along with everyone, loves people, and has become one of the dogs we care about most.',
  })),
};

function createEmptyAnimal(sortOrder: number): EditableShelterAnimal {
  return {
    pageType: 'shelter',
    nameAz: '',
    nameEn: '',
    eyebrowAz: '',
    eyebrowEn: '',
    altAz: '',
    altEn: '',
    thumbLabelAz: '',
    thumbLabelEn: '',
    genderLabelAz: '',
    genderLabelEn: '',
    genderValueAz: '',
    genderValueEn: '',
    birthLabelAz: '',
    birthLabelEn: '',
    birthValueAz: '',
    birthValueEn: '',
    breedLabelAz: '',
    breedLabelEn: '',
    breedValueAz: '',
    breedValueEn: '',
    colorLabelAz: '',
    colorLabelEn: '',
    colorValueAz: '',
    colorValueEn: '',
    storyAz: '',
    storyEn: '',
    sortOrder,
    published: true,
    file: null,
  };
}

function cloneShelterContent(value: ShelterContent): ShelterContent {
  return JSON.parse(JSON.stringify(value)) as ShelterContent;
}

function normalizeShelterContent(raw: string, fallback: ShelterContent): ShelterContent {
  const result = cloneShelterContent(fallback);
  if (!raw) return result;

  try {
    const parsed = JSON.parse(raw) as Partial<ShelterContent>;
    if (!parsed || typeof parsed !== 'object') return result;

    if (typeof parsed.heroIntro === 'string') result.heroIntro = parsed.heroIntro;
    if (typeof parsed.aboutTitle === 'string') result.aboutTitle = parsed.aboutTitle;
    if (Array.isArray(parsed.aboutParagraphs)) {
      result.aboutParagraphs = result.aboutParagraphs.map((item, index) =>
        typeof parsed.aboutParagraphs?.[index] === 'string' ? String(parsed.aboutParagraphs[index]) : item,
      );
    }
    if (Array.isArray(parsed.stats)) {
      result.stats = result.stats.map((item, index) => ({
        value: typeof parsed.stats?.[index]?.value === 'string' ? parsed.stats[index]!.value : item.value,
        label: typeof parsed.stats?.[index]?.label === 'string' ? parsed.stats[index]!.label : item.label,
      }));
    }
    if (typeof parsed.careTitle === 'string') result.careTitle = parsed.careTitle;
    if (typeof parsed.careIntro === 'string') result.careIntro = parsed.careIntro;
    if (Array.isArray(parsed.careBullets)) {
      result.careBullets = result.careBullets.map((item, index) =>
        typeof parsed.careBullets?.[index] === 'string' ? String(parsed.careBullets[index]) : item,
      );
    }
    if (typeof parsed.adoptionTitle === 'string') result.adoptionTitle = parsed.adoptionTitle;
    if (Array.isArray(parsed.adoptionParagraphs)) {
      result.adoptionParagraphs = result.adoptionParagraphs.map((item, index) =>
        typeof parsed.adoptionParagraphs?.[index] === 'string' ? String(parsed.adoptionParagraphs[index]) : item,
      );
    }
    if (typeof parsed.transparencyTitle === 'string') result.transparencyTitle = parsed.transparencyTitle;
    if (Array.isArray(parsed.transparencyParagraphs)) {
      result.transparencyParagraphs = result.transparencyParagraphs.map((item, index) =>
        typeof parsed.transparencyParagraphs?.[index] === 'string' ? String(parsed.transparencyParagraphs[index]) : item,
      );
    }
    if (typeof parsed.supportTitle === 'string') result.supportTitle = parsed.supportTitle;
    if (typeof parsed.supportParagraph === 'string') result.supportParagraph = parsed.supportParagraph;
    if (typeof parsed.supportNote === 'string') result.supportNote = parsed.supportNote;
    if (typeof parsed.dogsTitle === 'string') result.dogsTitle = parsed.dogsTitle;
    if (typeof parsed.dogsIntro === 'string') result.dogsIntro = parsed.dogsIntro;
    if (typeof parsed.contactsTitle === 'string') result.contactsTitle = parsed.contactsTitle;
    if (Array.isArray(parsed.contacts)) {
      result.contacts = result.contacts.map((item, index) => ({
        label: typeof parsed.contacts?.[index]?.label === 'string' ? parsed.contacts[index]!.label : item.label,
        url: typeof parsed.contacts?.[index]?.url === 'string' ? parsed.contacts[index]!.url : item.url,
      }));
    }
    if (Array.isArray(parsed.dogs)) {
      result.dogs = result.dogs.map((item, index) => {
        const current = parsed.dogs?.[index];
        return {
          ...item,
          id: typeof current?.id === 'string' ? current.id : item.id,
          name: typeof current?.name === 'string' ? current.name : item.name,
          eyebrow: typeof current?.eyebrow === 'string' ? current.eyebrow : item.eyebrow,
          alt: typeof current?.alt === 'string' ? current.alt : item.alt,
          thumbLabel: typeof current?.thumbLabel === 'string' ? current.thumbLabel : item.thumbLabel,
          genderLabel: typeof current?.genderLabel === 'string' ? current.genderLabel : item.genderLabel,
          genderValue: typeof current?.genderValue === 'string' ? current.genderValue : item.genderValue,
          birthLabel: typeof current?.birthLabel === 'string' ? current.birthLabel : item.birthLabel,
          birthValue: typeof current?.birthValue === 'string' ? current.birthValue : item.birthValue,
          breedLabel: typeof current?.breedLabel === 'string' ? current.breedLabel : item.breedLabel,
          breedValue: typeof current?.breedValue === 'string' ? current.breedValue : item.breedValue,
          colorLabel: typeof current?.colorLabel === 'string' ? current.colorLabel : item.colorLabel,
          colorValue: typeof current?.colorValue === 'string' ? current.colorValue : item.colorValue,
          story: typeof current?.story === 'string' ? current.story : item.story,
        };
      });
    }

    return result;
  } catch {
    return result;
  }
}

function ShelterEditor({ label, value, onChange }: { label: string; value: ShelterContent; onChange: (next: ShelterContent) => void }) {
  const setField = <K extends keyof ShelterContent>(key: K, next: ShelterContent[K]) => {
    onChange({ ...value, [key]: next });
  };

  return (
    <div className="panel stack-lg">
      <div>
        <h2>{label}</h2>
        <p className="muted">All visible shelter page texts for {label.toUpperCase()}.</p>
      </div>

      <div className="section-card stack-md">
        <h3>Hero</h3>
        <label className="field">
          <span>Hero intro</span>
          <textarea className="input textarea" value={value.heroIntro} onChange={(event) => setField('heroIntro', event.target.value)} />
        </label>
      </div>

      <div className="section-card stack-md">
        <h3>About</h3>
        <label className="field">
          <span>Section title</span>
          <input className="input" value={value.aboutTitle} onChange={(event) => setField('aboutTitle', event.target.value)} />
        </label>
        {value.aboutParagraphs.map((item, index) => (
          <label className="field" key={`about-${label}-${index}`}>
            <span>{`Paragraph ${index + 1}`}</span>
            <textarea className="input textarea" value={item} onChange={(event) => setField('aboutParagraphs', value.aboutParagraphs.map((paragraph, paragraphIndex) => (paragraphIndex === index ? event.target.value : paragraph)))} />
          </label>
        ))}
      </div>

      <div className="section-card stack-md">
        <h3>Stats</h3>
        {value.stats.map((item, index) => (
          <div className="grid-2" key={`stat-${label}-${index}`}>
            <label className="field">
              <span>{`Stat ${index + 1} value`}</span>
              <input className="input" value={item.value} onChange={(event) => setField('stats', value.stats.map((stat, statIndex) => (statIndex === index ? { ...stat, value: event.target.value } : stat)))} />
            </label>
            <label className="field">
              <span>{`Stat ${index + 1} text`}</span>
              <textarea className="input textarea" value={item.label} onChange={(event) => setField('stats', value.stats.map((stat, statIndex) => (statIndex === index ? { ...stat, label: event.target.value } : stat)))} />
            </label>
          </div>
        ))}
      </div>

      <div className="section-card stack-md">
        <h3>Care</h3>
        <label className="field">
          <span>Section title</span>
          <input className="input" value={value.careTitle} onChange={(event) => setField('careTitle', event.target.value)} />
        </label>
        <label className="field">
          <span>Intro paragraph</span>
          <textarea className="input textarea" value={value.careIntro} onChange={(event) => setField('careIntro', event.target.value)} />
        </label>
        {value.careBullets.map((item, index) => (
          <label className="field" key={`care-${label}-${index}`}>
            <span>{`Bullet ${index + 1}`}</span>
            <textarea className="input textarea" value={item} onChange={(event) => setField('careBullets', value.careBullets.map((bullet, bulletIndex) => (bulletIndex === index ? event.target.value : bullet)))} />
          </label>
        ))}
      </div>

      <div className="section-card stack-md">
        <h3>Adoption</h3>
        <label className="field">
          <span>Section title</span>
          <input className="input" value={value.adoptionTitle} onChange={(event) => setField('adoptionTitle', event.target.value)} />
        </label>
        {value.adoptionParagraphs.map((item, index) => (
          <label className="field" key={`adoption-${label}-${index}`}>
            <span>{`Paragraph ${index + 1}`}</span>
            <textarea className="input textarea" value={item} onChange={(event) => setField('adoptionParagraphs', value.adoptionParagraphs.map((paragraph, paragraphIndex) => (paragraphIndex === index ? event.target.value : paragraph)))} />
          </label>
        ))}
      </div>

      <div className="section-card stack-md">
        <h3>Transparency</h3>
        <label className="field">
          <span>Section title</span>
          <input className="input" value={value.transparencyTitle} onChange={(event) => setField('transparencyTitle', event.target.value)} />
        </label>
        {value.transparencyParagraphs.map((item, index) => (
          <label className="field" key={`transparency-${label}-${index}`}>
            <span>{`Paragraph ${index + 1}`}</span>
            <textarea className="input textarea" value={item} onChange={(event) => setField('transparencyParagraphs', value.transparencyParagraphs.map((paragraph, paragraphIndex) => (paragraphIndex === index ? event.target.value : paragraph)))} />
          </label>
        ))}
      </div>

      <div className="section-card stack-md">
        <h3>Support</h3>
        <label className="field">
          <span>Section title</span>
          <input className="input" value={value.supportTitle} onChange={(event) => setField('supportTitle', event.target.value)} />
        </label>
        <label className="field">
          <span>Main paragraph</span>
          <textarea className="input textarea" value={value.supportParagraph} onChange={(event) => setField('supportParagraph', event.target.value)} />
        </label>
        <label className="field">
          <span>Highlight note</span>
          <textarea className="input textarea" value={value.supportNote} onChange={(event) => setField('supportNote', event.target.value)} />
        </label>
      </div>

      <div className="section-card stack-md">
        <h3>Dogs section</h3>
        <label className="field">
          <span>Section title</span>
          <input className="input" value={value.dogsTitle} onChange={(event) => setField('dogsTitle', event.target.value)} />
        </label>
        <label className="field">
          <span>Section intro</span>
          <textarea className="input textarea" value={value.dogsIntro} onChange={(event) => setField('dogsIntro', event.target.value)} />
        </label>
        <p className="muted">Animals are managed below as a dynamic list with photo upload and separate records.</p>
      </div>

      <div className="section-card stack-md">
        <h3>Contacts</h3>
        <label className="field">
          <span>Section title</span>
          <input className="input" value={value.contactsTitle} onChange={(event) => setField('contactsTitle', event.target.value)} />
        </label>
        {value.contacts.map((item, index) => (
          <div className="grid-2" key={`contact-${label}-${index}`}>
            <label className="field">
              <span>{`Link ${index + 1} label`}</span>
              <input className="input" value={item.label} onChange={(event) => setField('contacts', value.contacts.map((contact, contactIndex) => (contactIndex === index ? { ...contact, label: event.target.value } : contact)))} />
            </label>
            <label className="field">
              <span>{`Link ${index + 1} URL`}</span>
              <input className="input" value={item.url} onChange={(event) => setField('contacts', value.contacts.map((contact, contactIndex) => (contactIndex === index ? { ...contact, url: event.target.value } : contact)))} />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShelterAnimalsManager() {
  const [items, setItems] = useState<EditableShelterAnimal[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');

  const loadItems = async () => {
    setLoading(true);
    try {
      const data = await apiFetch<ShelterAnimalItem[]>('/shelter-animals?pageType=shelter');
      setItems(data.map((item) => ({ ...item, file: null })));
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed to load animals');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadItems();
  }, []);

  const updateItem = (index: number, patch: Partial<EditableShelterAnimal>) => {
    setItems((current) =>
      current.map((item, itemIndex) => (itemIndex === index ? { ...item, ...patch } : item)),
    );
  };

  const addAnimal = () => {
    setItems((current) => [...current, createEmptyAnimal(current.length)]);
  };

  const saveAnimal = async (item: EditableShelterAnimal, index: number) => {
    if (!item.id && !item.file) {
      setStatus('New animal requires a photo before saving');
      return;
    }
    setStatus(`Saving animal ${index + 1}...`);
    const form = new FormData();
    form.set('pageType', item.pageType || 'shelter');
    form.set('nameAz', item.nameAz);
    form.set('nameEn', item.nameEn);
    form.set('eyebrowAz', item.eyebrowAz || '');
    form.set('eyebrowEn', item.eyebrowEn || '');
    form.set('altAz', item.altAz || '');
    form.set('altEn', item.altEn || '');
    form.set('thumbLabelAz', item.thumbLabelAz || '');
    form.set('thumbLabelEn', item.thumbLabelEn || '');
    form.set('genderLabelAz', item.genderLabelAz || '');
    form.set('genderLabelEn', item.genderLabelEn || '');
    form.set('genderValueAz', item.genderValueAz || '');
    form.set('genderValueEn', item.genderValueEn || '');
    form.set('birthLabelAz', item.birthLabelAz || '');
    form.set('birthLabelEn', item.birthLabelEn || '');
    form.set('birthValueAz', item.birthValueAz || '');
    form.set('birthValueEn', item.birthValueEn || '');
    form.set('breedLabelAz', item.breedLabelAz || '');
    form.set('breedLabelEn', item.breedLabelEn || '');
    form.set('breedValueAz', item.breedValueAz || '');
    form.set('breedValueEn', item.breedValueEn || '');
    form.set('colorLabelAz', item.colorLabelAz || '');
    form.set('colorLabelEn', item.colorLabelEn || '');
    form.set('colorValueAz', item.colorValueAz || '');
    form.set('colorValueEn', item.colorValueEn || '');
    form.set('storyAz', item.storyAz);
    form.set('storyEn', item.storyEn);
    form.set('sortOrder', String(item.sortOrder));
    form.set('published', String(item.published));
    if (item.file) {
      form.set('file', item.file);
    }

    try {
      const saved = item.id
        ? await apiFetch<ShelterAnimalItem>(`/shelter-animals/${item.id}`, { method: 'PATCH', body: form })
        : await apiFetch<ShelterAnimalItem>('/shelter-animals', { method: 'POST', body: form });
      setItems((current) =>
        current.map((currentItem, currentIndex) =>
          currentIndex === index ? { ...saved, file: null } : currentItem,
        ),
      );
      setStatus('Animal saved');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed to save animal');
    }
  };

  const removeAnimal = async (item: EditableShelterAnimal, index: number) => {
    if (item.id) {
      try {
        await apiFetch<{ id: string }>(`/shelter-animals/${item.id}`, { method: 'DELETE' });
      } catch (error) {
        setStatus(error instanceof Error ? error.message : 'Failed to delete animal');
        return;
      }
    }
    setItems((current) =>
      current
        .filter((_, itemIndex) => itemIndex !== index)
        .map((currentItem, itemIndex) => ({ ...currentItem, sortOrder: itemIndex })),
    );
    setStatus('Animal removed');
  };

  const moveAnimal = (index: number, direction: -1 | 1) => {
    setItems((current) => {
      const targetIndex = index + direction;
      if (targetIndex < 0 || targetIndex >= current.length) return current;
      const next = [...current];
      const [picked] = next.splice(index, 1);
      next.splice(targetIndex, 0, picked);
      return next.map((item, itemIndex) => ({ ...item, sortOrder: itemIndex }));
    });
  };

  return (
    <div className="panel stack-lg">
      <div className="toolbar">
        <div>
          <h2>Animals</h2>
          <p className="muted">Dynamic shelter animals list with image upload and bilingual content.</p>
        </div>
        <button className="secondary-button" type="button" onClick={addAnimal}>
          Add animal
        </button>
      </div>

      {status ? <div className="muted">{status}</div> : null}
      {loading ? <div className="muted">Loading animals...</div> : null}

      <div className="stack-lg">
        {items.map((item, index) => (
          <div className="section-subcard stack-md" key={item.id || `new-${index}`}>
            <div className="toolbar">
              <h3>{item.nameEn || item.nameAz || `Animal ${index + 1}`}</h3>
              <div className="action-row">
                <button className="ghost-button" type="button" onClick={() => moveAnimal(index, -1)}>
                  Up
                </button>
                <button className="ghost-button" type="button" onClick={() => moveAnimal(index, 1)}>
                  Down
                </button>
                <button className="ghost-button danger-button" type="button" onClick={() => removeAnimal(item, index)}>
                  Delete
                </button>
              </div>
            </div>

            <div className="grid-2">
              <label className="field">
                <span>Photo</span>
                <input type="file" accept="image/*" onChange={(event) => updateItem(index, { file: event.target.files?.[0] || null })} />
                {item.imagePath ? (
                  <img
                    className="animal-preview"
                    src={`/uploads/${item.imagePath}`}
                    alt={item.nameEn || item.nameAz || 'Animal preview'}
                  />
                ) : null}
              </label>
              <div className="stack-md">
                <label className="checkbox-row">
                  <input
                    checked={item.published}
                    type="checkbox"
                    onChange={(event) => updateItem(index, { published: event.target.checked })}
                  />
                  <span>Published</span>
                </label>
                <label className="field">
                  <span>Sort order</span>
                  <input
                    className="input"
                    type="number"
                    value={item.sortOrder}
                    onChange={(event) => updateItem(index, { sortOrder: Number(event.target.value) || 0 })}
                  />
                </label>
              </div>
            </div>

            <div className="grid-2">
              <label className="field"><span>Name AZ</span><input className="input" value={item.nameAz} onChange={(event) => updateItem(index, { nameAz: event.target.value })} /></label>
              <label className="field"><span>Name EN</span><input className="input" value={item.nameEn} onChange={(event) => updateItem(index, { nameEn: event.target.value })} /></label>
            </div>
            <div className="grid-2">
              <label className="field"><span>Eyebrow AZ</span><input className="input" value={item.eyebrowAz || ''} onChange={(event) => updateItem(index, { eyebrowAz: event.target.value })} /></label>
              <label className="field"><span>Eyebrow EN</span><input className="input" value={item.eyebrowEn || ''} onChange={(event) => updateItem(index, { eyebrowEn: event.target.value })} /></label>
            </div>
            <div className="grid-2">
              <label className="field"><span>Thumb label AZ</span><input className="input" value={item.thumbLabelAz || ''} onChange={(event) => updateItem(index, { thumbLabelAz: event.target.value })} /></label>
              <label className="field"><span>Thumb label EN</span><input className="input" value={item.thumbLabelEn || ''} onChange={(event) => updateItem(index, { thumbLabelEn: event.target.value })} /></label>
            </div>
            <div className="grid-2">
              <label className="field"><span>Image alt AZ</span><input className="input" value={item.altAz || ''} onChange={(event) => updateItem(index, { altAz: event.target.value })} /></label>
              <label className="field"><span>Image alt EN</span><input className="input" value={item.altEn || ''} onChange={(event) => updateItem(index, { altEn: event.target.value })} /></label>
            </div>
            <div className="grid-4">
              <label className="field"><span>Gender label AZ</span><input className="input" value={item.genderLabelAz || ''} onChange={(event) => updateItem(index, { genderLabelAz: event.target.value })} /></label>
              <label className="field"><span>Gender value AZ</span><input className="input" value={item.genderValueAz || ''} onChange={(event) => updateItem(index, { genderValueAz: event.target.value })} /></label>
              <label className="field"><span>Gender label EN</span><input className="input" value={item.genderLabelEn || ''} onChange={(event) => updateItem(index, { genderLabelEn: event.target.value })} /></label>
              <label className="field"><span>Gender value EN</span><input className="input" value={item.genderValueEn || ''} onChange={(event) => updateItem(index, { genderValueEn: event.target.value })} /></label>
            </div>
            <div className="grid-4">
              <label className="field"><span>Birth label AZ</span><input className="input" value={item.birthLabelAz || ''} onChange={(event) => updateItem(index, { birthLabelAz: event.target.value })} /></label>
              <label className="field"><span>Birth value AZ</span><input className="input" value={item.birthValueAz || ''} onChange={(event) => updateItem(index, { birthValueAz: event.target.value })} /></label>
              <label className="field"><span>Birth label EN</span><input className="input" value={item.birthLabelEn || ''} onChange={(event) => updateItem(index, { birthLabelEn: event.target.value })} /></label>
              <label className="field"><span>Birth value EN</span><input className="input" value={item.birthValueEn || ''} onChange={(event) => updateItem(index, { birthValueEn: event.target.value })} /></label>
            </div>
            <div className="grid-4">
              <label className="field"><span>Breed label AZ</span><input className="input" value={item.breedLabelAz || ''} onChange={(event) => updateItem(index, { breedLabelAz: event.target.value })} /></label>
              <label className="field"><span>Breed value AZ</span><input className="input" value={item.breedValueAz || ''} onChange={(event) => updateItem(index, { breedValueAz: event.target.value })} /></label>
              <label className="field"><span>Breed label EN</span><input className="input" value={item.breedLabelEn || ''} onChange={(event) => updateItem(index, { breedLabelEn: event.target.value })} /></label>
              <label className="field"><span>Breed value EN</span><input className="input" value={item.breedValueEn || ''} onChange={(event) => updateItem(index, { breedValueEn: event.target.value })} /></label>
            </div>
            <div className="grid-4">
              <label className="field"><span>Color label AZ</span><input className="input" value={item.colorLabelAz || ''} onChange={(event) => updateItem(index, { colorLabelAz: event.target.value })} /></label>
              <label className="field"><span>Color value AZ</span><input className="input" value={item.colorValueAz || ''} onChange={(event) => updateItem(index, { colorValueAz: event.target.value })} /></label>
              <label className="field"><span>Color label EN</span><input className="input" value={item.colorLabelEn || ''} onChange={(event) => updateItem(index, { colorLabelEn: event.target.value })} /></label>
              <label className="field"><span>Color value EN</span><input className="input" value={item.colorValueEn || ''} onChange={(event) => updateItem(index, { colorValueEn: event.target.value })} /></label>
            </div>
            <div className="grid-2">
              <label className="field"><span>Story AZ</span><textarea className="input textarea tall-textarea" value={item.storyAz} onChange={(event) => updateItem(index, { storyAz: event.target.value })} /></label>
              <label className="field"><span>Story EN</span><textarea className="input textarea tall-textarea" value={item.storyEn} onChange={(event) => updateItem(index, { storyEn: event.target.value })} /></label>
            </div>
            <div className="action-row">
              <button className="primary-button" type="button" onClick={() => void saveAnimal(item, index)}>
                Save animal
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShelterMediaManager() {
  const [item, setItem] = useState<MediaItem | null>(null);
  const [status, setStatus] = useState('');
  const apiBase = '';

  const loadItem = async () => {
    try {
      const data = await apiFetch<MediaItem[]>('/media?section=shelter');
      const logo = data.find((entry) => entry.slot === 'logo') ?? null;
      setItem(logo);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed to load shelter media');
    }
  };

  useEffect(() => {
    void loadItem();
  }, []);

  const uploadLogo = async (file: File) => {
    const form = new FormData();
    form.set('file', file);
    form.set('section', 'shelter');
    form.set('slot', 'logo');
    form.set('kind', 'logos');
    form.set('altAz', item?.altAz ?? 'BARS sığınacaq loqosu');
    form.set('altEn', item?.altEn ?? 'BARS shelter logo');

    try {
      setStatus('Uploading logo...');
      await apiFetch<MediaItem>('/media/upload', {
        method: 'POST',
        body: form,
      });
      await loadItem();
      setStatus('Logo uploaded');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Logo upload failed');
    }
  };

  const saveMeta = async () => {
    if (!item) return;
    try {
      setStatus('Saving logo meta...');
      const updated = await apiFetch<MediaItem>(`/media/${item.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          altAz: item.altAz,
          altEn: item.altEn,
        }),
      });
      setItem(updated);
      setStatus('Logo meta saved');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed to save logo meta');
    }
  };

  const removeLogo = async () => {
    if (!item) return;
    try {
      setStatus('Deleting logo...');
      await apiFetch(`/media/${item.id}`, {
        method: 'DELETE',
      });
      setItem(null);
      setStatus('Logo deleted');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Failed to delete logo');
    }
  };

  return (
    <div className="panel stack-lg">
      <div>
        <h2>Shelter Media</h2>
        <p className="muted">Page-level media for the shelter page. Right now this controls the shelter logo shown above the text.</p>
      </div>

      {status ? <div className="muted">{status}</div> : null}

      {item ? (
        <div className="section-subcard stack-md">
          <div className="media-preview">
            <img alt={item.altEn || item.altAz || 'Shelter logo'} src={`${apiBase}/uploads/${item.filePath}`} />
          </div>
          <div className="grid-2">
            <label className="field">
              <span>Alt AZ</span>
              <input
                className="input"
                value={item.altAz ?? ''}
                onChange={(event) => setItem((current) => (current ? { ...current, altAz: event.target.value } : current))}
              />
            </label>
            <label className="field">
              <span>Alt EN</span>
              <input
                className="input"
                value={item.altEn ?? ''}
                onChange={(event) => setItem((current) => (current ? { ...current, altEn: event.target.value } : current))}
              />
            </label>
          </div>
          <div className="action-row">
            <button className="secondary-button" type="button" onClick={() => void saveMeta()}>
              Save meta
            </button>
            <button className="ghost-button danger-button" type="button" onClick={() => void removeLogo()}>
              Delete logo
            </button>
          </div>
        </div>
      ) : (
        <div className="empty-box">No shelter logo uploaded yet.</div>
      )}

      <label className="upload-box">
        <span>{item ? 'Replace shelter logo' : 'Upload shelter logo'}</span>
        <input
          type="file"
          accept="image/*"
          onChange={(event) => {
            const file = event.target.files?.[0];
            if (file) {
              void uploadLogo(file);
              event.target.value = '';
            }
          }}
        />
      </label>
    </div>
  );
}

export function PageEditor({ type }: { type: string }) {
  const [page, setPage] = useState<PageItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState('');
  const [shelterAz, setShelterAz] = useState<ShelterContent>(cloneShelterContent(shelterDefaultAz));
  const [shelterEn, setShelterEn] = useState<ShelterContent>(cloneShelterContent(shelterDefaultEn));

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await apiFetch<PageItem>(`/pages/${type}`);
        setPage(data);
        if (type === 'shelter') {
          setShelterAz(normalizeShelterContent(data.contentAz, shelterDefaultAz));
          setShelterEn(normalizeShelterContent(data.contentEn, shelterDefaultEn));
        }
      } catch (error) {
        setStatus(error instanceof Error ? error.message : 'Failed to load page');
      } finally {
        setLoading(false);
      }
    };

    void load();
  }, [type]);

  const title = useMemo(() => pageLabels[type] ?? type, [type]);
  const hint = useMemo(() => pageHints[type] ?? 'Edit bilingual content and SEO.', [type]);
  const isShelter = type === 'shelter';

  const savePage = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!page) return;
    setStatus(`Saving ${page.type}...`);

    try {
      const updated = await apiFetch<PageItem>(`/pages/${page.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          titleAz: page.titleAz,
          titleEn: page.titleEn,
          slug: page.slug,
          contentAz: isShelter ? JSON.stringify(shelterAz, null, 2) : page.contentAz,
          contentEn: isShelter ? JSON.stringify(shelterEn, null, 2) : page.contentEn,
          seoTitleAz: page.seoTitleAz ?? '',
          seoTitleEn: page.seoTitleEn ?? '',
          seoDescriptionAz: page.seoDescriptionAz ?? '',
          seoDescriptionEn: page.seoDescriptionEn ?? '',
          published: page.published,
        }),
      });
      setPage(updated);
      if (isShelter) {
        setShelterAz(normalizeShelterContent(updated.contentAz, shelterDefaultAz));
        setShelterEn(normalizeShelterContent(updated.contentEn, shelterDefaultEn));
      }
      setStatus('Saved');
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Save failed');
    }
  };

  if (loading) {
    return (
      <main className="page-wrap">
        <div className="panel">Loading page editor...</div>
      </main>
    );
  }

  if (!page) {
    return (
      <main className="page-wrap">
        <div className="page-head">
          <h1>{title}</h1>
          <p>{hint}</p>
        </div>
        <div className="panel stack-md">
          <strong>Page not found.</strong>
          <p className="muted">This page type is not available in the database.</p>
          <div className="action-row">
            <Link className="ghost-button" href="/pages">
              Back to pages
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-wrap">
      <div className="page-head">
        <div className="page-head__row">
          <div>
            <h1>{title}</h1>
            <p>{hint}</p>
          </div>
          <Link className="ghost-button" href="/pages">
            Back to pages
          </Link>
        </div>
      </div>

      <form className="stack-lg" onSubmit={savePage}>
        <div className="panel stack-md">
          <div className="toolbar">
            <h2>{page.type}</h2>
            <label className="checkbox-row">
              <input checked={page.published} type="checkbox" onChange={(event) => setPage((current) => (current ? { ...current, published: event.target.checked } : current))} />
              <span>Published</span>
            </label>
          </div>

          <div className="grid-2">
            <label className="field">
              <span>Title AZ</span>
              <input className="input" value={page.titleAz} onChange={(event) => setPage((current) => (current ? { ...current, titleAz: event.target.value } : current))} />
            </label>
            <label className="field">
              <span>Title EN</span>
              <input className="input" value={page.titleEn} onChange={(event) => setPage((current) => (current ? { ...current, titleEn: event.target.value } : current))} />
            </label>
          </div>

          <label className="field">
            <span>Slug</span>
            <input className="input" value={page.slug} onChange={(event) => setPage((current) => (current ? { ...current, slug: event.target.value } : current))} />
          </label>

          <div className="grid-2">
            <label className="field">
              <span>SEO title AZ</span>
              <input className="input" value={page.seoTitleAz ?? ''} onChange={(event) => setPage((current) => (current ? { ...current, seoTitleAz: event.target.value } : current))} />
            </label>
            <label className="field">
              <span>SEO title EN</span>
              <input className="input" value={page.seoTitleEn ?? ''} onChange={(event) => setPage((current) => (current ? { ...current, seoTitleEn: event.target.value } : current))} />
            </label>
          </div>

          <div className="grid-2">
            <label className="field">
              <span>SEO description AZ</span>
              <textarea className="input textarea" value={page.seoDescriptionAz ?? ''} onChange={(event) => setPage((current) => (current ? { ...current, seoDescriptionAz: event.target.value } : current))} />
            </label>
            <label className="field">
              <span>SEO description EN</span>
              <textarea className="input textarea" value={page.seoDescriptionEn ?? ''} onChange={(event) => setPage((current) => (current ? { ...current, seoDescriptionEn: event.target.value } : current))} />
            </label>
          </div>
        </div>

        {isShelter ? (
          <>
            <div className="grid-2 shelter-editor-grid">
              <ShelterEditor label="AZ" value={shelterAz} onChange={setShelterAz} />
              <ShelterEditor label="EN" value={shelterEn} onChange={setShelterEn} />
            </div>
            <ShelterMediaManager />
            <ShelterAnimalsManager />
          </>
        ) : (
          <div className="panel">
            <div className="grid-2">
              <label className="field">
                <span>Content AZ</span>
                <textarea className="input textarea tall-textarea" value={page.contentAz} onChange={(event) => setPage((current) => (current ? { ...current, contentAz: event.target.value } : current))} />
              </label>
              <label className="field">
                <span>Content EN</span>
                <textarea className="input textarea tall-textarea" value={page.contentEn} onChange={(event) => setPage((current) => (current ? { ...current, contentEn: event.target.value } : current))} />
              </label>
            </div>
          </div>
        )}

        <div className="action-row">
          <button className="primary-button" type="submit">
            Save page
          </button>
        </div>
        {status ? <div className="muted">{status}</div> : null}
      </form>
    </main>
  );
}

