const { PrismaClient } = require('../node_modules/@prisma/client');

const prisma = new PrismaClient();

const updates = [
  ['hero', 'title', 'H\u0259r add\u0131m s\u0131\u011F\u0131nacaq heyvanlar\u0131n\u0131 doyurur.'],
  ['marquee', 'item1', 'G\u018FZ. YARI\u015E. QAZAN. K\u00D6M\u018FK ET.'],
  ['marquee', 'item2', 'H\u018FR AY SI\u011EINACAQLARA 500 KQ YEM\u018FK \u00C7ATDIRILIR'],
  ['marquee', 'item3', 'H\u018FR AY'],
  ['how', 'title', 'G\u00FCnd\u0259lik g\u0259zintini real k\u00F6m\u0259y\u0259 \u00E7evir.'],
  ['how', 'step1Tag', 'G\u0259z'],
  ['how', 'step1Title', 'H\u0259r g\u00FCn etdiyin kimi g\u0259z.'],
  ['how', 'step1Body', 'Telefonun add\u0131mlar\u0131n\u0131 Apple Health, Google Fit v\u0259 ya Samsung Health vasit\u0259sil\u0259 avtomatik izl\u0259yir.'],
  ['how', 'step2Tag', 'Qazan'],
  ['how', 'step2Title', 'Add\u0131mlar coin-l\u0259r\u0259 \u00E7evrilir.'],
  ['how', 'step2Body', 'H\u0259r add\u0131m Dosty Walks daxilind\u0259 s\u0259n\u0259 coin qazand\u0131r\u0131r.'],
  ['how', 'step3Tag', 'K\u00F6m\u0259k et'],
  ['how', 'step3Title', 'Coin-l\u0259r yem\u0259y\u0259 \u00E7evrilir.'],
  ['how', 'step3Body', 'Coin-l\u0259rini ba\u011F\u0131\u015Fla v\u0259 birlikd\u0259 s\u0131\u011F\u0131nacaq heyvanlar\u0131n\u0131 doyurma\u011Fa k\u00F6m\u0259k et.'],
  ['competition', 'title', 'Add\u0131m say\u011Fac\u0131ndan daha \u00E7ox.'],
  ['competition', 'note', 'H\u0259r add\u0131m\u0131nda yar\u0131\u015F, m\u00FCkafat qazan v\u0259 s\u0131\u011F\u0131nacaq heyvanlar\u0131na k\u00F6m\u0259k et.'],
  ['competition', 'card1Title', 'Liderl\u0259r\\u003cbr\\u003ec\u0259dv\u0259li.'],
  ['competition', 'card1Body', 'Dostlar\u0131n v\u0259 qlobal icma il\u0259 yar\u0131\u015F.'],
  ['competition', 'card2Title', 'M\u00F6vs\u00FCml\u0259r v\u0259\\u003cbr\\u003e\\u003cem\\u003em\u00FCkafatlar.\\u003c/em\\u003e'],
  ['competition', 'card2Body', 'Ni\u015Fanlar\u0131, m\u00FCkafatlar\u0131 v\u0259 milestone nailiyy\u0259tl\u0259rini a\u00E7.'],
  ['competition', 'card3Title', 'Real qida\\u003cbr\\u003e\\u003cem\\u003eian\u0259l\u0259ri.\\u003c/em\\u003e'],
  ['competition', 'card3Body', 'G\u00FCnd\u0259lik add\u0131mlar\u0131n\u0131 s\u0131\u011F\u0131nacaqlar \u00FC\u00E7\u00FCn real d\u0259st\u0259y\u0259 \u00E7evir.'],
  ['season', 'title', 'H\u0259r add\u0131m daha \u00E7oxunu a\u00E7\u0131r.'],
  ['season', 'body', 'H\u0259r Dosty Pass m\u00F6vs\u00FCm\u00FC heyvanlar \u00FC\u00E7\u00FCn yeni bir mac\u0259ra, yeni m\u00FCkafatlar v\u0259 yeni bir missiya g\u0259tirir. Bu m\u00F6vs\u00FCm: Treasure Island. H\u0259r g\u00FCn g\u0259z, milestone-lar\u0131 a\u00E7, ekskl\u00FCziv m\u00FCkafatlar qazan v\u0259 h\u0259r add\u0131m\u0131nla t\u0259sirini art\u0131r.'],
  ['download', 'body', 'Add\u0131mlar\u0131n\u0131 s\u0131\u011F\u0131nacaq heyvanlar\u0131 \u00FC\u00E7\u00FCn real k\u00F6m\u0259y\u0259 \u00E7evir\u0259n icma.'],
  ['footer', 'tagline', 'Add\u0131mlar\u0131n\u0131 s\u0131\u011F\u0131nacaq heyvanlar\u0131 \u00FC\u00E7\u00FCn real k\u00F6m\u0259y\u0259 \u00E7evir\u0259n icma.'],
];

async function main() {
  for (const [section, key, az] of updates) {
    await prisma.translation.updateMany({
      where: { section, key },
      data: { az },
    });
  }

  const sample = await prisma.translation.findMany({
    where: {
      OR: [
        { section: 'hero', key: 'title' },
        { section: 'season', key: 'title' },
        { section: 'download', key: 'body' },
      ],
    },
    orderBy: [{ section: 'asc' }, { key: 'asc' }],
  });

  console.log(JSON.stringify({ updated: updates.length, sample }, null, 2));
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
