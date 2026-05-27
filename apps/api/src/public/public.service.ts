import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PublicService {
  constructor(private readonly prisma: PrismaService) {}

  async getSettings() {
    const settings = await this.prisma.setting.findMany({
      orderBy: { key: 'asc' },
    });

    return Object.fromEntries(settings.map((item) => [item.key, item.value]));
  }

  async getTranslations(lang: 'az' | 'en', section?: string) {
    const items = await this.prisma.translation.findMany({
      where: section ? { section } : undefined,
      orderBy: [{ section: 'asc' }, { key: 'asc' }],
    });

    return items.map((item) => ({
      id: item.id,
      section: item.section,
      key: item.key,
      value: lang === 'az' ? item.az : item.en,
    }));
  }

  getMedia(section?: string) {
    return this.prisma.mediaAsset.findMany({
      where: section ? { section } : undefined,
      orderBy: [{ section: 'asc' }, { slot: 'asc' }],
    });
  }

  async getPage(type: string, lang: 'az' | 'en') {
    const page = await this.prisma.page.findUnique({
      where: { type },
    });

    if (!page || !page.published) {
      return null;
    }

    return {
      id: page.id,
      type: page.type,
      slug: page.slug,
      title: lang === 'az' ? page.titleAz : page.titleEn,
      content: lang === 'az' ? page.contentAz : page.contentEn,
      seoTitle: lang === 'az' ? page.seoTitleAz : page.seoTitleEn,
      seoDescription:
        lang === 'az' ? page.seoDescriptionAz : page.seoDescriptionEn,
    };
  }

  async getPageBySlug(slug: string, lang: 'az' | 'en') {
    const page = await this.prisma.page.findUnique({
      where: { slug },
    });

    if (!page || !page.published) {
      return null;
    }

    return {
      id: page.id,
      type: page.type,
      slug: page.slug,
      title: lang === 'az' ? page.titleAz : page.titleEn,
      content: lang === 'az' ? page.contentAz : page.contentEn,
      seoTitle: lang === 'az' ? page.seoTitleAz : page.seoTitleEn,
      seoDescription:
        lang === 'az' ? page.seoDescriptionAz : page.seoDescriptionEn,
    };
  }

  async getShelterAnimals(lang: 'az' | 'en', pageType: string) {
    const items = await this.prisma.shelterAnimal.findMany({
      where: {
        pageType,
        published: true,
      },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });

    return items.map((item) => ({
      id: item.id,
      pageType: item.pageType,
      name: lang === 'az' ? item.nameAz : item.nameEn,
      eyebrow: lang === 'az' ? item.eyebrowAz : item.eyebrowEn,
      alt: lang === 'az' ? item.altAz : item.altEn,
      thumbLabel: lang === 'az' ? item.thumbLabelAz : item.thumbLabelEn,
      genderLabel: lang === 'az' ? item.genderLabelAz : item.genderLabelEn,
      genderValue: lang === 'az' ? item.genderValueAz : item.genderValueEn,
      birthLabel: lang === 'az' ? item.birthLabelAz : item.birthLabelEn,
      birthValue: lang === 'az' ? item.birthValueAz : item.birthValueEn,
      breedLabel: lang === 'az' ? item.breedLabelAz : item.breedLabelEn,
      breedValue: lang === 'az' ? item.breedValueAz : item.breedValueEn,
      colorLabel: lang === 'az' ? item.colorLabelAz : item.colorLabelEn,
      colorValue: lang === 'az' ? item.colorValueAz : item.colorValueEn,
      story: lang === 'az' ? item.storyAz : item.storyEn,
      imagePath: item.imagePath,
      sortOrder: item.sortOrder,
    }));
  }
}
