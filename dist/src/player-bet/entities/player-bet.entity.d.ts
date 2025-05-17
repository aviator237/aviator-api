import { TimestampEntities } from "generics/timestamp.entities";
import { BetStatus } from "src/enum/bet-status.enum";
import { GameRoundEntity } from "src/game-round/entities/game-round.entity";
import { UserEntity } from "src/user/entites/user.entity";
export declare class PlayerBetEntity extends TimestampEntities {
    id: number;
    amount: number;
    winAmount: number;
    reference: string;
    status: BetStatus;
    autoCashoutValue: number;
    gameRound: GameRoundEntity;
    user: UserEntity;
}
