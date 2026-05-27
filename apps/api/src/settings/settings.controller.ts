import { Body, Controller, Get, Param, Patch } from '@nestjs/common';
import { UpdateSettingsBulkDto } from './dto/update-setting.dto';
import { SettingsService } from './settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  getAll() {
    return this.settingsService.getAll();
  }

  @Get(':key')
  getOne(@Param('key') key: string) {
    return this.settingsService.getOne(key);
  }

  @Patch()
  updateMany(@Body() body: UpdateSettingsBulkDto) {
    return this.settingsService.upsertMany(body.settings ?? []);
  }
}
