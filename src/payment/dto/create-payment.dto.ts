import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsPositive, IsString, Min } from "class-validator";
import { PaymentRaison } from "src/enum/payment-raison.enum";

export class CreatePaymentDto {

    @IsNotEmpty()
    @IsString()
    @IsEnum(PaymentRaison)
    raison: PaymentRaison;


    @IsOptional()
    @IsString()
    nestReference: string;


    @IsNotEmpty()
    @IsString()
    @IsPhoneNumber()
    phoneNumber: string;


    @IsNumber()
    @IsNotEmpty()
    @IsPositive()
    @Min(10)
    amount: number;


}
