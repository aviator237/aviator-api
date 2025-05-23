"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentModule = void 0;
const common_1 = require("@nestjs/common");
const payment_service_1 = require("./payment.service");
const payment_controller_1 = require("./payment.controller");
const nestjs_uuid_1 = require("nestjs-uuid");
const typeorm_1 = require("@nestjs/typeorm");
const payment_entity_1 = require("./entities/payment.entity");
const user_module_1 = require("../user/user.module");
const user_entity_1 = require("../user/entites/user.entity");
const config_1 = require("@nestjs/config");
let PaymentModule = class PaymentModule {
};
exports.PaymentModule = PaymentModule;
exports.PaymentModule = PaymentModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([payment_entity_1.PaymentEntity, user_entity_1.UserEntity]),
            nestjs_uuid_1.UuidModule, user_module_1.UserModule, config_1.ConfigModule
        ],
        controllers: [payment_controller_1.PaymentController],
        providers: [payment_service_1.PaymentService, nestjs_uuid_1.UuidService],
    })
], PaymentModule);
//# sourceMappingURL=payment.module.js.map