"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var PlayerBetService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayerBetService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const game_round_entity_1 = require("../game-round/entities/game-round.entity");
const player_bet_entity_1 = require("./entities/player-bet.entity");
const user_entity_1 = require("../user/entites/user.entity");
const game_round_state_enum_1 = require("../enum/game-round-state.enum");
const socket_service_1 = require("../socket/socket.service");
const bet_status_enum_1 = require("../enum/bet-status.enum");
let PlayerBetService = PlayerBetService_1 = class PlayerBetService {
    constructor(playerBetRepository, gameRoundRepository, userRepository, socketService) {
        this.playerBetRepository = playerBetRepository;
        this.gameRoundRepository = gameRoundRepository;
        this.userRepository = userRepository;
        this.socketService = socketService;
    }
    async handleUserBet(createPlayerBetDto) {
        const round = await this.gameRoundRepository.findOne({ where: { id: createPlayerBetDto.roundId }, relations: { players: true } });
        console.log(round);
        if (!round) {
            this.socketService.sendBetDenied(createPlayerBetDto.userId, createPlayerBetDto.reference);
            return false;
        }
        const user = await this.userRepository.findOneBy({ id: createPlayerBetDto.userId });
        if (!user) {
            return false;
        }
        createPlayerBetDto.user = user;
        if (round.status !== game_round_state_enum_1.GameRoundStateEnum.INITIALISE) {
            PlayerBetService_1.waitingPlayers.push(createPlayerBetDto);
            this.socketService.sendBetWait(createPlayerBetDto.userId, createPlayerBetDto.reference);
            return false;
        }
        if (user.walletAmount < createPlayerBetDto.amount) {
            return false;
        }
        user.walletAmount -= createPlayerBetDto.amount;
        await this.userRepository.save(user);
        this.socketService.sendWalletAmount(user.id, user.walletAmount);
        const playerBet = await this.playerBetRepository.save(createPlayerBetDto);
        this.socketService.sendBetAccepted(createPlayerBetDto.userId, createPlayerBetDto.reference);
        round.players.push(playerBet);
        await this.gameRoundRepository.save(round);
        return true;
    }
    async handleUserStopWaitingBet(userId, reference) {
        for (let index = 0; index < PlayerBetService_1.waitingPlayers.length; index++) {
            const element = PlayerBetService_1.waitingPlayers[index];
            if (element.reference === reference) {
                PlayerBetService_1.waitingPlayers.splice(index, 1);
                this.socketService.sendWaitingBetStop(userId, reference);
                break;
            }
        }
    }
    async handleUserStopBet(userId, roundId) {
        console.log("BBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBBB");
        const user = await this.userRepository.findOneBy({ id: userId });
        if (!user) {
            return false;
        }
        console.log("TTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");
        const round = await this.gameRoundRepository.findOne({ where: { id: roundId }, relations: { players: { user: true } } });
        console.log(round);
        if (!round || round.status !== game_round_state_enum_1.GameRoundStateEnum.EN_COURS) {
            return false;
        }
        console.log("FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFF");
        const player = await this.playerBetRepository.findOneBy({ gameRound: { id: roundId }, user: { id: userId } });
        console.log(player);
        if (!player || player.status !== bet_status_enum_1.BetStatus.MISE) {
            return false;
        }
        var winAmount = player.amount * PlayerBetService_1.currentPercent;
        winAmount = parseFloat(winAmount.toFixed(2));
        user.walletAmount += winAmount;
        await this.userRepository.save(user);
        player.status = bet_status_enum_1.BetStatus.GAGNE;
        player.winAmount = winAmount;
        this.socketService.sendWalletAmount(user.id, user.walletAmount);
        const newPlayer = await this.playerBetRepository.save(player);
        this.socketService.sendBetStop(user.id, newPlayer);
        this.socketService.sendPlayerUpdate(newPlayer);
        return true;
    }
};
exports.PlayerBetService = PlayerBetService;
PlayerBetService.currentPercent = 1;
PlayerBetService.waitingPlayers = [];
exports.PlayerBetService = PlayerBetService = PlayerBetService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(player_bet_entity_1.PlayerBetEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(game_round_entity_1.GameRoundEntity)),
    __param(2, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository,
        socket_service_1.SocketService])
], PlayerBetService);
//# sourceMappingURL=player-bet.service.js.map