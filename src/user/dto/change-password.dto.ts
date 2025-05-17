import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class ChangePasswordDto {
    @IsNotEmpty()
    @IsString()
    currentPassword: string;

    @IsNotEmpty()
    @IsString()
    // @MinLength(6, { message: 'Le nouveau mot de passe doit contenir au moins 6 caractères' })
    newPassword: string;

    @IsNotEmpty()
    @IsString()
    confirmPassword: string;
}
