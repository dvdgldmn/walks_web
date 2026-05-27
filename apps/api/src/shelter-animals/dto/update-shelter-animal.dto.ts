import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsOptional, IsString, Min } from 'class-validator';

export class UpdateShelterAnimalDto {
  @IsOptional()
  @IsString()
  pageType?: string;

  @IsOptional()
  @IsString()
  nameAz?: string;

  @IsOptional()
  @IsString()
  nameEn?: string;

  @IsOptional()
  @IsString()
  eyebrowAz?: string;

  @IsOptional()
  @IsString()
  eyebrowEn?: string;

  @IsOptional()
  @IsString()
  altAz?: string;

  @IsOptional()
  @IsString()
  altEn?: string;

  @IsOptional()
  @IsString()
  thumbLabelAz?: string;

  @IsOptional()
  @IsString()
  thumbLabelEn?: string;

  @IsOptional()
  @IsString()
  genderLabelAz?: string;

  @IsOptional()
  @IsString()
  genderLabelEn?: string;

  @IsOptional()
  @IsString()
  genderValueAz?: string;

  @IsOptional()
  @IsString()
  genderValueEn?: string;

  @IsOptional()
  @IsString()
  birthLabelAz?: string;

  @IsOptional()
  @IsString()
  birthLabelEn?: string;

  @IsOptional()
  @IsString()
  birthValueAz?: string;

  @IsOptional()
  @IsString()
  birthValueEn?: string;

  @IsOptional()
  @IsString()
  breedLabelAz?: string;

  @IsOptional()
  @IsString()
  breedLabelEn?: string;

  @IsOptional()
  @IsString()
  breedValueAz?: string;

  @IsOptional()
  @IsString()
  breedValueEn?: string;

  @IsOptional()
  @IsString()
  colorLabelAz?: string;

  @IsOptional()
  @IsString()
  colorLabelEn?: string;

  @IsOptional()
  @IsString()
  colorValueAz?: string;

  @IsOptional()
  @IsString()
  colorValueEn?: string;

  @IsOptional()
  @IsString()
  storyAz?: string;

  @IsOptional()
  @IsString()
  storyEn?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  sortOrder?: number;

  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  published?: boolean;
}
