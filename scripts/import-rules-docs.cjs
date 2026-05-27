const fs = require('fs');
const path = require('path');
const { PrismaClient } = require('../node_modules/@prisma/client');

const prisma = new PrismaClient();
const root = path.join(__dirname, '..');

function readLines(name) {
  return fs
    .readFileSync(path.join(root, name), 'utf8')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
}

function buildContent(lines, skipCount, headingRegex) {
  const body = lines.slice(skipCount);
  const blocks = [];
  let current = [];

  for (const line of body) {
    if (headingRegex.test(line) && current.length) {
      blocks.push(current);
      current = [line];
      continue;
    }
    current.push(line);
  }

  if (current.length) {
    blocks.push(current);
  }

  return blocks.map((block) => block.join('\n')).join('\n\n');
}

async function run() {
  const rulesEn = readLines('tmp-rules-en.txt');
  const rulesAz = readLines('tmp-rules-az.txt');

  const rulesEnContent = buildContent(rulesEn, 4, /^\d+(?:\.\d+)?\./);
  const rulesAzContent = buildContent(rulesAz, 4, /^\d+(?:\.\d+)?\./);

  await prisma.translation.upsert({
    where: {
      section_key: {
        section: 'nav',
        key: 'rules',
      },
    },
    update: {
      az: 'Qaydalar',
      en: 'Rules',
    },
    create: {
      section: 'nav',
      key: 'rules',
      az: 'Qaydalar',
      en: 'Rules',
    },
  });

  await prisma.page.upsert({
    where: { type: 'rules' },
    update: {
      titleAz: 'Qaydalar',
      titleEn: 'Rules',
      slug: 'rules',
      seoTitleAz: 'Qaydalar',
      seoTitleEn: 'Rules',
      seoDescriptionAz: rulesAz[4] || '',
      seoDescriptionEn: rulesEn[4] || '',
      contentAz: rulesAzContent,
      contentEn: rulesEnContent,
      published: true,
    },
    create: {
      type: 'rules',
      titleAz: 'Qaydalar',
      titleEn: 'Rules',
      slug: 'rules',
      seoTitleAz: 'Qaydalar',
      seoTitleEn: 'Rules',
      seoDescriptionAz: rulesAz[4] || '',
      seoDescriptionEn: rulesEn[4] || '',
      contentAz: rulesAzContent,
      contentEn: rulesEnContent,
      published: true,
    },
  });

  console.log(
    JSON.stringify(
      {
        rules: {
          enBlocks: rulesEnContent.split(/\n\n/).length,
          azBlocks: rulesAzContent.split(/\n\n/).length,
          enTitle: rulesEn[1],
          azTitle: rulesAz[1],
        },
      },
      null,
      2,
    ),
  );
}

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
