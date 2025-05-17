import { TimestampEntities } from "generics/timestamp.entities";
import { BetStatus } from "src/enum/bet-status.enum";
import { GameRoundEntity } from "src/game-round/entities/game-round.entity";
import { UserEntity } from "src/user/entites/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity("player_bet")
export class PlayerBetEntity extends TimestampEntities {

    @PrimaryGeneratedColumn()
    id: number;


    @Column({
        nullable: false,
        type: "float"
    })
    amount: number;

    @Column({
        nullable: true,
        type: "float",
        default: 0
    })
    winAmount: number;

    @Column({
        nullable: true,
        type: "float",
        default: 0
    })
    endPercent: number;

    @Column({
        nullable: false,
    })
    reference: string;


    @Column({
        type: "enum",
        enum: BetStatus,
        default: BetStatus.MISE,
        nullable: false
    })
    status: BetStatus;

    @Column({
        nullable: true,
        type: "float",
        default: null
    })
    autoCashoutValue: number;

    @ManyToOne(
        () => GameRoundEntity,
        (gameRound) => gameRound.players,
    )
    @JoinColumn()
    gameRound: GameRoundEntity;

    @ManyToOne(
        () => UserEntity,
        (user) => user.bets,
    )
    @JoinColumn()
    user: UserEntity;

}
