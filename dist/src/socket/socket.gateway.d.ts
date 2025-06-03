import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit } from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { Repository } from "typeorm";
import { UserEntity } from "src/user/entites/user.entity";
import { PaymentEntity } from "src/payment/entities/payment.entity";
import { SocketService } from "./socket.service";
import { PlayerBetService } from "src/player-bet/player-bet.service";
import { CreatePlayerBetDto } from "src/player-bet/dto/create-player-bet.dto";
export declare class SocketsGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
    private userEntityRepository;
    private paymentRepository;
    private readonly socketService;
    private readonly playerBetService;
    constructor(userEntityRepository: Repository<UserEntity>, paymentRepository: Repository<PaymentEntity>, socketService: SocketService, playerBetService: PlayerBetService);
    server: Server;
    afterInit(server: Server): void;
    handleConnection(client: Socket): Promise<void>;
    handleUserBet(createPlayerBetDto: CreatePlayerBetDto): Promise<boolean>;
    handleStopBet(data: {
        userId: string;
        roundId: number;
        reference: string;
    }): Promise<boolean>;
    handleStopWaitingBet(data: {
        userId: string;
        reference: string;
    }): Promise<void>;
    handleWalletAmount(data: {
        userId: string;
    }): Promise<void>;
    handleDisconnect(client: Socket): Promise<void>;
}
