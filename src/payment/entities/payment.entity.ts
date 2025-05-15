import { TimestampEntities } from "generics/timestamp.entities";
import { PaymentRaison } from "src/enum/payment-raison.enum";
import { PaymentType } from "src/enum/payment-type.enum";
import { PaymentChannel } from "src/enum/payment-channel.enum";
import { UserEntity } from "src/user/entites/user.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity("payment")
export class PaymentEntity extends TimestampEntities {

    @PrimaryGeneratedColumn()
    id: number;


    @Column({
        nullable: false,
        enum: PaymentRaison,
        type: "enum",
        default: PaymentRaison.RECHARGE_DU_COMTE
    })
    raison: PaymentRaison;


    @Column({
        length: 255,
        nullable: true
    })
    nestReference: string;


    @Column({
        length: 255,
        nullable: true
    })
    geo: string;


    @Column({
        nullable: true,
        type: "float"
    })
    fee: number;


    @Column({
        default: false
    })
    isIncoming: boolean;


    @Column({
        length: 255,
        nullable: true
    })
    notchPayReference: string;


    @Column({
        length: 50,
        nullable: true
    })
    status: string;


    @Column({
        nullable: true,
        type: "enum",
        enum: PaymentChannel,
        default: PaymentChannel.MTN_OR_ORANGE_MONEY_CM
    })
    paymentChannel: PaymentChannel;


    @Column({
        nullable: false,
        type: "enum",
        enum: PaymentType,
        default: PaymentType.PAR_MOBILE
    })
    paymentType: PaymentType;


    @Column({
        length: 50,
        nullable: true
    })
    phoneNumber: string;


    @Column({
        nullable: false,
        type: "float"
    })
    amount: number;


    @ManyToOne(
        () => UserEntity,
        (user) => user.payments,
    )
    @JoinColumn()
    user: UserEntity;

}
