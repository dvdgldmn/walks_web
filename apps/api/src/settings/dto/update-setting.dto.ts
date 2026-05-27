import { IsOptional, IsString, IsObject } from 'class-validator';

export class UpdateSettingDto {
  @IsString()
  key!: string;

  @IsObject()
  value!: Record<string, unknown>;
}

export class UpdateSettingsBulkDto {
  @IsOptional()
  settings?: UpdateSettingDto[];
}
