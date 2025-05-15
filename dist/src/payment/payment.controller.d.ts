import { PaymentService } from './payment.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UserEntity } from 'src/user/entites/user.entity';
import { CreateTransfertDto } from './dto/create-transfert.dto';
import { PaymentEntity } from './entities/payment.entity';
export declare class PaymentController {
    private readonly paymentService;
    constructor(paymentService: PaymentService);
    create(createPaymentDto: CreatePaymentDto, user: UserEntity): Promise<{
        result: any;
        reference: any;
    }>;
    transfer(createTransfertDto: CreateTransfertDto, user: UserEntity): Promise<{
        result: any;
    }>;
    handledWebhook(event: string, data: any): Promise<{
        status: string;
    }>;
    findAll(page: number, count: number): Promise<PaymentEntity[]>;
    getUserPayment(page: number, count: number, user: UserEntity): Promise<PaymentEntity[]>;
    getReservationAmount(): number;
    findOne(id: number): Promise<PaymentEntity>;
}
