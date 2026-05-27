const { PrismaClient } = require('../node_modules/@prisma/client');

const prisma = new PrismaClient();

const contentEn = [
  'This FAQ explains the most important practical rules for using Dosty Walks, including step tracking, Coins, donations, leaderboards, prizes, and the Season Pass.',
  'For full legal terms, please also read the Terms of Use, Privacy Policy, and Rules pages.',

  '1. What is Dosty Walks?',
  'Dosty Walks is a mobile app that turns everyday walking into measurable help for shelter animals. Your recorded steps can help unlock Coins, support food missions, and take part in seasonal experiences.',

  '2. How are my steps counted?',
  'Steps are counted through supported data sources on your phone, such as Apple Health, Google Fit, or Samsung Health. The app depends on those sources and may need time to sync recent activity.',

  '3. What are Coins and what can I do with them?',
  'Coins are in-app value generated from eligible walking activity. They can be used inside the product mechanics connected to donations, engagement, and rewards. Coins are not cash and are not withdrawable.',

  '4. How does help for shelter animals work?',
  'Dosty Walks converts community movement into real shelter support. Depending on the campaign or season structure, support can include food missions, donation-linked mechanics, and other forms of help shown in the app.',

  '5. How do leaderboards work?',
  'The app may include daily, weekly, monthly, and yearly leaderboards. Rankings are based on valid recorded Steps within the relevant time window. Some leaderboards may be country-wide, while others may be limited to friends or private groups.',

  '6. Are there prizes for top users?',
  'Some monthly leaderboard periods may include prizes provided by partners. Prize details, eligibility, and delivery conditions are determined by Dosty Walks and the relevant partner, and winners may be subject to verification before a prize is delivered.',

  '7. What is the Season Pass?',
  'The Season Pass is a seasonal progression system built around walking milestones. A season runs for a limited period and contains milestone rewards, partner offers, and sometimes a final grand reward for the top verified result.',

  '8. What is considered cheating?',
  'Cheating includes any attempt to simulate or falsify steps, such as shaking the phone, using step-generating devices, editing health data, using emulators, running multiple accounts, or any other method that creates movement results that do not reflect genuine walking.',

  '9. What happens if rules are broken?',
  'Dosty Walks may remove suspicious Steps, hide a user from leaderboards, cancel results, revoke rewards, suspend the account, or permanently delete it in severe cases. If a measure is applied, the user may appeal according to the procedure described in the Rules and Terms.',
].join('\n\n');

