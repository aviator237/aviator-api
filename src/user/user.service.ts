import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entites/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action } from 'src/enum/action.enum';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private readonly caslAbilityFactory: CaslAbilityFactory

    ) { }


    async getById(userId: string, user: UserEntity): Promise<UserEntity> {
        const userData: UserEntity = await this.userRepository.findOne({ where: { id: userId } });
        if (userData) {
            const ability = this.caslAbilityFactory.createForUser(user);
            console.log(ability.rules);
            console.log(ability.can(Action.Read, userData));
            console.log(userData);
            return userData;
        } else {
            throw new NotFoundException();
        }
    }


    async getWalletAmount(user: UserEntity): Promise<number> {
        const userData = await this.userRepository.findOne({ where: { id: user.id }, select: { walletAmount: true } });
        if (userData) {
            return userData.walletAmount;
        } else {
            throw new NotFoundException();
        }
    }


    async getUsers(user: UserEntity, page: number, count: number): Promise<UserEntity[]> {
        return await this.userRepository.find({ skip: page * count, take: count });
    }



    async getUserGodDaughters(user: UserEntity, page: number, count: number): Promise<UserEntity[]> {
        return await this.userRepository.find({ where: { godfather: { id: user.id } }, order: { createAt: "DESC" }, skip: page * count, take: count });
    }


    async userSoftDeleteAccount(userId: string) {
        try {
            await this.userRepository.softDelete(userId);
            return {
                "status": "ok"
            };
        } catch (e) {
            throw new BadRequestException();
        }
    }


    async update(id: string, updateUserDto: UpdateUserDto) {
        (updateUserDto.firstName ?? "").replace(" ", "");
        (updateUserDto.lastName ?? "").replace(" ", "");
        let newUser = await this.userRepository.preload({
            id,
            ...updateUserDto
        });
        if (newUser) {
            try {
                newUser = await this.userRepository.save(newUser);
                return {
                    "user": newUser
                };
            } catch (e) {
                throw new BadRequestException(e);
            }
        } else {
            throw new NotFoundException("User Not Found")
        }

    }

}
