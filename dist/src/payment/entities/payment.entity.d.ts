import { TimestampEntities } from "generics/timestamp.entities";
import { PaymentRaison } from "src/enum/payment-raison.enum";
import { PaymentType } from "src/enum/payment-type.enum";
import { PaymentChannel } from "src/enum/payment-channel.enum";
import { UserEntity } from "src/user/entites/user.entity";
export declare class PaymentEntity extends TimestampEntities {
    id: number;
    raison: PaymentRaison;
    nestReference: string;
    geo: string;
    fee: number;
    isIncoming: boolean;
    notchPayReference: string;
    status: string;
    paymentChannel: PaymentChannel;
    paymentType: PaymentType;
    phoneNumber: string;
    amount: number;
    user: UserEntity;
}
