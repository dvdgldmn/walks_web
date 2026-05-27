import { Controller, Get, Param, Query } from '@nestjs/common';
import { Public } from '../auth/decorators/public.decorator';
import { PublicService } from './public.service';

@Public()
@Controller('public')
export class PublicController {
  constructor(private readonly publicService: PublicService) {}

  @Get('settings')
  getSettings() {
    return this.publicService.getSettings();
  }

  @Get('translations')
  getTranslations(
    @Query('lang') lang: 'az' | 'en' = 'en',
    @Query('section') section?: string,
  ) {
    return this.publicService.getTranslations(lang, section);
  }

  @Get('media')
  getMedia(@Query('section') section?: string) {
    return this.publicService.getMedia(section);
  }

  @Get('pages/:type')
  getPage(
    @Param('type') type: string,
    @Query('lang') lang: 'az' | 'en' = 'en',
  ) {
    return this.publicService.getPage(type, lang);
  }

  @Get('pages-by-slug/:slug')
  getPageBySlug(
    @Param('slug') slug: string,
    @Query('lang') lang: 'az' | 'en' = 'en',
  ) {
    return this.publicService.getPageBySlug(slug, lang);
  }

  @Get('shelter-animals')
  getShelterAnimals(
    @Query('lang') lang: 'az' | 'en' = 'en',
    @Query('pageType') pageType?: string,
  ) {
    return this.publicService.getShelterAnimals(lang, pageType || 'shelter');
  }
}
