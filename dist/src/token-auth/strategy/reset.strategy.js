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
exports.ResetStrategy = void 0;
const passport_1 = require("@nestjs/passport");
const passport_jwt_1 = require("passport-jwt");
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../../user/entites/user.entity");
const typeorm_2 = require("typeorm");
const user_enum_1 = require("../../enum/user.enum");
let ResetStrategy = class ResetStrategy extends (0, passport_1.PassportStrategy)(passport_jwt_1.Strategy, 'jwt-reset') {
    constructor(userRepository) {
        super({
            jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.JWT_RESET_SECRET,
            passReqToCallback: true,
        });
        this.userRepository = userRepository;
    }
    async validate(payload) {
        const user = await this.userRepository.findOne({
            where: { id: payload.id }
        });
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
exports.ResetStrategy = ResetStrategy;
exports.ResetStrategy = ResetStrategy = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ResetStrategy);
//# sourceMappingURL=reset.strategy.js.map