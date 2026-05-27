const { PrismaClient } = require('../node_modules/@prisma/client');

const prisma = new PrismaClient();

const updates = [
  ['competition', 'card1Title', 'Liderl\u0259r<br>c\u0259dv\u0259li.'],
  ['competition', 'card2Title', 'M\u00F6vs\u00FCml\u0259r v\u0259<br><em>m\u00FCkafatlar.</em>'],
  ['competition', 'card3Title', 'Real qida<br><em>ian\u0259l\u0259ri.</em>'],
];

async function main() {
  for (const [section, key, az] of updates) {
    await prisma.translation.updateMany({
      where: { section, key },
      data: { az },
    });
  }

  const rows = await prisma.translation.findMany({
    where: {
      section: 'competition',
      key: { in: ['card1Title', 'card2Title', 'card3Title'] },
    },
    orderBy: { key: 'asc' },
  });

  console.log(JSON.stringify(rows, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
