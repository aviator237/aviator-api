import { UserSubscribeDto } from "./User-subscribe.dto";
declare const UpdateUserDto_base: import("@nestjs/mapped-types").MappedType<Partial<UserSubscribeDto>>;
export declare class UpdateUserDto extends UpdateUserDto_base {
    notificationId: string;
    isOnline: boolean;
}
export {};
