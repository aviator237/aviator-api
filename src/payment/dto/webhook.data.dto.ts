import { IsNotEmpty, IsNumber, IsOptional, IsPhoneNumber, IsString } from "class-validator";

export class WebhookDataDto {

    converted_amount: number;

    fee: number;

    sandbox: boolean;

    amount_total: number;

    payment_method: string;

    customer: string;

    reference: string;

    provider_reference: string;

    status: string;

    currency: string;

    geo: string;

    amount: number;


}
