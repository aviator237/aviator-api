import { PartialType } from "@nestjs/mapped-types";
import { IsBoolean, IsOptional, IsString } from "class-validator";
import { UserSubscribeDto } from "./User-subscribe.dto";


export class UpdateUserDto extends PartialType(UserSubscribeDto) {

    @IsOptional()
    @IsString()
    notificationId: string;

    @IsOptional()
    @IsBoolean()
    isOnline: boolean;

}
