import { UpdateUserDto } from './dto/update-user.dto';
import { UserEntity } from './entites/user.entity';
import { UserService } from './user.service';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getWalletAmount(user: UserEntity): Promise<number>;
    userAccountSoftDelete(user: UserEntity): Promise<{
        status: string;
    }>;
    deleteUser(id: string): Promise<{
        status: string;
    }>;
    getOneUserData(user: UserEntity): Promise<UserEntity>;
    getUserGodDaughters(user: UserEntity, page: number, count: number): Promise<UserEntity[]>;
    getById(user: UserEntity, id: string): Promise<UserEntity>;
    getUsers(user: UserEntity, page: number, count: number): Promise<UserEntity[]>;
    userUpdateAccountControl(UpdateUserDto: UpdateUserDto, id: string): Promise<{
        user: UserEntity;
    }>;
    updateMyAcount(UpdateUserDto: UpdateUserDto, user: UserEntity): Promise<{
        user: UserEntity;
    }>;
}
