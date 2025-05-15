import { IsNotEmpty, IsOptional, IsString, IsStrongPassword } from "class-validator";

export class LoginCredentialsDto {

    @IsNotEmpty()
    @IsString()
    login: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsOptional()
    @IsString()
    // @IsStrongPassword()
    newPassword: string;

}