import { NestMiddleware } from '@nestjs/common';
export declare class FirstMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: () => void): void;
}
