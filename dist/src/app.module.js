"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const user_module_1 = require("./user/user.module");
const dotenv = require("dotenv");
const path_1 = require("path");
const platform_express_1 = require("@nestjs/platform-express");
const gateway_module_1 = require("./gateway/gateway.module");
const socket_module_1 = require("./socket/socket.module");
const auth_module_1 = require("./auth/auth.module");
const user_permission_module_1 = require("./user-permission/user-permission.module");
const casl_module_1 = require("./casl/casl.module");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const user_entity_1 = require("./user/entites/user.entity");
const game_round_module_1 = require("./game-round/game-round.module");
const player_bet_module_1 = require("./player-bet/player-bet.module");
const socket_gateway_1 = require("./socket/socket.gateway");
const payment_entity_1 = require("./payment/entities/payment.entity");
dotenv.config();
const MYSQL_ADDON_HOST = process.env.MYSQL_ADDON_HOST;
const MYSQL_ADDON_PORT = parseInt(process.env.MYSQL_ADDON_PORT);
const MYSQL_ADDON_USER = process.env.MYSQL_ADDON_USER;
const MYSQL_ADDON_PASSWORD = process.env.MYSQL_ADDON_PASSWORD;
const MYSQL_ADDON_DB = process.env.MYSQL_ADDON_DB;
const MYSQL_ADDON_URI = `mysql://${MYSQL_ADDON_USER}:${MYSQL_ADDON_PASSWORD}@${MYSQL_ADDON_HOST}:${MYSQL_ADDON_PORT}/${MYSQL_ADDON_DB}`;
let AppModule = class AppModule {
    configure(consumer) {
    }
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true, cache: true
            }),
            platform_express_1.MulterModule.register({
                dest: (0, path_1.join)(__dirname, '../uploads'),
            }),
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserEntity, payment_entity_1.PaymentEntity]),
            typeorm_1.TypeOrmModule.forRoot({
                type: "mysql",
                entities: ["dist/**/*.entity{.ts,.js}"],
                synchronize: true,
                url: MYSQL_ADDON_URI,
                subscribers: ["dist/**/*.subscriber{.ts,.js}"]
            }),
            throttler_1.ThrottlerModule.forRoot([
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
            gateway_module_1.GatewayModule,
            socket_module_1.SocketModule,
            auth_module_1.AuthModule,
            user_permission_module_1.UserPermissionModule,
            casl_module_1.CaslModule,
            user_module_1.UserModule,
            game_round_module_1.GameRoundModule,
            player_bet_module_1.PlayerBetModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService, socket_gateway_1.SocketsGateway,
            {
                provide: core_1.APP_GUARD,
                useClass: throttler_1.ThrottlerGuard
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map