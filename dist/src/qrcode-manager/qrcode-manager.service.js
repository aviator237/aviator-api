"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrcodeManagerService = void 0;
const common_1 = require("@nestjs/common");
const QRCode = require('qrcode');
const fs = require("fs");
const qrcode_1 = require("qrcode");
let QrcodeManagerService = class QrcodeManagerService {
    async generateQrCode(path, data) {
        try {
            const qrCode = await QRCode.toFile(path, data, {
                color: {
                    dark: '#000',
                    light: '#FFF'
                }
            }).then(url => {
                console.log(url);
            });
            const writeStream = fs.createWriteStream(path);
            const mqrCode = await (0, qrcode_1.toFileStream)(writeStream, data, {
                color: {
                    dark: '#000',
                    light: '#FFF'
                }
            }, function (err) {
                console.log(err);
                if (err)
                    throw err;
            });
            console.log(mqrCode);
            return qrCode;
        }
        catch (error) {
            console.log(error);
            throw new Error('Failed to generate QR code.');
        }
    }
};
exports.QrcodeManagerService = QrcodeManagerService;
exports.QrcodeManagerService = QrcodeManagerService = __decorate([
    (0, common_1.Injectable)()
], QrcodeManagerService);
//# sourceMappingURL=qrcode-manager.service.js.map