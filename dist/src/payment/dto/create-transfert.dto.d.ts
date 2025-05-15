import { PaymentRaison } from "src/enum/payment-raison.enum";
export declare class CreateTransfertDto {
    raison: PaymentRaison;
    nestReference: string;
    phoneNumber: string;
    amount: number;
}
