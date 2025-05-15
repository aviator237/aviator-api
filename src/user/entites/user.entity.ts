import { TimestampEntities } from "generics/timestamp.entities";
import { AuthLoginEntity } from "src/auth/entities/auth-login.entity";
import { UserLangEnum } from "src/enum/user-lang.enum";
import { UserRoleEnum } from "src/enum/user-role.enum";
import { PaymentEntity } from "src/payment/entities/payment.entity";
import { PlayerBetEntity } from "src/player-bet/entities/player-bet.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, PrimaryColumn } from "typeorm";

@Entity("myuser")
export class UserEntity extends TimestampEntities {


    @PrimaryColumn({ generated: "uuid" })
    id: string;


    @Column({
        unique: false,
        length: 30,
        nullable: true
    })
    userName: string;


    @Column({
        unique: true,
        length: 50,
        nullable: true
    })
    email: string;


    @Column({
        length: 50,
        nullable: true
    })
    firstName: string;


    @Column({
        length: 50,
        nullable: true
    })
    lastName: string;


    @Column({
        type: "enum",
        enum: UserRoleEnum,
        default: UserRoleEnum.USER,
        nullable: false
    })
    role: UserRoleEnum;


    @Column({
        type: "enum",
        enum: UserLangEnum,
        default: UserLangEnum.FRANCAIS,
        nullable: false
    })
    lang: UserLangEnum;


    @Column({
        default: false,
        nullable: false
    })
    isActive: boolean;


    @Column({
        default: false,
        nullable: false
    })
    isBlocked: boolean;


    @Column({
        length: 200,
        nullable: true
    })
    notchRecipientId: string;


    @Column({
        length: 200,
        nullable: true
    })
    password: string;


    @Column({
        length: 50,
        nullable: true
    })
    salt: string;


    @Column({
        length: 15,
        nullable: false
    })
    phoneNumber: string;


    @Column({
        nullable: true,
        type: "text"
    })
    notificationId: string;


    @Column({
        nullable: true,

    })
    referalCode: string;


    @Column({
        nullable: true
    })
    lastLogin: Date;


    @Column({
        default: false
    })
    isOnline: boolean;


    @Column({
        type: "float",
        default: 0
    })
    walletAmount: number;

    @ManyToOne(
        () => UserEntity,
        (user) => user.goddaughters,
    )
    @JoinColumn()
    godfather: UserEntity;

    @OneToMany(
        () => UserEntity,
        (user) => user.godfather,
    )
    goddaughters: UserEntity[];

    @OneToMany(
        () => PaymentEntity,
        (payment) => payment.user
    )
    payments: PaymentEntity[];

    @OneToMany(
        () => PlayerBetEntity,
        (bet) => bet.user
    )
    bets: PlayerBetEntity[];

    @OneToOne(
        () => AuthLoginEntity,
        (authLogin) => authLogin.user,
    )
    @JoinColumn()
    authLogin: AuthLoginEntity;


}
