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
exports.SocketsGateway = void 0;
const websockets_1 = require("@nestjs/websockets");
const socket_io_1 = require("socket.io");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../user/entites/user.entity");
const payment_entity_1 = require("../payment/entities/payment.entity");
const socket_service_1 = require("./socket.service");
const socket_rooms_enum_1 = require("../enum/socket-rooms.enum");
const player_bet_service_1 = require("../player-bet/player-bet.service");
const socket_event_enum_1 = require("../enum/socket-event.enum");
const create_player_bet_dto_1 = require("../player-bet/dto/create-player-bet.dto");
let SocketsGateway = class SocketsGateway {
    constructor(userEntityRepository, paymentRepository, socketService, playerBetService) {
        this.userEntityRepository = userEntityRepository;
        this.paymentRepository = paymentRepository;
        this.socketService = socketService;
        this.playerBetService = playerBetService;
    }
    afterInit(server) {
        socket_service_1.SocketService.server = server;
    }
    async handleConnection(client) {
        console.log('Client received');
        const clientSocketId = client.handshake.query.clientSocketId;
        if (!clientSocketId) {
            client.disconnect();
            return;
        }
        const expectedClient = await this.userEntityRepository.findOne({ where: { id: clientSocketId } });
        if (expectedClient) {
            expectedClient.isOnline = true;
            await this.userEntityRepository.save(expectedClient);
        }
        client.join([socket_rooms_enum_1.SocketRoomsEnum.TOUS_LES_UTILISATEURS, clientSocketId]);
        console.log(`Client connected: ${clientSocketId}`);
    }
    async handleUserBet(createPlayerBetDto) {
        const result = await this.playerBetService.handleUserBet(createPlayerBetDto);
        console.log(result);
        return result;
    }
    async handleStopBet(data) {
        console.log(data);
        const { userId, roundId, reference } = data;
        const result = await this.playerBetService.handleUserStopBet(userId, roundId, reference);
        console.log(result);
        return result;
    }
    async handleStopWaitingBet(data) {
        console.log(data);
        await this.playerBetService.handleUserStopWaitingBet(data.userId, data.reference);
    }
    async handleWalletAmount(data) {
        console.log(data);
        const expectedClient = await this.userEntityRepository.findOne({ where: { id: data.userId } });
        if (expectedClient) {
            this.socketService.sendWalletAmount(expectedClient.id, expectedClient.walletAmount);
        }
    }
    async handleDisconnect(client) {
        const clientSocketId = client.handshake.query.clientSocketId;
        if (clientSocketId) {
            client.leave(clientSocketId);
            client.leave(socket_rooms_enum_1.SocketRoomsEnum.TOUS_LES_UTILISATEURS);
            console.log(`Client disconnected: ${clientSocketId}`);
            const expectedClient = await this.userEntityRepository.findOne({ where: { id: clientSocketId } });
            if (expectedClient) {
                expectedClient.isOnline = true;
                await this.userEntityRepository.save(expectedClient);
            }
        }
    }
};
exports.SocketsGateway = SocketsGateway;
__decorate([
    (0, websockets_1.WebSocketServer)(),
    __metadata("design:type", socket_io_1.Server)
], SocketsGateway.prototype, "server", void 0);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], SocketsGateway.prototype, "handleConnection", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(socket_event_enum_1.SocketEventEnum.MISE_UTILISATEUR),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_player_bet_dto_1.CreatePlayerBetDto]),
    __metadata("design:returntype", Promise)
], SocketsGateway.prototype, "handleUserBet", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(socket_event_enum_1.SocketEventEnum.STOP_MISE),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SocketsGateway.prototype, "handleStopBet", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(socket_event_enum_1.SocketEventEnum.ARRET_MISE_EN_ATTENTE),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SocketsGateway.prototype, "handleStopWaitingBet", null);
__decorate([
    (0, websockets_1.SubscribeMessage)(socket_event_enum_1.SocketEventEnum.MONTANT_WALLET),
    __param(0, (0, websockets_1.MessageBody)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], SocketsGateway.prototype, "handleWalletAmount", null);
__decorate([
    __param(0, (0, websockets_1.ConnectedSocket)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [socket_io_1.Socket]),
    __metadata("design:returntype", Promise)
], SocketsGateway.prototype, "handleDisconnect", null);
exports.SocketsGateway = SocketsGateway = __decorate([
    (0, websockets_1.WebSocketGateway)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(payment_entity_1.PaymentEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        socket_service_1.SocketService,
        player_bet_service_1.PlayerBetService])
], SocketsGateway);
//# sourceMappingURL=socket.gateway.js.map