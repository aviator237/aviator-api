import { Global, Module } from '@nestjs/common';
import { SocketService } from './socket.service';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from 'src/token-auth/strategy/passport-jwt.strategy';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/user/entites/user.entity';
import { SocketsGateway } from './socket.gateway';
import { PaymentEntity } from 'src/payment/entities/payment.entity';


@Global()
@Module({
  providers: [SocketService, JwtStrategy,],
  exports: [SocketService],
  imports: [
    TypeOrmModule.forFeature([UserEntity, PaymentEntity]),
  ]
})
export class SocketModule { }
