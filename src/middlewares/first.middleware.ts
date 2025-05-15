import { Injectable, NestMiddleware } from '@nestjs/common';

@Injectable()
export class FirstMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: () => void) {
    console.log("je suis le first middleware")
    next();
  }
}
