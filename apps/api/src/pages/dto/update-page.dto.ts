import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdatePageDto {
  @IsOptional()
  @IsString()
  titleAz?: string;

  @IsOptional()
  @IsString()
  titleEn?: string;

  @IsOptional()
  @IsString()
  slug?: string;

  @IsOptional()
  @IsString()
  contentAz?: string;

  @IsOptional()
  @IsString()
  contentEn?: string;

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
