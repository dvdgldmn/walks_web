import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTranslationDto {
  @IsString()
  @IsNotEmpty()
  section!: string;

  @IsString()
  @IsNotEmpty()
  key!: string;

  @IsString()
  az!: string;

  @IsString()
  en!: string;
}
