import { Body, Controller, Get, Patch, Post, Query, Param } from '@nestjs/common';
import { CreateTranslationDto } from './dto/create-translation.dto';
import { UpdateTranslationDto } from './dto/update-translation.dto';
import { TranslationsService } from './translations.service';

@Controller('translations')
export class TranslationsController {
  constructor(private readonly translationsService: TranslationsService) {}

  @Get()
  findAll(@Query('section') section?: string) {
    return this.translationsService.findAll(section);
  }

  @Post()
  create(@Body() dto: CreateTranslationDto) {
    return this.translationsService.create(dto);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateTranslationDto) {
    return this.translationsService.update(id, dto);
  }
}
