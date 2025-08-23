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
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _PaymentService_currency;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const nestjs_uuid_1 = require("nestjs-uuid");
const user_entity_1 = require("../user/entites/user.entity");
const payment_entity_1 = require("./entities/payment.entity");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_channel_enum_1 = require("../enum/payment-channel.enum");
const config_1 = require("@nestjs/config");
const payment_event_enum_1 = require("../enum/payment-event.enum");
const payment_status_enum_1 = require("../enum/payment-status.enum");
const socket_service_1 = require("../socket/socket.service");
let PaymentService = class PaymentService {
    constructor(paymentRepository, userEntityRepository, uuidService, configService) {
        this.paymentRepository = paymentRepository;
        this.userEntityRepository = userEntityRepository;
        this.uuidService = uuidService;
        this.configService = configService;
        _PaymentService_currency.set(this, void 0);
        __classPrivateFieldSet(this, _PaymentService_currency, "XAF", "f");
    }
    async createPayment(createPaymentDto, user) {
        try {
            const nestReference = this.uuidService.generate({ version: 4 });
            const response = await this.initializeMobilePayment(createPaymentDto.phoneNumber, createPaymentDto.amount, __classPrivateFieldGet(this, _PaymentService_currency, "f"), createPaymentDto.raison, nestReference);
            const newPayment = this.paymentRepository.create(createPaymentDto);
            newPayment.notchPayReference = response.transaction.reference;
            newPayment.user = user;
            newPayment.nestReference = nestReference;
            newPayment.isIncoming = true;
            newPayment.status = payment_status_enum_1.PaymentStatus.INITIALISE;
            this.paymentRepository.save(newPayment);
            const result = await this.makePayment(response.transaction.reference, payment_channel_enum_1.PaymentChannel.MTN_OR_ORANGE_MONEY_CM, createPaymentDto.phoneNumber);
            return {
                "result": result,
                "reference": response.transaction.reference
            };
        }
        catch (error) {
            throw new common_1.BadRequestException();
        }
    }
    async createTransfer(createTransfertDto, user) {
        try {
            const nestReference = this.uuidService.generate({ version: 4 });
            let recipientId;
            if (!user.notchRecipientId) {
                const response = await this.createRecipiant(payment_channel_enum_1.PaymentChannel.MTN_OR_ORANGE_MONEY_CM, createTransfertDto.phoneNumber, createTransfertDto.phoneNumber, "CM", user.lastName + " " + user.firstName, createTransfertDto.raison, nestReference, user.email);
                recipientId = response.recipient.id;
                user.notchRecipientId = response.recipient.id;
                this.userEntityRepository.save(user);
            }
            else {
                recipientId = user.notchRecipientId;
            }
            const notchFeePercent = 2;
            var exactAmountToTransfer = createTransfertDto.amount - createTransfertDto.amount * notchFeePercent / 100;
            exactAmountToTransfer = Math.floor(exactAmountToTransfer);
            const newPayment = this.paymentRepository.create(createTransfertDto);
            newPayment.user = user;
            newPayment.notchPayReference = recipientId;
            newPayment.nestReference = nestReference;
            newPayment.isIncoming = false;
            newPayment.status = payment_status_enum_1.PaymentStatus.INITIALISE;
            user.walletAmount -= createTransfertDto.amount;
            await this.userEntityRepository.save(user);
            this.paymentRepository.save(newPayment);
            const result = await this.initializeTransfert(recipientId, exactAmountToTransfer, __classPrivateFieldGet(this, _PaymentService_currency, "f"), createTransfertDto.raison);
            return {
                "result": result,
            };
        }
        catch (error) {
            throw new common_1.BadRequestException();
        }
    }
    async createRecipiant(channel, number, phone, country, name, description, nestReference, email) {
        const data = {
            channel,
            number,
            phone,
            country,
            description,
            reference: nestReference,
            name,
            email
        };
        try {
            const response = await axios_1.default.post('https://api.notchpay.co/recipients', data, {
                headers: {
                    Authorization: process.env.NOTCH_PAY_PUBLIC_API_KEY,
                    "X-Grant": process.env.NOTCH_PAY_PRIVATE_API_KEY,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        }
        catch (error) {
            console.error('Erreur lors de la creation du beneficiaire:', error);
            throw error;
        }
    }
    async initializeTransfert(recipient, amount, currency, description) {
        const data = { amount, currency, description, recipient };
        try {
            const response = await axios_1.default.post('https://api.notchpay.co/transfers', data, {
                headers: {
                    Authorization: process.env.NOTCH_PAY_PUBLIC_API_KEY,
                    "X-Grant": process.env.NOTCH_PAY_PRIVATE_API_KEY,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        }
        catch (error) {
            console.error('Erreur lors de l\'initialisation du transfert:', error);
            throw error;
        }
    }
    async initializeMobilePayment(phone, amount, currency, description, nestReference) {
        const data = { amount, reference: nestReference, currency, description, customer: { phone } };
        try {
            const response = await axios_1.default.post('https://api.notchpay.co/payments/initialize', data, {
                headers: {
                    Authorization: process.env.NOTCH_PAY_PUBLIC_API_KEY,
                    'Content-Type': 'application/json',
                },
            });
            return response.data;
        }
        catch (error) {
            console.error('Erreur lors de l\'initialisation du paiement:', error);
            throw error;
        }
    }
    async makePayment(reference, channel, phone) {
        const data = { channel, data: { phone } };
        try {
            const response = await axios_1.default.put(`https://api.notchpay.co/payments/${reference}`, data, {
                headers: {
                    Authorization: process.env.NOTCH_PAY_PUBLIC_API_KEY,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            });
            return response.data;
        }
        catch (error) {
            throw error;
        }
    }
    async findAll(page, count) {
        return await this.paymentRepository.find({ skip: page * count, take: count, order: { createAt: "DESC" } });
    }
    async getUserPayment(user, page, count) {
        return await this.paymentRepository.find({ where: { user: { id: user.id } }, order: { createAt: "DESC" }, skip: page * count, take: count });
    }
    async handledWebhook(event, data) {
        console.log(data);
        const expectedPayment = await this.paymentRepository.findOne({ where: { notchPayReference: data.reference }, relations: { user: true } });
        if (expectedPayment) {
            if (expectedPayment.status === payment_event_enum_1.NotchPayPaymentEvent.PAYMENT_COMPLETE || expectedPayment.status === payment_event_enum_1.NotchPayPaymentEvent.TRANSFERT_COMPLETE) {
                return;
            }
            expectedPayment.status = data.status;
            expectedPayment.geo = data.geo;
            expectedPayment.fee = data.fee;
            this.paymentRepository.save(expectedPayment);
            const socketService = new socket_service_1.SocketService();
            switch (event) {
                case payment_event_enum_1.NotchPayPaymentEvent.PAYMENT_COMPLETE:
                    expectedPayment.user.walletAmount += expectedPayment.amount;
                    this.userEntityRepository.save(expectedPayment.user);
                    await socketService.sendPaymentUpdate(expectedPayment.user.id, expectedPayment);
                    await socketService.sendWalletAmount(expectedPayment.user.id, { "walletAmount": expectedPayment.user.walletAmount, "unwithdrawableWalletAmount": expectedPayment.user.unwithdrawableWalletAmount });
                    break;
                case payment_event_enum_1.NotchPayPaymentEvent.TRANSFERT_COMPLETE:
                    await socketService.sendPaymentUpdate(expectedPayment.user.id, expectedPayment);
                    await socketService.sendWalletAmount(expectedPayment.user.id, { "walletAmount": expectedPayment.user.walletAmount, "unwithdrawableWalletAmount": expectedPayment.user.unwithdrawableWalletAmount });
                    this.userEntityRepository.save(expectedPayment.user);
                    break;
                case payment_event_enum_1.NotchPayPaymentEvent.TRANSFERT_ECHOUE:
                    expectedPayment.user.walletAmount += expectedPayment.amount;
                    this.userEntityRepository.save(expectedPayment.user);
                    await socketService.sendPaymentUpdate(expectedPayment.user.id, expectedPayment);
                    await socketService.sendWalletAmount(expectedPayment.user.id, { "walletAmount": expectedPayment.user.walletAmount, "unwithdrawableWalletAmount": expectedPayment.user.unwithdrawableWalletAmount });
                    break;
                case payment_event_enum_1.NotchPayPaymentEvent.PAYMENT_ECHOUE:
                    await socketService.sendPaymentUpdate(expectedPayment.user.id, expectedPayment);
                    break;
                case payment_event_enum_1.NotchPayPaymentEvent.PAYMENT_REMBOURSE_AU_CLIENT:
                    expectedPayment.user.walletAmount -= expectedPayment.amount;
                    this.userEntityRepository.save(expectedPayment.user);
                    await socketService.sendPaymentUpdate(expectedPayment.user.id, expectedPayment);
                    await socketService.sendWalletAmount(expectedPayment.user.id, { "walletAmount": expectedPayment.user.walletAmount, "unwithdrawableWalletAmount": expectedPayment.user.unwithdrawableWalletAmount });
                    break;
                default:
                    break;
            }
        }
        return {
            "status": "ok"
        };
    }
    getReservationAmount() {
        return this.configService.get('TICKET_RESERVATION_PERCENT');
    }
    async findOne(id) {
        return await this.paymentRepository.findOneBy({ id: id });
    }
    update(id, updatePaymentDto) {
        return `This action updates a #${id} payment`;
    }
    remove(id) {
        return `This action removes a #${id} payment`;
    }
};
exports.PaymentService = PaymentService;
_PaymentService_currency = new WeakMap();
exports.PaymentService = PaymentService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.PaymentEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        nestjs_uuid_1.UuidService,
        config_1.ConfigService])
], PaymentService);
//# sourceMappingURL=payment.service.js.map