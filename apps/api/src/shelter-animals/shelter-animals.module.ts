import { Module } from '@nestjs/common';
import { ShelterAnimalsController } from './shelter-animals.controller';
import { ShelterAnimalsService } from './shelter-animals.service';

@Module({
  controllers: [ShelterAnimalsController],
  providers: [ShelterAnimalsService],
  exports: [ShelterAnimalsService],
})
export class ShelterAnimalsModule {}
