import { Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { payloadInterface } from '../interface/payload.interface';
import { Repository } from 'typeorm';
import { UserEntity } from 'src/user/entites/user.entity';
declare const JwtStrategy_base: new (...args: any[]) => InstanceType<typeof Strategy>;
export declare class JwtStrategy extends JwtStrategy_base {
    private configService;
    private userRepository;
    constructor(configService: ConfigService, userRepository: Repository<UserEntity>);
    validate(payload: payloadInterface): Promise<UserEntity>;
}
export {};
