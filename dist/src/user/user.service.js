"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("./entites/user.entity");
const casl_ability_factory_1 = require("../casl/casl-ability.factory/casl-ability.factory");
const action_enum_1 = require("../enum/action.enum");
const bcrypt = require("bcrypt");
let UserService = class UserService {
    constructor(userRepository, caslAbilityFactory) {
        this.userRepository = userRepository;
        this.caslAbilityFactory = caslAbilityFactory;
    }
    async getById(userId, user) {
        const userData = await this.userRepository.findOne({ where: { id: userId } });
        if (userData) {
            const ability = this.caslAbilityFactory.createForUser(user);
            console.log(ability.rules);
            console.log(ability.can(action_enum_1.Action.Read, userData));
            console.log(userData);
            return userData;
        }
        else {
            throw new common_1.NotFoundException();
        }
    }
    async getWalletAmount(user) {
        const userData = await this.userRepository.findOne({ where: { id: user.id }, select: { walletAmount: true } });
        if (userData) {
            return userData.walletAmount;
        }
        else {
            throw new common_1.NotFoundException();
        }
    }
    async getUsers(user, page, count) {
        return await this.userRepository.find({ skip: page * count, take: count });
    }
    async getUserGodDaughters(user, page, count) {
        return await this.userRepository.find({ where: { godfather: { id: user.id } }, order: { createAt: "DESC" }, skip: page * count, take: count });
    }
    async userSoftDeleteAccount(userId) {
        try {
            await this.userRepository.softDelete(userId);
            return {
                "status": "ok"
            };
        }
        catch (e) {
            throw new common_1.BadRequestException();
        }
    }
    async update(id, updateUserDto) {
        var _a, _b;
        ((_a = updateUserDto.firstName) !== null && _a !== void 0 ? _a : "").replace(" ", "");
        ((_b = updateUserDto.lastName) !== null && _b !== void 0 ? _b : "").replace(" ", "");
        let newUser = await this.userRepository.preload(Object.assign({ id }, updateUserDto));
        if (newUser) {
            try {
                newUser = await this.userRepository.save(newUser);
                return {
                    "user": newUser
                };
            }
            catch (e) {
                throw new common_1.BadRequestException(e);
            }
        }
        else {
            throw new common_1.NotFoundException("User Not Found");
        }
    }
    async changePassword(user, changePasswordDto) {
        try {
            const currentPasswordHash = await bcrypt.hash(changePasswordDto.currentPassword, user.salt);
            if (currentPasswordHash !== user.password) {
                throw new common_1.UnauthorizedException('Mot de passe actuel incorrect');
            }
            if (changePasswordDto.newPassword !== changePasswordDto.confirmPassword) {
                throw new common_1.BadRequestException('Le nouveau mot de passe et la confirmation ne correspondent pas');
            }
            const isSamePassword = await bcrypt.compare(changePasswordDto.newPassword, user.password);
            if (isSamePassword) {
                throw new common_1.BadRequestException('Le nouveau mot de passe doit être différent de l\'ancien');
            }
            user.salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(changePasswordDto.newPassword, user.salt);
            await this.userRepository.save(user);
            return {
                status: "success",
                message: "Mot de passe modifié avec succès"
            };
        }
        catch (e) {
            if (e instanceof common_1.UnauthorizedException || e instanceof common_1.BadRequestException) {
                throw e;
            }
            throw new common_1.BadRequestException('Une erreur est survenue lors du changement de mot de passe');
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        casl_ability_factory_1.CaslAbilityFactory])
], UserService);
//# sourceMappingURL=user.service.js.map