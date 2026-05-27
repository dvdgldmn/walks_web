// One-off, idempotent repair: the middot separator "·" in some ShelterAnimal
// text fields was lost to a literal "?" on the old admin write path.
// This restores " ? " -> " · " in the affected string fields only.
const { PrismaClient } = require('../node_modules/@prisma/client');

const prisma = new PrismaClient();

const FIELDS = [
  'nameAz', 'nameEn',
  'eyebrowAz', 'eyebrowEn',
  'altAz', 'altEn',
  'thumbLabelAz', 'thumbLabelEn',
  'genderValueAz', 'genderValueEn',
  'birthValueAz', 'birthValueEn',
  'breedValueAz', 'breedValueEn',
  'colorValueAz', 'colorValueEn',
  'storyAz', 'storyEn',
];

async function main() {
  const animals = await prisma.shelterAnimal.findMany();
  let updated = 0;

  for (const a of animals) {
    const data = {};
    for (const f of FIELDS) {
      const v = a[f];
      if (typeof v === 'string' && v.includes(' ? ')) {
        data[f] = v.split(' ? ').join(' · ');
      }
    }
    if (Object.keys(data).length) {
      await prisma.shelterAnimal.update({ where: { id: a.id }, data });
      updated += 1;
      console.log(a.id, '->', data);
    }
  }

  console.log(`Done. Updated ${updated} record(s).`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
