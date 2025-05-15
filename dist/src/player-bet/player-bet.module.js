"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerBetModule = void 0;
const common_1 = require("@nestjs/common");
const player_bet_service_1 = require("./player-bet.service");
const player_bet_controller_1 = require("./player-bet.controller");
const typeorm_1 = require("@nestjs/typeorm");
const player_bet_entity_1 = require("./entities/player-bet.entity");
const game_round_entity_1 = require("../game-round/entities/game-round.entity");
const user_entity_1 = require("../user/entites/user.entity");
const socket_service_1 = require("../socket/socket.service");
let PlayerBetModule = class PlayerBetModule {
};
exports.PlayerBetModule = PlayerBetModule;
exports.PlayerBetModule = PlayerBetModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([player_bet_entity_1.PlayerBetEntity, game_round_entity_1.GameRoundEntity, user_entity_1.UserEntity]),
        ],
        controllers: [player_bet_controller_1.PlayerBetController],
        providers: [player_bet_service_1.PlayerBetService, socket_service_1.SocketService],
        exports: [player_bet_service_1.PlayerBetService]
    })
], PlayerBetModule);
//# sourceMappingURL=player-bet.module.js.map