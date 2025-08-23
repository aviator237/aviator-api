import { Injectable, UseGuards } from "@nestjs/common";
import { ConnectedSocket, MessageBody, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserEntity } from "src/user/entites/user.entity";
import { PaymentEntity } from "src/payment/entities/payment.entity";
import { SocketService } from "./socket.service";
import { SocketRoomsEnum } from "src/enum/socket-rooms.enum";
import { PlayerBetService } from "src/player-bet/player-bet.service";
import { SocketEventEnum } from "src/enum/socket-event.enum";
import { CreatePlayerBetDto } from "src/player-bet/dto/create-player-bet.dto";

@WebSocketGateway()
export class SocketsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        @InjectRepository(UserEntity)
        private userEntityRepository: Repository<UserEntity>,
        @InjectRepository(PaymentEntity)
        private paymentRepository: Repository<PaymentEntity>,
        private readonly socketService: SocketService,
        private readonly playerBetService: PlayerBetService
    ) { }

    @WebSocketServer()
    public server: Server;

    afterInit(server: Server) {
        SocketService.server = server;
    }

    async handleConnection(@ConnectedSocket() client: Socket) {
        console.log('Client received');
        const clientSocketId = client.handshake.query.clientSocketId as string;
        if (!clientSocketId) {
            client.disconnect();
            return;
        }
        const expectedClient = await this.userEntityRepository.findOne({ where: { id: clientSocketId } });
        if (expectedClient) {
            expectedClient.isOnline = true;
            await this.userEntityRepository.save(expectedClient);
        }
        client.join([SocketRoomsEnum.TOUS_LES_UTILISATEURS, clientSocketId]);
        console.log(`Client connected: ${clientSocketId}`);
    }

    @SubscribeMessage(SocketEventEnum.MISE_UTILISATEUR)
    async handleUserBet(@MessageBody() createPlayerBetDto: CreatePlayerBetDto): Promise<boolean> {
        console.info(createPlayerBetDto)
        const result = await this.playerBetService.handleUserBet(createPlayerBetDto)
        console.log(result);
        return result;
    }

    @SubscribeMessage(SocketEventEnum.STOP_MISE)
    async handleStopBet(@MessageBody() data: { userId: string, roundId: number, reference: string }): Promise<boolean> {
        // console.log(data);
        const { userId, roundId, reference } = data;
        const result = await this.playerBetService.handleUserStopBet(userId, roundId, reference)
        // console.log(result);
        return result;
    }

    @SubscribeMessage(SocketEventEnum.ARRET_MISE_EN_ATTENTE)
    async handleStopWaitingBet(@MessageBody() data: { userId: string, reference: string }) {
        // console.log(data);
        await this.playerBetService.handleUserStopWaitingBet(data.userId, data.reference)
    }

    @SubscribeMessage(SocketEventEnum.MONTANT_WALLET)
    async handleWalletAmount(@MessageBody() data: { userId: string }) {
        // console.log(data);
        const expectedClient = await this.userEntityRepository.findOne({ where: { id: data.userId } });
        if (expectedClient) {
            // this.socketService.sendWalletAmount(expectedClient.id, expectedClient.walletAmount);
          this.socketService.sendWalletAmount(expectedClient.id, {"walletAmount": expectedClient.walletAmount, "unwithdrawableWalletAmount": expectedClient.unwithdrawableWalletAmount});
        }
    }

    // @SubscribeMessage(SocketEventEnum.RECENT_HISTORY)
    // async getRecentHistory(@MessageBody() data: { userId: string }) {
    //     const expectedClient = await this.userEntityRepository.findOne({ where: { id: data.userId } });
    //     if (expectedClient) {
    //         this.socketService.sendRecentHistory(expectedClient.id);
    //     }
    // }

    async handleDisconnect(@ConnectedSocket() client: Socket) {
        const clientSocketId = client.handshake.query.clientSocketId as string;
        if (clientSocketId) {
            client.leave(clientSocketId);
            client.leave(SocketRoomsEnum.TOUS_LES_UTILISATEURS);
            console.log(`Client disconnected: ${clientSocketId}`);
            const expectedClient = await this.userEntityRepository.findOne({ where: { id: clientSocketId } });
            if (expectedClient) {
                expectedClient.isOnline = true;
                await this.userEntityRepository.save(expectedClient);
            }
        }
    }


}