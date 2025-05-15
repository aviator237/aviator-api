import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../../decorators/skip-auth.decorator';

@Injectable()
export class JwtResetGuard extends AuthGuard('jwt-reset') { }


