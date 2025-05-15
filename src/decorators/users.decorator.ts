import { createParamDecorator, ExecutionContext } from '@nestjs/common';


//Decorateur recuperable par @User
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);