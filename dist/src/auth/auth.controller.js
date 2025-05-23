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
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./auth.service");
const login_credentials_dto_1 = require("../user/dto/login-credentials.dto");
const User_subscribe_dto_1 = require("../user/dto/User-subscribe.dto");
const skip_auth_decorator_1 = require("../decorators/skip-auth.decorator");
const refresh_token_guard_1 = require("../token-auth/Guard/refresh-token.guard");
const users_decorator_1 = require("../decorators/users.decorator");
const user_entity_1 = require("../user/entites/user.entity");
let AuthController = class AuthController {
    constructor(authService) {
        this.authService = authService;
    }
    async login(loginData) {
        return await this.authService.login(loginData);
    }
    async userCreateAccount(userdata, next) {
        return await this.authService.create(userdata, next);
    }
    async refresh(user) {
        return await this.authService.refreshTokens(user);
    }
    async logout(user) {
        return await this.authService.logout(user);
    }
};
exports.AuthController = AuthController;
__decorate([
    (0, skip_auth_decorator_1.SkipAuth)(),
    (0, common_1.Post)("login"),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [login_credentials_dto_1.LoginCredentialsDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    (0, skip_auth_decorator_1.SkipAuth)(),
    (0, common_1.Post)("create"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Query)("next")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [User_subscribe_dto_1.UserSubscribeDto, String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "userCreateAccount", null);
__decorate([
    (0, skip_auth_decorator_1.SkipAuth)(),
    (0, common_1.UseGuards)(refresh_token_guard_1.RefreshTokenGuard),
    (0, common_1.Get)("refresh"),
    __param(0, (0, users_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "refresh", null);
__decorate([
    (0, common_1.Post)("logout"),
    __param(0, (0, users_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "logout", null);
exports.AuthController = AuthController = __decorate([
    (0, common_1.Controller)('auth'),
    __metadata("design:paramtypes", [auth_service_1.AuthService])
], AuthController);
//# sourceMappingURL=auth.controller.js.map