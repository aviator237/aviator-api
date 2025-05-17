import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entites/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory/casl-ability.factory';
import { Action } from 'src/enum/action.enum';
import { ChangePasswordDto } from './dto/change-password.dto';
import * as bcrypt from 'bcrypt';

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

    async changePassword(user: UserEntity, changePasswordDto: ChangePasswordDto) {
        try {
            // Vérifier que le mot de passe actuel est correct
            const currentPasswordHash = await bcrypt.hash(changePasswordDto.currentPassword, user.salt);
            if (currentPasswordHash !== user.password) {
                throw new UnauthorizedException('Mot de passe actuel incorrect');
            }

            // Vérifier que le nouveau mot de passe et la confirmation correspondent
            if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
                throw new BadRequestException('Le nouveau mot de passe et la confirmation ne correspondent pas');
            }

            // Vérifier que le nouveau mot de passe est différent de l'ancien
            const isSamePassword = await bcrypt.compare(changePasswordDto.newPassword, user.password);
            if (isSamePassword) {
                throw new BadRequestException('Le nouveau mot de passe doit être différent de l\'ancien');
            }

            // Mettre à jour le mot de passe
            user.salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(changePasswordDto.newPassword, user.salt);
            await this.userRepository.save(user);

            return {
                status: "success",
                message: "Mot de passe modifié avec succès"
            };
        } catch (e) {
            if (e instanceof UnauthorizedException || e instanceof BadRequestException) {
                throw e;
            }
            throw new BadRequestException('Une erreur est survenue lors du changement de mot de passe');
        }
    }

}