const contentAz = [
  'Bu FAQ Dosty Walks tətbiqinin istifadəsi ilə bağlı ən vacib praktiki sualları izah edir: addımların sayılması, Sikkələr, yardım mexanikası, liderlər lövhəsi, mükafatlar və Season Pass.',
  'Tam hüquqi şərtlər üçün ayrıca Terms of Use, Privacy Policy və Rules səhifələrini də oxuyun.',

  '1. Dosty Walks nədir?',
  'Dosty Walks gündəlik gəzintini sığınacaq heyvanlarına ölçülə bilən yardıma çevirən mobil tətbiqdir. Qeydə alınmış addımlarınız Sikkə qazanmağa, yemək missiyalarına dəstək olmağa və mövsümi təcrübələrdə iştirak etməyə kömək edə bilər.',

  '2. Addımlarım necə sayılır?',
  'Addımlar telefonunuzdakı uyğun mənbələr vasitəsilə sayılır, məsələn Apple Health, Google Fit və ya Samsung Health. Tətbiq bu mənbələrə bağlı işləyir və yeni aktivliyin sinxronizasiyası üçün müəyyən vaxt tələb oluna bilər.',

  '3. Sikkə nədir və onunla nə edə bilərəm?',
  'Sikkələr uyğun gəzinti aktivliyindən yaranan tətbiqdaxili dəyərdir. Onlar ianə, engagement və reward mexanikaları ilə bağlı məhsul daxilində istifadə olunur. Sikkələr pul deyil və çıxarıla bilməz.',

  '4. Sığınacaq heyvanlarına yardım necə işləyir?',
  'Dosty Walks icma hərəkətini real sığınacaq dəstəyinə çevirir. Kampaniya və ya mövsüm quruluşundan asılı olaraq bu dəstək yemək missiyaları, ianə mexanikaları və tətbiqdə göstərilən digər yardım formaları ilə həyata keçirilə bilər.',

  '5. Liderlər lövhəsi necə işləyir?',
  'Tətbiqdə günlük, həftəlik, aylıq və illik liderlər lövhələri ola bilər. Reytinq müvafiq dövr üzrə etibarlı şəkildə qeydə alınmış addımlara əsaslanır. Bəzi lövhələr ölkə üzrə, bəziləri isə yalnız dostlar və ya şəxsi qruplar üçün ola bilər.',

  '6. Top istifadəçilər üçün mükafat varmı?',
  'Bəzi aylıq leaderboard dövrlərində tərəfdaşlar tərəfindən təqdim olunan mükafatlar ola bilər. Mükafatın tərkibi, uyğunluq şərtləri və təqdim olunma qaydası Dosty Walks və müvafiq tərəfdaş tərəfindən müəyyən edilir, qaliblər isə mükafat təqdim olunmazdan əvvəl yoxlamadan keçə bilər.',

  '7. Season Pass nədir?',
  'Season Pass gəzinti milestone-ları üzərində qurulan mövsümi progression sistemidir. Mövsüm məhdud müddət davam edir və milestone reward-ları, partner offers, bəzən isə ən yüksək təsdiqlənmiş nəticə üçün final grand reward təqdim edir.',

  '8. Hansı davranış cheating sayılır?',
  'Telefonu silkələmək, addım yaradan cihazlardan istifadə etmək, health məlumatlarını dəyişmək, emulatorlardan istifadə etmək, birdən çox hesab işlətmək və ya real gəzintini əks etdirməyən nəticə yaratmağa yönəlmiş hər hansı üsul cheating hesab olunur.',

  '9. Qaydalar pozularsa nə baş verir?',
  'Dosty Walks şübhəli addımları silə, istifadəçini leaderboard-dan gizlədə, nəticələri ləğv edə, reward-ları geri ala, hesabı müvəqqəti bloklaya və ya ağır hallarda tam silə bilər. Tədbir tətbiq olunarsa, istifadəçi Rules və Terms səhifələrində göstərilən qayda ilə apellyasiya verə bilər.',
].join('\n\n');

async function run() {
  await prisma.translation.upsert({
    where: {
      section_key: {
        section: 'footer',
        key: 'faq',
      },
    },
    update: {
      az: 'FAQ',
      en: 'FAQ',
    },
    create: {
      section: 'footer',
      key: 'faq',
      az: 'FAQ',
      en: 'FAQ',
    },
  });

  await prisma.page.upsert({
    where: { type: 'faq' },
    update: {
      titleAz: 'FAQ',
      titleEn: 'FAQ',
      slug: 'faq',
      seoTitleAz: 'FAQ',
      seoTitleEn: 'FAQ',
      seoDescriptionAz: 'Dosty Walks tətbiqindən istifadə, addımlar, reward-lar və Season Pass haqqında ən vacib suallar.',
      seoDescriptionEn: 'The most important questions about using Dosty Walks, steps, rewards, and the Season Pass.',
      contentAz,
      contentEn,
      published: true,
    },
    create: {
      type: 'faq',
      titleAz: 'FAQ',
      titleEn: 'FAQ',
      slug: 'faq',
      seoTitleAz: 'FAQ',
      seoTitleEn: 'FAQ',
      seoDescriptionAz: 'Dosty Walks tətbiqindən istifadə, addımlar, reward-lar və Season Pass haqqında ən vacib suallar.',
      seoDescriptionEn: 'The most important questions about using Dosty Walks, steps, rewards, and the Season Pass.',
      contentAz,
      contentEn,
      published: true,
    },
  });

  console.log(JSON.stringify({ faqBlocks: contentEn.split(/\n\n/).length / 2 }, null, 2));
}

run()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
