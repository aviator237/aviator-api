import { QrcodeManagerService } from './qrcode-manager.service';
export declare class QrcodeManagerController {
    private readonly qrCodeService;
    constructor(qrCodeService: QrcodeManagerService);
    generateQrCode(data: string): Promise<any>;
}
