import { Repository } from 'typeorm';
import { UserEntity } from './entites/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { ChangePasswordDto } from './dto/change-password.dto';
export declare class UserService {
    private readonly userRepository;
    private readonly caslAbilityFactory;
    constructor(userRepository: Repository<UserEntity>, caslAbilityFactory: CaslAbilityFactory);
    getById(userId: string, user: UserEntity): Promise<UserEntity>;
    getWalletAmount(user: UserEntity): Promise<number>;
    getUsers(user: UserEntity, page: number, count: number): Promise<UserEntity[]>;
    getUserGodDaughters(user: UserEntity, page: number, count: number): Promise<UserEntity[]>;
    userSoftDeleteAccount(userId: string): Promise<{
        status: string;
    }>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<{
        user: UserEntity;
    }>;
    changePassword(user: UserEntity, changePasswordDto: ChangePasswordDto): Promise<{
        status: string;
        message: string;
    }>;
}
