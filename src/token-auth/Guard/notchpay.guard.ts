import { Injectable, CanActivate, ExecutionContext, ForbiddenException, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class NotchPayGuard implements CanActivate {
    private readonly secretKey = process.env.NOTCH_PAY_HASH_CODE;

    canActivate(context: ExecutionContext): boolean {
        const request = context.switchToHttp().getRequest<Request>();
        const signature = request.headers['x-notch-signature'] as string;
        const payload = JSON.stringify(request.body);
        if (this.verifySignature(payload, signature)) {
            return true; // Authentification réussie
        } else if (!signature) {
            throw new UnauthorizedException();
        } else {
            throw new ForbiddenException('Invalid NotchPay signature');
        }
    }

    private verifySignature(payload: string, signature: string): boolean {
        const hash = crypto
            .createHmac('sha256', this.secretKey) // Utilisez SHA256
            .update(payload)
            .digest('hex');
        return hash === signature; // Compare la signature calculée avec celle reçue
    }
}
