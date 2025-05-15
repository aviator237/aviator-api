import { Controller, Get, Param } from '@nestjs/common';
import { SettingService } from './setting.service';

@Controller('setting')
export class SettingController {
    constructor(
        private settingService: SettingService
      ){}

      @Get("getSettingByType/:type")
      async getSettingByType(
        @Param("type") type: string,
      ){
        return await this.settingService.getSettingByType(type)
      }

}
