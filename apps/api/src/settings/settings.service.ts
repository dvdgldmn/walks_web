import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateSettingDto } from './dto/update-setting.dto';

@Injectable()
export class SettingsService {
  constructor(private readonly prisma: PrismaService) {}

  getAll() {
    return this.prisma.setting.findMany({
      orderBy: { key: 'asc' },
    });
  }

  getOne(key: string) {
    return this.prisma.setting.findUnique({
      where: { key },
    });
  }

  async upsertMany(settings: UpdateSettingDto[]) {
    return this.prisma.$transaction(
      settings.map((setting) =>
        this.prisma.setting.upsert({
          where: { key: setting.key },
          update: { value: setting.value as Prisma.InputJsonValue },
          create: {
            key: setting.key,
            value: setting.value as Prisma.InputJsonValue,
          },
        }),
      ),
    );
  }
}
