const { PrismaClient } = require('../node_modules/@prisma/client');

const prisma = new PrismaClient();

const contentAz = {
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
};

async function main() {
  await prisma.page.update({
    where: { type: 'shelter' },
    data: {
      titleAz: 'BARS Shelter',
      seoTitleAz: 'BARS Shelter · Dosty Walks',
      seoDescriptionAz:
        'BARS sığınacağı Dosty Walks-un hər ay yemək dəstəyi göndərdiyi əsas sığınacaqlardan biridir. Bu səhifə sığınacaq, onun qayğı prosesi və yardımın necə real nəticəyə çevrildiyi haqqında məlumat verir.',
      contentAz: JSON.stringify(contentAz, null, 2),
    },
  });

  const page = await prisma.page.findUnique({ where: { type: 'shelter' } });
  console.log(
    JSON.stringify(
      {
        titleAz: page.titleAz,
        seoTitleAz: page.seoTitleAz,
        seoDescriptionAz: page.seoDescriptionAz,
        contentHead: page.contentAz.slice(0, 600),
      },
      null,
      2,
    ),
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
