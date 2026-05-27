import { hash } from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL || 'admin@dosty.local';
  const password = process.env.ADMIN_PASSWORD || 'admin12345';
  const passwordHash = await hash(password, 10);

  await prisma.adminUser.upsert({
    where: { email },
    update: { passwordHash },
    create: {
      email,
      passwordHash,
      role: 'superadmin',
    },
  });

  const defaultSettings = [
    {
      key: 'site.defaultLanguage',
      value: { code: 'az' },
    },
    {
      key: 'site.seo',
      value: {
        titleAz: 'Dosty Walks',
        titleEn: 'Dosty Walks',
        descriptionAz: '',
        descriptionEn: '',
      },
    },
    {
      key: 'social.instagram',
      value: { enabled: true, url: '' },
    },
    {
      key: 'social.facebook',
      value: { enabled: false, url: '' },
    },
    {
      key: 'social.tiktok',
      value: { enabled: true, url: '' },
    },
    {
      key: 'store.apple',
      value: { url: '' },
    },
    {
      key: 'store.google',
      value: { url: '' },
    },
  ];

  for (const setting of defaultSettings) {
    await prisma.setting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  const defaultTranslations = [
    { section: 'nav', key: 'how', az: 'Necə işləyir', en: 'How it works' },
    { section: 'nav', key: 'impact', az: 'Təsir', en: 'Impact' },
    { section: 'nav', key: 'season', az: 'Mövsüm', en: 'Season' },
    { section: 'nav', key: 'partners', az: 'Partnyorlar', en: 'Partners' },
    { section: 'nav', key: 'download', az: 'Tətbiq', en: 'Get the app' },
    { section: 'nav', key: 'rules', az: 'Qaydalar', en: 'Rules' },
    { section: 'nav', key: 'privacy', az: 'Məxfilik', en: 'Privacy' },
    { section: 'footer', key: 'faq', az: 'FAQ', en: 'FAQ' },
    {
      section: 'hero',
      key: 'eyebrow',
      az: 'Hər addım. Hər ay.',
      en: 'Every Step Feeds Shelter Animals.',
    },
    {
      section: 'hero',
      key: 'title',
      az: 'Hər addım. Hər ay 500 kq yemək.',
      en: 'Every Step Feeds Shelter Animals.',
    },
    { section: 'hero', key: 'primaryCta', az: 'Tətbiqi yüklə', en: 'Download app' },
    { section: 'hero', key: 'secondaryCta', az: 'Partnyor ol', en: 'Become a partner' },
    { section: 'how', key: 'eyebrow', az: 'Necə işləyir', en: 'How it works' },
    { section: 'how', key: 'title', az: 'Gəz. Qazan. Təsirə çevir.', en: 'Walk. Earn. Convert impact.' },
    { section: 'how', key: 'note', az: 'Telefonunda addımla. Coin qazan. Yeməyə çevir.', en: 'Turn Your Daily Walk Into Real Help.' },
    { section: 'how', key: 'step1Tag', az: 'Gəz', en: 'Walk' },
    { section: 'how', key: 'step1Title', az: 'Hər gün gəz', en: 'Walk Like You Always Do.' },
    { section: 'how', key: 'step1Body', az: 'Gündəlik addımlar tətbiq daxilində coin-lərə çevrilir.', en: 'Your phone tracks steps automatically through Apple Health, Google Fit, or Samsung Health.' },
    { section: 'how', key: 'step2Tag', az: 'Qazan', en: 'Earn' },
    { section: 'how', key: 'step2Title', az: 'Mövsümlərdə yarış', en: 'Steps Become Coins.' },
    { section: 'how', key: 'step2Body', az: 'Qruplar, reytinq və mövsüm mexanikası insanları geri qaytarır.', en: 'Every step helps you earn coins inside Dosty Walks.' },
    { section: 'how', key: 'step3Tag', az: 'Bağışla', en: 'Help' },
    { section: 'how', key: 'step3Title', az: 'Coin-ləri yeməyə çevir', en: 'Coins Turn Into Food.' },
    { section: 'how', key: 'step3Body', az: 'Hərəkətiniz sığınacaqlar üçün real yemək çatdırılmasına çevrilir.', en: 'Donate your coins and help feed shelter animals together with the community.' },
    { section: 'marquee', key: 'item1', az: 'Gəz. Yarış. Qazan. Kömək et.', en: 'WALK. COMPETE. EARN. HELP.' },
    { section: 'marquee', key: 'item2', az: 'Hər ay sığınacaqlara 500 kq yemək çatdırılır', en: '500KG OF FOOD DELIVERED TO SHELTERS' },
    { section: 'marquee', key: 'item3', az: 'Hər ay', en: 'EVERY MONTH' },
    { section: 'marquee', key: 'item4', az: 'Hər addım sayılır', en: 'EVERY STEP COUNTS' },
    { section: 'impact', key: 'eyebrow', az: 'Təsir', en: 'Impact' },
    { section: 'impact', key: 'title', az: 'Hərəkət ölçülə bilən ictimai faydaya çevrilir.', en: 'Movement becomes measurable public good.' },
    { section: 'impact', key: 'note', az: 'Əvvəl təsiri sabitləyirik. Sonra böyüdürük.', en: 'First we lock the impact. Then we scale.' },
    { section: 'impact', key: 'row1Eyebrow', az: 'Miqyas', en: 'Scale' },
    { section: 'impact', key: 'row1Value', az: '75', en: '75' },
    { section: 'impact', key: 'row1Suffix', az: 'K+', en: 'K+' },
    { section: 'impact', key: 'row1Copy', az: 'Partnyor şəbəkələri üzərindən aktiv istifadəçi hədəfi.', en: 'Active users reached via partner networks.' },
    { section: 'impact', key: 'row2Eyebrow', az: 'Zəmanət', en: 'Guaranteed' },
    { section: 'impact', key: 'row2Value', az: '7', en: '7' },
    { section: 'impact', key: 'row2Suffix', az: 'tons', en: 'tons' },
    { section: 'impact', key: 'row2Copy', az: 'Sığınacaqlara illik çatdırılan yemək. Auditoriya artımından asılı deyil.', en: 'Food delivered to shelters each year. Guaranteed regardless of audience growth.' },
    { section: 'impact', key: 'row3Eyebrow', az: 'Dövr', en: 'Cycle' },
    { section: 'impact', key: 'row3Value', az: '90', en: '90' },
    { section: 'impact', key: 'row3Suffix', az: 'days', en: 'days' },
    { section: 'impact', key: 'row3Copy', az: 'Bir mövsüm pass-i. Mövsüm aktiv olduğu müddətdə istənilən vaxt qoşul.', en: 'One Season Pass. Join anytime while the season is live.' },
    { section: 'impact', key: 'row4Eyebrow', az: 'Milestone', en: 'Milestones' },
    { section: 'impact', key: 'row4Prefix', az: '~', en: '~' },
    { section: 'impact', key: 'row4Value', az: '30', en: '30' },
    { section: 'impact', key: 'row4Copy', az: 'Hər mövsüm təxminən 30 milestone. Pro sürət üstünlüyü vermir.', en: 'About 30 milestones per season. Pro gives no speed advantage.' },
    { section: 'impact', key: 'stat1Value', az: '500', en: '500' },
    { section: 'impact', key: 'stat1Label', az: 'hər ay kq', en: 'kg every month' },
    { section: 'impact', key: 'stat2Value', az: '90', en: '90' },
    { section: 'impact', key: 'stat2Label', az: 'günlük mövsüm', en: 'day seasons' },
    { section: 'impact', key: 'stat3Value', az: '1000+', en: '1000+' },
    { section: 'impact', key: 'stat3Label', az: 'aktiv yürüşçü', en: 'active walkers' },
    { section: 'competition', key: 'eyebrow', az: 'Canlı rəqabət', en: 'More Than A Step Counter.' },
    { section: 'competition', key: 'title', az: 'Sosial motivasiya hər addımın içindədir.', en: 'Social motivation built into every step.' },
    { section: 'competition', key: 'note', az: 'Gəz. Yarış. Kömək et.', en: 'Compete, earn rewards, and help feed shelter animals with every step.' },
    { section: 'competition', key: 'card1Eyebrow', az: 'Liderlər', en: 'Leaderboard' },
    { section: 'competition', key: 'card1Title', az: 'Real<br>zamanda<br><em>yarış.</em>', en: 'Leader<br><em>boards.</em>' },
    { section: 'competition', key: 'card1Body', az: 'Ölkə üzrə liderlər cədvəli. Bakıda kimin öndə olduğunu hər an görün.', en: 'Compete with friends and the global community.' },
    { section: 'competition', key: 'card2Eyebrow', az: 'Qruplar', en: 'Groups' },
    { section: 'competition', key: 'card2Title', az: 'Komandalar və<br><em>şirkətlər.</em>', en: 'Seasons &<br><em>Rewards.</em>' },
    { section: 'competition', key: 'card2Body', az: 'Dostlar, həmkarlar və şirkətlər üçün şəxsi qruplar yaradın.', en: 'Unlock badges, rewards, and milestone achievements.' },
    { section: 'competition', key: 'card3Eyebrow', az: 'Tanınma', en: 'Recognition' },
    { section: 'competition', key: 'card3Title', az: 'Ay.<br>Mövsüm.<br><em>İl.</em>', en: 'Real Food<br><em>Donations.</em>' },
    { section: 'competition', key: 'card3Body', az: 'Günlük streak-lərdən illik mükafatlara qədər hər dövr üçün ayrıca tanınma.', en: 'Turn your daily steps into real shelter support.' },
    { section: 'competition', key: 'card4Eyebrow', az: 'Vərdiş', en: 'Habit' },
    { section: 'competition', key: 'card4Title', az: '<em>Kampaniya</em> deyil —<br>vərdişdir.', en: 'Not a <em>campaign</em> —<br>a habit.' },
    { section: 'competition', key: 'card4Body', az: 'Xatırlatma olmadan geri qayıtdığınız gündəlik davranış mexanikası.', en: 'Game mechanics embedded in daily behaviour. You return without reminders.' },
    { section: 'season', key: 'eyebrow', az: 'Season pass', en: 'Season pass' },
    { section: 'season', key: 'note', az: '90 gün · ~30 milestone', en: 'Each Dosty Pass season brings a new adventure, new rewards, and a new mission for animals.' },
    { section: 'season', key: 'title', az: 'Mövsüm. 90 gün. Qoşul.', en: 'Every Step<br><em>Unlocks More.</em>' },
    { section: 'season', key: 'body', az: 'Hər mövsüm milestone və reward unlock-larla gəlir. Pro daha çox reward açır, amma sürət üstünlüyü vermir.', en: 'This season: <strong>Treasure Island.</strong> Walk daily, unlock milestones, earn exclusive rewards, and increase your impact with every step.<br><br><strong>Seasonal Adventures</strong> — Every season introduces a completely new world, theme, and progression journey.<br><strong>Exclusive Rewards</strong> — Unlock badges, partner rewards, discounts, and seasonal collectibles.<br><strong>Bigger Impact</strong> — Increase your donation limits and help feed more shelter animals.<br><strong>90 Days Of Progress</strong> — Complete milestones, level up, and build movement into a lasting habit.<br><br><strong>Join This Season.</strong>' },
    { section: 'pricing', key: 'eyebrow', az: 'Pro abunəlik', en: 'Pro subscription' },
    { section: 'pricing', key: 'note', az: 'İllik planda 10% qənaət', en: 'Save 10% on yearly' },
    { section: 'pricing', key: 'title', az: 'Pro. Daha çox təsir.', en: 'Pro. More impact.' },
    { section: 'pricing', key: 'body', az: 'Limitsiz donation, xüsusi reward-lar və partnyor üstünlükləri.', en: 'Unlimited donations, exclusive rewards, and partner perks.' },
    { section: 'pricing', key: 'yearlyChip', az: '10% qənaət', en: 'Save 10%' },
    { section: 'pricing', key: 'yearlyName', az: 'İllik abunəlik', en: 'Yearly subscription' },
    { section: 'pricing', key: 'yearlyPrice', az: '19.99 ₼', en: '19.99 ₼' },
    { section: 'pricing', key: 'yearlyHint', az: '12 ay · ən yaxşı seçim', en: '12 months · best value' },
    { section: 'pricing', key: 'monthlyName', az: 'Aylıq', en: 'Monthly' },
    { section: 'pricing', key: 'monthlyPrice', az: '2.00 ₼', en: '2.00 ₼' },
    { section: 'pricing', key: 'monthlyHint', az: 'Elastik aylıq plan', en: 'Flexible monthly plan' },
    { section: 'pricing', key: 'compareTitle', az: 'Nə əldə edirsiniz', en: 'What you get' },
    { section: 'pricing', key: 'tableHeadFree', az: 'Pulsuz', en: 'Free' },
    { section: 'pricing', key: 'tableHeadPro', az: 'Pro', en: 'Pro' },
    { section: 'pricing', key: 'tableHeadFeature', az: 'Funksiya', en: 'Feature' },
    { section: 'pricing', key: 'tableFeature1', az: 'Gəz və coin qazan', en: 'Walk & earn coins' },
    { section: 'pricing', key: 'tableFeature2', az: 'Gündəlik addım izləmə', en: 'Daily step tracking' },
    { section: 'pricing', key: 'tableFeature3', az: 'Baza challenge-lər', en: 'Basic challenges' },
    { section: 'pricing', key: 'tableFeature4', az: 'Donation limiti', en: 'Donation limit' },
    { section: 'pricing', key: 'tableFeature5', az: 'Coin-ləri yeməyə çevir', en: 'Convert coins to food' },
    { section: 'pricing', key: 'tableFeature6', az: 'Liga lotereyaları', en: 'League lotteries' },
    { section: 'pricing', key: 'tableFeature7', az: 'Partnyor endirimləri', en: 'Partner discounts' },
    { section: 'pricing', key: 'tableFeature8', az: 'Donation hesabatları', en: 'Donations reports' },
    { section: 'pricing', key: 'tableFeature9', az: 'Profildə Pro badge', en: 'Pro badge on profile' },
    { section: 'pricing', key: 'limited', az: 'Məhdud', en: 'Limited' },
    { section: 'pricing', key: 'unlimited', az: 'Limitsiz', en: 'Unlimited' },
    { section: 'pricing', key: 'benefit1', az: 'Limitsiz donation', en: 'Unlimited donations' },
    { section: 'pricing', key: 'benefit2', az: 'Xüsusi partnyor reward-ları', en: 'Exclusive partner rewards' },
    { section: 'pricing', key: 'benefit3', az: 'Yerli heyvan icmasına dəstək', en: 'Support the local pet community' },
    { section: 'pricing', key: 'compareNote', az: 'Free vs Pro · tam siyahı', en: 'Free vs Pro · full list' },
    { section: 'pricing', key: 'cta', az: 'İndi yüksəlt', en: 'Upgrade now' },
    { section: 'pricing', key: 'ctaHint', az: 'İstənilən vaxt ləğv et. Bərpa et · Şərtlər · Məxfilik siyasəti', en: 'Cancel anytime. Restore Purchases · Terms · Privacy Policy' },
    { section: 'tracker', key: 'eyebrow', az: 'Şəffaflıq', en: 'Transparency' },
    { section: 'tracker', key: 'title', az: 'Hər çatdırılmanın şəffaflığı.', en: 'Transparency of every delivery.' },
    { section: 'tracker', key: 'note', az: 'Hər çatdırılma — açıq şəkildə təsdiqlənir', en: 'Every delivery — publicly verified' },
    { section: 'tracker', key: 'cycleLabel', az: 'Aprel · cari dövr', en: 'April · current cycle' },
    { section: 'tracker', key: 'value', az: '220 / 500 kq', en: '220 / 500 kg' },
    { section: 'tracker', key: 'live', az: 'Bu gün 25 donation', en: '25 donations today' },
    { section: 'tracker', key: 'body', az: 'Hər dövr açıq progress, tarixçə və aylıq hesabatla görünür.', en: 'Every cycle shows live progress, history, and publicly visible monthly reports.' },
    { section: 'tracker', key: 'hint', az: 'Dövr bağlanana 10 gün qalır. Hər addım sayılır.', en: '10 days until cycle closes. Every step counts.' },
    { section: 'tracker', key: 'month1', az: 'Yan', en: 'Jan' },
    { section: 'tracker', key: 'month2', az: 'Fev', en: 'Feb' },
    { section: 'tracker', key: 'month3', az: 'Mar', en: 'Mar' },
    { section: 'tracker', key: 'month4', az: 'Apr', en: 'Apr' },
    { section: 'tracker', key: 'history1Count', az: '94 donation', en: '94 donations' },
    { section: 'tracker', key: 'history2Count', az: '145 donation · ✓', en: '145 donations · ✓' },
    { section: 'tracker', key: 'history3Count', az: '38 donation', en: '38 donations' },
    { section: 'tracker', key: 'history4Count', az: '120 donation · live', en: '120 donations · live' },
    { section: 'tracker', key: 'history1Cap', az: '<strong>700</strong> / 1000 kq', en: '<strong>700</strong> of 1000 kg' },
    { section: 'tracker', key: 'history2Cap', az: '<strong>1500</strong> / 1500 kq', en: '<strong>1500</strong> of 1500 kg' },
    { section: 'tracker', key: 'history3Cap', az: '<strong>220</strong> / 500 kq', en: '<strong>220</strong> of 500 kg' },
    { section: 'tracker', key: 'history4Cap', az: '<strong>220</strong> / 500 kq', en: '<strong>220</strong> of 500 kg' },
    { section: 'partners', key: 'eyebrow', az: 'Partnyorlar', en: 'Partners' },
    { section: 'partners', key: 'title', az: 'Brend milli hərəkətin içində.', en: 'Brand inside a national movement.' },
    { section: 'partners', key: 'note', az: '3 inteqrasiya istiqaməti', en: '3 integration directions' },
    { section: 'partners', key: 'card1Title', az: 'Görünürlük', en: 'Visibility' },
    { section: 'partners', key: 'card1Body', az: 'Brend banner kimi deyil, mövsümün özünün içinə toxunur.', en: 'Brand woven into the season, not bolted on as banner inventory.' },
    { section: 'partners', key: 'card2Title', az: 'Engagement', en: 'Engagement' },
    { section: 'partners', key: 'card2Body', az: 'Korporativ qruplar, team challenge-lər və reward mexanikası.', en: 'Corporate groups, team challenges, reward mechanics, and promo codes.' },
    { section: 'partners', key: 'card3Title', az: 'CSR təsiri', en: 'CSR impact' },
    { section: 'partners', key: 'card3Body', az: 'Aylıq sığınacaq çatdırılmalarına bağlanan zəmanətli nəticə.', en: 'A guaranteed monthly outcome tied to visible shelter food deliveries.' },
    { section: 'partners', key: 'ctaPrimary', az: 'Media kit istə →', en: 'Request media kit →' },
    { section: 'partners', key: 'ctaSecondary', az: 'Komanda ilə əlaqə', en: 'Contact the team' },
    { section: 'download', key: 'eyebrow', az: 'Tətbiqi yüklə · həmişə pulsuz', en: 'Get the app · free forever' },
    { section: 'download', key: 'title', az: 'Dosty Walks.', en: 'Dosty Walks.' },
    { section: 'download', key: 'body', az: 'Reklamsız app. Hər addım Bakı sığınacaqları üçün real yeməyə çevrilir.', en: 'A community turning everyday movement into real help for shelter animals.' },
    { section: 'download', key: 'badgeAppleSmall', az: 'App Store-dan yüklə', en: 'Download on the' },
    { section: 'download', key: 'badgeGoogleSmall', az: 'Buradan əldə et', en: 'Get it on' },
    { section: 'footer', key: 'tagline', az: 'Hər addım sayılır. Hər ay — sığınacaq üçün 500 kq yemək.', en: 'Every step counts. Every month — 500 kg of food to shelter.' },
    { section: 'footer', key: 'productTitle', az: 'Məhsul', en: 'Product' },
    { section: 'footer', key: 'partnersTitle', az: 'Partnyorlar', en: 'Partners' },
    { section: 'footer', key: 'legalTitle', az: 'Hüquqi', en: 'Legal' },
    { section: 'footer', key: 'becomePartner', az: 'Partnyor ol', en: 'Become a partner' },
    { section: 'footer', key: 'pressKit', az: 'Media kit', en: 'Press kit' },
    { section: 'footer', key: 'contacts', az: 'Əlaqə', en: 'Contacts' },
    { section: 'footer', key: 'cookies', az: 'Kukilər', en: 'Cookies' },
    { section: 'footer', key: 'bottomLeft', az: '© 2026 Dosty Walks · Bakıda hazırlanıb 🇦🇿', en: '© 2026 Dosty Walks · Made in Baku 🇦🇿' },
    { section: 'footer', key: 'bottomRight', az: 'Design draft v2 · work in progress', en: 'Design draft v2 · work in progress' },
  ];

  for (const translation of defaultTranslations) {
    await prisma.translation.upsert({
      where: {
        section_key: {
          section: translation.section,
          key: translation.key,
        },
      },
      update: {
        az: translation.az,
        en: translation.en,
      },
      create: translation,
    });
  }

  const defaultPages = [
    {
      type: 'privacy',
      titleAz: 'Privacy Policy',
      titleEn: 'Privacy Policy',
      slug: 'privacy-policy',
    },
    {
      type: 'terms',
      titleAz: 'Terms of Use',
      titleEn: 'Terms of Use',
      slug: 'terms-of-use',
    },
    {
      type: 'shelter',
      titleAz: 'BARS Shelter',
      titleEn: 'BARS Shelter',
      slug: 'shelter',
    },
    {
      type: 'contact',
      titleAz: 'Əlaqə',
      titleEn: 'Contact',
      slug: 'contact',
    },
    {
      type: 'rules',
      titleAz: 'Qaydalar',
      titleEn: 'Rules',
      slug: 'rules',
    },
    {
      type: 'faq',
      titleAz: 'FAQ',
      titleEn: 'FAQ',
      slug: 'faq',
    },
  ];

  for (const page of defaultPages) {
    await prisma.page.upsert({
      where: { type: page.type },
      update: {},
      create: {
        ...page,
        contentAz:
          page.type === 'privacy'
            ? 'Bu səhifə admin paneldən idarə olunur.\nBuraya məxfilik siyasətinin AZ mətni əlavə ediləcək.'
            : page.type === 'terms'
              ? 'Bu səhifə admin paneldən idarə olunur.\nBuraya istifadə şərtlərinin AZ mətni əlavə ediləcək.'
              : page.type === 'rules'
                ? 'Bu səhifə admin paneldən idarə olunur.\nBuraya qaydaların AZ mətni əlavə ediləcək.'
                : page.type === 'faq'
                  ? 'Bu səhifə admin paneldən idarə olunur.\nBuraya FAQ səhifəsinin AZ mətni əlavə ediləcək.'
              : 'Baku Animal Rescue Society (BARS) Bakı şəhərində qeydiyyatdan keçmiş heyvan müdafiəsi təşkilatıdır.\nDosty Walks hər ay bu sığınacaq üçün yemək dəstəyi yaradır.\nBu səhifə sığınacağın fəaliyyəti, qayğı prosesi və dəstək modeli haqqında məlumat verir.',
        contentEn:
          page.type === 'privacy'
            ? 'This page is managed from the admin panel.\nAdd the English privacy policy content here.'
            : page.type === 'terms'
              ? 'This page is managed from the admin panel.\nAdd the English terms of use content here.'
              : page.type === 'rules'
                ? 'This page is managed from the admin panel.\nAdd the English rules content here.'
                : page.type === 'faq'
                  ? 'This page is managed from the admin panel.\nAdd the English FAQ content here.'
              : 'Baku Animal Rescue Society (BARS) is a registered animal rescue organisation based in Baku.\nDosty Walks supports this shelter through its monthly food mission.\nThis page explains the shelter, the care process, and how support is turned into real help for animals.',
        published: true,
      },
    });
  }

  console.log(`Seed complete. Admin: ${email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
