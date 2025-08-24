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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserEntity = void 0;
const timestamp_entities_1 = require("../../../generics/timestamp.entities");
const auth_login_entity_1 = require("../../auth/entities/auth-login.entity");
const user_lang_enum_1 = require("../../enum/user-lang.enum");
const user_role_enum_1 = require("../../enum/user-role.enum");
const payment_entity_1 = require("../../payment/entities/payment.entity");
const player_bet_entity_1 = require("../../player-bet/entities/player-bet.entity");
const typeorm_1 = require("typeorm");
let UserEntity = class UserEntity extends timestamp_entities_1.TimestampEntities {
};
exports.UserEntity = UserEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)({ generated: "uuid" }),
    __metadata("design:type", String)
], UserEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        unique: false,
        length: 30,
        nullable: true
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "userName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        unique: true,
        length: 50,
        nullable: true
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 50,
        nullable: true
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "firstName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 50,
        nullable: true
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "lastName", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: user_role_enum_1.UserRoleEnum,
        default: user_role_enum_1.UserRoleEnum.USER,
        nullable: false
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "role", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "enum",
        enum: user_lang_enum_1.UserLangEnum,
        default: user_lang_enum_1.UserLangEnum.FRANCAIS,
        nullable: false
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "lang", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: false,
        nullable: false
    }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isActive", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: false,
        nullable: false
    }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isBlocked", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 200,
        nullable: true
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "notchRecipientId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 200,
        nullable: true
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "password", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 50,
        nullable: true
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "salt", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 15,
        nullable: false
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        type: "text"
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "notificationId", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "referalCode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
    }),
    __metadata("design:type", String)
], UserEntity.prototype, "specialReferalCode", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true
    }),
    __metadata("design:type", Date)
], UserEntity.prototype, "lastLogin", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: false
    }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isOnline", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: false
    }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "isLoggedOut", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: false
    }),
    __metadata("design:type", Boolean)
], UserEntity.prototype, "alreadyMakeFirstDeposite", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "float",
        default: 0
    }),
    __metadata("design:type", Number)
], UserEntity.prototype, "walletAmount", void 0);
__decorate([
    (0, typeorm_1.Column)({
        type: "float",
        default: 0
    }),
    __metadata("design:type", Number)
], UserEntity.prototype, "unwithdrawableWalletAmount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => UserEntity, (user) => user.goddaughters),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", UserEntity)
], UserEntity.prototype, "godfather", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => UserEntity, (user) => user.godfather),
    __metadata("design:type", Array)
], UserEntity.prototype, "goddaughters", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payment_entity_1.PaymentEntity, (payment) => payment.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "payments", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => player_bet_entity_1.PlayerBetEntity, (bet) => bet.user),
    __metadata("design:type", Array)
], UserEntity.prototype, "bets", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => auth_login_entity_1.AuthLoginEntity, (authLogin) => authLogin.user),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", auth_login_entity_1.AuthLoginEntity)
], UserEntity.prototype, "authLogin", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => payment_entity_1.PaymentEntity, (payment) => payment.trasnferFromOrToUser),
    __metadata("design:type", Array)
], UserEntity.prototype, "transfers", void 0);
exports.UserEntity = UserEntity = __decorate([
    (0, typeorm_1.Entity)("myuser")
], UserEntity);
//# sourceMappingURL=user.entity.js.map