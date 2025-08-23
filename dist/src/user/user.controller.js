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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const users_decorator_1 = require("../decorators/users.decorator");
const update_user_dto_1 = require("./dto/update-user.dto");
const user_entity_1 = require("./entites/user.entity");
const user_service_1 = require("./user.service");
const user_role_enum_1 = require("../enum/user-role.enum");
const roles_decorator_1 = require("../decorators/roles.decorator");
const roles_guard_1 = require("../token-auth/Guard/roles.guard");
const is_valid_object_id_pipe_1 = require("../pipes/is-valid-object-id.pipe");
const change_password_dto_1 = require("./dto/change-password.dto");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    async getWalletAmount(user) {
        return await this.userService.getWalletAmount(user);
    }
    async userAccountSoftDelete(user) {
        return await this.userService.userSoftDeleteAccount(user.id);
    }
    async deleteUser(id) {
        return await this.userService.userSoftDeleteAccount(id);
    }
    async getOneUserData(user) {
        return await this.userService.getById(user.id, user);
    }
    async getUserGodDaughters(user, page, count) {
        return await this.userService.getUserGodDaughters(user, page, count);
    }
    async getById(user, id) {
        return await this.userService.getById(id, user);
    }
    async getUsers(user, page, count) {
        return await this.userService.getUsers(user, page, count);
    }
    async userUpdateAccountControl(UpdateUserDto, id) {
        return await this.userService.update(id, UpdateUserDto);
    }
    async updateMyAcount(UpdateUserDto, user) {
        return await this.userService.update(user.id, UpdateUserDto);
    }
    async changePassword(user, changePasswordDto) {
        return await this.userService.changePassword(user, changePasswordDto);
    }
};
exports.UserController = UserController;
__decorate([
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRoleEnum.USER, user_role_enum_1.UserRoleEnum.SUPER_ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Get)("getWalletAmount"),
    __param(0, (0, users_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getWalletAmount", null);
__decorate([
    (0, common_1.Delete)(),
    __param(0, (0, users_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "userAccountSoftDelete", null);
__decorate([
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRoleEnum.SUPER_ADMIN),
    (0, common_1.Delete)(":id"),
    __param(0, (0, common_1.Param)("id", new is_valid_object_id_pipe_1.IsValidObjectIdPipe(user_entity_1.UserEntity))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "deleteUser", null);
__decorate([
    (0, common_1.Get)("getData"),
    __param(0, (0, users_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getOneUserData", null);
__decorate([
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRoleEnum.USER, user_role_enum_1.UserRoleEnum.SUPER_ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Get)("getGodDaughters"),
    __param(0, (0, users_decorator_1.User)()),
    __param(1, (0, common_1.Query)("page", common_1.ParseIntPipe, new common_1.DefaultValuePipe(0))),
    __param(2, (0, common_1.Query)("count", common_1.ParseIntPipe, new common_1.DefaultValuePipe(0))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.UserEntity, Number, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserGodDaughters", null);
__decorate([
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRoleEnum.SUPER_ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Get)(":id"),
    __param(0, (0, users_decorator_1.User)()),
    __param(1, (0, common_1.Param)("id", new is_valid_object_id_pipe_1.IsValidObjectIdPipe(user_entity_1.UserEntity))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.UserEntity, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getById", null);
__decorate([
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRoleEnum.SUPER_ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Get)(),
    __param(0, (0, users_decorator_1.User)()),
    __param(1, (0, common_1.Query)("page", new common_1.DefaultValuePipe(0))),
    __param(2, (0, common_1.Query)("count", new common_1.DefaultValuePipe(0))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.UserEntity, Number, Number]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUsers", null);
__decorate([
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRoleEnum.SUPER_ADMIN),
    (0, common_1.Patch)(":id"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Param)("id", new is_valid_object_id_pipe_1.IsValidObjectIdPipe(user_entity_1.UserEntity))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_dto_1.UpdateUserDto, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "userUpdateAccountControl", null);
__decorate([
    (0, common_1.Patch)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, users_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_dto_1.UpdateUserDto,
        user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateMyAcount", null);
__decorate([
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRoleEnum.USER, user_role_enum_1.UserRoleEnum.SUPER_ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Post)("change-password"),
    __param(0, (0, users_decorator_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.UserEntity,
        change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "changePassword", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map