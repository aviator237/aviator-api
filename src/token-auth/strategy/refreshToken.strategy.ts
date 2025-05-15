import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request } from 'express';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { payloadInterface } from '../interface/payload.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entites/user.entity';
import { Repository } from 'typeorm';
import { UserLoginStatusEnum } from 'src/enum/user.enum';

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(Strategy, 'jwt-refresh',) {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_REFRESH_SECRET,
            passReqToCallback: true,
        });
    }

    async validate(payload: payloadInterface) {
        const user: UserEntity = await this.userRepository.findOne({
            where: { id: payload.id }
        });

        if (user) {
            if (user.isBlocked) {
                throw new UnauthorizedException(UserLoginStatusEnum.ACCOUNT_BLOCKED, { description: "Your account is blocked due to suspicious activity" });
            }
            return user;
        } else {
            throw new UnauthorizedException();
        }
    }
}