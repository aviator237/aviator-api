import { SettingEntity } from './setting.entities/setting.entity';
import { Repository } from 'typeorm';
export declare class SettingService {
    private readonly settingRepository;
    constructor(settingRepository: Repository<SettingEntity>);
    getSettingByType(type: string): Promise<SettingEntity[]>;
}
