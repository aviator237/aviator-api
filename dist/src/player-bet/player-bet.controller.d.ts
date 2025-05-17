import { PlayerBetService } from './player-bet.service';
import { UserEntity } from 'src/user/entites/user.entity';
export declare class PlayerBetController {
    private readonly playerBetService;
    constructor(playerBetService: PlayerBetService);
    getUserBetHistory(page: number, count: number, user: UserEntity): Promise<import("./entities/player-bet.entity").PlayerBetEntity[]>;
}
