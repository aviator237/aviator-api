"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRoundModule = void 0;
const common_1 = require("@nestjs/common");
const game_round_service_1 = require("./game-round.service");
const game_round_controller_1 = require("./game-round.controller");
const typeorm_1 = require("@nestjs/typeorm");
const game_round_entity_1 = require("./entities/game-round.entity");
const socket_service_1 = require("../socket/socket.service");
const player_bet_service_1 = require("../player-bet/player-bet.service");
const player_bet_entity_1 = require("../player-bet/entities/player-bet.entity");
const user_entity_1 = require("../user/entites/user.entity");
let GameRoundModule = class GameRoundModule {
};
exports.GameRoundModule = GameRoundModule;
exports.GameRoundModule = GameRoundModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([game_round_entity_1.GameRoundEntity, player_bet_entity_1.PlayerBetEntity, user_entity_1.UserEntity]),
        ],
        controllers: [game_round_controller_1.GameRoundController],
        providers: [game_round_service_1.GameRoundService, socket_service_1.SocketService, player_bet_service_1.PlayerBetService],
    })
], GameRoundModule);
//# sourceMappingURL=game-round.module.js.map