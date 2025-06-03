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
const bet_status_enum_1 = require("../enum/bet-status.enum");
const fake_bet_generator_1 = require("../utils/fake-bet.generator");
let GameRoundService = class GameRoundService {
    constructor(gameRoundRepository, socketService, playerBetService, fakeBetGenerator) {
        this.gameRoundRepository = gameRoundRepository;
        this.socketService = socketService;
        this.playerBetService = playerBetService;
        this.fakeBetGenerator = fakeBetGenerator;
        this.fakeBets = [];
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
        var _a, _b;
        console.log("startPlaying...........................................");
        if (player_bet_service_1.PlayerBetService.waitingPlayers && player_bet_service_1.PlayerBetService.waitingPlayers.length > 0) {
            console.log(`Traitement de ${player_bet_service_1.PlayerBetService.waitingPlayers.length} mises en attente`);
            const waitingPlayersCopy = [...player_bet_service_1.PlayerBetService.waitingPlayers];
            player_bet_service_1.PlayerBetService.waitingPlayers = [];
            for (const playerDto of waitingPlayersCopy) {
                try {
                    playerDto.roundId = gameRoundId;
                    await this.playerBetService.handleUserBet(playerDto);
                }
                catch (error) {
                    console.error(`Erreur lors du traitement de la mise en attente: ${error}`);
                }
            }
        }
        var gameRound = await this.gameRoundRepository.findOne({ where: { id: gameRoundId }, relations: { players: true } });
        gameRound.isActive = true;
        gameRound.status = game_round_state_enum_1.GameRoundStateEnum.EN_COURS;
        gameRound = await this.gameRoundRepository.save(gameRound);
        this.fakeBets = this.fakeBetGenerator.generateFakeBets(gameRound.id, gameRound.players.length);
        if (this.fakeBets.length > 0) {
            gameRound.players = [...gameRound.players, ...this.fakeBets];
        }
        await this.socketService.sendStartRound(gameRound);
        this.socketService.sendRoundPlayers(gameRound.players);
        const maxCount = (Math.floor(Math.random() * 50) + 1) * 10;
        console.log("maxCount: ", maxCount);
        for (let i = 0; i < maxCount; i++) {
            gameRound.currentPercent += 0.01;
            gameRound.currentPercent = parseFloat(gameRound.currentPercent.toFixed(2));
            await this.socketService.sendRoundCurrentPercent(gameRound.currentPercent);
            player_bet_service_1.PlayerBetService.currentPercent = gameRound.currentPercent;
            this.checkAutoCashouts(gameRound);
            this.checkFakeBets(gameRound);
            await new Promise(resolve => setTimeout(resolve, 100));
        }
        if (gameRound.players && gameRound.players.length > 0) {
            const activePlayers = gameRound.players.filter(player => player.status === bet_status_enum_1.BetStatus.MISE);
            for (const player of activePlayers) {
                player.status = bet_status_enum_1.BetStatus.PERDUE;
                player.endPercent = gameRound.currentPercent;
                if ((_b = (_a = player.user) === null || _a === void 0 ? void 0 : _a.id) === null || _b === void 0 ? void 0 : _b.startsWith('fake_')) {
                    this.socketService.sendPlayerUpdate(player);
                }
                else {
                    await this.updateLosingPlayer(player);
                }
            }
        }
        player_bet_service_1.PlayerBetService.currentPercent = 0;
        gameRound.isActive = false;
        gameRound.status = game_round_state_enum_1.GameRoundStateEnum.TERMINE;
        gameRound = await this.gameRoundRepository.save(gameRound);
        player_bet_service_1.PlayerBetService.clearAutoCheckoutPlayersForRound(gameRound.id);
        this.fakeBets = [];
        await this.socketService.sendEndRound(gameRound);
        this.createNewRound();
        return gameRound;
    }
    async checkFakeBets(gameRound) {
        const activeFakeBets = this.fakeBets.filter(bet => bet.status === bet_status_enum_1.BetStatus.MISE);
        for (const fakeBet of activeFakeBets) {
            if (this.fakeBetGenerator.shouldCashout(fakeBet, gameRound.currentPercent)) {
                const winAmount = fakeBet.amount * gameRound.currentPercent;
                fakeBet.winAmount = parseFloat(winAmount.toFixed(2));
                fakeBet.status = bet_status_enum_1.BetStatus.GAGNE;
                fakeBet.endPercent = gameRound.currentPercent;
                this.socketService.sendPlayerUpdate(fakeBet);
                this.fakeBets = this.fakeBets.filter(bet => bet !== fakeBet);
            }
        }
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
    async checkAutoCashouts(gameRound) {
        try {
            this.playerBetService.processAutoCheckouts(gameRound.id, gameRound.currentPercent)
                .catch(error => {
                console.error('Erreur lors du traitement des cashouts automatiques:', error);
            });
        }
        catch (error) {
            console.error('Erreur lors de la vérification des cashouts automatiques:', error);
        }
    }
    async updateLosingPlayer(player) {
        try {
            const updatedPlayer = await this.playerBetService.updatePlayerStatus(player);
            this.socketService.sendPlayerUpdate(updatedPlayer);
        }
        catch (error) {
            console.error('Erreur lors de la mise à jour du joueur perdant:', error);
        }
    }
};
exports.GameRoundService = GameRoundService;
exports.GameRoundService = GameRoundService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(game_round_entity_1.GameRoundEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        socket_service_1.SocketService,
        player_bet_service_1.PlayerBetService,
        fake_bet_generator_1.FakeBetGenerator])
], GameRoundService);
//# sourceMappingURL=game-round.service.js.map