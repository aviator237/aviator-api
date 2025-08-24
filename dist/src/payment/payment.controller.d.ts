import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UserEntity } from 'src/user/entites/user.entity';
import { CreateTransfertDto } from './dto/create-transfert.dto';
import { PaymentEntity } from './entities/payment.entity';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    createPayment(createPaymentDto: CreatePaymentDto, user: UserEntity): Promise<{
        result: any;
        reference: any;
    }>;
    transfer(createTransfertDto: CreateTransfertDto, user: UserEntity): Promise<{
        result: any;
    }>;
    internalTransfer(amount: number, recipientNumber: string, user: UserEntity): Promise<any>;
    handledWebhook(event: string, data: any): Promise<{
        status: string;
    }>;
    findAll(page: number, count: number): Promise<PaymentEntity[]>;
    getUserPayment(page: number, count: number, user: UserEntity): Promise<PaymentEntity[]>;
    findOne(id: number): Promise<PaymentEntity>;
}
