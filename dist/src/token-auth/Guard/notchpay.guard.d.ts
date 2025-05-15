import { CanActivate, ExecutionContext } from '@nestjs/common';
export declare class NotchPayGuard implements CanActivate {
    private readonly secretKey;
    canActivate(context: ExecutionContext): boolean;
    private verifySignature;
}
