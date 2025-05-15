import { GameRoundService } from './game-round.service';
import { UpdateGameRoundDto } from './dto/update-game-round.dto';
export declare class GameRoundController {
    private readonly gameRoundService;
    constructor(gameRoundService: GameRoundService);
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateGameRoundDto: UpdateGameRoundDto): string;
    remove(id: string): string;
}
