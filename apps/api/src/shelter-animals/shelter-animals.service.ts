import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { PrismaService } from '../prisma/prisma.service';
import { CreateShelterAnimalDto } from './dto/create-shelter-animal.dto';
import { UpdateShelterAnimalDto } from './dto/update-shelter-animal.dto';

const MIME_TO_EXTENSION: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

@Injectable()
export class ShelterAnimalsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  findAll(pageType = 'shelter') {
    return this.prisma.shelterAnimal.findMany({
      where: { pageType },
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'asc' }],
    });
  }

  private getUploadsRoot() {
    return resolve(
      process.cwd(),
      this.config.get<string>('UPLOADS_DIR', '../../uploads'),
    );
  }

  private ensureTargetDir() {
    const targetDir = join(this.getUploadsRoot(), 'shelter-animals');
    if (!existsSync(targetDir)) {
      mkdirSync(targetDir, { recursive: true });
    }
    return targetDir;
  }

  private tryDeleteFile(filePath: string) {
    if (!existsSync(filePath)) {
      return;
    }

    try {
      unlinkSync(filePath);
    } catch {
      // If Windows temporarily locks the previewed image, keep the DB mutation successful.
    }
  }

  private saveImage(file: Express.Multer.File, pageType: string) {
    if (!file) {
      throw new BadRequestException('Image file is required');
    }

    const extension = MIME_TO_EXTENSION[file.mimetype];
    if (!extension) {
      throw new BadRequestException('Unsupported image type');
    }

    const targetDir = this.ensureTargetDir();
    const safeName = `${Date.now()}-${pageType}${extension}`;
    const diskPath = join(targetDir, safeName);
    writeFileSync(diskPath, file.buffer);
    return {
      fileName: safeName,
      originalName: file.originalname,
      mimeType: file.mimetype,
      filePath: `shelter-animals/${safeName}`,
    };
  }

  async create(dto: CreateShelterAnimalDto, file: Express.Multer.File) {
    const image = this.saveImage(file, dto.pageType || 'shelter');

    return this.prisma.shelterAnimal.create({
      data: {
        pageType: dto.pageType || 'shelter',
        nameAz: dto.nameAz,
        nameEn: dto.nameEn,
        eyebrowAz: dto.eyebrowAz,
        eyebrowEn: dto.eyebrowEn,
        altAz: dto.altAz,
        altEn: dto.altEn,
        thumbLabelAz: dto.thumbLabelAz,
        thumbLabelEn: dto.thumbLabelEn,
        genderLabelAz: dto.genderLabelAz,
        genderLabelEn: dto.genderLabelEn,
        genderValueAz: dto.genderValueAz,
        genderValueEn: dto.genderValueEn,
        birthLabelAz: dto.birthLabelAz,
        birthLabelEn: dto.birthLabelEn,
        birthValueAz: dto.birthValueAz,
        birthValueEn: dto.birthValueEn,
        breedLabelAz: dto.breedLabelAz,
        breedLabelEn: dto.breedLabelEn,
        breedValueAz: dto.breedValueAz,
        breedValueEn: dto.breedValueEn,
        colorLabelAz: dto.colorLabelAz,
        colorLabelEn: dto.colorLabelEn,
        colorValueAz: dto.colorValueAz,
        colorValueEn: dto.colorValueEn,
        storyAz: dto.storyAz,
        storyEn: dto.storyEn,
        sortOrder: dto.sortOrder ?? 0,
        published: dto.published ?? true,
        imagePath: image.filePath,
        imageFileName: image.fileName,
        imageOriginalName: image.originalName,
        imageMimeType: image.mimeType,
      },
    });
  }

  async update(id: string, dto: UpdateShelterAnimalDto, file?: Express.Multer.File) {
    const current = await this.prisma.shelterAnimal.findUnique({
      where: { id },
    });

    if (!current) {
      return null;
    }

    let imageData: Partial<{
      imagePath: string;
      imageFileName: string;
      imageOriginalName: string;
      imageMimeType: string;
    }> = {};

    if (file) {
      const image = this.saveImage(file, dto.pageType || current.pageType);
      const oldFile = resolve(this.getUploadsRoot(), current.imagePath);
      this.tryDeleteFile(oldFile);
      imageData = {
        imagePath: image.filePath,
        imageFileName: image.fileName,
        imageOriginalName: image.originalName,
        imageMimeType: image.mimeType,
      };
    }

    return this.prisma.shelterAnimal.update({
      where: { id },
      data: {
        ...dto,
        ...imageData,
      },
    });
  }

  async remove(id: string) {
    const current = await this.prisma.shelterAnimal.findUnique({
      where: { id },
    });

    if (!current) {
      return null;
    }

    const oldFile = resolve(this.getUploadsRoot(), current.imagePath);
    this.tryDeleteFile(oldFile);

    await this.prisma.shelterAnimal.delete({
      where: { id },
    });

    return { id };
  }
}
