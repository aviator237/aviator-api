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
exports.QrcodeManagerController = void 0;
const common_1 = require("@nestjs/common");
const qrcode_manager_service_1 = require("./qrcode-manager.service");
let QrcodeManagerController = class QrcodeManagerController {
    constructor(qrCodeService) {
        this.qrCodeService = qrCodeService;
    }
    async generateQrCode(data) {
        const qrCodeDataURL = await this.qrCodeService.generateQrCode("qr-code", data);
        return qrCodeDataURL;
    }
};
exports.QrcodeManagerController = QrcodeManagerController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], QrcodeManagerController.prototype, "generateQrCode", null);
exports.QrcodeManagerController = QrcodeManagerController = __decorate([
    (0, common_1.Controller)('qrcode-manager'),
    __metadata("design:paramtypes", [qrcode_manager_service_1.QrcodeManagerService])
], QrcodeManagerController);
//# sourceMappingURL=qrcode-manager.controller.js.map