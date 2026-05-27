import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTranslationDto } from './dto/create-translation.dto';
import { UpdateTranslationDto } from './dto/update-translation.dto';

@Injectable()
export class TranslationsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(section?: string) {
    return this.prisma.translation.findMany({
      where: section ? { section } : undefined,
      orderBy: [{ section: 'asc' }, { key: 'asc' }],
    });
  }

  create(dto: CreateTranslationDto) {
    return this.prisma.translation.create({
      data: dto,
    });
  }

  update(id: string, dto: UpdateTranslationDto) {
    return this.prisma.translation.update({
      where: { id },
      data: dto,
    });
  }
}
