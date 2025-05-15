import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthEntity } from './entities/auth.entity';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserEntity } from 'src/user/entites/user.entity';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/token-auth/Guard/jwt-auth.guard';
import { AuthLoginEntity } from './entities/auth-login.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AuthEntity, UserEntity, AuthLoginEntity]),
    PassportModule.register({
      defaultStrategy: "jwt"
    }),
    JwtModule.register({
      secret: process.env.SECRET,
      global: true,
      signOptions: {
        expiresIn: 3600000000000000
      }
    }),
  ],
  exports: [AuthService],
  providers: [AuthService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
  controllers: [AuthController]
})
export class AuthModule { }
