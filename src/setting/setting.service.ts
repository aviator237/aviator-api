import { Injectable } from '@nestjs/common';
import { SettingEntity } from './setting.entities/setting.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class SettingService {
    constructor(
        @InjectRepository(SettingEntity)
        private readonly settingRepository: Repository<SettingEntity>,
    ) { }

    async getSettingByType(type: string) {
        return await this.settingRepository.find({ where: { type: type } });
    }
}
