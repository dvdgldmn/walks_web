import { IsOptional, IsString, IsObject, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export class UpdateSettingDto {
  @IsString()
  key!: string;

  @IsObject()
  value!: Record<string, unknown>;
}

export class UpdateSettingsBulkDto {
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => UpdateSettingDto)
  settings?: UpdateSettingDto[];
}
