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

  if (current.length) blocks.push(current);

  return blocks.map((block) => block.join('\n')).join('\n\n');
}

async function run() {
  const privacyEn = readLines('tmp-privacy-en.txt');
  const privacyAz = readLines('tmp-privacy-az.txt');
  const termsEn = readLines('tmp-terms-en.txt');
  const termsAz = readLines('tmp-terms-az.txt');

  const privacyEnContent = buildContent(privacyEn, 3, /^\d+(?:\.\d+)?\./);
  const privacyAzContent = buildContent(privacyAz, 4, /^\d+(?:\.\d+)?\./);
  const termsEnContent = buildContent(termsEn, 3, /^\d+(?:\.\d+)?\s/);
  const termsAzContent = buildContent(termsAz, 4, /^\d+(?:\.\d+)?\s/);

  await prisma.page.update({
    where: { type: 'privacy' },
    data: {
      titleEn: 'Privacy Policy',
      titleAz: 'Məxfilik Siyasəti',
      seoTitleEn: 'Privacy Policy',
      seoTitleAz: 'Məxfilik Siyasəti',
      seoDescriptionEn: privacyEn[3] || '',
      seoDescriptionAz: privacyAz[4] || '',
      contentEn: privacyEnContent,
      contentAz: privacyAzContent,
      published: true,
    },
  });

  await prisma.page.update({
    where: { type: 'terms' },
    data: {
      titleEn: 'Terms and Conditions of Use',
      titleAz: 'İstifadə Şərtləri və Qaydaları',
      seoTitleEn: 'Terms and Conditions of Use',
      seoTitleAz: 'İstifadə Şərtləri və Qaydaları',
      seoDescriptionEn: termsEn[3] || '',
      seoDescriptionAz: termsAz[4] || '',
      contentEn: termsEnContent,
      contentAz: termsAzContent,
      published: true,
    },
  });

  console.log(
    JSON.stringify(
      {
        privacy: {
          enBlocks: privacyEnContent.split(/\n\n/).length,
          azBlocks: privacyAzContent.split(/\n\n/).length,
        },
        terms: {
          enBlocks: termsEnContent.split(/\n\n/).length,
          azBlocks: termsAzContent.split(/\n\n/).length,
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
