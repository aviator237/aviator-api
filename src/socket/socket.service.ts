import { Injectable } from '@nestjs/common';
import { Server } from 'socket.io';
import { SocketEventEnum } from 'src/enum/socket-event.enum';
import { SocketRoomsEnum } from 'src/enum/socket-rooms.enum';
import { PlayerBetEntity } from 'src/player-bet/entities/player-bet.entity';
// import { SocketEventEnum } from 'src/enum/socket-event.enum';

@Injectable()
export class SocketService {
    public static server: Server = null;

    async sendEvent(notificationId: string | string[], event: string, data: any) {
        try {
            SocketService.server.to(notificationId).emit(event, { data });
        } catch (e) {
            console.log(e);
        }
    }

    async sendPaymentStatusUpdate(clientSocketId: string | string[], status: string) {
        SocketService.server.to(clientSocketId).emit(SocketEventEnum.CHANGEMENT_STATUT_PAIEMENT, { status });
    }


    async sendData(clientSocketId: string | string[], event: SocketEventEnum, data: any) {
        SocketService.server.to(clientSocketId).emit(event, { data });
    }

    // async sendNotifcation(clientSocketId: string | string[], data: any) {
    //     SocketService.server.to(clientSocketId).emit(SocketEventEnum.NOTIFICATION, { data });
    // }

    async sendNewRound(data: any) {
        SocketService.server.to(SocketRoomsEnum.TOUS_LES_UTILISATEURS).emit(SocketEventEnum.NOUVEAU_JEUX, { data });
    }

    async sendStartRound(data: any) {
        SocketService.server.to(SocketRoomsEnum.TOUS_LES_UTILISATEURS).emit(SocketEventEnum.DEBUT_JEUX, { data });
    }

    async sendEndRound(data: any) {
        SocketService.server.to(SocketRoomsEnum.TOUS_LES_UTILISATEURS).emit(SocketEventEnum.FIN_DU_JEUX, { data });
    }

    async sendWalletAmount(userSocketId: string, data: any) {
        SocketService.server.to(userSocketId).emit(SocketEventEnum.MONTANT_WALLET, data);
    }

    async sendRoundCurrentPercent(currentPercent: number) {
        SocketService.server.to(SocketRoomsEnum.TOUS_LES_UTILISATEURS).emit(SocketEventEnum.POURCENTAGE_COURANT, currentPercent);
    }

    async sendRoundPlayers(players: PlayerBetEntity[]) {
        SocketService.server.to(SocketRoomsEnum.TOUS_LES_UTILISATEURS).emit(SocketEventEnum.MISEURS, { "data": players });
    }


    async sendPlayerUpdate(player: PlayerBetEntity) {
        SocketService.server.to(SocketRoomsEnum.TOUS_LES_UTILISATEURS).emit(SocketEventEnum.MISE_A_JOUR_JOUEUR, { "data": player });
    }


    async sendPaymentUpdate(clientSocketId: string | string[], data: any) {
        SocketService.server.to(clientSocketId).emit(SocketEventEnum.PAYMENT, { data });
    }

    async sendBetDenied(clientSocketId: string | string[], reference: any) {
        SocketService.server.to(clientSocketId).emit(SocketEventEnum.IMPOSSIBLE_DE_MISER, { reference });
    }


    async sendBetWait(clientSocketId: string | string[], reference: any) {
        SocketService.server.to(clientSocketId).emit(SocketEventEnum.ATTENTE_PROCHAIN_TOUR, { reference });
    }

    async sendBetAccepted(clientSocketId: string | string[], reference: any) {
        SocketService.server.to(clientSocketId).emit(SocketEventEnum.MISE_ACCEPTE, { reference });
    }

    async sendWaitingBetStop(clientSocketId: string | string[], reference: any) {
        SocketService.server.to(clientSocketId).emit(SocketEventEnum.ARRET_MISE_EN_ATTENTE, { reference });
    }

    async sendBetStop(clientSocketId: string | string[], data: any) {
        SocketService.server.to(clientSocketId).emit(SocketEventEnum.STOP_MISE, { data });
    }


    async sendRecentHistory(data: any) {
        // console.log(data)
        SocketService.server.to(SocketRoomsEnum.TOUS_LES_UTILISATEURS).emit(SocketEventEnum.RECENT_HISTORY, { data });

    }


    // git remote add origin3 https://github.com/scidev-academy/naviator.git

}
