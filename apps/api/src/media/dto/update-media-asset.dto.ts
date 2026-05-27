import { IsOptional, IsString } from 'class-validator';

export class UpdateMediaAssetDto {
  @IsOptional()
  @IsString()
  altAz?: string;

  @IsOptional()
  @IsString()
  altEn?: string;
}
