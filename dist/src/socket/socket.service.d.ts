import { Server } from 'socket.io';
import { SocketEventEnum } from 'src/enum/socket-event.enum';
import { PlayerBetEntity } from 'src/player-bet/entities/player-bet.entity';
export declare class SocketService {
    static server: Server;
    sendEvent(notificationId: string | string[], event: string, data: any): Promise<void>;
    sendPaymentStatusUpdate(clientSocketId: string | string[], status: string): Promise<void>;
    sendData(clientSocketId: string | string[], event: SocketEventEnum, data: any): Promise<void>;
    sendNewRound(data: any): Promise<void>;
    sendStartRound(data: any): Promise<void>;
    sendEndRound(data: any): Promise<void>;
    sendWalletAmount(userSocketId: string, data: any): Promise<void>;
    sendRoundCurrentPercent(currentPercent: number): Promise<void>;
    sendRoundPlayers(players: PlayerBetEntity[]): Promise<void>;
    sendPlayerUpdate(player: PlayerBetEntity): Promise<void>;
    sendPaymentUpdate(clientSocketId: string | string[], data: any): Promise<void>;
    sendBetDenied(clientSocketId: string | string[], reference: any): Promise<void>;
    sendBetWait(clientSocketId: string | string[], reference: any): Promise<void>;
    sendBetAccepted(clientSocketId: string | string[], reference: any): Promise<void>;
    sendWaitingBetStop(clientSocketId: string | string[], reference: any): Promise<void>;
    sendBetStop(clientSocketId: string | string[], data: any): Promise<void>;
    sendRecentHistory(data: any): Promise<void>;
}
