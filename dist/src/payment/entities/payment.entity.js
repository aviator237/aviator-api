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
exports.PaymentEntity = void 0;
const timestamp_entities_1 = require("../../../generics/timestamp.entities");
const payment_raison_enum_1 = require("../../enum/payment-raison.enum");
const payment_type_enum_1 = require("../../enum/payment-type.enum");
const payment_channel_enum_1 = require("../../enum/payment-channel.enum");
const user_entity_1 = require("../../user/entites/user.entity");
const typeorm_1 = require("typeorm");
let PaymentEntity = class PaymentEntity extends timestamp_entities_1.TimestampEntities {
};
exports.PaymentEntity = PaymentEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], PaymentEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: false,
        enum: payment_raison_enum_1.PaymentRaison,
        type: "enum",
        default: payment_raison_enum_1.PaymentRaison.RECHARGE_DU_COMTE
    }),
    __metadata("design:type", String)
], PaymentEntity.prototype, "raison", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 255,
        nullable: true
    }),
    __metadata("design:type", String)
], PaymentEntity.prototype, "nestReference", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 255,
        nullable: true
    }),
    __metadata("design:type", String)
], PaymentEntity.prototype, "geo", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        type: "float"
    }),
    __metadata("design:type", Number)
], PaymentEntity.prototype, "fee", void 0);
__decorate([
    (0, typeorm_1.Column)({
        default: false
    }),
    __metadata("design:type", Boolean)
], PaymentEntity.prototype, "isIncoming", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 255,
        nullable: true
    }),
    __metadata("design:type", String)
], PaymentEntity.prototype, "notchPayReference", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 50,
        nullable: true
    }),
    __metadata("design:type", String)
], PaymentEntity.prototype, "status", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: true,
        type: "enum",
        enum: payment_channel_enum_1.PaymentChannel,
        default: payment_channel_enum_1.PaymentChannel.MTN_OR_ORANGE_MONEY_CM
    }),
    __metadata("design:type", String)
], PaymentEntity.prototype, "paymentChannel", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: false,
        type: "enum",
        enum: payment_type_enum_1.PaymentType,
        default: payment_type_enum_1.PaymentType.PAR_MOBILE
    }),
    __metadata("design:type", String)
], PaymentEntity.prototype, "paymentType", void 0);
__decorate([
    (0, typeorm_1.Column)({
        length: 50,
        nullable: true
    }),
    __metadata("design:type", String)
], PaymentEntity.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({
        nullable: false,
        type: "float"
    }),
    __metadata("design:type", Number)
], PaymentEntity.prototype, "amount", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.UserEntity, (user) => user.payments),
    (0, typeorm_1.JoinColumn)(),
    __metadata("design:type", user_entity_1.UserEntity)
], PaymentEntity.prototype, "user", void 0);
exports.PaymentEntity = PaymentEntity = __decorate([
    (0, typeorm_1.Entity)("payment")
], PaymentEntity);
//# sourceMappingURL=payment.entity.js.map