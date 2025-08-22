"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var SocketService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SocketService = void 0;
const common_1 = require("@nestjs/common");
const socket_event_enum_1 = require("../enum/socket-event.enum");
const socket_rooms_enum_1 = require("../enum/socket-rooms.enum");
let SocketService = SocketService_1 = class SocketService {
    async sendEvent(notificationId, event, data) {
        try {
            SocketService_1.server.to(notificationId).emit(event, { data });
        }
        catch (e) {
            console.log(e);
        }
    }
    async sendPaymentStatusUpdate(clientSocketId, status) {
        SocketService_1.server.to(clientSocketId).emit(socket_event_enum_1.SocketEventEnum.CHANGEMENT_STATUT_PAIEMENT, { status });
    }
    async sendData(clientSocketId, event, data) {
        SocketService_1.server.to(clientSocketId).emit(event, { data });
    }
    async sendNewRound(data) {
        SocketService_1.server.to(socket_rooms_enum_1.SocketRoomsEnum.TOUS_LES_UTILISATEURS).emit(socket_event_enum_1.SocketEventEnum.NOUVEAU_JEUX, { data });
    }
    async sendStartRound(data) {
        SocketService_1.server.to(socket_rooms_enum_1.SocketRoomsEnum.TOUS_LES_UTILISATEURS).emit(socket_event_enum_1.SocketEventEnum.DEBUT_JEUX, { data });
    }
    async sendEndRound(data) {
        SocketService_1.server.to(socket_rooms_enum_1.SocketRoomsEnum.TOUS_LES_UTILISATEURS).emit(socket_event_enum_1.SocketEventEnum.FIN_DU_JEUX, { data });
    }
    async sendWalletAmount(userSocketId, data) {
        SocketService_1.server.to(userSocketId).emit(socket_event_enum_1.SocketEventEnum.MONTANT_WALLET, data);
    }
    async sendRoundCurrentPercent(currentPercent) {
        SocketService_1.server.to(socket_rooms_enum_1.SocketRoomsEnum.TOUS_LES_UTILISATEURS).emit(socket_event_enum_1.SocketEventEnum.POURCENTAGE_COURANT, currentPercent);
    }
    async sendRoundPlayers(players) {
        SocketService_1.server.to(socket_rooms_enum_1.SocketRoomsEnum.TOUS_LES_UTILISATEURS).emit(socket_event_enum_1.SocketEventEnum.MISEURS, { "data": players });
    }
    async sendPlayerUpdate(player) {
        SocketService_1.server.to(socket_rooms_enum_1.SocketRoomsEnum.TOUS_LES_UTILISATEURS).emit(socket_event_enum_1.SocketEventEnum.MISE_A_JOUR_JOUEUR, { "data": player });
    }
    async sendPaymentUpdate(clientSocketId, data) {
        SocketService_1.server.to(clientSocketId).emit(socket_event_enum_1.SocketEventEnum.PAYMENT, { data });
    }
    async sendBetDenied(clientSocketId, reference) {
        SocketService_1.server.to(clientSocketId).emit(socket_event_enum_1.SocketEventEnum.IMPOSSIBLE_DE_MISER, { reference });
    }
    async sendBetWait(clientSocketId, reference) {
        SocketService_1.server.to(clientSocketId).emit(socket_event_enum_1.SocketEventEnum.ATTENTE_PROCHAIN_TOUR, { reference });
    }
    async sendBetAccepted(clientSocketId, reference) {
        SocketService_1.server.to(clientSocketId).emit(socket_event_enum_1.SocketEventEnum.MISE_ACCEPTE, { reference });
    }
    async sendWaitingBetStop(clientSocketId, reference) {
        SocketService_1.server.to(clientSocketId).emit(socket_event_enum_1.SocketEventEnum.ARRET_MISE_EN_ATTENTE, { reference });
    }
    async sendBetStop(clientSocketId, data) {
        SocketService_1.server.to(clientSocketId).emit(socket_event_enum_1.SocketEventEnum.STOP_MISE, { data });
    }
    async sendRecentHistory(data) {
        console.log(data);
        SocketService_1.server.to(socket_rooms_enum_1.SocketRoomsEnum.TOUS_LES_UTILISATEURS).emit(socket_event_enum_1.SocketEventEnum.RECENT_HISTORY, { data });
    }
};
exports.SocketService = SocketService;
SocketService.server = null;
exports.SocketService = SocketService = SocketService_1 = __decorate([
    (0, common_1.Injectable)()
], SocketService);
//# sourceMappingURL=socket.service.js.map