import { Strategy } from 'passport-jwt';
import { payloadInterface } from '../interface/payload.interface';
import { UserEntity } from 'src/user/entites/user.entity';
import { Repository } from 'typeorm';
declare const RefreshTokenStrategy_base: new (...args: any[]) => InstanceType<typeof Strategy>;
export declare class RefreshTokenStrategy extends RefreshTokenStrategy_base {
    private userRepository;
    constructor(userRepository: Repository<UserEntity>);
    validate(payload: payloadInterface): Promise<UserEntity>;
}
export {};
