import { BadRequestException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateMediaAssetDto } from './dto/update-media-asset.dto';

type UploadMeta = {
  section: string;
  slot: string;
  kind: string;
  altAz?: string;
  altEn?: string;
};

const ALLOWED_MEDIA_KINDS = new Set([
  'logos',
  'qr',
  'sections',
  'pages',
  'shelter-animals',
]);

const MIME_TO_EXTENSION: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
  'image/gif': '.gif',
};

@Injectable()
export class MediaService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

  findAll(section?: string) {
    return this.prisma.mediaAsset.findMany({
      where: section ? { section } : undefined,
      orderBy: [{ section: 'asc' }, { slot: 'asc' }],
    });
  }

  private tryDeleteFile(filePath: string) {
    if (!existsSync(filePath)) {
      return;
    }

    try {
      unlinkSync(filePath);
    } catch {
      // Keep the DB operation successful even if Windows temporarily locks a previewed file.
    }
  }

  async saveFile(file: Express.Multer.File, meta: UploadMeta) {
    if (!ALLOWED_MEDIA_KINDS.has(meta.kind)) {
      throw new BadRequestException('Invalid media kind');
    }
    if (!file) {
      throw new BadRequestException('File is required');
    }

    const extension = MIME_TO_EXTENSION[file.mimetype];
    if (!extension) {
      throw new BadRequestException('Unsupported file type');
    }

    const uploadsRoot = resolve(
      process.cwd(),
      this.config.get<string>('UPLOADS_DIR', '../../uploads'),
    );
    const targetDir = join(uploadsRoot, meta.kind);
    if (!existsSync(targetDir)) {
      mkdirSync(targetDir, { recursive: true });
    }

    const safeName = `${Date.now()}-${meta.section}-${meta.slot}${extension}`;
    const diskPath = join(targetDir, safeName);
    writeFileSync(diskPath, file.buffer);

    const existing = await this.prisma.mediaAsset.findUnique({
      where: {
        section_slot: {
          section: meta.section,
          slot: meta.slot,
        },
      },
    });

    if (existing) {
      const oldFile = resolve(uploadsRoot, existing.filePath);
      this.tryDeleteFile(oldFile);
    }

    return this.prisma.mediaAsset.upsert({
      where: {
        section_slot: {
          section: meta.section,
          slot: meta.slot,
        },
      },
      update: {
        kind: meta.kind,
        fileName: safeName,
        originalName: file.originalname,
        mimeType: file.mimetype,
        filePath: `${meta.kind}/${safeName}`,
        altAz: meta.altAz,
        altEn: meta.altEn,
      },
      create: {
        section: meta.section,
        slot: meta.slot,
        kind: meta.kind,
        fileName: safeName,
        originalName: file.originalname,
        mimeType: file.mimetype,
        filePath: `${meta.kind}/${safeName}`,
        altAz: meta.altAz,
        altEn: meta.altEn,
      },
    });
  }

  update(id: string, dto: UpdateMediaAssetDto) {
    return this.prisma.mediaAsset.update({
      where: { id },
      data: dto,
    });
  }

  async remove(id: string) {
    const asset = await this.prisma.mediaAsset.findUnique({
      where: { id },
    });

    if (!asset) {
      return null;
    }

    const uploadsRoot = resolve(
      process.cwd(),
      this.config.get<string>('UPLOADS_DIR', '../../uploads'),
    );
    const diskPath = resolve(uploadsRoot, asset.filePath);

    if (existsSync(diskPath)) {
      this.tryDeleteFile(diskPath);
    }

    await this.prisma.mediaAsset.delete({
      where: { id },
    });

    return { id };
  }
}
