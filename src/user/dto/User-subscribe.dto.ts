import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsStrongPassword, MaxLength } from "class-validator";
import { UserLangEnum } from "src/enum/user-lang.enum";

export class UserSubscribeDto {

    @MaxLength(50)
    @IsString()
    @IsOptional()
    firstName?: string;

    @MaxLength(30)
    @IsString()
    @IsOptional()
    userName?: string;

    @MaxLength(30)
    @IsString()
    @IsOptional()
    referalCode?: string;

    @IsString()
    @IsNotEmpty()
    // @IsStrongPassword()
    password?: string;

    @MaxLength(50)
    @IsString()
    @IsOptional()
    lastName?: string;

    @IsOptional()
    @IsEmail()
    @MaxLength(50)
    email?: string;

    @MaxLength(15)
    @IsPhoneNumber()
    @IsNotEmpty()
    phoneNumber?: string;

    @IsOptional()
    @IsEnum(UserLangEnum)
    lang?: UserLangEnum;

}