import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { payloadInterface } from '../interface/payload.interface';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entites/user.entity';
import { UserLoginStatusEnum } from 'src/enum/user.enum';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get("SECRET"),
    });
  }

  async validate(payload: payloadInterface) {
    const user: UserEntity = await this.userRepository.findOne({
      where: { id: payload.id }
    });

    console.log("utilisateur: ", user)
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