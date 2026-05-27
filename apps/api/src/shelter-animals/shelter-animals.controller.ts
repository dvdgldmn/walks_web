import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CreateShelterAnimalDto } from './dto/create-shelter-animal.dto';
import { UpdateShelterAnimalDto } from './dto/update-shelter-animal.dto';
import { ShelterAnimalsService } from './shelter-animals.service';

@Controller('shelter-animals')
export class ShelterAnimalsController {
  constructor(private readonly shelterAnimalsService: ShelterAnimalsService) {}

  @Get()
  findAll(@Query('pageType') pageType?: string) {
    return this.shelterAnimalsService.findAll(pageType || 'shelter');
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateShelterAnimalDto,
  ) {
    return this.shelterAnimalsService.create(dto, file);
  }

  @Patch(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  update(
    @Param('id') id: string,
    @Body() dto: UpdateShelterAnimalDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return this.shelterAnimalsService.update(id, dto, file);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.shelterAnimalsService.remove(id);
  }
}
