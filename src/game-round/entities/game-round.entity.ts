import { TimestampEntities } from "generics/timestamp.entities";
import { GameRoundStateEnum } from "src/enum/game-round-state.enum";
import { PlayerBetEntity } from "src/player-bet/entities/player-bet.entity";
import { Column, Entity, OneToMany, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("game_round")
export class GameRoundEntity extends TimestampEntities {


    @PrimaryGeneratedColumn()
    id: number;


    @Column({
        nullable: false,
        default: 1,
        type: "float"
    })
    currentPercent: number;

    @Column({
        nullable: false, default: 0,
        type: "float"
    })
    initialFunds: number;


    @Column({
        nullable: false, default: 0,
        type: "float"
    })
    finalFunds: number;


    @Column({
        nullable: false, default: 0,
        type: "float"
    })
    totalBetAmount: number;


    @Column({
        default: false
    })
    isActive: boolean;

    @Column({
        type: "enum",
        enum: GameRoundStateEnum,
        default: GameRoundStateEnum.INITIALISE,
        nullable: false
    })
    status: GameRoundStateEnum;


    @OneToMany(
        () => PlayerBetEntity,
        (player) => player.gameRound
    )
    players: PlayerBetEntity[];


}
