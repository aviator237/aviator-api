import { Body, Controller, Get, MaxFileSizeValidator, ParseFilePipe, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginCredentialsDto } from 'src/user/dto/login-credentials.dto';
import { UserSubscribeDto } from 'src/user/dto/User-subscribe.dto';
import { SkipAuth } from 'src/decorators/skip-auth.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserRoleEnum } from 'src/enum/user-role.enum';
import { RefreshTokenGuard } from 'src/token-auth/Guard/refresh-token.guard';
import { User } from 'src/decorators/users.decorator';
import { UserEntity } from 'src/user/entites/user.entity';

@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService,

    ) { }


    // Controller qui gere le login des utilisateurs
    @SkipAuth()
    @Post("login")
    async login(
        @Body() loginData: LoginCredentialsDto,
    ) {
        return await this.authService.login(loginData);
    }

    // Controller qui gere la creation des comptes utilisateur web
    @SkipAuth()
    @Post("create")
    async userCreateAccount(
        @Body() userdata: UserSubscribeDto,
        @Query("next") next?: string,

    ) {
        return await this.authService.create(userdata, next);
    }


    // Controller qui gere le rafraichissement des tokens des utilisateurs
    @SkipAuth()
    @UseGuards(RefreshTokenGuard)
    @Get("refresh")
    async refresh(
        @User() user: UserEntity,
    ) {
        return await this.authService.refreshTokens(user);
    }

    // Controller qui gère la déconnexion des utilisateurs
    @Post("logout")
    async logout(
        @User() user: UserEntity,
    ) {
        return await this.authService.logout(user);
    }

}
