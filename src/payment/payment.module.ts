import { Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { UuidModule, UuidService } from 'nestjs-uuid';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaymentEntity } from './entities/payment.entity';
import { UserModule } from 'src/user/user.module';
import { UserEntity } from 'src/user/entites/user.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([PaymentEntity, UserEntity]),
    UuidModule, UserModule, ConfigModule],
  controllers: [PaymentController],
  providers: [PaymentService, UuidService],
})
export class PaymentModule { }
