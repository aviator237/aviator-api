import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { SubscribeMessage } from '@nestjs/websockets';
import { myGateWay } from './gateway';

@Module({
    providers: [myGateWay],
})
export class GatewayModule {}
