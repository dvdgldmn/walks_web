const { PrismaClient } = require('../node_modules/@prisma/client');

const prisma = new PrismaClient();

const translationUpdates = [
  {
    section: 'hero',
    key: 'title',
    az: 'Hər addım sığınacaq heyvanlarına yemək olur.',
    en: 'Every Step Feeds Shelter Animals.',
  },
  {
    section: 'hero',
    key: 'eyebrow',
    az: 'Gəz. Yarış. Kömək et.',
    en: 'Walk. Compete. Help.',
  },
  {
    section: 'marquee',
    key: 'item1',
    az: 'GƏZ. YARIŞ. QAZAN. KÖMƏK ET.',
    en: 'WALK. COMPETE. EARN. HELP.',
  },
  {
    section: 'marquee',
    key: 'item2',
    az: 'HƏR AY SIĞINACAQLARA 500 KQ YEMƏK ÇATDIRILIR',
    en: '500KG OF FOOD DELIVERED TO SHELTERS',
  },
  {
    section: 'marquee',
    key: 'item3',
    az: 'HƏR AY',
    en: 'EVERY MONTH',
  },
  {
    section: 'marquee',
    key: 'item4',
    az: 'HƏR ADDIM SAYILIR',
    en: 'EVERY STEP COUNTS',
  },
  {
    section: 'footer',
    key: 'bottomLeft',
    az: '© 2026 Dosty Walks · Bakıda hazırlanıb 🇦🇿',
    en: '© 2026 Dosty Walks · Made in Baku 🇦🇿',
  },
  {
    section: 'footer',
    key: 'bottomRight',
    az: 'Design draft v2 · work in progress',
    en: 'Design draft v2 · work in progress',
  },
];

const contactUpdate = {
  titleAz: 'Əlaqə',
  contentAz:
    'Dosty Walks komandası ilə əlaqə, tərəfdaşlıq və media sorğuları üçün aşağıdakı formadan istifadə edin.\nİstək göndərildikdən sonra komanda sizinlə qeyd etdiyiniz əlaqə vasitəsilə geri dönüş edəcək.',
  seoTitleAz: 'Əlaqə',
  seoDescriptionAz: 'Dosty Walks komandası ilə əlaqə, tərəfdaşlıq və media sorğuları üçün forma.',
};

const animalTextFixes = {
  eyebrowAz: 'BARS sakini · Hekayə',
  altAz: 'BARS sığınacağında it',
  genderLabelAz: 'Cins',
  genderAz: 'Erkək',
  birthLabelAz: 'Doğum tarixi',
  breedAz: 'Kane-korso metisi',
  breedLabelAz: 'Cins tipi',
  colorLabelAz: 'Rəng',
  colorAz: 'Qara',
  storyAz:
    'Kinq çox ağır vəziyyətdə xilas olunmuşdu, demək olar ki, yalnız dəri və sümük qalmışdı. Görünüşü sərt olsa da, əslində çox mehriban, sakit və insanları sevən bir itdir. Hamı ilə yaxşı yola gedir və onu çox sevirik.',
};

function needsRepair(value) {
  return typeof value === 'string' && value.includes('?');
}

async function repairTranslations() {
  for (const entry of translationUpdates) {
    await prisma.translation.updateMany({
      where: { section: entry.section, key: entry.key },
      data: { az: entry.az, en: entry.en },
    });
  }
}

async function repairContact() {
  await prisma.page.update({
    where: { type: 'contact' },
    data: contactUpdate,
  });
}

async function repairAnimals() {
  const animals = await prisma.shelterAnimal.findMany({
    orderBy: { sortOrder: 'asc' },
  });

  for (const animal of animals) {
    const data = {};

    if (needsRepair(animal.eyebrowAz)) data.eyebrowAz = animalTextFixes.eyebrowAz;
    if (needsRepair(animal.altAz)) data.altAz = animalTextFixes.altAz;
    if (needsRepair(animal.genderLabelAz)) data.genderLabelAz = animalTextFixes.genderLabelAz;
    if (needsRepair(animal.genderValueAz)) data.genderValueAz = animalTextFixes.genderAz;
    if (needsRepair(animal.birthLabelAz)) data.birthLabelAz = animalTextFixes.birthLabelAz;
    if (needsRepair(animal.breedLabelAz)) data.breedLabelAz = animalTextFixes.breedLabelAz;
    if (needsRepair(animal.breedValueAz)) data.breedValueAz = animalTextFixes.breedAz;
    if (needsRepair(animal.colorLabelAz)) data.colorLabelAz = animalTextFixes.colorLabelAz;
    if (needsRepair(animal.colorValueAz)) data.colorValueAz = animalTextFixes.colorAz;
    if (needsRepair(animal.storyAz)) data.storyAz = animalTextFixes.storyAz;

    if (Object.keys(data).length > 0) {
      await prisma.shelterAnimal.update({
        where: { id: animal.id },
        data,
      });
    }
  }
}

async function main() {
  await repairTranslations();
  await repairContact();
  await repairAnimals();
  console.log('Frontend CMS content repaired.');
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
