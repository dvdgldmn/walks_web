import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { slugify } from '../common/utils/slug.util';
import { CreatePageDto } from './dto/create-page.dto';
import { UpdatePageDto } from './dto/update-page.dto';

@Injectable()
export class PagesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.page.findMany({
      orderBy: { type: 'asc' },
    });
  }

  findOne(type: string) {
    return this.prisma.page.findUnique({
      where: { type },
    });
  }

  create(dto: CreatePageDto) {
    return this.prisma.page.create({
      data: {
        ...dto,
        slug: dto.slug || slugify(dto.type),
        published: dto.published ?? false,
      },
    });
  }

  update(id: string, dto: UpdatePageDto) {
    return this.prisma.page.update({
      where: { id },
      data: dto,
    });
  }
}
