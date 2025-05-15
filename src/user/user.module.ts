import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entites/user.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import * as dotenv from "dotenv";
import { AuthService } from 'src/auth/auth.service';
import { AuthEntity } from 'src/auth/entities/auth.entity';
import { UuidModule } from 'nestjs-uuid';
import { AuthLoginEntity } from 'src/auth/entities/auth-login.entity';
dotenv.config()

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, AuthEntity, AuthLoginEntity]),
    UuidModule
  ],
  controllers: [UserController],
  providers: [UserService, AuthService],
  exports: [UserService]
})
export class UserModule { }
