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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../user/entites/user.entity");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcrypt");
const socket_service_1 = require("../socket/socket.service");
const user_enum_1 = require("../enum/user.enum");
const jwt_1 = require("@nestjs/jwt");
const user_role_enum_1 = require("../enum/user-role.enum");
const auth_login_entity_1 = require("./entities/auth-login.entity");
const user_account_create_status_enum_1 = require("../enum/user-account-create-status.enum");
const user_lang_enum_1 = require("../enum/user-lang.enum");
const config_1 = require("@nestjs/config");
let AuthService = class AuthService {
    constructor(authLoginRepository, userRepository, socketService, jwtService, configService) {
        this.authLoginRepository = authLoginRepository;
        this.userRepository = userRepository;
        this.socketService = socketService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async create(userData, next) {
        var _a;
        console.log("MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM");
        const status = user_account_create_status_enum_1.userAccountCreateStatus.ACCOUNT_SUCCESSFUL_CREATE;
        const expectedUserWithPhone = await this.userRepository.findOneBy({ phoneNumber: userData.phoneNumber });
        if (expectedUserWithPhone) {
            throw new common_1.BadRequestException({ "status": user_account_create_status_enum_1.userAccountCreateStatus.DUPLICATE_PHONE_NUMBER });
        }
        if (userData.userName) {
            const expectedUserWithUserName = await this.userRepository.findOneBy({ userName: userData.userName });
            if (expectedUserWithUserName) {
                throw new common_1.BadRequestException({ "status": user_account_create_status_enum_1.userAccountCreateStatus.DUPLICATE_USER_NAME });
            }
        }
        else {
            userData.userName = userData.phoneNumber;
        }
        (_a = userData.lang) !== null && _a !== void 0 ? _a : (userData.lang = user_lang_enum_1.UserLangEnum.FRANCAIS);
        const user = this.userRepository.create(Object.assign({}, userData));
        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password, user.salt);
        user.role = user_role_enum_1.UserRoleEnum.USER;
        user.isActive = true;
        let newUser = await this.userRepository.save(user);
        const randomCode = Math.floor(100 + Math.random() * 90).toString();
        newUser.referalCode = randomCode.toString() + newUser.id.toString().substring(1, 6);
        newUser = await this.userRepository.save(newUser);
        return {
            "user": newUser,
            "status": status,
        };
    }
    async login(loginCredentialsDto) {
        try {
            const user = await this.userRepository.findOne({ where: [{ phoneNumber: loginCredentialsDto.login }, { userName: loginCredentialsDto.login }] });
            if (user) {
                if (!user.isBlocked) {
                    const password = await bcrypt.hash(loginCredentialsDto.password, user.salt);
                    if (password === user.password) {
                        if (user.role == user_role_enum_1.UserRoleEnum.SUPER_ADMIN || user.role == user_role_enum_1.UserRoleEnum.USER) {
                            const payload = {
                                id: user.id,
                                role: user.role
                            };
                            user.lastLogin = new Date();
                            user.isLoggedOut = false;
                            const [accessToken, refreshToken] = await this.getTokens(payload);
                            this.userRepository.save(user);
                            const { password } = user, rest = __rest(user, ["password"]);
                            const expectedAuthLogin = await this.authLoginRepository.findOneBy({ user: { id: user.id } });
                            if (expectedAuthLogin) {
                                this.authLoginRepository.delete(expectedAuthLogin.id);
                            }
                            return {
                                "status": user_enum_1.UserLoginStatusEnum.LOGIN_SUCCESSFULY,
                                "user": rest,
                                "access_token": accessToken,
                                "refresh_token": refreshToken
                            };
                        }
                        else {
                            throw new common_1.UnauthorizedException();
                        }
                    }
                    else {
                        const expectedAuthLogin = await this.authLoginRepository.findOneBy({ user: { id: user.id } });
                        if (expectedAuthLogin) {
                            if (expectedAuthLogin.loginCount >= parseInt(process.env.MAX_LOGIN_FAIL_COUNT)) {
                                user.isBlocked = true;
                                this.userRepository.save(user);
                                throw new common_1.UnauthorizedException(user_enum_1.UserLoginStatusEnum.ACCOUNT_BLOCKED, { description: "Your account is blocked due to suspicious activity" });
                            }
                            this.authLoginRepository.increment({ id: expectedAuthLogin.id }, "loginCount", 1);
                        }
                        else {
                            this.authLoginRepository.save({ loginCount: 1, user: user });
                        }
                        return {
                            "status": user_enum_1.UserLoginStatusEnum.WRONG_PASSWORD
                        };
                    }
                }
                else {
                    throw new common_1.UnauthorizedException(user_enum_1.UserLoginStatusEnum.ACCOUNT_BLOCKED, { description: "Your account is blocked due to suspicious activity" });
                }
            }
            else {
                return {
                    "status": user_enum_1.UserLoginStatusEnum.ACCOUNT_DOESNT_EXIST
                };
            }
        }
        catch (e) {
            console.log(e);
            throw new common_1.BadRequestException(e);
        }
        ;
    }
    async generateUserName(userCreateDto) {
        let userName = userCreateDto.lastName.replace(" ", "") + userCreateDto.firstName.replace(" ", "");
        let expectedUser = await this.userRepository.findOneBy({ userName: userName });
        if (expectedUser) {
            let i = 1;
            while (expectedUser) {
                userName = userName + (i++).toString();
                expectedUser = await this.userRepository.findOne({ where: { userName: userName }, withDeleted: true });
            }
        }
        return userName;
    }
    async getTokens(payload) {
        const access_token = await this.jwtService.signAsync(payload);
        const refresh_token = await this.jwtService.signAsync(payload, {
            secret: this.configService.get('JWT_REFRESH_SECRET'),
            expiresIn: '60d',
        });
        return [access_token, refresh_token];
    }
    async refreshTokens(user) {
        const [accessToken, refreshToken] = await this.getTokens({ id: user.id, role: user.role });
        return {
            "access_token": accessToken,
            "refresh_token": refreshToken
        };
    }
    async logout(user) {
        try {
            user.isLoggedOut = true;
            await this.userRepository.save(user);
            return {
                "status": "success",
                "message": "Déconnexion réussie"
            };
        }
        catch (error) {
            throw new common_1.BadRequestException("Erreur lors de la déconnexion");
        }
    }
    async resetPassword(user, newPassword) {
        try {
            const isSamePassword = await bcrypt.compare(newPassword, user.password);
            if (isSamePassword) {
                throw new common_1.BadRequestException("New password must be different from the old password");
            }
            user.salt = await bcrypt.genSalt();
            user.password = await bcrypt.hash(newPassword, user.salt);
            await this.userRepository.save(user);
            return { status: "ok" };
        }
        catch (e) {
            throw new common_1.BadRequestException(e);
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(auth_login_entity_1.AuthLoginEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        socket_service_1.SocketService,
        jwt_1.JwtService,
        config_1.ConfigService])
], AuthService);
//# sourceMappingURL=auth.service.js.map