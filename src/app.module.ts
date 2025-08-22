// import { HelmetMiddleware } from '@nest-middlewares/helmet';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from "@nestjs/typeorm"
import { UserModule } from './user/user.module';
import * as dotenv from "dotenv";
import { join } from 'path';
import { MulterModule } from '@nestjs/platform-express';
import { GatewayModule } from './gateway/gateway.module';
import { SocketModule } from './socket/socket.module';
import { AuthModule } from './auth/auth.module';
import { UserPermissionModule } from './user-permission/user-permission.module';
import { CaslModule } from './casl/casl.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { UserEntity } from './user/entites/user.entity';
import { GameRoundModule } from './game-round/game-round.module';
import { PlayerBetModule } from './player-bet/player-bet.module';
import { SocketsGateway } from './socket/socket.gateway';
import { PaymentEntity } from './payment/entities/payment.entity';
import { PaymentModule } from './payment/payment.module';

dotenv.config()

const MYSQL_ADDON_HOST = process.env.MYSQL_ADDON_HOST
const MYSQL_ADDON_PORT = parseInt(process.env.MYSQL_ADDON_PORT)
const MYSQL_ADDON_USER = process.env.MYSQL_ADDON_USER
const MYSQL_ADDON_PASSWORD = process.env.MYSQL_ADDON_PASSWORD
const MYSQL_ADDON_DB = process.env.MYSQL_ADDON_DB

const MYSQL_ADDON_URI = `mysql://${MYSQL_ADDON_USER}:${MYSQL_ADDON_PASSWORD}@${MYSQL_ADDON_HOST}:${MYSQL_ADDON_PORT}/${MYSQL_ADDON_DB}`


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, cache: true
    }),
    MulterModule.register({
      dest: join(__dirname, '../uploads'),
      // dest: '../files',
      // storage: 
    }),
    TypeOrmModule.forFeature([UserEntity, PaymentEntity]),
    TypeOrmModule.forRoot({
      type: "mysql",
      entities: ["dist/**/*.entity{.ts,.js}"],
      synchronize: true,
      url: MYSQL_ADDON_URI,
      cache: {
        duration: 100 // 100 milliseconds
      },
      // migrations: ["dist/migration/*{.ts,.js}"],
      //
      subscribers: ["dist/**/*.subscriber{.ts,.js}"]
      // debug: true,
      // migrationsRun: true,
    }),

    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,
        limit: 3,
      },
      {
        name: 'medium',
        ttl: 10000,
        limit: 20
      },
      {
        name: 'long',
        ttl: 60000,
        limit: 100
      }
    ]),

    GatewayModule,
    SocketModule,
    AuthModule,
    UserPermissionModule,
    CaslModule,
    UserModule,
    GameRoundModule,
    PlayerBetModule,
    PaymentModule,
  ],
  controllers: [AppController],
  providers: [AppService, SocketsGateway,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    },

  ],
})

export class AppModule implements NestModule {

  configure(consumer: MiddlewareConsumer) {

  }
}
