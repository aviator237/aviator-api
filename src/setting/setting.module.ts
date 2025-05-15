import { Module } from '@nestjs/common';
import { SettingService } from './setting.service';
import { SettingController } from './setting.controller';
import { SettingEntity } from './setting.entities/setting.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
imports: [  TypeOrmModule.forFeature([SettingEntity]),],
  providers: [SettingService],
  controllers: [SettingController],
  exports: [SettingService]

})
export class SettingModule {}
