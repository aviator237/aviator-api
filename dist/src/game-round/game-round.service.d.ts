import { UpdateGameRoundDto } from './dto/update-game-round.dto';
import { GameRoundEntity } from './entities/game-round.entity';
import { Repository } from 'typeorm';
import { SocketService } from 'src/socket/socket.service';
import { PlayerBetService } from 'src/player-bet/player-bet.service';
import { FakeBetGenerator } from 'src/utils/fake-bet.generator';
export declare class GameRoundService {
    private readonly gameRoundRepository;
    private readonly socketService;
    private readonly playerBetService;
    private readonly fakeBetGenerator;
    private fakeBets;
    constructor(gameRoundRepository: Repository<GameRoundEntity>, socketService: SocketService, playerBetService: PlayerBetService, fakeBetGenerator: FakeBetGenerator);
    createNewRound(): Promise<GameRoundEntity>;
    private startPlaying;
    private checkFakeBets;
    findAll(): string;
    findOne(id: number): string;
    update(id: number, updateGameRoundDto: UpdateGameRoundDto): string;
    remove(id: number): string;
    private checkAutoCashouts;
    private updateLosingPlayer;
}
