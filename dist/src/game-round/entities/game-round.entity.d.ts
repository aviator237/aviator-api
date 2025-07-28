import { TimestampEntities } from "generics/timestamp.entities";
import { GameRoundStateEnum } from "src/enum/game-round-state.enum";
import { PlayerBetEntity } from "src/player-bet/entities/player-bet.entity";
export declare class GameRoundEntity extends TimestampEntities {
    id: number;
    currentPercent: number;
    initialFunds: number;
    finalFunds: number;
    totalBetAmount: number;
    isActive: boolean;
    status: GameRoundStateEnum;
    players: PlayerBetEntity[];
}
