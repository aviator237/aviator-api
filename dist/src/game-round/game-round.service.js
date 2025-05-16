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
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameRoundService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const game_round_entity_1 = require("./entities/game-round.entity");
const typeorm_2 = require("typeorm");
const socket_service_1 = require("../socket/socket.service");
const game_round_state_enum_1 = require("../enum/game-round-state.enum");
const player_bet_service_1 = require("../player-bet/player-bet.service");
let GameRoundService = class GameRoundService {
    constructor(gameRoundRepository, socketService, playerBetService) {
        this.gameRoundRepository = gameRoundRepository;
        this.socketService = socketService;
        this.playerBetService = playerBetService;
        setTimeout(() => {
            this.createNewRound();
        }, 5000);
    }
    async createNewRound() {
        var gameRound = new game_round_entity_1.GameRoundEntity();
        gameRound = await this.gameRoundRepository.save(gameRound);
        this.socketService.sendNewRound(gameRound);
        console.log("Noveau jeu...........................................");
        setTimeout(() => {
            this.startPlaying(gameRound.id);
        }, 5000);
        return gameRound;
    }
    async startPlaying(gameRoundId) {
        console.log("startPlaying...........................................");
        if (player_bet_service_1.PlayerBetService.waitingPlayers) {
            player_bet_service_1.PlayerBetService.waitingPlayers.forEach((playerDto) => {
                playerDto.roundId = gameRoundId;
                this.playerBetService.handleUserBet(playerDto);
            });
            player_bet_service_1.PlayerBetService.waitingPlayers = [];
        }
        var gameRound = await this.gameRoundRepository.findOne({ where: { id: gameRoundId }, relations: { players: true } });
        gameRound.isActive = true;
        gameRound.status = game_round_state_enum_1.GameRoundStateEnum.EN_COURS;
        gameRound = await this.gameRoundRepository.save(gameRound);
        await this.socketService.sendStartRound(gameRound);
        this.socketService.sendRoundPlayers(gameRound.players);
        const maxCount = (Math.floor(Math.random() * 100) + 1) * 10;
        console.log("maxCount: ", maxCount);
        for (let i = 0; i < maxCount; i++) {
            gameRound.currentPercent += 0.01;
            gameRound.currentPercent = parseFloat(gameRound.currentPercent.toFixed(2));
            await this.socketService.sendRoundCurrentPercent(gameRound.currentPercent);
            player_bet_service_1.PlayerBetService.currentPercent = gameRound.currentPercent;
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        player_bet_service_1.PlayerBetService.currentPercent = 0;
        gameRound.isActive = false;
        gameRound.status = game_round_state_enum_1.GameRoundStateEnum.TERMINE;
        gameRound = await this.gameRoundRepository.save(gameRound);
        await this.socketService.sendEndRound(gameRound);
        this.createNewRound();
        return gameRound;
    }
    findAll() {
        return `This action returns all gameRound`;
    }
    findOne(id) {
        return `This action returns a #${id} gameRound`;
    }
    update(id, updateGameRoundDto) {
        return `This action updates a #${id} gameRound`;
    }
    remove(id) {
        return `This action removes a #${id} gameRound`;
    }
};
exports.GameRoundService = GameRoundService;
exports.GameRoundService = GameRoundService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(game_round_entity_1.GameRoundEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        socket_service_1.SocketService,
        player_bet_service_1.PlayerBetService])
], GameRoundService);
//# sourceMappingURL=game-round.service.js.map