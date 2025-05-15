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
exports.PaymentController = void 0;
const common_1 = require("@nestjs/common");
const payment_service_1 = require("./payment.service");
const create_payment_dto_1 = require("./dto/create-payment.dto");
const users_decorator_1 = require("../decorators/users.decorator");
const user_entity_1 = require("../user/entites/user.entity");
const skip_auth_decorator_1 = require("../decorators/skip-auth.decorator");
const notchpay_guard_1 = require("../token-auth/Guard/notchpay.guard");
const user_role_enum_1 = require("../enum/user-role.enum");
const roles_guard_1 = require("../token-auth/Guard/roles.guard");
const roles_decorator_1 = require("../decorators/roles.decorator");
const create_transfert_dto_1 = require("./dto/create-transfert.dto");
const is_valid_object_id_pipe_1 = require("../pipes/is-valid-object-id.pipe");
const payment_entity_1 = require("./entities/payment.entity");
let PaymentController = class PaymentController {
    constructor(paymentService) {
        this.paymentService = paymentService;
    }
    async create(createPaymentDto, user) {
        return await this.paymentService.createPayment(createPaymentDto, user);
    }
    async transfer(createTransfertDto, user) {
        return await this.paymentService.createTransfer(createTransfertDto, user);
    }
    async handledWebhook(event, data) {
        return await this.paymentService.handledWebhook(event, data);
    }
    async findAll(page, count) {
        return await this.paymentService.findAll(page, count);
    }
    async getUserPayment(page, count, user) {
        return await this.paymentService.getUserPayment(user, page, count);
    }
    getReservationAmount() {
        return this.paymentService.getReservationAmount();
    }
    async findOne(id) {
        return await this.paymentService.findOne(id);
    }
};
exports.PaymentController = PaymentController;
__decorate([
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRoleEnum.USER, user_role_enum_1.UserRoleEnum.SUPER_ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, users_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_payment_dto_1.CreatePaymentDto,
        user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "create", null);
__decorate([
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRoleEnum.USER, user_role_enum_1.UserRoleEnum.SUPER_ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Post)("transfer"),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, users_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_transfert_dto_1.CreateTransfertDto,
        user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "transfer", null);
__decorate([
    (0, common_1.Post)("handledWebhook"),
    (0, skip_auth_decorator_1.SkipAuth)(),
    (0, common_1.UseGuards)(notchpay_guard_1.NotchPayGuard),
    __param(0, (0, common_1.Body)("event")),
    __param(1, (0, common_1.Body)("data")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "handledWebhook", null);
__decorate([
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRoleEnum.SUPER_ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)("page", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)("count", common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "findAll", null);
__decorate([
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRoleEnum.USER, user_role_enum_1.UserRoleEnum.SUPER_ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Get)("byUser"),
    __param(0, (0, common_1.Query)("page", common_1.ParseIntPipe)),
    __param(1, (0, common_1.Query)("count", common_1.ParseIntPipe)),
    __param(2, (0, users_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, user_entity_1.UserEntity]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "getUserPayment", null);
__decorate([
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRoleEnum.USER, user_role_enum_1.UserRoleEnum.SUPER_ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Get)("getReservationAmount"),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], PaymentController.prototype, "getReservationAmount", null);
__decorate([
    (0, roles_decorator_1.Roles)(user_role_enum_1.UserRoleEnum.USER, user_role_enum_1.UserRoleEnum.SUPER_ADMIN),
    (0, common_1.UseGuards)(roles_guard_1.RolesGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', new is_valid_object_id_pipe_1.IsValidObjectIdPipe(payment_entity_1.PaymentEntity))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PaymentController.prototype, "findOne", null);
exports.PaymentController = PaymentController = __decorate([
    (0, common_1.Controller)('payment'),
    __metadata("design:paramtypes", [payment_service_1.PaymentService])
], PaymentController);
//# sourceMappingURL=payment.controller.js.map