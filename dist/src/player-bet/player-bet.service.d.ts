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
    static stopRound: boolean;
    static totalWinningAmount: number;
    static waitingPlayers: CreatePlayerBetDto[];
    static autoCheckoutPlayers: {
        userId: string;
        roundId: number;
        autoCashoutValue: number;
        betId: number;
        reference: string;
    }[];
    constructor(playerBetRepository: Repository<PlayerBetEntity>, gameRoundRepository: Repository<GameRoundEntity>, userRepository: Repository<UserEntity>, socketService: SocketService);
    handleUserBet(createPlayerBetDto: CreatePlayerBetDto): Promise<boolean>;
    handleUserStopWaitingBet(userId: string, reference: string): Promise<void>;
    handleUserStopBet(userId: string, roundId: number, reference: string): Promise<boolean>;
    getUserBetHistory(userId: string, page: number, count: number): Promise<PlayerBetEntity[]>;
    static clearAutoCheckoutPlayersForRound(gameRoundId: number): void;
    processAutoCheckouts(gameRoundId: number, currentMultiplier: number): Promise<void>;
    getActivePlayersWithAutoCashout(gameRoundId: number): Promise<PlayerBetEntity[]>;
    updatePlayerStatus(player: PlayerBetEntity): Promise<PlayerBetEntity>;
}
