import { Repository } from "typeorm";
import { GameRoundEntity } from "src/game-round/entities/game-round.entity";
import { PlayerBetEntity } from "./entities/player-bet.entity";
import { UserEntity } from "src/user/entites/user.entity";
import { SocketService } from "src/socket/socket.service";
import { CreatePlayerBetDto } from "./dto/create-player-bet.dto";
export declare class PlayerBetService {
    private readonly playerBetRepository;
    private readonly gameRoundRepository;
    private readonly userRepository;
    private readonly socketService;
    static currentPercent: number;
    static waitingPlayers: CreatePlayerBetDto[];
    constructor(playerBetRepository: Repository<PlayerBetEntity>, gameRoundRepository: Repository<GameRoundEntity>, userRepository: Repository<UserEntity>, socketService: SocketService);
    handleUserBet(createPlayerBetDto: CreatePlayerBetDto): Promise<boolean>;
    handleUserStopWaitingBet(userId: string, reference: string): Promise<void>;
    handleUserStopBet(userId: string, roundId: number): Promise<boolean>;
}
