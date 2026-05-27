import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreatePageDto {
  @IsString()
  type!: string;

  @IsString()
  titleAz!: string;

  @IsString()
  titleEn!: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsString()
  contentAz!: string;

  @IsString()
  contentEn!: string;

  @IsOptional()
  @IsString()
  seoTitleAz?: string;

  @IsOptional()
  @IsString()
  seoTitleEn?: string;

  @IsOptional()
  @IsString()
  seoDescriptionAz?: string;

  @IsOptional()
  @IsString()
  seoDescriptionEn?: string;

  @IsOptional()
  @IsBoolean()
  published?: boolean;
}
