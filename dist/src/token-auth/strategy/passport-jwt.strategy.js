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
exports.JwtStrategy = void 0;
const passport_jwt_1 = require("passport-jwt");
const passport_1 = require("@nestjs/passport");
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("typeorm");
const typeorm_2 = require("@nestjs/typeorm");
const user_entity_1 = require("../../user/entites/user.entity");
const user_enum_1 = require("../../enum/user.enum");
let JwtStrategy = class JwtStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy) {
    constructor(configService, userRepository) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get("SECRET"),
        });
        this.configService = configService;
        this.userRepository = userRepository;
    }
    async validate(payload) {
        const user = await this.userRepository.findOne({
            where: { id: payload.id }
        });
        console.log("utilisateur: ", user);
        if (user) {
            if (user.isBlocked) {
                throw new common_1.UnauthorizedException(user_enum_1.UserLoginStatusEnum.ACCOUNT_BLOCKED, { description: "Your account is blocked due to suspicious activity" });
            }
            return user;
        }
        else {
            throw new common_1.UnauthorizedException();
        }
    }
};
exports.JwtStrategy = JwtStrategy;
exports.JwtStrategy = JwtStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, typeorm_2.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        typeorm_1.Repository])
], JwtStrategy);
//# sourceMappingURL=passport-jwt.strategy.js.map