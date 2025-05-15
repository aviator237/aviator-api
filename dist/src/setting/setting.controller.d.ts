import { SettingService } from './setting.service';
export declare class SettingController {
    private settingService;
    constructor(settingService: SettingService);
    getSettingByType(type: string): Promise<import("./setting.entities/setting.entity").SettingEntity[]>;
}
