"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotchPayGuard = void 0;
const common_1 = require("@nestjs/common");
const crypto = require("crypto");
let NotchPayGuard = class NotchPayGuard {
    constructor() {
        this.secretKey = process.env.NOTCH_PAY_HASH_CODE;
    }
    canActivate(context) {
        const request = context.switchToHttp().getRequest();
        const signature = request.headers['x-notch-signature'];
        const payload = JSON.stringify(request.body);
        if (this.verifySignature(payload, signature)) {
            return true;
        }
        else if (!signature) {
            throw new common_1.UnauthorizedException();
        }
        else {
            throw new common_1.ForbiddenException('Invalid NotchPay signature');
        }
    }
    verifySignature(payload, signature) {
        const hash = crypto
            .createHmac('sha256', this.secretKey)
            .update(payload)
            .digest('hex');
        return hash === signature;
    }
};
exports.NotchPayGuard = NotchPayGuard;
exports.NotchPayGuard = NotchPayGuard = __decorate([
    (0, common_1.Injectable)()
], NotchPayGuard);
//# sourceMappingURL=notchpay.guard.js.map